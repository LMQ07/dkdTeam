<template>
  <el-dialog title="区域详情" :visible.sync="infoDialog" :before-close="handleClose">
    <el-form ref="formDate">
      <el-form-item label="区域名称：" :label-width="formLabelWidth">
        {{ regionInfo.name }}
      </el-form-item>
      <el-form-item label="备注说明：" :label-width="formLabelWidth">
        <el-table
          v-loading="loading"
          :data="nodeList"
          style="width: 100%"
        >
          <el-table-column
            type="index"
            label="序号"
            width="80"
          />
          <el-table-column
            prop="name"
            label="点位名称"
            width="158"
          />
          <el-table-column
            prop="vmCount"
            label="设备数量"
            width="158"
          />
        </el-table>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
// import { getNodeList } from '@/api/vm-node'
export default {
  props: {
    infoDialog: {
      type: Boolean,
      default: false
    },
    regionInfo: {
      type: Object,
      default: () => ({})
    },
    nodeList: {
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
      formLabelWidth: '140px',
      data: []
    }
  },
  created() {
    // this.getNodeList()
  },
  methods: {
    handleClose() {
      this.$emit('offInfoDialog')
    }
    // async getNodeList() {
    //   const res = await getNodeList({
    //     pageIndex: 1,
    //     pageSize: 10,
    //     regionId: this.regionInfo.id
    //   })
    //   console.log(res)
    // }
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
    .el-form-item {
        margin-bottom: 22px !important;
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
}
</style>
