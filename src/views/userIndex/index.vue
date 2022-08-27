<template>
  <div class="dashboard-container">
    <el-card style="margin-bottom:20px">
      <el-form ref="form" :model="formData" label-width="80px">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="人员搜索">
              <el-input v-model="formData.userName" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-button type="primary" icon="el-icon-search" @click="search">查询</el-button>
          </el-col>
        </el-row>

      </el-form>
    </el-card>
    <el-card>
      <myTable
        :table-date="tableDate"
        :thead="thead"
        :total-count="totalCount"
        :page-index="formData.pageIndex"
        :total-page="totalPage"
        @click="click"
      >
        <template v-slot:action="{row}">
          <el-button type="text">修改</el-button>
          <el-button type="text">删除</el-button>
        </template>
      </myTable>
    </el-card>
    <personModel />
  </div>
</template>

<script>
import myTable from '@/components/Table'
import { userServiceList } from '@/api/userIndex'
import personModel from './components/personModel.vue'
export default {
  name: 'UserIndex',
  components: { myTable, personModel },
  data() {
    return {
      formData: {
        pageIndex: 1,
        pageSize: 10,
        userName: ''
      },
      tableDate: [],
      totalCount: '',
      totalPage: '',
      thead: [
        {
          prop: 'userName',
          label: '人员名称'
        },
        {
          prop: 'regionName',
          label: '归属区域'
        },
        {
          prop: 'roleName',
          label: '角色'
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
  created() {
    this.userServiceList()
  },
  methods: {
    async userServiceList() {
      const { data } = await userServiceList(this.formData)
      this.tableDate = data.currentPageRecords.map(item => {
        item.roleName = item.role.roleName
        return item
      })
      console.log('this.tableDate', this.tableDate)
      this.totalCount = data.totalCount
      this.totalPage = data.totalPage
    },
    click(val) {
      if (val === 0) {
        this.$set(this.formData, 'pageIndex', Number(this.formData.pageIndex) - 1)
      } else if (val === 1) {
        this.$set(this.formData, 'pageIndex', Number(this.formData.pageIndex) + 1)
      }
      this.userServiceList()
    },
    search() {
      this.$set(this.formData, 'pageIndex', 1)
      this.userServiceList()
    }
  }
}
</script>

<style>

</style>
