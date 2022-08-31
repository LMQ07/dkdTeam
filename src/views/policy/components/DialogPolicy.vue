<template>
  <div class="dialog-content">
    <el-dialog
      :title="`${policy.policyId ? '修改' : '新增'}策略`"
      :visible.sync="dialogVisible"
      width="600px"
      :before-close="handleClose"
      class="dialog"
    >
      <el-form ref="policyForm" class="policy-form" :model="policy" :rules="rules">

        <el-form-item label="策略名称:" prop="policyName" style="margin-left:25px;">
          <el-input
            v-model="policy.policyName"
            placeholder="请输入"
            style="width:400px"
            maxlength="15"
            show-word-limit
          />
        </el-form-item>

        <el-form-item label="策略方案:" prop="discount" style="margin-left:25px;">
          <el-input-number v-model="policy.discount" placeholder="请输入" style="width:400px" controls-position="right" :min="1" :max="100" @change="handleChange" />
        </el-form-item>

        <el-form-item class="btn">
          <el-button class="cancel" @click="handleClose">取消</el-button>
          <el-button class="confirm" @click="confirm">确认</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { addPolicy, editPolicy } from '@/api/policy'
export default {
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      policy: {
        discount: undefined,
        policyName: ''
      },
      rules: {
        policyName: [{ required: true, message: '策略名称不能为空', trigger: 'blur' }],
        discount: [{ required: true, message: '策略方案不能为空', trigger: 'blur' }]
      }
    }
  },
  methods: {
    handleClose() {
      this.$emit('update:dialogVisible', false)
      this.$refs.policyForm.resetFields()
      this.policy = {
        discount: '',
        policyName: ''
      }
    },
    handleChange(value) {
      console.log(value)
    },
    async confirm() {
      try {
        await this.$refs.policyForm.validate()
        this.policy.policyId ? await editPolicy(this.policy.policyId, this.policy.discount, this.policy.policyName) : await addPolicy(this.policy)
        this.$message.success(`策略${this.policy.policyId ? '修改' : '新增'}成功`)
        this.$emit('update')
        this.$emit('update:dialogVisible', false)
      } catch (e) {
        console.log(e)
      } finally {
        this.$refs.policyForm.resetFields()
        this.policy = {
          discount: undefined,
          policyName: ''
        }
      }
    }
  }
}
</script>

<style scoped lang="scss">
.dialog-content {
  ::v-deep .el-form-item__content {
    margin-bottom:25px;
  }
      ::v-deep .el-dialog__title {
        font-weight:800;
    }
        ::v-deep .el-dialog {
            border-radius: 10px;
    }
    .dialog {
        border-radius:10px;
    }
    .policy-form {
    text-align: center;

    .input {
        margin-bottom:10px;
    }

    .btn {
        margin-top:20px;

        .cancel {
            width:80px;
            height:36px;
                background-color: #f3e7e1!important;
                border:none;
                margin-right:15px;
        }

        .confirm {
            width:80px;
            height:36px;
            background: linear-gradient(135deg,#ff9743,#ff5e20)!important;
            border:none;
            color:#fff;
        }
    }
}
}

</style>
