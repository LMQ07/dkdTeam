<template>
  <div class="dashboard-container">
    <div class="search">
      <search label="设备编号" @search="searchByInnerCode" />
    </div>
    <div class="result">
      <Table
        :thead="thead"
        :table-date="tableDate"
        :total-count="totalCount"
        :page-index="pageIndex"
        :total-page="totalPage"
        @click="changeIndex"
      >
        <template v-slot:status>
          <div class="status">
            <div class="item success">
              <span>离线</span>
            </div>
            <div class="item">
              <span class="green">货道</span>
            </div>
            <div class="item">
              <span class="green">传动轴</span>
            </div>
          </div>
        </template>
        <template v-slot:action="{row}">
          <el-button type="text" @click="showDetail(row)">
            查看详情
          </el-button>
        </template>
      </Table>
    </div>
    <detailDialog :dialog-visible="detailShow" :row-detail="rowDetail" />
  </div>
</template>

<script>
import { getVmIndexMsg } from '@/api/vm'
import detailDialog from './components/detailDialog.vue'

export default {
  components: {
    detailDialog
  },
  data() {
    return {
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      totalCount: 0,
      tableDate: [],
      thead: [
        { label: '设备编号', prop: 'innerCode' },
        { label: '设备型号', prop: 'type.name' },
        { label: '详细地址', prop: 'node.addr' },
        { label: '运营状态', prop: 'vmStatus' },
        { label: '设备状态', prop: 'status', slotName: 'status' },
        { label: '操作', prop: 'detail', slotName: 'action' }
      ],
      detailShow: false,
      rowDetail: {}
    }
  },
  mounted() {
    this.getDate()
  },
  methods: {
    // 搜索栏的发起请求
    searchByInnerCode(value) {
      this.getVmIndexDate({
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
        innerCode: value
      })
    },
    getDate() {
      this.getVmIndexDate({
        pageIndex: this.pageIndex,
        pageSize: this.pageSize
      })
    },
    // 获取数据的方法
    async  getVmIndexDate(obj) {
      const { data } = await getVmIndexMsg(obj)
      const statusObj = {
        0: '未投放',
        1: '运营',
        3: '撤机'
      }
      // 处理好数据
      data.currentPageRecords.forEach(element => {
        element.node.addr = element.node.addr.split('-')[3]
        element.vmStatus = statusObj[element.vmStatus]
      })
      this.tableDate = data.currentPageRecords
      this.totalCount = data.totalCount
      this.totalPage = data.totalPage
      console.log(this.tableDate)
    },
    // 点击页面
    changeIndex(val) {
      if (val === 0) {
        this.pageIndex -= 1
        this.getVmIndexDate({
          pageIndex: this.pageIndex,
          pageSize: this.pageSize
        })
      } else {
        this.pageIndex += 1
        this.getVmIndexDate({
          pageIndex: this.pageIndex,
          pageSize: this.pageSize
        })
      }
    },
    showDetail(row) {
      this.detailShow = true
      this.rowDetail = row
    }
  }
}
</script>

<style lang="scss" scoped>
.search{
  display: flex;
  align-items: center;
  height: 64px;
  margin-bottom: 20px;
  padding-left: 17px;
  background-color: #fff;
}
.el-table_1_column_6{
  width:300px;
}
 .status{
   display:flex;
    div{
    display: block;
    flex:1;
    margin-right: 5px;
    &.item{
      cursor: pointer;
     padding:0 5px;
     box-sizing: border-box;
     text-align: center;
     color: #fff;
     background: #ff665f linear-gradient(135deg,#3fc997,#4bda98);
     border-radius: 14px;
     &.success{
     background: #ff665f linear-gradient(135deg,#ffb043,#ffc020);
     }
    }
    &.div{
      width:75px
    }
  }
 }
</style>
