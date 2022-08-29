<template>
  <div>
    <el-dialog
      title="人员详情"
      :visible.sync="dialogVisible"
      width="40%"
      style="min-height:270px"
      :before-close="handleClose"
      :close-on-click-modal="false"
    >
      <div class="info">
        <el-row type="flex" justify="center" align="middle">
          <el-col :span="9">人员名称：{{ userInfo.userName }}</el-col>
          <el-col :span="7">角色：{{ userInfo.roleName }}</el-col>
          <el-col :span="8">联系电话：{{ userInfo.mobile }}</el-col>
        </el-row>
        <el-row class="row">
          <el-col :span="24">负责区域：{{ userInfo.regionName }}</el-col>
        </el-row>

      </div>
      <div style="padding-top:20px" class="table">
        <el-table
          :data="list"
          border
          style="width: 100%"
        >
          <el-table-column
            prop="time"
          />
          <el-table-column
            prop="total"
            label="总工单数"
          />
          <el-table-column
            prop="cancelCount"
            label="拒绝工单"
          />
          <el-table-column
            prop="workCount"
            label="完成工单"
          />
          <el-table-column
            prop="progressTotal"
            label="进行中工单"
          />
        </el-table>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    userInfo: {
      type: Object,
      default: () => ({})
    },
    list: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    label() {
      return '本周'
    }
  },
  methods: {
    handleClose() {
      this.$emit('update:dialogVisible', false)
    }
  }
}
</script>

<style lang="scss" scoped>
  ::v-deep .el-dialog {
    border-radius: 10px;
  }
 ::v-deep .el-dialog__body {
    padding: 15px 20px;
  }
.info {
    height: 86px;
    padding: 19px 19px 0;
    background: #f3f6fb;
    // min-height: 277px;

    .row {
      margin-top: 15px;
    }

}
::v-deep .table {
  .el-table--border th {
    text-align: center;
    font-weight: normal;
    color: #666;
  }
  .el-table--border td  {
    text-align: center;
  }
  .el-table tbody tr:hover > td {
    background-color: unset !important
  }

}
</style>
