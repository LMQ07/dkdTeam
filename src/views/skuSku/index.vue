<template>
  <div class="dashboard-container">
    <div class="SearBtn">
      <Search :label="searName" @search="Search"></Search>
    </div>
    <div class="NewBtn">
      <el-row style="margin:20px 0 20px 0">
        <el-button size="medium" class="newBuild" @click="xjSkusku">
          <i class="el-icon-circle-plus-outline" /> 新建
        </el-button>
        <el-button size="medium" class="two" @click="centerDialogVisible = true">导入数据</el-button>
        <el-dialog title="数据导入" :visible.sync="centerDialogVisible" width="32%" class="sjdr">
          <label class="el-form-item__label" style="width: 120px;">标题：</label>
          <div class="el-form-item__content" style="margin-left: 100px;">
            <div>
              <el-button type="primary" style="width:230px" @click="handleUpload">
                <i class="el-icon-upload el-icon--right"></i>上传文件
              </el-button>
              <input
                ref="excel-upload-input"
                class="excel-upload-input"
                type="file"
                accept=".xlsx, .xls"
                @change="handleClick"
              />

              <div style="line-height: 20px; margin-top:30px; color:#ccc">支持扩展名:xls、xlsx,文件不得大于1M</div>
            </div>
          </div>
          <span slot="footer" class="dialog-footer">
            <el-button @click="centerDialogVisible = false" class="qxBBtn">取 消</el-button>
            <el-button type="primary" @click="centerDialogVisible = false" class="qdBBtn">确 认</el-button>
          </span>
        </el-dialog>
      </el-row>
      <Table
        :thead="theadFn"
        :table-date="tableDate"
        :total-count="totalCount"
        :page-index="pageIndex"
        :total-page="totalPage"
        @click="changeIndex"
        ref="PriceJg"
      >
        <template v-slot:Price="{ row }">{{row.row.price/100}}</template>
        <template v-slot:picture="{ row }">
          <el-avatar :size="24" :src="row.row.skuImage" />
        </template>
        <template v-slot:obj="{ row }">{{row.row.createTime | formatDate("yyyy.MM.dd hh:mm:ss") }}</template>
        <template v-slot:action="{ row }">
          <el-button type="text" @click="edit(row.row)">修改</el-button>
        </template>
      </Table>
    </div>
    <AddSkusku
      v-model="Addskussss"
      v-if="currentPageRecords"
      :currentPageRecords="currentPageRecords"
      ref="addPermission"
    ></AddSkusku>
  </div>
</template>

