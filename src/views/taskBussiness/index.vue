<template>
  <div>
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
        <el-button
          size="mini"
          style="background-color: #fbf4f0 !important"
          @click="autoSupplyVisible = true"
        >
          工单配置
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
    <InfoDialog
      :infoDialogVisible="infoDialogVisible"
      :detailsInfo="rowDetailsInfo"
      v-if="rowDetailsInfo"
    />
    <AutoSupply
      :autoSupplyVisible="autoSupplyVisible"
      v-if="autoSupplyVisible"
    />
    <NewDialog
      :dialogFormVisible="dialogFormVisible"
      :taskTypeOption="taskType"
      :operatorList="operatorList"
      @getTaskInfo="taskRequest"
      @getInnerCode="operatorRequest"
      @showChannelDialog="showChannelDialog"
      v-if="dialogFormVisible"
    />
    <ChannelListDialog
      :channelVisible="channelVisible"
      :channelList="channelList"
      v-if="channelVisible"
      :channelLabel="channelLabel"
      @sendDetails="getDetails"
    />
  </div>
</template>

<script>
import MyTable from "@/components/Table";
import InfoDialog from "./components/InfoDialog.vue";
import AutoSupply from "./components/AutoSupply.vue";
import NewDialog from "./components/NewDialog";
import ChannelListDialog from "./components/ChannelListDialog";
import {
  getTaskAPI,
  getOperatorListAPI,
  getChannelListAPI,
  createTaskAPI,
} from "@/api/task";
export default {
  name: "TaskBussiness",
  data() {
    return {
      //搜索条件
      form: {
        taskCode: "",
        status: "",
      },
      // 新增弹框
      dialogFormVisible: false,
      tableData: [],
      // 当前页
      currentPage: 1,
      // 每页数量
      pageSize: "",
      // 总共几条
      total: "",
      // 当前行的的信息
      rowDetailsInfo: null,
      // 详情弹框
      infoDialogVisible: false,
      //工单弹框
      autoSupplyVisible: false,
      // 补货详情弹框
      channelVisible: false,
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
      // 新增设备工单类型
      taskType: [],
      // 运营人员列表
      operatorList: [],
      //新增更新表单信息
      taskInfo: [],
      // 补货详情
      details: [],
      // 补货信息列表
      channelList: [],
      // 补货信息列表表头
      channelLabel: [],
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
        isRepair: false,
        ...queryInfo,
      });
      this.currentPage = res.pageIndex;
      this.pageSize = res.pageSize;
      this.total = res.totalCount;
      this.tableData = res.currentPageRecords;
      console.log(res);
    },
    // 条件查询列表
    onSearch() {
      this.getTaskList({ ...this.form });
    },
    // 点击查看详情
    getInfo(row) {
      this.rowDetailsInfo = row;
      this.infoDialogVisible = true;
      console.log(row);
    },
    // 下一页
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
    // 打开新增弹窗
    openAddDialog() {
      this.taskType = [{ label: "补货工单", value: 2 }];
      this.dialogFormVisible = true;
    },
    // 拿到工单编号
    async operatorRequest(innercode) {
      this.taskInfo.innerCode = innercode;
      if (innercode) {
        const { data: res } = await getOperatorListAPI(innercode);
        console.log(res);
        this.operatorList = res;
      }
      console.log(innercode);
    },
    // 新增工单或重建工单
    async taskRequest(taskInfo) {
      this.taskInfo = taskInfo;
      this.taskInfo.details = this.details;
      const res = await createTaskAPI(this.taskInfo);
      this.getTaskList();
      console.log(res);
      this.$children[2].handleClose();
    },
    // 显示补货详情弹框
    showChannelDialog() {
      if (this.taskInfo.innerCode) {
        this.channelLabel = [
          { label: "货道编号", prop: "channelCode" },
          { label: "商品名称", prop: "sku.skuName", slotName: "skuName" },
          {
            label: "当前数量",
            prop: "currentCapacity",
            slotName: "currentCapacity",
          },
          { label: "还可添加", prop: "num", slotName: "num" },
          { label: "补满商品", prop: "buhuo", slotName: "buhuo" },
        ];
        this.channelVisible = true;
        this.getChannelList();
      }
    },
    // 获取货道详情列表
    async getChannelList() {
      const { data: res } = await getChannelListAPI(this.taskInfo.innerCode);
      this.channelList = res;
      this.channelList.forEach((item, index) => {
        let num = item.maxCapacity - item.currentCapacity;
        this.$set(this.channelList[index], "expectCapacity", num);
        this.$set(this.channelList[index], "num", num);
      });

      console.log(res);

      this.channelVisible = true;
    },
    // 将补货信息放到请求信息中去
    getDetails(val) {
      console.log(val);
      this.details = val;
    },
  },
  computed: {
    totalPage() {
      return Math.ceil(this.total / this.pageSize);
    },
  },
  components: {
    MyTable,
    InfoDialog,
    AutoSupply,
    NewDialog,
    ChannelListDialog,
  },
};
</script>

<style scoped lang="scss">
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
