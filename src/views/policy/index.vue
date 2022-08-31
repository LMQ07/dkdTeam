<template>
  <div class="dashboard-container">
    <div class="search">
      <el-form inline="true">
        <el-form-item label="策略搜索:">
          <el-input v-model="search.orderNo" placeholder="请输入" class="order-id" clearable />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="searchPolicy">查询</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="policy-info">
      <el-button class="el-icon-circle-plus-outline add" @click="add">新建</el-button>
      <Table :thead="thead" :table-date="tableDate" :total-page="totalPage" :total-count="totalCount" :page-index="pageIndex" @click="pageFn">
        <template v-slot:operation="{row}">
          <div class="policy-operation">
            <span @click="checkDetails(row.row.policyId,row.row.policyName)">查看详情</span>
            <span @click="edit(row.row)">修改</span>
            <span class="three" @click="del(row.row.policyId)">删除</span>
          </div>
        </template>
        <template v-slot:createTime="{row}">
          <span> {{ row.row.createTime | formatDate }}</span>
        </template>
      </Table>
    </div>

    <!-- 新增弹窗 -->
    <DialogPolicy ref="policyDialog" :dialog-visible.sync="dialogVisible" @update="getPolicy" />

    <!-- 详情弹窗 -->
    <DialogDetails ref="policyDetails" :dialog-visible1.sync="dialogVisible1" />
  </div>
</template>

<script>
import Table from '@/components/Table'
import { getPolicy, delPolicy } from '@/api/policy'
import DialogPolicy from './components/DialogPolicy.vue'
import DialogDetails from './components/DialogDetails.vue'
export default {
  components: { Table, DialogPolicy, DialogDetails },
  data() {
    return {
      dialogVisible: false,
      dialogVisible1: false,
      search: {
        orderNo: ''
      },
      pageIndex: 1,
      pageSize: 10,
      thead: [{
        prop: 'policyName',
        label: '策略名称'
      },
      {
        prop: 'discount',
        label: '策略方案'
      },
      {
        prop: 'createTime',
        label: '创建日期',
        slotName: 'createTime'
      },
      {
        prop: 'operation',
        label: '操作',
        slotName: 'operation'
      }],
      tableDate: [],
      totalPage: 0,
      totalCount: 0
    }
  },
  mounted() {
    this.getPolicy()
  },
  methods: {
    async getPolicy() {
      const { data } = await getPolicy({
        pageIndex: this.pageIndex,
        pageSize: this.pageSize
      })
      console.log(data)
      this.tableDate = data.currentPageRecords
      this.totalCount = data.totalCount
      this.totalPage = data.totalPage
      if (data.totalCount !== 0 && data.currentPageRecords.length === 0) {
        // 说明没有数据 ==> 1.真正的 2.假的
        // 把真正没有数据的情况 去掉
        // 重新调用接口
        this.pageIndex = this.pageIndex - 1
        this.getEmployeeList()
      }
    },
    pageFn(val) {
      if (val === 0) {
        this.pageIndex -= 1
        this.getPolicy()
      } else {
        this.pageIndex += 1
        this.getPolicy()
      }
    },
    async searchPolicy() {
      const { data: { currentPageRecords, totalCount, totalPage }} = await getPolicy({
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
        policyName: this.search.orderNo
      })
      console.log(currentPageRecords)
      this.tableDate = currentPageRecords
      this.totalCount = totalCount
      this.totalPage = totalPage
      this.search.orderNo = ''
    },
    clear() {
      this.search.orderNo = ''
    },
    add() {
      this.dialogVisible = true
    },
    async del(policyId) {
      try {
        await this.$confirm('确定删除吗', '提示', {
          type: 'warning'
        })
        const res = await delPolicy(policyId)
        console.log(res)
        this.$message.success('删除策略成功')
        this.getPolicy()
      } catch (e) {
        console.log(e)
      }
    },
    edit(row) {
      console.log(row)
      this.dialogVisible = true
      this.$refs.policyDialog.policy = { ...row }
    },
    checkDetails(policyId, policyName) {
      this.dialogVisible1 = true
      this.$refs.policyDetails.policyId = policyId
      this.$refs.policyDetails.policyName = policyName
      this.$refs.policyDetails.policyAutomat()
    }
  }
}
</script>

<style scoped lang="scss">
.dashboard-container {
  .search {
        display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    height: 64px;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    margin-bottom: 20px;
    padding-left: 17px;
    background-color: #fff;
    .order-id {
      width: 205px;
      height: 36px;
    }
  }

  .policy-info {
    background-color: #fff;
    padding:20px;

    .add {
          display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    justify-content: center;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    width: 80px!important;
    height: 36px;
    padding: 0;
    background: linear-gradient(135deg,#ff9743,#ff5e20)!important;
    border: none;
    color:#fff;
    margin-bottom:20px;
    }

    .policy-operation {
      color: #5f84ff;
      cursor: pointer;

      span {
        margin-right:10px;
      }

      .three {
        color:#ff5a5a;
      }
    }
  }
}
</style>
