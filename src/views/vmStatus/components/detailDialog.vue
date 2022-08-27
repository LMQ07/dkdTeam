<template>
  <el-dialog
    title="设备详情"
    :visible.sync="dialogVisible"
    width="30%"
    :before-close="handleClose"
  >
    <div class="top">123</div>
    <div class="bottom">
      <p>商品销量（月）</p>
    </div>
  </el-dialog>
</template>

<script>
export default {
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    handleClose() {
      this.$parent.detailShow = false
    }
  }
}
</script>

<style lang="scss" scoped>
.top{
    height: 54px;
    background: rgba(227,233,245,.39);
    text-align: center;
    line-height: 54px;
}
</style>
