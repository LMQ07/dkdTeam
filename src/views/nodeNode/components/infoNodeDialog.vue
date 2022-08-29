<template>
  <el-dialog title="点位详情" :visible.sync="infoDialog" :before-close="handleClose">
    <el-table
      v-loading="loading"
      :data="nodeInfoList"
      style="padding-left: 20px"
    >
      <el-table-column
        type="index"
        label="序号"
        width="80"
      />
      <el-table-column
        prop="innerCode"
        label="机器编号"
        width="158"
      />
      <el-table-column
        prop="vmStatus"
        label="设备状态"
        width="157"
      />
      <el-table-column
        prop="lastSupplyTime"
        label="最后一次供货时间"
        width="157"
      />
    </el-table>
  </el-dialog>
</template>

<script>
export default {
  props: {
    infoDialog: {
      type: Boolean,
      default: false
    },
    nodeInfoList: {
      type: Array,
      default: () => []
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      formLabelWidth: '140px'
    }
  },
  methods: {
    handleClose() {
      this.$emit('offInfoDialog')
    }
  }
}
</script>

<style lang='scss'>
.el-dialog {
  width: 630px;
  border-radius: 10px;
  .el-dialog__body {
    padding: 20px 20px 30px;
  }
  .el-form-item__content {
    width: 396px;
  }
  .el-table__header-wrapper {
    height: 42px;
    line-height: 21px;
  }
  .el-table::before, .el-table--group::after, .el-table--border::after {
    background-color: #fff;
  }
  .el-table td, .el-table th.is-leaf {
    border-bottom: 0;
  }
}
</style>
