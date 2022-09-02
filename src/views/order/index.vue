<template>
  <div class="dashboard-container">
    <div class="search">
      <el-form :inline="true">
        <el-form-item label="订单编号:">
          <el-input v-model="search.orderNo" placeholder="请输入订单编号" class="order-id" clearable />
        </el-form-item>

        <el-form-item label="选择日期:">
          <div class="block">
            <span class="demonstration" />
            <el-date-picker
              v-model="value1"
              type="daterange"
              range-separator="~"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            />
          </div>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="searchOrder">查询</el-button>
        </el-form-item>
      </el-form>
    </div>

    <Table v-loading="loading" :thead="thead" :table-date="tableDate" :total-count="totalCount" :total-page="totalPage" :page-index="pageIndex" @click="pageFn">
      <template v-slot:operation="{row}">
        <span class="check" @click="check(row.row)">查看详情</span>
      </template>
      <template v-slot:createTime="{row}">
        <span> {{ row.row.createTime | formatDate }}</span>
      </template>
    </Table>

    <!-- 弹窗 -->
    <DialogOreder :order-info="orderInfo" :dialog-visible.sync="dialogVisible" />
  </div>
</template>

<script>
import Table from '@/components/Table'
import { getOrder } from '@/api/order'
import DialogOreder from './components/DialogOreder.vue'
export default {
  components: { Table, DialogOreder },
  data() {
    return {
      dialogVisible: false,
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      },
      thead: [{
        prop: 'orderNo',
        label: '订单编号'
      },
      {
        prop: 'skuName',
        label: '商品名称'
      },
      {
        prop: 'price',
        label: '订单金额'
      },
      {
        prop: 'innerCode',
        label: '设备编号'
      },
      {
        prop: 'status',
        label: '订单状态'
      },
      {
        prop: 'createTime',
        label: '订单日期',
        slotName: 'createTime'
      },
      {
        prop: 'operation',
        label: '操作',
        slotName: 'operation'
      }],
      pageIndex: 1,
      pageSize: 10,
      tableDate: [],
      totalCount: 0,
      totalPage: 1,
      value1: '',
      search: {
        orderNo: '',
        startDate: '',
        endDate: ''
      },
      orderInfo: {},
      loading: false,
      show: true
    }
  },

  mounted() {
    this.getOrder()
  },
  methods: {
    async getOrder() {
      try {
        this.loading = true
        const { data } = await getOrder({
          pageIndex: this.pageIndex,
          pageSize: this.pageSize
        })
        // console.log(currentPageRecords, totalCount, totalPage)
        this.tableDate = data.currentPageRecords.map(item => {
          item.payType = item.payType === '1' ? '支付宝支付' : '微信支付'
          const name = {
            0: '未支付',
            1: '支付完成',
            2: '出货成功',
            3: '出货失败'
          }
          item.status = name[item.status]
          return item
        })
        this.totalCount = data.totalCount
        this.totalPage = data.totalPage
      } catch (e) {
        console.log(e)
      } finally {
        this.loading = false
      }
    },
    pageFn(val) {
      if (val === 0) {
        this.pageIndex -= 1
        this.getOrder()
      } else {
        this.pageIndex = +this.pageIndex + 1
        this.getOrder()
      }
    },
    check(val) {
      this.dialogVisible = true
      console.log(val)
      this.orderInfo = val
    },
    async searchOrder() {
      this.search.startDate = this.value1[0]
      this.search.endDate = this.value1[1]
      // console.log(this.search.value1)
      const { data } = await getOrder({
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
        ...this.search
      })
      // console.log(currentPageRecords, totalCount, totalPage, pageIndex)
      this.tableDate = data.currentPageRecords.map(item => {
        item.payType = item.payType === '1' ? '支付宝支付' : '微信支付'
        const name = {
          0: '创建',
          1: '支付完成',
          2: '出货成功',
          3: '出货失败'
        }
        item.status = name[item.status]
        return item
      })
      this.totalCount = data.totalCount
      this.totalPage = data.totalPage
    },
    clear() {
      this.search.orderNo = ''
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

      .isShow {
        display:none;
      }
    }
  }

  .check {
        color: #5f84ff;
        cursor: pointer;
  }
}
</style>
