<template>
  <el-dialog
    title="工单配置"
    :visible="autoSupplyVisible"
    width="630px"
    :before-close="handleClose"
  >
    <el-form>
      <el-form-item
        :model="form"
        label="补货警戒线："
        :rules="[{ required: true, message: '阈值不能为空' }]"
      >
        <el-input-number
          v-model="form.num"
          controls-position="right"
          :min="1"
          :max="100"
        ></el-input-number>
      </el-form-item>
    </el-form>
    <div class="button">
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="submit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { getSupplyAlertValue, setSupplyAlertValue } from "@/api/task";
export default {
  props: {
    autoSupplyVisible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      form: {
        num: 0,
      },
    };
  },
  created() {
    this.getSupplyAlertValue();
  },
  methods: {
    handleClose() {
      this.$parent.autoSupplyVisible = false;
    },

    async getSupplyAlertValue() {
      const { data: res } = await getSupplyAlertValue();
      this.form.num = res;
    },
    async submit() {
      await setSupplyAlertValue({ alertValue: this.form.num });
      this.$message.success("修改成功~！");
      this.handleClose();
    },
  },
};
</script>

<style scoped>
.el-input-number {
  width: 75%;
}
.button {
  margin-top: 22px;
  padding-left: 220px;
}
</style>
