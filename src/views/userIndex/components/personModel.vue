<template>
  <el-dialog
    :title="personForm.id?'编辑人员':'新增人员'"
    :visible.sync="personVisible"
    :before-close="handleClose"
    width="630px"
  >
    <el-form ref="personForm" :model="personForm" label-width="140px" :rules="personRules">
      <el-form-item label="人员名称" prop="userName">
        <el-input v-model="personForm.userName" maxlength="5" show-word-limit placeholder="请输入" />
      </el-form-item>
      <el-form-item label="角色" prop="roleId">
        <el-select v-model="personForm.roleId" clearable placeholder="请选择">
          <el-option v-for="item in roleList" :key="item.roleId" :label="item.roleName" :value="item.roleId" />
        </el-select>
      </el-form-item>
      <el-form-item label="联系电话" prop="mobile">
        <el-input v-model="personForm.mobile" maxlength="11" show-word-limit placeholder="请输入" />
      </el-form-item>
      <el-form-item label="负责区域" prop="regionId">
        <el-select v-model="personForm.regionId" placeholder="请选择" @change="addRegionName">
          <el-option v-for="item in regionList" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="头像" prop="image">
        <el-upload
          class="avatar-uploader"
          action="`${process.env.NODE_ENV}/api/vm-service/sku/fileUpload`"
          :show-file-list="false"
          :http-request="uploadFile"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
          :headers="headerObj"
        >
          <!-- action="http://likede2-admin.itheima.net/likede/api/vm-service/sku/fileUpload" -->
          <img v-if="personForm.image" :src="personForm.image" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon" />
        </el-upload>

      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-checkbox v-model="personForm.status" label="是否启用" name="type" />
      </el-form-item>

      <el-form-item size="large" class="marginLeftZero">
        <el-row type="flex" justify="center">
          <el-col :span="4"> <el-button @click="handleClose">取消</el-button></el-col>
          <el-col :span="4"> <el-button type="warning" @click="submitPerson">确定</el-button></el-col>
        </el-row>

      </el-form-item>

    </el-form>

  </el-dialog>
</template>

<script>
import { userServiceRole, vmServiceGet, fileUpload, userServiceUserPOST, userServicePut } from '@/api/userIndex'
export default {
  props: {
    personVisible: {
      type: Boolean,
      default: () => {
        return false
      }
    }
  },
  data() {
    const token = this.$store.getters.token
    return {
      personForm: {
        userName: '',
        roleId: '',
        mobile: '',
        regionId: '',
        regionName: '',
        image: '',
        status: false
      },
      personRules: {
        userName: [
          { required: true, message: '请输入人员名称', trigger: 'blur' },
          { max: 5, message: '长度在不超过5个字符', trigger: 'blur' }
        ],
        roleId: [
          { required: true, message: '请选择角色', trigger: 'change' }
        ],
        mobile: [
          { required: true, message: '请填联系电话', trigger: 'blur' },
          { max: 11, message: '长度在不超过11个字符', trigger: 'blur' },
          { pattern: /^(?:(?:\+|00)86)?1[3-9]\d{9}$/, message: '请输入正确的格式', trigger: 'blur' }
        ],
        regionId: [
          { required: true, message: '请填选择区域', trigger: 'change' }
        ],
        image: [
          { required: true, message: '请上传图像', trigger: 'blur' }
        ]
      },
      roleList: [],
      regionData: {
        pageIndex: 1,
        pageSize: 1000
      },
      regionList: [],
      headerObj: {
        Authorization: token
      }
    }
  },
  created() {
    this.userServiceRole()
    this.vmServiceGet()
  },
  methods: {
    async userServiceRole() {
      const { data } = await userServiceRole()
      this.roleList = data
    },
    async vmServiceGet() {
      const { data } = await vmServiceGet()
      this.regionList = data.currentPageRecords
      console.log('this.regionList', this.regionList)
    },
    addRegionName() {
      console.log(this.personForm.regionId)
      const regionItem = this.regionList.filter((item) => {
        return this.personForm.regionId === item.id
      })
      this.personForm.regionName = regionItem[0].name
    },
    handleAvatarSuccess(res, file) {
    },
    beforeAvatarUpload(file) {
      const types = ['image/jpeg', 'image/jpg']
      const isImage = types.includes(file.type)
      console.log('isImage', isImage)
      if (!isImage) {
        this.$message.error('上传图片只能是 JPG、JPEG!')
        return false
      }
      const isLtSize = file.size / 1024 / 1024 < 1
      if (!isLtSize) {
        this.$message.error('上传图片大小不能超过 1MB!')
        return false
      }
      return true
    },
    // 上传图片
    async uploadFile(params) {
      const _file = params.file
      const formData = new FormData()
      formData.append('fileName', _file)
      const { data } = await fileUpload(formData)
      this.personForm.image = data
    },
    async submitPerson() {
      try {
        await this.$refs.personForm.validate()
        // const res = await userServiceUserPOST(this.personForm)
        this.personForm.id ? await userServicePut(this.personForm.id, this.personForm) : await userServiceUserPOST(this.personForm)
        this.handleClose()
        this.$emit('refresh')
      } catch (error) {
        console.log(error)
      }
    },
    handleClose() {
      this.$emit('update:personVisible', false)
      console.log(8888888)
      this.$refs.personForm.resetFields()
      this.personForm = {
        userName: '',
        roleId: '',
        mobile: '',
        regionId: '',
        regionName: '',
        image: '',
        status: false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep  .el-dialog{
  border-radius: 10px;
}
::v-deep .el-form-item__content{
    margin-bottom: 20px;
}
::v-deep .marginLeftZero{
  .is-justify-center{
    margin-left:-140px;
  }
}
::v-deep .el-form{
  .el-form-item__content{
    width: 396px;
  }
  .el-input__inner{
    width: 396px;
  }
}
::v-deep  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 90px;
    height: 90px;
    line-height: 90px;
    text-align: center;
  }
  .avatar {
    width: 90px;
    height: 90px;
    display: block;
  }
</style>
