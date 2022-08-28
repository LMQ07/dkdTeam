<template>
  <el-dialog
    title="策略管理"
    :visible.sync="dialogVisible"
    width="630px"
    :before-close="handleClose"
  >
    <el-row class="first">
      <el-col :span="12">
        <span style="margin-left:60px">机器编号：</span>
        <span>{{ currentStragory.innerCode }}</span>
      </el-col>
      <el-col :span="12">
        <span>策略名称：</span>
        <span>{{ currentStragory.policyName }}</span>
      </el-col>
    </el-row>
    <el-row class="two-change">
      <el-col :span="12">
        <span style="margin-left:60px">策略方案：</span>
        <span>{{ currentStragory.discount }}%</span>
      </el-col>
    </el-row>
    <el-row>
      <el-col class="btn-change">
        <el-button class="cancel" @click="cancelStragory">取消策略</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import { cancelStragory } from '@/api/vm'
export default {
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    currentStragory: {
      type: Object,
      default: () => ({})
    }
  },
  methods: {
    handleClose() {
      this.$parent.showAction = false
    },
    async cancelStragory() {
      await cancelStragory(this.currentStragory.innerCode, this.currentStragory.policyId)
      this.$message.success('取消成功')
      this.handleClose()
      this.$parent.getDate()
    }
  }
}
</script>

<style lang="scss" scoped>
.first{
  margin-bottom: 20px;
}
.two-change{
  margin-bottom: 30px;
}
.btn-change{
  display: flex;
  justify-content: center;
  align-items: center;
  padding-bottom: 30px;
}
</style>
