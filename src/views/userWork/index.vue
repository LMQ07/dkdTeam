<template>
  <div class="dashboard-container">
    <!-- 搜索框 -->
    <el-row type="flex" align="middle">
      <el-form ref="form" :model="userForm" label-width="80px" :inline="true" class="search">
        <el-form-item label="人员搜索:">
          <el-input v-model="userForm.userName" placeholder="请输入" clearable />
        </el-form-item>
        <el-form-item label="角色:">
          <el-select v-model="userForm.isRepair" placeholder="请选择" clearable>
            <el-option label="运营员" value="false" />
            <el-option label="维修员" value="true" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button
            class="button"
            type="primary"
            @click="getUserWork"
          >
            <i class="el-icon-search" />
            查询</el-button>
        </el-form-item>
      </el-form>
    </el-row>
    <!-- 列表 -->
    <Table
      :total-count="totalCount"
      :page-index="pageIndex"
      :total-page="totalPage"
      :table-date="userWork"
      :thead="thead"
      @click="changePage"
    >
      <template v-slot:operation="{row}">
        <span class="operation" @click="check(row.row.userId)">查看操作</span>
      </template>
    </Table>
    <!-- 弹窗 -->
    <userDialog :dialog-visible.sync="dialogVisible" />
  </div>
</template>

<script>
import { getUserWork, getUserWorkInfo } from '@/api/user'
import userDialog from './components/userDialog.vue'
export default {
  components: {
    userDialog
  },
  data() {
    return {
      userWork: [],
      pageIndex: 1,
      pageSize: 10,
      thead: [
        {
          prop: 'userName',
          label: '人员名称'
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
          prop: 'workCount',
          label: '完成工单(本月)'
        },
        {
          prop: 'progressTotal',
          label: '进行中工单'
        },
        {
          prop: 'cancelCount',
          label: '拒绝工单'
        },
        {
          prop: '',
          label: '操作',
          slotName: 'operation'
        }
      ],
      totalCount: 0, // 总条数
      totalPage: 0,
      userForm: {
        userName: '',
        isRepair: ''
      },
      dialogVisible: false // 弹窗
    }
  },
  created() {
    this.getUserWork()
  },
  methods: {
    // 人员列表渲染  点击查询的时候也调用这个接口
    async  getUserWork() {
      try {
        const { data } = await getUserWork({
          pageIndex: this.pageIndex,
          pageSize: this.pageSize,
          userName: this.userForm.userName,
          isRepair: this.userForm.isRepair
        })
        // console.log(data)
        this.userWork = data.currentPageRecords
        this.totalCount = data.totalCount // 总条数
        this.totalPage = data.totalPage
      } catch (e) {
        console.log(e)
      }
    },
    // 分页切换
    changePage(val) {
      if (val === 0) {
        // 表示点击上一页
        this.pageIndex -= 1
      }
      if (val === 1) {
        // 表示点击下一页
        this.pageIndex += 1
      }
      // 重新调用接口
      this.getUserWork()
    },
    // 查看操作
    async  check(id) {
      this.dialogVisible = true
      // console.log(id)
      try {
        const res = await getUserWorkInfo()
        console.log(res)
      } catch (e) {
        console.log(e)
      }
    }

  }
}
</script>

<style lang="scss" scoped>
  .dashboard-container{
    .search {
  margin-bottom: 20px;
  padding-left: 5px;
  background: #fff;
  width: 100%;
  height: 64px;
  line-height: 64px;
   .el-input,
   .el-select {
    line-height: 64px;
  }

    .el-button {
    margin-top: 12px;
    min-width: 80px;
    height: 36px;
    padding: 0;
    border: 0;
    background-color: #5f84ff;
  }
}
  }
  ::v-deep .el-form-item__label{
    font-weight: 400 !important;
  }
.operation{
  color: #5f84ff;
  cursor: pointer;
  font-weight: 700;
}
.operation:hover{
  color: #4368e1;;
}
</style>
