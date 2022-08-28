<template>
  <div>

    <el-card style="margin-bottom:20px">
      <el-form ref="form" :model="page" label-width="100px">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="合作商搜索">
              <el-input v-model="page.name" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-button type="primary" icon="el-icon-search" @click="search">查询</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <el-card>
      <Table
        :thead="thead"
        :table-date="tableData"
        :total-count="totalCount"
        :page-index="page.pageIndex"
        :total-page="totalPage"
        @click="click"
      >
        <template v-slot:action="{row}">
          <el-button type="text">重置密码</el-button>
          <el-button type="text">查看详情</el-button>
          <el-button type="text">修改</el-button>
          <el-button type="text">删除</el-button>
        </template>
      </Table>
    </el-card>
    <partner />
  </div>
</template>

<script>
// import myTable from '@/components/Table'
import { partnerSearchGet } from '@/api/nodePartner'
import partner from './components/partner.vue'
export default {
  name: 'NodePartner',
  // components: { myTable },
  components: { partner },
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
      ]
    }
  },
  mounted() {
    this.partnerSearchGet()
  },
  methods: {
    async partnerSearchGet() {
      const { data } = await partnerSearchGet(this.page)
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
      this.partnerSearchGet()
    }
  }
}
</script>

<style>

</style>
