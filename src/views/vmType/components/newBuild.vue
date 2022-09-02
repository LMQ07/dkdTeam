<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    width="630px"
    :before-close="handleClose"
    class="dialogMq"
  >
    <div class="form">
      <el-form ref="form" :model="form" :rules="rules" label-width="140px">
        <el-form-item label="型号名称：" prop="name">
          <el-input
            v-model="form.name"
            placeholder="请输入"
            maxlength="10"
            show-word-limit
          />
        </el-form-item>
        <!-- /^[a-zA-Z0-9_\\-\u4e00-\u9fa5]+$/ -->
        <el-form-item label="型号编号：" prop="model">
          <el-input
            v-model="form.model"
            placeholder="请输入（限制数字，字母，中划线，下划线）"
            maxlength="15"
            show-word-limit
          />
        </el-form-item>
        <el-form-item label="货道行数：" prop="vmRow">
          <el-input-number v-model="form.vmRow" placeholder="请输入" controls-position="right" :min="1" :max="10" />
        </el-form-item>
        <el-form-item label="货道列数：" prop="vmCol">
          <el-input-number v-model="form.vmCol" placeholder="请输入" controls-position="right" :min="1" :max="10" />
        </el-form-item>
        <el-form-item label="货道容量：" prop="channelMaxCapacity">
          <el-input-number v-model="form.channelMaxCapacity" placeholder="请输入" controls-position="right" :min="1" :max="10" />
        </el-form-item>
        <el-form-item label="设备图片：" prop="image">
          <uploadImage ref="images" :img.sync="form.image" />
          <div class="tip">支持扩展名：jpg、png，文件不得大于100kb
          </div>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button class="cancel" @click="handleClose">取消</el-button>
        <el-button type="primary" class="confirm" @click="submit">确认</el-button>
      </span>
    </div>

  </el-dialog>
</template>

<script>
import uploadImage from './uploadImage.vue'
import { addVmType, changeVmType } from '@/api/vm'
export default {
  components: { uploadImage },
  props: {
    isNewBuild: {
      type: Boolean,
      default: true
    },
    dialogVisible: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      form: {
        name: '',
        model: '',
        vmRow: undefined,
        vmCol: undefined,
        channelMaxCapacity: undefined,
        image: ''
      },
      rules: {
        name: [{ required: true, message: '请输入', trigger: 'blur' }],
        model: [{ required: true, message: '请输入', trigger: 'blur' }, {
          pattern: /^[a-zA-Z0-9_\\-\u4e00-\u9fa5]+$/,
          message: '格式不正确',
          trigger: 'blur'
        }],
        vmRow: [{ required: true, message: '请输入', trigger: 'blur' }],
        vmCol: [{ required: true, message: '请输入', trigger: 'blur' }],
        channelMaxCapacity: [{ required: true, message: '请输入', trigger: 'blur' }],
        image: [{ required: true, message: '请上传', trigger: 'blur' }]
      }
    }
  },
  computed: {
    title() {
      return this.isNewBuild ? '新增设备类型' : '修改设备类型'
    }
  },
  watch: {
    'form.image': {
      deep: true,
      immediate: true,
      handler(value) {
        if (!this.isNewBuild) {
          if (value !== '' && value !== undefined) {
            this.$nextTick(() => {
              console.log(value)
              this.$refs.images.fileList = [{ url: value }]
            })
          } else {
            this.$refs.images.fileList = []
          }
        }
      }
    }
  },
  methods: {
    handleClose() {
      this.$parent.dialogVisible = false
      this.form = {
        name: '',
        model: '',
        vmRow: undefined,
        vmCol: undefined,
        channelMaxCapacity: undefined,
        image: ''
      }
      this.$refs.form.resetFields()
      this.$refs.images.fileList = []
    },
    async  submit() {
      this.$refs.form.validate()
      if (this.form.image === '' || undefined) {
        return this.$message.error('请上传图片')
      } else {
        if (this.isNewBuild) {
          await addVmType(this.form)
        } else {
          await changeVmType(this.form.typeId, this.form)
        }
        this.$message.success(`${this.isNewBuild ? '新增成功' : '修改成功'}`)
        this.handleClose()
        this.$parent.getDate()
      }
    }
    // onSuccess(url) {
    //   // 拿到了地址
    //   // this.$refs.imgIpt.focus()
    //   this.form.image = url
    //   console.log(this.form.image)
    //   // this.$refs.imgIpt.blur()
    // }
  }

}
</script>

<style lang="scss" >
 .dialogMq{
  .el-dialog{
    border-radius: 10px;
    .el-dialog__body{
    padding: 20px 20px 30px;
    color: #666;
    }
  }

.cancel{
      width: 80px!important;
    height: 36px;
    padding: 0;
    background-color: #fbf4f0!important;
    border: none;
    color: #655b56!important;
}
.confirm{
  width: 80px!important;
    height: 36px;
    padding: 0;
    background: linear-gradient(135deg,#ff9743,#ff5e20)!important;
    border: none;
}
.form{
  color: #666;
  .dialog-footer{
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .el-input-number{
    width:100%
  }
}
.tip{
  font-size: 14px;
    color: #bac0cd;
}
}

</style>
