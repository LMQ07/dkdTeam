<template>
  <div class="">
    <el-row type="flex" align="middle">
      <el-form
        ref="form"
        :model="form"
        label-width="80px"
        :inline="true"
        class="search"
      >
        <el-form-item label=" 工单编号:">
          <el-input v-model="form.taskCode" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="工单状态">
          <el-select v-model="form.status" placeholder="请选择" clearable>
            <el-option label="待办" value="1"></el-option>
            <el-option label="进行" value="2"></el-option>
            <el-option label="取消" value="3"></el-option>
            <el-option label="完成" value="4"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button class="button" type="primary" @click="onSearch"
            >查询</el-button
          >
        </el-form-item>
      </el-form>
    </el-row>
    <el-row class="list-container">
      <el-row>
        <el-button
          class="addBtn"
          icon="el-icon-circle-plus-outline"
          size="mini"
          @click="openAddDialog"
        >
          新建
        </el-button>
      </el-row>
      <el-row class="table">
        <MyTable
          :tableDate="tableData"
          :thead="dataLabel"
          :totalCount="total"
          :pageIndex="currentPage"
          :totalPage="totalPage"
          @click="changePage"
        >
          <template #createType="{ row }">
            {{ row.row.createType == 0 ? "自动" : "手动" }}
          </template>
          <template #operate="{ row }">
            <span class="details" @click="getInfo(row.row)">查看详情</span>
          </template>
        </MyTable>
      </el-row>
    </el-row>
    <NewDialog
      ref="dialogRef"
      :dialogFormVisible="dialogFormVisible"
      :operatorList="repairerList"
      :taskTypeOption="taskType"
      formType="operation"
      :detailsInfo="currentDetails"
      :dialogType="dialogType"
      @getInnerCode="operatorRequest"
      @getTaskInfo="taskRequest"
      v-if="dialogFormVisible"
    />
    <InfoDialog
      :infoDialogVisible="infoDialogVisible"
      v-if="infoDialogVisible"
      formType="operation"
      @rebuildTask="rebuild"
      :detailsInfo="rowDetailsInfo"
    />
  </div>
</template>

<script>
import MyTable from "@/components/Table";
import NewDialog from "../taskBussiness/components/NewDialog";
import InfoDialog from "../taskBussiness/components/InfoDialog.vue";
import { getTaskAPI, getRepairerListAPI, createTaskAPI } from "@/api/task";

export default {
  data() {
    return {
      form: {
        taskCode: "",
        status: "",
      },
      dataLabel: [
        {
          prop: "taskCode",
          label: "工单序号",
        },
        {
          prop: "innerCode",
          label: "设备编号",
        },
        {
          prop: "taskType.typeName",
          label: "工单类型",
        },
        {
          prop: "createType",
          label: "工单方式",
          slotName: "createType",
        },
        {
          prop: "taskStatusTypeEntity.statusName",
          label: "工单状态",
        },
        {
          prop: "userName",
          label: "运营人员",
        },
        {
          prop: "createTime",
          label: "创建日期",
        },
        {
          prop: "operate",
          label: "操作",
          slotName: "operate",
        },
      ],
      tableData: [],
      // 当前页
      currentPage: 1,
      // 每页数量
      pageSize: "",
      // 总共几条
      total: "",
      taskType: [],
      dialogFormVisible: false,
      repairerList: [],
      infoDialogVisible: false,
      rowDetailsInfo: {},
      currentDetails: {},
      dialogType: "Bussiness",
    };
  },
  created() {
    this.getTaskList();
  },
  methods: {
    // 获取表格数据
    async getTaskList(queryInfo) {
      const { data: res } = await getTaskAPI({
        pageIndex: this.currentPage,
        isRepair: true,
        ...queryInfo,
      });
      this.currentPage = res.pageIndex;
      this.pageSize = res.pageSize;
      this.total = res.totalCount;
      this.tableData = res.currentPageRecords;
      console.log(res);
    },

    onSearch() {
      // 查询
      this.getTaskList({ ...this.form });
    },
    getInfo(row) {
      this.currentDetails = row;
      this.rowDetailsInfo = row;
      this.infoDialogVisible = true;
      console.log(row);
    },
    changePage(val) {
      if (val == 1) {
        this.currentPage = +this.currentPage + 1;
      } else {
        this.currentPage = +this.currentPage - 1;
      }
      this.getTaskList();
      console.log(this.currentPage);
      console.log(val);
    },
    openAddDialog() {
      this.taskType = [
        { label: "投放工单", value: 1 },
        { label: "维修工单", value: 3 },
        { label: "撤机工单", value: 4 },
      ];
      this.dialogFormVisible = true;
    },
    async operatorRequest(innerCode) {
      if (innerCode) {
        const { data: res } = await getRepairerListAPI(innerCode);
        console.log(res);
        this.repairerList = res;
      }
      // console.log(innerCode);
    },
    async taskRequest(taskInfo) {
      await createTaskAPI(taskInfo);
      this.getTaskList();
      this.$refs.dialogRef.handleClose();
      console.log(taskInfo);
    },
    async rebuild() {
      console.log(1);
      const { data: res } = await getRepairerListAPI(
        this.currentDetails.innerCode
      );
      this.taskType = [
        { label: "投放工单", value: 1 },
        { label: "维修工单", value: 3 },
        { label: "撤机工单", value: 4 },
      ];
      this.dialogType = "rebuild";
      this.repairerList = res;
      console.log(this.repairerList);
      this.dialogFormVisible = true;
    },
  },
  computed: {
    totalPage() {
      return Math.ceil(this.total / this.pageSize);
    },
  },
  components: {
    MyTable,
    NewDialog,
    InfoDialog,
  },
};
</script>

<style lang="scss" scoped>
.search {
  width: 100%;
  height: 64px;
  line-height: 64px;
  background: #fff !important;
  font-size: 14px;
  color: #606266;
  padding-left: 17px;

  .el-input,
  .el-select {
    line-height: 64px;
  }
  .el-button {
    margin-top: 12px;
  }
}
.list-container {
  background: #fff !important;
  /* height: 647px; */
  margin-top: 20px;
  padding: 20px 15px 19px 17px;
  .el-button {
    padding: 10px 15px;
  }
  .table {
    margin: 20px 0;
    .details {
      color: #5f84ff;
      cursor: pointer;
    }
  }
  .addBtn {
    background: linear-gradient(135deg, #ff9743, #ff5e20) !important;
    color: #fff;
  }
}
</style>