<script>
import * as XLSX from 'xlsx'
import { getSkuSkuSearch, getSkuClass, servicUpload } from '@/api/sku'
import AddSkusku from './components/add-sku.vue'
export default {
  name: 'SkuSku',
  components: { AddSkusku },
  data() {
    return {
      excelData: {
        header: null,
        results: null,
      },
      Addskussss: false,
      centerDialogVisible: false,
      searName: '商品搜索',
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      totalCount: 0,
      tableDate: [],
      priceS: '',
      currentPageRecords: [],
      theadFn: [
        { label: '商品类型名称', prop: 'skuName' },
        { label: '商品图片', prop: 'skuImage', slotName: 'picture' },
        { label: '品牌', prop: 'brandName' },
        { label: '规格', prop: 'unit' },
        { label: '商品价格', prop: 'price', slotName: 'Price' },
        { label: '商品类型', prop: 'skuClass.className' },
        { label: '创建日期', prop: 'createTime', slotName: 'obj' },
        { label: '操作', slotName: 'action' },
      ],
    }
  },
  mounted() {
    this.getSkuSkuSearch()
  },
  methods: {
    async getSkuSkuSearch() {
      try {
        const { data } = await getSkuSkuSearch({
          pageIndex: this.pageIndex,
          pageSize: this.pageSize,
        })
        console.log(data)
        this.totalPage = data.totalPage
        this.totalCount = data.totalCount
        this.tableDate = data.currentPageRecords
      } catch (error) {
        console.log(error)
      }
    },
    // 点击页面
    changeIndex(val) {
      if (val === 0) {
        this.pageIndex -= 1
        this.getSkuSkuSearch()
      } else {
        this.pageIndex += 1
        this.getSkuSkuSearch()
      }
    },
    // 搜索
    async Search(value) {
      // console.log(9)
      const { data } = await getSkuSkuSearch({
        skuName: value,
      })
      // console.log("22",data)
      this.totalPage = data.totalPage
      this.totalCount = data.totalCount
      this.tableDate = data.currentPageRecords
    },
    // 上传
    generateData({ header, results }) {
      this.excelData.header = header
      this.excelData.results = results
      // 数据整合，整合成功之后 通过毁掉函数 onSuccess 传递出去
      this.onSuccess && this.onSuccess(this.excelData)
    },
    handleClick(e) {
      const files = e.target.files
      // files 一个文件夹中所有 File 对象的集合。
      // File 对象  提供对文件所有属性的访问
      const rawFile = files[0] // only use files[0]
      if (!rawFile) return
      this.upload(rawFile)
    },
    handleUpload() {
      // 实际上点击的 input
      this.$refs['excel-upload-input'].click()
    },
    upload(rawFile) {
      this.$refs['excel-upload-input'].value = null // fix can't select the same excel
      // beforeUpload 上传之前的检测函数
      // 不存在
      if (!this.beforeUpload) {
        this.readerData(rawFile)
        return
      }
      // 存在
      const before = this.beforeUpload(rawFile)
      if (before) {
        this.readerData(rawFile)
      }
    },
    readerData(rawFile) {
      this.loading = true
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        // reader 可以读取文件的内容
        reader.onload = (e) => {
          const data = e.target.result
          const workbook = XLSX.read(data, { type: 'array' })
          const firstSheetName = workbook.SheetNames[0]
          const worksheet = workbook.Sheets[firstSheetName]
          const header = this.getHeaderRow(worksheet)

          const results = XLSX.utils.sheet_to_json(worksheet)

          this.generateData({ header, results }) // 数据整合

          this.loading = false
          resolve()
        }
        reader.readAsArrayBuffer(rawFile)
      })
    },
    getHeaderRow(sheet) {
      const headers = []
      const range = XLSX.utils.decode_range(sheet['!ref'])
      let C
      const R = range.s.r
      /* start in the first row */
      for (C = range.s.c; C <= range.e.c; ++C) {
        /* walk every column in the range */
        const cell = sheet[XLSX.utils.encode_cell({ c: C, r: R })]
        /* find the cell in the first row */
        let hdr = 'UNKNOWN ' + C // <-- replace with your desired default
        if (cell && cell.t) hdr = XLSX.utils.format_cell(cell)
        headers.push(hdr)
      }
      return headers
    },
    async qdBBtn() {
      await servicUpload(this.rawFile)
    },
    // 弹窗显示
    async xjSkusku() {
      // console.log(1112323)
      this.Addskussss = true
      const { data } = await getSkuClass()
      // console.log(data)
      this.currentPageRecords = data.currentPageRecords
      console.log(this.currentPageRecords)
    },

    // 修改页面
    edit(row) {
      const data = { ...row }
      data.price = data.price / 100
      this.$refs.addPermission.personForm = { ...data }
      console.log('12', this.$refs.addPermission.personForm)
      this.Addskussss = true
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
  .qxBBtn {
    background-color: #fbf4f0 !important;
    margin-right: 50px;
    margin-left: 100px;
  }
  .qdBBtn {
    background-color: #ed743d !important;
    margin-right: 100px;
  }
  .el-form-item__label {
    text-align: right;
    vertical-align: middle;
    float: left;
    font-size: 14px;
    color: #606266;
    line-height: 40px;
    padding: 0 12px 0 0;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
  }
  .excel-upload-input {
    display: none;
    z-index: -9999;
  }
}
</style>
