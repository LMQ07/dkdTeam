<template>
  <div class="itemAdd1">
    <el-dialog
      :title="`${personForm.skuId?'修改':'新增'}商品`"
      :visible="value"
      :before-close="handleClose"
      width="40%"
      class="demo-ruleForm"
    >
      <el-form label-width="120px" :model="personForm" :rules="rules" ref="perForm">
        <el-form-item label="商品名称:" prop="skuName">
          <el-input
            v-model.trim="personForm.skuName"
            style="width:90%"
            maxlength="15"
            type="text"
            show-word-limit
          />
        </el-form-item>

        <el-form-item label="品牌:" style="margin-top:20px" prop="brandName">
          <el-input
            v-model.trim="personForm.brandName"
            style="width:90%"
            maxlength="10"
            type="text"
            show-word-limit
          />
        </el-form-item>
        <el-form-item label="商品价格(元):" style="margin-top:20px" prop="price">
          <el-input-number
            v-model.trim="personForm.price"
            :precision="2"
            :step="0.5"
            :max="999999"
            :min="0"
            controls-position="right"
          ></el-input-number>
        </el-form-item>

        <el-form-item label="商品类型:" style="margin-top:20px" prop="classId">
          <!-- <el-input v-model="fromData.productType" style="width:90%" /> -->
          <el-select v-model.trim="personForm.classId" placeholder="请选择" style="width:395px">
            <el-option
              v-for="item in currentPageRecords"
              :key="item.classId"
              :label="item.className"
              :value="item.classId"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="规格:" style="margin-top:20px" prop="unit">
          <el-input
            v-model.trim="personForm.unit"
            style="width:90%"
            maxlength="10"
            type="text"
            show-word-limit
          />
        </el-form-item>

        <el-form-item label="商品图片:" style="margin-top:20px" prop="skuImage">
          <el-upload
            class="avatar-uploader"
            action="`${process.env.NODE_ENV}/api/vm-service/sku/fileUpload`"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
            :http-request="uploadFile"
          >
            <img v-if="personForm.skuImage" :src="personForm.skuImage" class="avatar" />
            <i v-else class="el-icon-upload2 avatar-uploader-icon"></i>
          </el-upload>
          <div>支持扩展名:png,文件不得大于1M</div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" type="flex" justify="center">
        <el-button class="skuskuBtn" @click="handleClose">取 消</el-button>
        <el-button class="addBtn" @click="sureAdd" v-loading="loading">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { addskuSku, updatePermission, addFileUpload } from '@/api/sku'
export default {
  name: 'AddSkusku',
  // 需要传入一个props变量来控制 显示或者隐藏
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    currentPageRecords: {
      type: Array,
    },
  },
  data() {
    return {
      loading: false,
      personForm: {
        skuName: '', // 商品名称
        brandName: '', // 品牌
        price: '', // 商品价格
        classId: '', // 商品类型
        unit: '', // 规格
        skuImage: '', // 商品图片
      },
      rules: {
        skuName: [{ required: true, message: '请输入', trigger: 'blur' }],
        brandName: [{ required: true, message: '请输入', trigger: 'blur' }],
        num: [{ required: true, message: '请输入', trigger: 'blur' }],
        classId: [{ required: true, message: '请输入', trigger: 'blur' }],
        unit: [{ required: true, message: '请输入', trigger: 'blur' }],
        skuImage: [{ required: true, message: '上传图片', trigger: 'blur' }],
      },
    }
  },
  methods: {
    handleClose() {
      this.$emit('input', false)
      this.$refs.perForm.resetFields()
    },
    handleAvatarSuccess(res, file) {},
    beforeAvatarUpload(file) {
      const types = ['image/jpg', 'image/png']
      const isImage = types.includes(file.type)
      // console.log('isImage', isImage)
      if (!isImage) {
        this.$message.error('上传图片只能是 png!')
        return false
      }
      const isLtSize = file.size / 1024 / 1024 < 1
      if (!isLtSize) {
        this.$message.error('上传图片大小不能超过 1M!')
        return false
      }
      return true
    },
    // 上传图片
    async uploadFile(params) {
      const _file = params.file
      const formData = new FormData()
      formData.append('fileName', _file)
      const { data } = await addFileUpload(formData)
      // console.log('img', data)
      this.personForm.skuImage = data
      // console.log(this.personForm.skuImage)
    },
    // 修改
    async sureAdd() {
      try {
        await this.$refs.perForm.validate()
        this.loading = true
        this.personForm.price = this.personForm.price * 100
        this.personForm.skuId
          ? await updatePermission(this.personForm)
          : await addskuSku(this.personForm)
        this.$parent.getSkuSkuSearch()
        this.$message.success(`${this.personForm.skuId ? '修改' : '新增'}成功`)
        this.handleClose()
      } catch (error) {
        console.log(error)
      } finally {
        this.loading = false
      }
    },
  },
}
</script>

<style lang="scss">
.itemAdd1 {
  .el-dialog {
    border-radius: 15px !important;
    .el-dialog__title {
      line-height: 22px;
      font-size: 16px;
      font-weight: 600;
    }
    .el-button--default {
      background-color: #fbf4f0 !important;
      border: none;
      color: #655b56 !important;
    }
    .el-button--primary {
      background: linear-gradient(135deg, #ff9743, #ff5e20) !important;
      border: none;
    }
    .dialog-footer {
      display: flex;
      padding-left: 220px;
    }
    .skuskuBtn {
      margin-left: -30px;
    }
    .addBtn {
      color: #fff !important;
      margin-left: 50px;
      background-color: #ee7a41 !important;
    }
    .el-input-number {
      width: 395px;
    }

    .avatar-uploader .el-upload {
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
    }
    .avatar-uploader .el-upload:hover {
      border-color: #409eff;
    }
    .avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 178px;
      height: 178px;
      line-height: 178px;
      text-align: center;
    }
    .avatar {
      width: 178px;
      height: 178px;
      display: block;
    }

    .avatar-uploader .el-upload {
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
    }
    .avatar-uploader .el-upload:hover {
      border-color: #409eff;
    }
    .avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 84px;
      height: 84px;
      line-height: 84px;
      text-align: center;
    }
    .avatar {
      width: 84px;
      height: 84px;
      display: block;
    }
  }
}
</style>