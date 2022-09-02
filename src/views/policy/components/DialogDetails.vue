<template>
  <div class="dialog-content">
    <el-dialog
      title="策略详情"
      :visible.sync="dialogVisible1"
      width="630px"
      :before-close="handleClose"
    >
      <el-form label-width="396px">
        <el-form-item label="策略名称:" style="margin-left: -250px;">
          <span>{{ policyName }}</span>
        </el-form-item>

        <el-form-item label="策略方案:" style="margin-left: -250px;">
          <Table :thead="thead" :table-date="tableDate" :total-count="totalCount" :total-page="totalPage" :page-index="pageIndex" @click="pageFn" />
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import Table from '@/components/Table'
import { policyAutomat } from '@/api/policy'
export default {
  components: { Table },
  props: {
    dialogVisible1: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      policyName: '',
      policyId: '',
      thead: [{
        prop: 'nodeName',
        label: '点位名称'
      },
      {
        prop: 'innerCode',
        label: '设备编号'
      }],
      tableDate: [],
      pageIndex: 1,
      pageSize: 10,
      totalCount: 0,
      totalPage: 1

    }
  },
  methods: {
    handleClose() {
      this.$emit('update:dialogVisible1', false)
    },
    mounted() {
    //   this.policyAutomat()
    },
    async policyAutomat() {
      const { data } = await policyAutomat(this.policyId, this.pageIndex, this.pageSize)
      console.log(data)
      this.tableDate = data.currentPageRecords
      this.totalCount = data.totalCount
      this.totalPage = data.totalPage
    },
    pageFn(val) {
      if (val === 0) {
        this.pageIndex -= 1
        this.policyAutomat()
      } else {
        this.pageIndex += 1
        this.policyAutomat()
      }
    }
  }
}
</script>

<style scoped lang="scss">
.dialog-content {
    ::v-deep .el-dialog {
            border-radius: 10px;
                margin-top: 15vh;
    width: 300px;
    }

    ::v-deep .el-table tr {
        background-color: #fcfdfe;
    }
    ::v-deep .el-dialog__title {
        font-weight:800;
    }

    // ::v-deep .el-form {
    //     text-align: center;
    // }
    // .policy-plan {
    //     width:396px;
    // }

    ::v-deep .el-form-item__label {
            text-align: right;
    vertical-align: middle;
    float: left;
    font-size: 14px;
    color: #606266;
    line-height: 40px;
    padding: 0 12px 0 0;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    }

    ::v-deep .el-dialog .el-dialog__body .el-form-item .el-form-item__content {
    width: 396px;
    line-height: 36px;
    }
}
</style>
