<template>
  <el-dialog
    title="设备详情"
    :visible.sync="dialogVisible"
    width="630px"
    :before-close="handleClose"
  >
    <div class="top">
      <div>
        销售量：<span>0个</span>
      </div>
      <div>
        销售额：<span>0万元</span>
      </div>
      <div>
        补货次数：<span>0次</span>
      </div>
      <div>
        维修次数：<span>0次</span>
      </div>
    </div>
    <div class="bottom">
      <p class="title">商品销量（月）</p>
    </div>
  </el-dialog>
</template>

<script>
export default {
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    rowDetail: {
      type: Object,
      default: () => ({})
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
    display: flex;
    div{
      flex:1;
      span {
        color: #5f84ff;
      }
    }
}
.bottom {
  .title{
    margin: 20px 0 12px 6px;
  }
}
</style>
