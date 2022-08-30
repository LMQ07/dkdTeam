<template>
  <div>

    <el-card style="margin-bottom:20px">
      <el-form ref="form" :model="page" label-width="100px">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="合作商搜索">
              <el-input v-model="page.name" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-button type="primary" icon="el-icon-search" @click="search">查询</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <el-card>

      <div class="addBtn">
        <el-button icon="el-icon-circle-plus-outline" type="warning" size="small" @click="addParnter">新建</el-button>
      </div>

      <Table
        :thead="thead"
        :table-date="tableData"
        :total-count="totalCount"
        :page-index="page.pageIndex"
        :total-page="totalPage"
        @click="click"
      >
        <template v-slot:action="{row}" width="300px">
          <el-button type="text" @click="resetPassword(row.row)">重置密码</el-button>
          <el-button type="text" @click="checkDetail(row.row)">查看详情</el-button>
          <el-button type="text" @click="edit(row.row)">修改</el-button>
          <el-button type="text" :style="{color:'#eb4444'}" @click="delePartner(row.row)">删除</el-button>
        </template>
      </Table>

    </el-card>
    <partner ref="partner" :partner-visible.sync="partnerVisible" @refresh="partnerSearchGet" />
    <partnerDetail :detail-visible.sync="detailVisible" :detail-data="detailData" />
  </div>
</template>

<script>
// import myTable from '@/components/Table'
import { partnerSearchGet, partnerResetPwd, userServicePartnerDel } from '@/api/nodePartner'
import partner from './components/partner.vue'
import partnerDetail from './components/partnerDetail.vue'
export default {
  name: 'NodePartner',
  // components: { myTable },
  components: { partner, partnerDetail },
  data() {
    return {
      page: {
        pageIndex: 1,
        pageSize: 10,
        name: ''
      },
      tableData: [],
      totalCount: 0,
      totalPage: 0,
      thead: [
        {
          prop: 'name',
          label: '合作商名称'
        },
        {
          prop: 'account',
          label: '账号'
        },
        {
          prop: 'vmCount',
          label: '设备数量'
        },
        {
          prop: 'ratio',
          label: '分成比例'
        },
        {
          prop: 'contact',
          label: '联系人'
        },
        {
          prop: 'mobile',
          label: '联系电话'
        },
        {
          label: '操作',
          prop: 'action',
          slotName: 'action'
        }
      ],
      partnerVisible: false,
      detailVisible: false,
      detailData: {}
    }
  },
  mounted() {
    this.partnerSearchGet()
  },
  methods: {
    async partnerSearchGet() {
      const { data } = await partnerSearchGet(this.page)
      console.log('data.currentPageRecords', data.currentPageRecords)
      if (data.currentPageRecords.length === 0 && data.totalCount !== 0) {
        this.page.pageIndex = +this.page.pageIndex - 1
        this.partnerSearchGet()
      }
      this.tableData = data.currentPageRecords
      this.totalCount = data.totalCount
      this.totalPage = data.totalPage
    },
    click(val) {
      if (val === 0) {
        this.$set(this.page, 'pageIndex', Number(this.page.pageIndex) - 1)
      } else if (val === 1) {
        this.$set(this.page, 'pageIndex', Number(this.page.pageIndex) + 1)
      }
      this.partnerSearchGet()
    },
    search() {
      this.$set(this.page, 'pageIndex', 1)
      this.partnerSearchGet()
    },
    addParnter() {
      this.partnerVisible = true
    },
    edit(row) {
      this.partnerVisible = true
      this.$refs.partner.ruleForm = row
    },
    checkDetail(row) {
      this.detailVisible = true
      this.detailData = row
    },
    resetPassword(row) {
      this.$confirm('确定要重置合作商密码吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        await partnerResetPwd(row.id)
        this.partnerSearchGet()
        this.$message({
          type: 'success',
          message: '重置密码成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    async  delePartner(row) {
      try {
        await userServicePartnerDel(row.id)
        this.partnerSearchGet()
        this.$message.success('删除成功')
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>

<style>
.addBtn{
  margin-bottom: 20px;
}
</style>
