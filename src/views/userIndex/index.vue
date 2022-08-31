<template>
  <div class="dashboard-container">
    <el-card style="margin-bottom:20px">
      <el-form ref="form" :model="formData" label-width="80px">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="人员搜索">
              <el-input v-model="formData.userName" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-button type="primary" icon="el-icon-search" @click="search">查询</el-button>
          </el-col>
        </el-row>

      </el-form>
    </el-card>
    <el-card>
      <div class="addBtn">
        <el-button icon="el-icon-circle-plus-outline" type="warning" size="small" @click="addPerson">新建</el-button>
      </div>
      <myTable
        :table-date="tableDate"
        :thead="thead"
        :total-count="totalCount"
        :page-index="formData.pageIndex"
        :total-page="totalPage"
        @click="click"
      >
        <template v-slot:action="{row}">
          <el-button type="text" @click="edit(row.row)">修改</el-button>
          <el-button type="text" :style="{color:'#eb4444'}" @click="del(row.row)">删除</el-button>
        </template>
      </myTable>
    </el-card>
    <personModel ref="personModel" :person-visible.sync="personVisible" @refresh="userServiceList" />
  </div>
</template>

<script>
import myTable from '@/components/Table'
import { userServiceList, userServiceUserDel } from '@/api/userIndex'
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
      ],
      personVisible: false
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
      if (this.tableDate.length === 0 && data.totalCount !== 0) {
        this.formData.pageIndex = +this.formData.pageIndex - 1
        this.userServiceList()
      }
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
    },
    addPerson() {
      this.personVisible = true
    },
    edit(row) {
      this.$refs.personModel.personForm = { ...row }
      this.personVisible = true
    },
    async del(row) {
      try {
        await userServiceUserDel(row.id)
        this.$message.success('删除成功')
        this.userServiceList()
      } catch (error) {
        this.$message.error(error)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.addBtn{
  margin-bottom: 20px;
}
</style>
