<template>
  <div class="dashboard-container">
    <div class="headerSearch">
      <search :table-date="tableDate" @searchNode="searchNode" />
    </div>
    <div class="main">
      <Button :two-show="false" @ShowAddDialog="ShowAddDialog" />
      <Table
        v-loading="loading"
        :thead="thead"
        :table-date="nodeList"
        :total-count="totalCount"
        :total-page="totalPage"
        :page-index="pageIndex"
        @click="changePage"
      >
        <template #action="row">
          <el-button
            size="mini"
            :style="{color: '#5f84ff'}"
            @click="showInfoDialog(row.row.row.id)"
          >查看详情</el-button>
          <el-button
            size="mini"
            :style="{color: '#5f84ff'}"
            @click="editRegion(row.row.row)"
          >修改</el-button>
          <el-button
            size="mini"
            :style="{color: '#ff5a5a'}"
            @click="delRegion(row.row.row.id)"
          >删除</el-button>
        </template>
      </Table>
    </div>
    <addNodeDialog
      ref="addNodeDialog"
      :dialog-form-visible="dialogFormVisible"
      :table-date="tableDate"
      :business-list="businessList"
      :partner-list="partnerList"
      @offAddDialog="offAddDialog"
      @refreshList="getNodeList"
    />
    <infoNodeDialog
      :info-dialog="infoDialog"
      :loading="loading"
      :node-info-list="nodeInfoList"
      @offInfoDialog="offInfoDialog"
    />
  </div>
</template>
<script>
import { getRegionList, searchNode, getBusinessList, getPartnerList, delNode, getNodeInfo } from '@/api/vm-node'
import search from './components/search.vue'
import addNodeDialog from './components/addNodeDialog.vue'
import infoNodeDialog from './components/infoNodeDialog.vue'
import Button from '../nodeRegion/components/button.vue'
import addr from './addr'
export default {
  components: {
    search,
    Button,
    addNodeDialog,
    infoNodeDialog
  },
  data() {
    return {
      label: '区域管理',
      thead: [
        { prop: 'name', label: '点位名称' },
        { prop: 'region.name', label: '所在区域' },
        { prop: 'businessType.name', label: '商圈类型' },
        { prop: 'ownerName', label: '合作商' },
        { prop: 'addr', label: '详细地址' },
        { prop: 'actions', label: '操作', slotName: 'action' }
      ],
      RegionPage: {
        pageIndex: 1
      },
      tableDate: [],
      nodeList: [],
      businessList: [],
      partnerList: [],
      // allNodeList: [],
      totalCount: 0,
      totalPage: 1,
      pageIndex: 1,
      loading: false,
      dialogFormVisible: false,
      infoDialog: false,
      nodeInfoList: []
    }
  },
  created() {
    this.getRegionList()
    this.getNodeList()
  },
  methods: {
    async getRegionList() {
      const { data } = await getRegionList({ pageSize: 10000 })
      console.log(data)
      this.tableDate = data.currentPageRecords
    },
    async getNodeList(val) {
      this.loading = true
      const { data } = await searchNode(val)
      console.log(data)
      console.log(data.currentPageRecords)
      data.currentPageRecords.forEach(ele => {
        const index = ele.addr.lastIndexOf('-')
        // console.log(ele.addr.slice(index + 1))
        ele.addr = ele.addr.slice(index + 1)
      })
      this.nodeList = data.currentPageRecords
      this.totalCount = data.totalCount
      this.totalPage = data.totalPage
      this.pageIndex = +data.pageIndex
      this.loading = false
    },
    async searchNode(val) {
      this.getNodeList(val)
    },
    changePage(val) {
      if (val === 0) {
        this.pageIndex = this.pageIndex * 1 - 1
        this.RegionPage.pageIndex = this.RegionPage.pageIndex * 1 - 1
        this.getNodeList(this.RegionPage)
      } else {
        this.pageIndex = this.pageIndex * 1 + val
        this.RegionPage.pageIndex = this.RegionPage.pageIndex * 1 + val
        this.getNodeList(this.RegionPage)
      }
    },
    async ShowAddDialog(val) {
      this.dialogFormVisible = val
      this.getBusinessList()
      this.getPartnerList()
    },
    offAddDialog() {
      this.dialogFormVisible = false
    },
    async getBusinessList() {
      const { data } = await getBusinessList()
      this.businessList = data
    },
    async getPartnerList() {
      const { data } = await getPartnerList({ pageSize: 10000 })
      this.partnerList = data.currentPageRecords
    },
    showInfoDialog(val) {
      this.infoDialog = true
      this.getNodeInfo(val)
    },
    offInfoDialog() {
      this.infoDialog = false
    },
    editRegion(val) {
      console.log(val)
      this.dialogFormVisible = true
      this.getBusinessList()
      this.getPartnerList()
      this.$refs.addNodeDialog.formDate = { ...val }
      // this.$refs.addNodeDialog.value.push(val.areaCode)
      // this.$refs.addNodeDialog.value = ['110000', '110100', '110101']
      addr.options.forEach(ele => {
        ele.children.forEach(item => {
          if (item.value === val.areaCode) {
            this.$refs.addNodeDialog.value = [ele.value, item.value, item.children[0].value]
          }
        })
      })
    },
    async delRegion(val) {
      await delNode(val)
      this.$message.success('删除区域成功')
      this.getNodeList()
    },
    async getNodeInfo(val) {
      this.loading = true
      const { data } = await getNodeInfo(val)
      console.log(data)
      data.forEach(ele => {
        if (ele.vmStatus === 0) {
          ele.vmStatus = '未投放'
        } else if (ele.vmStatus === 1) {
          ele.vmStatus = '运营'
        } else {
          ele.vmStatus = '撤机'
        }
        ele.lastSupplyTime = ele.lastSupplyTime.replace('T', ' ')
      })
      this.nodeInfoList = data
      this.loading = false
    }
  }
}
</script>

<style lang="scss" scoped>
.headerSearch {
  display: flex;
  justify-content: start;
  align-items: center;
  height: 64px;
  padding-left: 17px;
  margin-bottom: 20px;
  background-color: #fff;
  font-size: 14px;
  color: #606266;
}
.main {
  padding: 20px 15px 19px 17px;
  background-color: #fff;
  .el-row {
    margin-bottom: 20px;
  }
  // v-deep.el-table--border::after, .el-table--group::after, .el-table::before {
  //     background-color: #fff !important;
  // }
  .el-table td, .el-table th.is-leaf {
      border-bottom: 0;
  }
  .el-button--mini, .el-button--mini.is-round {
    padding: 0;
  }
  td {
    .el-button {
      font-size: 14px;
      border: 0;
    }
  }
}
</style>
