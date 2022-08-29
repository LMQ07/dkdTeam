<template>
  <div class="dashboard-container">
    <div class="search">
      <search label="设备编号" @search="searchByInnerCode" />
    </div>
    <div class="result">
      <div style="margin-bottom:20px">
        <VmButton />
      </div>
      <Table
        :show-box="true"
        :thead="thead"
        :table-date="tableDate"
        :total-count="totalCount"
        :page-index="pageIndex"
        :total-page="totalPage"
        @click="changeIndex"
      >
        <template v-slot:img="{row}">
          <el-avatar
            src="https://pics3.baidu.com/feed/cf1b9d16fdfaaf51055aeb850e4a2de7f01f7a73.jpeg?token=13a989ae26c8c26689240bf4a3c776a0"
          />
        </template>
        <template v-slot:action="{row}">
          <el-button type="text">货道</el-button>
          <el-button type="text">策略</el-button>
          <el-button style="color: red" type="text">修改</el-button>
        </template>
      </Table>
    </div>
  </div>
</template>

<script>
import { getVmIndexMsg } from '@/api/vm'
export default {
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
        { label: '图片', prop: 'img', slotName: 'img' },
        { label: '合作商', prop: 'ownerName' },
        { label: '操作', prop: 'action', slotName: 'action' },
      ],
    }
  },
  mounted() {
    this.getVmIndexDate()
  },
  methods: {
    searchByInnerCode(value) {
      console.log(value)
    },
    async getVmIndexDate() {
      const { data } = await getVmIndexMsg({
        pageIndex: this.pageIndex,
        pageSize: this.pageSize
      })
      // 处理好数据
      data.currentPageRecords.forEach((element) => {
        element.node.addr = element.node.addr.split('-')[3]
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
        this.getVmIndexDate()
      } else {
        this.pageIndex += 1
        this.getVmIndexDate()
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.search {
  display: flex;
  align-items: center;
  height: 64px;
  margin-bottom: 20px;
  padding-left: 17px;
  background-color: #fff;
}
.result {
  padding: 20px 15px 19px 17px;
  background-color: #fff;
}
.detail {
  span {
    color: #5f84ff;
  }
}
</style>
