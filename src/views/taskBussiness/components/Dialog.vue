<template>
  <div>
    <el-dialog
      title="新增设备类型"
      :visible.sync="dialogFormVisible"
      width="630px"
      :before-close="handleClose"
    >
      <el-form ref="formRef" label-width="80px" :model="taskInfo">
        <el-form-item
          label="设备编号"
          :rules="{ required: true, message: '请输入', trigger: 'blur' }"
        >
          <el-input
            v-model="taskInfo.innerCode"
            type="text"
            placeholder="请输入"
            maxlength="15"
            show-word-limit
            @blur="getOperatorList"
          />
        </el-form-item>
        <el-form-item
          label="工单类型"
          :rules="{
            required: true,
            trigger: 'blur',
            message: '请选择',
          }"
        >
          <el-select
            v-model="taskInfo.productType"
            placeholder="请选择"
            style="width: 100%"
          >
            <el-option label="补货工单" value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="补货数量">
          <div>
            <span
              class="el-icon-document"
              style="color: #5f84ff; cursor: pointer"
              @click="getChannelList"
              >补货清单</span
            >
            <textarea v-model="taskInfo.details" hidden />
          </div>
        </el-form-item>
        <el-form-item
          label="运营人员"
          :rules="{
            required: true,
            trigger: 'blur',
            message: '请选择',
          }"
        >
          <el-select
            v-model="taskInfo.assignorId"
            placeholder="请选择"
            style="width: 100%"
          >
            <el-option
              v-for="item in operatorList"
              :key="item.userId"
              :label="item.userName"
              :value="item.userId"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="备注"
          :rules="{
            required: true,
            trigger: 'blur',
            message: '请输入',
          }"
        >
          <el-input
            v-model="taskInfo.desc"
            type="textarea"
            placeholder="请输入备注（不超过40字）"
            maxlength="40"
            show-word-limit
            :autosize="{ minRows: 4, maxRows: 4 }"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </div>
    </el-dialog>
    <ChannelListDialog
      :innerCode="taskInfo.innerCode"
      :channelVisible="channelVisible"
      v-if="channelVisible"
      :channelList="channelList"
      :channelLabel="channelLabel"
      @sendDetails="getDetails"
    ></ChannelListDialog>
  </div>
</template>

<script>
import {
  getOperatorListAPI,
  createTaskAPI,
  getChannelListAPI,
} from "@/api/task";
import ChannelListDialog from "./ChannelListDialog";
export default {
  components: {
    ChannelListDialog,
  },
  props: {
    dialogFormVisible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      // 表单信息（发请求用）
      taskInfo: {
        createType: 1,
        innerCode: "",
        productType: "",
        desc: "",
        userId: 1,
        assignorId: "",
        details: [],
      },
      // 运营人员列表
      operatorList: [],
      // 控制货道列表弹出框
      channelVisible: false,
      channelList: [],
      channelLabel: [
        { label: "货道编号", prop: "channelCode" },
        { label: "商品名称", prop: "sku.skuName", slotName: "skuName" },
        {
          label: "当前数量",
          prop: "currentCapacity",
          slotName: "currentCapacity",
        },
        { label: "还可添加", prop: "num", slotName: "num" },
        { label: "补满商品", prop: "buhuo", slotName: "buhuo" },
      ],
    };
  },
  watch: {},
  methods: {
    handleClose() {
      this.$parent.dialogFormVisible = false;
      this.taskInfo = {
        createType: 1,
        innerCode: "",
        productType: "",
        desc: "",
        userId: 1,
        assignorId: "",
        details: [],
      };
      this.$refs.formRef.resetFields();
    },
    // 根据售货机获取维修人员列表
    async getOperatorList() {
      if (this.taskInfo.innerCode) {
        const { data: res } = await getOperatorListAPI(this.taskInfo.innerCode);
        this.operatorList = res;
      }
    },
    // 获取货道详情列表
    async getChannelList() {
      if (this.taskInfo.innerCode) {
        const { data: res } = await getChannelListAPI(this.taskInfo.innerCode);
        this.channelList = res;
        this.channelList.forEach((item, index) => {
          let num = item.maxCapacity - item.currentCapacity;
          this.$set(this.channelList[index], "expectCapacity", num);
          this.$set(this.channelList[index], "num", num);
        });

        console.log(res);
      }
      this.channelVisible = true;
    },
    getDetails(val) {
      this.taskInfo.details = val;
    },
    async submit() {
      console.log(this.taskInfo);
      try {
        const res = await createTaskAPI(this.taskInfo);
        console.log(res);
      } catch (error) {
        console.dir(error);
      }
      this.$parent.getTaskList();
      this.handleClose();
    },
  },
};
</script>

<style lang="scss">
.el-dialog {
  border-radius: 15px;
  .el-dialog__title {
    line-height: 22px;
    font-size: 16px;
    font-weight: 600;
  }
  .el-button--default {
    background-color: #fbf4f0 !important;
    border: none;
    color: #655b56 !important;
  }
  .el-button--primary {
    background: linear-gradient(135deg, #ff9743, #ff5e20) !important;
    border: none;
  }
  .dialog-footer {
    display: flex;
    padding-left: 220px;
  }
}
</style>
