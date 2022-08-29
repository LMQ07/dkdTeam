<template>
  <el-dialog :title="formDate.id ?'修改区域':'新增区域' " :visible.sync="dialogFormVisible" :before-close="handleClose">
    <el-form ref="formDate" :model="formDate" :rules="rules">
      <el-form-item label="区域名称：" :label-width="formLabelWidth" :prop=" formDate.id ? 'name' : 'regionName'">
        <el-input
          v-if="formDate.id"
          v-model="formDate.name"
          placeholder="请输入"
          maxlength="15"
          show-word-limit
        />
        <el-input
          v-else
          v-model="formDate.regionName"
          placeholder="请输入"
          maxlength="15"
          show-word-limit
        />
      </el-form-item>
      <el-form-item label="备注说明：" :label-width="formLabelWidth" prop="remark">
        <el-input
          v-model="formDate.remark"
          type="textarea"
          :rows="4"
          placeholder="请输入备注(不超过40字)"
          maxlength="40"
          show-word-limit
        />
      </el-form-item>
      <div class="dialog-footer">
        <el-button class="cancel" @click="handleClose">取 消</el-button>
        <el-button class="confirm" type="primary" @click="addRagion">确 定</el-button>
      </div>
    </el-form>
  </el-dialog>
</template>

<script>
import { addRegion, editRegion } from '@/api/vm-node'
export default {
  props: {
    dialogFormVisible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      formLabelWidth: '140px',
      formDate: {
        regionName: '',
        remark: ''
      },
      rules: {
        regionName: [{ required: true, message: '请输入', trigger: 'blur' }],
        name: [{ required: true, message: '请输入', trigger: 'blur' }],
        remark: [{ required: true, message: '请输入', trigger: 'blur' }]
      }
    }
  },
  methods: {
    handleClose() {
      this.$refs.formDate.resetFields()
      this.$emit('offAddDialog')
      this.formDate = {
        regionName: '',
        remark: ''
      }
    },
    async addRagion() {
      this.$refs.formDate.validate()
      if (!this.formDate.id) {
        await addRegion(this.formDate)
      } else {
        await editRegion(this.formDate.id, {
          regionName: this.formDate.name,
          remark: this.formDate.remark
        })
      }
      this.$message.success(`${this.formDate.id ? '修改区域' : '新增区域'}成功`)
      this.$emit('refreshList')
      this.handleClose()
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
    .el-form-item {
        margin-bottom: 22px !important;
        .el-form-item__content {
            width: 396px;
        }
    }
    .dialog-footer {
        display: flex;
        justify-content: center;
        .cancel {
            background-color: #fbf4f0;
            border:none
        }
        .confirm {
            background: linear-gradient(135deg,#ff9743,#ff5e20);
            border:none
        }
    }
}
</style>
