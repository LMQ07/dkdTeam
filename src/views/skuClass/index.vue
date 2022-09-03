<template>
  <div class="dashboard-container">
    <div class="SearBtn">
      <Search :label="searName" @search="Search"></Search>
    </div>
    <div class="NewBtn">
      <VmButton :twoShow="btnShow" style="margin:20px 0 20px 0" @show="AdSku"></VmButton>
      <Table
        :thead="theadFn"
        :table-date="tableDate"
        :total-count="totalCount"
        :page-index="pageIndex"
        :total-page="totalPage"
        @click="changeIndex"
      >
        <template v-slot:action="{ row }">
          <el-button type="text" @click="amendMerchandise(row.row)">修改</el-button>
          <el-button style="color: red" type="text" @click="deleSke(row.row.classId)">删除</el-button>
        </template>
      </Table>
      <AddSku
        :showDialog.sync="showDialogBtn"
        @QueBtn="queskuBtn"
        :show-before="true"
        ref="roleForm"
        :nameFn="name"
        @clickqr="clickQr"
      ></AddSku>
    </div>
  </div>
</template>

<script>
import { getSkuClass, addskuClass, DeleskuClass, updateRole } from '@/api/sku'
import AddSku from './components/addSku.vue'
export default {
  name: 'SkuClass',
  components: { AddSku },
  data() {
    return {
      showDialogBtn: false,
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      totalCount: 0,
      tableDate: [],
      rowF: {},
      name: '',
      searName: '商品类型搜索',
      btnShow: false,
      theadFn: [
        { label: '商品类型名称', prop: 'className' },
        { label: '操作', slotName: 'action' },
      ],
    }
  },
  mounted() {
    this.GetSkuClass()
  },
  methods: {
    async GetSkuClass() {
      const { data } = await getSkuClass({
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
      })
      // console.log(data)
      this.totalPage = data.totalPage
      this.totalCount = data.totalCount
      this.tableDate = data.currentPageRecords
    },
    AdSku() {
      this.showDialogBtn = true
      this.name = ''
    },
    async queskuBtn(className) {
      // console.log(className)
      await addskuClass({ className: className })
      this.showDialogBtn = false
      this.GetSkuClass()
    },
    // 点击页面
    changeIndex(val) {
      if (val === 0) {
        this.pageIndex -= 1
        this.GetSkuClass()
      } else {
        this.pageIndex += 1
        this.GetSkuClass()
      }
    },
    // 点击删除
    async deleSke(id) {
      // console.log(id)
      try {
        await this.$confirm('您确定删除该商品吗')
        await DeleskuClass(id)
        this.GetSkuClass()
        this.$message.success('删除商品成功')
      } catch (error) {
        console.log(error)
      }
    },
    async amendMerchandise(className) {
      console.log(className)
      this.showDialogBtn = true
      this.name = className.className
      this.$refs.roleForm.form.text = className.className
      this.rowF = className
      // console.log(this.name)
      // console.log(this.$refs.roleForm.form.text)
      // await updateRole(className)
    },
    async clickQr(value) {
      console.log(111)
      console.log(this.rowF)
      // await updateRole({ ...className, id: className.classId })
      await updateRole({
        ...this.rowF,
        id: this.rowF.classId,
        className: value,
      })
      this.GetSkuClass()
    },
    async Search(value) {
      console.log(9)
      const { data } = await getSkuClass({
        className: value,
      })
      console.log(data)
      this.totalPage = data.totalPage
      this.totalCount = data.totalCount
      this.tableDate = data.currentPageRecords
    },
  },
}
</script>

<style lang="scss" scoped>
.dashboard-container {
  width: 100%;
  height: 100%;
  background-color: 248, 250, 253;
  padding-right: 40px;
  .SearBtn {
    width: 100%;
    height: 60px;
    padding: 13px 20px 10px 20px;
    background-color: #fff;
  }
  .NewBtn {
    width: 100%;
    background-color: #fff;
    padding: 13px 20px 10px 20px;
    margin-top: 20px;
    color: #fff;
  }
}
</style>
