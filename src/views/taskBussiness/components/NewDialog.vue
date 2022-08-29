<template>
  <div>
    <el-dialog
      title="新增设备类型"
      :visible.sync="dialogFormVisible"
      :before-close="handleClose"
      width="630px"
    >
      <el-form
        label-width="80px"
        :model="taskInfo"
        ref="formRef"
        :rules="rules"
      >
        <el-form-item label="设备编号" prop="innerCode">
          <el-input
            v-focus
            v-model="taskInfo.innerCode"
            ref="inputRef"
            type="text"
            placeholder="请输入"
            maxlength="15"
            show-word-limit
            @blur="sendInnerCode"
          />
        </el-form-item>
        <el-form-item label="工单类型" prop="productType">
          <el-select
            placeholder="请选择"
            style="width: 100%"
            v-model="taskInfo.productType"
          >
            <el-option
              v-for="(item, index) in taskTypeOption"
              :key="index"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="补货数量" v-if="formType == 'Bussiness'">
          <div>
            <span
              class="el-icon-document"
              style="color: #5f84ff; cursor: pointer"
              @click="showChannelDialog"
              >补货清单</span
            >
            <textarea hidden />
          </div>
        </el-form-item>
        <el-form-item label="运营人员" prop="assignorId">
          <el-select
            placeholder="请选择"
            style="width: 100%"
            v-model="taskInfo.assignorId"
          >
            <el-option
              v-for="item in operatorList"
              :key="item.userId"
              :label="item.userName"
              :value="item.userId"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="desc">
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
        <el-button>取 消</el-button>
        <el-button type="primary" @click="sendData">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import ChannelListDialog from "./ChannelListDialog";
export default {
  components: {
    ChannelListDialog,
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
      rules: {
        innerCode: [{ required: true, message: "请输入", trigger: "blur" }],
        productType: [{ required: true, message: "请选择", trigger: "blur" }],
        assignorId: [{ required: true, message: "请选择", trigger: "blur" }],
        desc: [{ required: true, message: "请输入", trigger: "blur" }],
      },
    };
  },
  props: {
    dialogFormVisible: {
      type: Boolean,
      default: false,
    },
    // 工单类型
    taskTypeOption: {
      type: Array,
      default: () => [],
    },
    // 运营人员列表
    operatorList: {
      type: Array,
      default: () => [],
    },
    // 弹窗类型
    dialogType: {
      type: String,
      default: "add",
    },
    // 填充信息
    detailsInfo: {
      type: Object,
      default: () => {},
    },
    // 表单类型
    formType: {
      type: String,
      default: "Bussiness",
    },
  },
  created() {
    if (this.dialogType == "rebuild") {
      this.taskInfo = JSON.parse(JSON.stringify(this.detailsInfo));
      this.taskInfo.productType = this.detailsInfo.taskType.typeId;
    }
    console.log(this.detailsInfo);
    console.log(this.dialogType);
  },
  methods: {
    sendData() {
      this.$emit("getTaskInfo", this.taskInfo);
      // this.handleClose();
    },
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

    // 向父组件传工单编号
    sendInnerCode() {
      this.$emit("getInnerCode", this.taskInfo.innerCode);
    },
    // 显示补货详情弹框
    showChannelDialog() {
      this.$emit("showChannelDialog");
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
