<template>
  <div class="dashboard-container">
    <div class="headerSearch">
      <Search :label="label" @search="searchRegion" />
    </div>
    <div class="main">
      <Button :two-show="false" @ShowAddDialog="ShowAddDialog" />
      <Table
        v-loading="loading"
        :thead="thead"
        :table-date="tableDate"
        :total-count="totalCount"
        :total-page="totalPage"
        :page-index="pageIndex"
        @click="changePage"
      >
        <template #action="row">
          <el-button
            size="mini"
            :style="{color: '#5f84ff'}"
            @click="showInfoDialog(row)"
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
    <addDialog
      ref="addDialog"
      :dialog-form-visible="dialogFormVisible"
      @offAddDialog="offAddDialog"
      @refreshList="getRegionList"
    />
    <infoDialog
      :info-dialog="infoDialog"
      :region-info="regionInfo"
      :node-list="nodeList"
      :loading="loading"
      @offInfoDialog="offInfoDialog"
    />
  </div>
</template>
<script>
import { getRegionList, getNodeList, delRegion } from '@/api/vm-node'

import addDialog from './components/addDialog.vue'
import infoDialog from './components/infoDialog.vue'
import Button from './components/button.vue'
export default {
  components: {
    addDialog,
    infoDialog,
    Button
  },
  data() {
    return {
      label: '区域管理',
      thead: [
        { prop: 'name', label: '区域名称' },
        { prop: 'nodeCount', label: '点位数' },
        { prop: 'remark', label: '备注说明' },
        { prop: 'actions', label: '操作', slotName: 'action' }
      ],
      page: {
        pageIndex: 1,
        pageSize: 10,
        name: ''
      },
      tableDate: [],
      totalCount: 0,
      totalPage: 1,
      pageIndex: 1,
      dialogFormVisible: false,
      infoDialog: false,
      regionInfo: {},
      nodeList: [],
      loading: false
    }
  },
  created() {
    this.getRegionList()
  },
  methods: {
    async getRegionList() {
      this.loading = true
      const { data } = await getRegionList(this.page)
      console.log(data)
      this.tableDate = data.currentPageRecords
      this.totalCount = data.totalCount
      this.totalPage = data.totalPage
      this.pageIndex = +data.pageIndex
      this.loading = false
    },
    changePage(val) {
      if (val === 0) {
        this.page.pageIndex = this.page.pageIndex * 1 - 1
        this.getRegionList()
      } else {
        this.page.pageIndex = this.page.pageIndex * 1 + val
        this.getRegionList()
      }
    },
    searchRegion(val) {
      this.page.name = val
      this.getRegionList()
    },
    ShowAddDialog(val) {
      this.dialogFormVisible = val
    },
    offAddDialog() {
      this.dialogFormVisible = false
    },
    showInfoDialog(val) {
      console.log(val)
      this.regionInfo = val.row.row
      this.infoDialog = true
      this.getNodeList()
    },
    offInfoDialog() {
      this.infoDialog = false
    },
    async getNodeList() {
      this.loading = true
      const { data } = await getNodeList({
        // pageIndex: 1,
        pageSize: 10000,
        regionId: this.regionInfo.id
      })
      console.log(data)
      this.nodeList = data.currentPageRecords
      this.loading = false
    },
    async delRegion(val) {
      const { data } = await delRegion(val)
      console.log(data)
      this.$message.success('删除区域成功')
      this.getRegionList()
    },
    editRegion(val) {
      this.dialogFormVisible = true
      this.$refs.addDialog.formDate = { ...val }
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
