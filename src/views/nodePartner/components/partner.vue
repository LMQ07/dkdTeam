<template>
  <el-dialog
    :title="ruleForm.id?'修改合作商':'新增合作商'"
    :visible.sync="partnerVisible"
    :before-close="handleClose"
    width="630px"
  >
    <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="140px">
      <el-form-item label="合作商名称" prop="name">
        <el-input v-model="ruleForm.name" placeholder="请输入" maxlength="10" show-word-limit />
      </el-form-item>
      <el-form-item label="联系人" prop="contact">
        <el-input v-model="ruleForm.contact" placeholder="请输入" maxlength="10" show-word-limit />
      </el-form-item>
      <el-form-item label="联系电话" prop="mobile">
        <el-input v-model="ruleForm.mobile" placeholder="请输入" maxlength="11" show-word-limit />
      </el-form-item>
      <el-form-item label="分成比例（%）" prop="ratio">
        <el-input v-model="ruleForm.ratio" placeholder="请输入" type="number" />
      </el-form-item>
      <el-form-item v-if="!ruleForm.id" label="账号" prop="account">
        <el-input v-model="ruleForm.account" placeholder="请输入" maxlength="18" show-word-limit />
      </el-form-item>
      <el-form-item v-if="!ruleForm.id" label="密码" prop="password">
        <el-input v-model="ruleForm.password" placeholder="请输入" maxlength="20" show-word-limit />
      </el-form-item>
      <el-form-item class="marginLeftZero">
        <el-row type="flex" justify="center">
          <el-col :span="4"> <el-button @click="handleClose">取消</el-button></el-col>
          <el-col :span="4"> <el-button type="warning" @click="sure">确认</el-button></el-col>
        </el-row>

      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import { userServicePartnerPost, userServicePartnerPut } from '@/api/nodePartner'
export default {
  props: {
    partnerVisible: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      ruleForm: {
        name: '',
        contact: '',
        mobile: '',
        ratio: '',
        account: '',
        password: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入', trigger: 'blur' }
        ],
        contact: [
          { required: true, message: '请输入', trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入', trigger: 'blur' },
          { max: 11, message: '长度在不超过11个字符', trigger: 'blur' },
          { pattern: /^(?:(?:\+|00)86)?1[3-9]\d{9}$/, message: '请输入正确的格式', trigger: 'blur' }
        ],
        ratio: [
          { required: true, message: '请输入', trigger: 'blur' }
        ],
        account: [
          { required: true, message: '请输入', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    handleClose() {
      this.$emit('update:partnerVisible', false)
      this.$refs.ruleForm.resetFields()
      this.ruleForm = {
        name: '',
        contact: '',
        mobile: '',
        ratio: '',
        account: '',
        password: ''
      }
    },
    async sure() {
      try {
        await this.$refs.ruleForm.validate()

        this.ruleForm.id ? await userServicePartnerPut(this.ruleForm.id, this.ruleForm) : await userServicePartnerPost(this.ruleForm)// 新增

        this.$message.success(`${this.ruleForm.id ? '编辑' : '修改'}成功`)
        this.$emit('refresh')
        this.handleClose()
      } catch (e) {
        console.log(e)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .marginLeftZero{
  .is-justify-center{
    margin-left:-140px;
  }
}
::v-deep .el-form{
  .el-form-item__content{
    width: 396px;
  }
}
::v-deep  .el-dialog{
  border-radius: 10px;
}
::v-deep .el-form-item__content{
    margin-bottom: 20px;
}
</style>
