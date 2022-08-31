<template>
  <div class="dashboard-container">
    <div class="search">
      <search label="型号查询" @search="searchByInnerCode" />
    </div>
    <div class="result">
      <div style="margin-bottom:20px">
        <VmButton :two-show="false" @show="showAddDetail" />
      </div>
      <Table
        :thead="thead"
        :table-date="tableDate"
        :total-count="totalCount"
        :page-index="pageIndex"
        :total-page="totalPage"
        @click="changeIndex"
      >
        <template v-slot:img="{row}">
          <el-image
            style="width: 24px; height: 24px; border-radius: 50%;"
            :src="row.row.image"
            fit="fill"
          />
        </template>
        <template v-slot:action="{row}">
          <el-button type="text" @click="showChangeDetail(row)">
            修改
          </el-button>
          <el-button type="text" style="color:red" @click="del(row)">
            删除
          </el-button>
        </template>
      </Table>
    </div>
    <!-- 新建以及修改都需要用到 需要注意 -->
    <newBuild ref="dialoge" :is-new-build="isNewBuild" :dialog-visible.sync="dialogVisible" />
  </div>
</template>

<script>
import newBuild from './components/newBuild.vue'
import { getVmType, delectVmType } from '@/api/vm'
import Table from '@/components/Table/index.vue'
export default {
  components: { newBuild, Table },
  data() {
    return {
      pageIndex: 1,
      pageSize: 10,
      name: '',
      totalCount: 0,
      totalPage: 0,
      tableDate: [],
      thead: [
        { label: '型号名称', prop: 'name' },
        { label: '型号编码', prop: 'model' },
        { label: '设备图片', prop: 'img', slotName: 'img' },
        { label: '货道行数', prop: 'vmRow' },
        { label: '货道列数', prop: 'vmCol' },
        { label: '设备容量', prop: 'channelMaxCapacity' },
        { label: '操作', prop: 'action', slotName: 'action' }
      ],
      isNewBuild: true,
      dialogVisible: false
    }
  },
  mounted() {
    this.getDate()
  },
  methods: {
    getDate() {
      this.getTableDate({
        pageIndex: this.pageIndex,
        pageSize: this.pageSize
      })
    },
    // 搜索用
    searchByInnerCode(value) {
      this.name = value
      this.getTableDate({
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
        name: this.name
      })
    },
    async getTableDate(obj) {
      const res = await getVmType(obj)
      console.log(res.data.currentPageRecords)
      this.tableDate = res.data.currentPageRecords
      this.totalCount = res.data.totalCount
      this.totalPage = res.data.totalPage
    },
    // 展示修改详情
    showChangeDetail({ row }) {
      this.isNewBuild = false
      this.dialogVisible = true
      this.$refs.dialoge.form = { ...row }
    },
    // 展示新增详情
    showAddDetail() {
      this.isNewBuild = true
      this.dialogVisible = true
    },
    // 删除
    async del({ row }) {
      // console.log(row.typeId)
      try {
        await delectVmType(row.typeId)
        this.$message.success('删除成功')
        this.pageIndex = 1
        this.getDate()
      } catch {
        this.$message.error('删除失败')
      }
    },
    // 点击页面的
    changeIndex(val) {
      if (val === 0) {
        this.pageIndex -= 1
        this.getTableDate({
          pageIndex: this.pageIndex,
          pageSize: this.pageSize
        })
      } else {
        this.pageIndex += 1
        this.getTableDate({
          pageIndex: this.pageIndex,
          pageSize: this.pageSize
        })
      }
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
.result{
  padding: 20px 15px 19px 17px;
  background-color: #fff;
}
</style>
