<template>
  <div class="MQ">
    <el-upload
      class="avatar-uploader"
      action="https://jsonplaceholder.typicode.com/posts/"
      :file-list="fileList"
      list-type="picture-card"
      :show-file-list="true"
      :limit="1"
      :on-success="handleAvatarSuccess"
      :before-upload="beforeAvatarUpload"
      :on-change="onChange"
      :on-remove="onRemove"
      :http-request="oRequest"
      :class="fileList.length === 1 ? 'hideAdd' : ''"
    >
      <i class="el-icon-upload avatar-uploader-icon" />
    </el-upload>
  </div>
</template>

<script>
import COS from 'cos-js-sdk-v5'
const cos = new COS({
  SecretId: 'AKIDUpxrZ8TZQ4UVLzQeezGLDsKZcR3FG4e2',
  SecretKey: 'MTMApHWZSBj4DAuRkspZ5QYTBfy4xc8U'
})
export default {
  data() {
    return {
      fileList: []
    }
  },
  watch: {
    fileList(val) {
      this.onChange('', val)
    }
  },
  methods: {
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw)
    },
    beforeAvatarUpload(file) {
      console.log(file)
      const isJPG = file.type === 'image/jpeg'
      const maxSize = 100 * 1024

      if (!isJPG) {
        this.$message.error('图片只能是 JPG 格式!')
        return false
      }
      if (file.size > maxSize) {
        this.$message.error('上传图片大小不能超过 100kb!')
        return false
      }
      return true
    },
    // 文件状态发生变化
    onChange(file, fileList) {
      // file 当前上传的图片
      // fileList 图片列表
      console.log('上传图片', file, fileList)
      this.fileList = fileList
    },
    oRequest(data) {
    // 自定义上传动作 有个参数 有个file对象，是我们需要上传到腾讯云服务器的内容
    // params.file
      if (this.beforeAvatarUpload()) {
        cos.putObject({
          Bucket: 'mq-1313544708', /* 填入您自己的存储桶，必须字段 */
          Region: 'ap-chongqing', /* 存储桶所在地域，例如ap-beijing，必须字段 */
          Key: data.file.name, /* 存储在桶里的对象键（例如1.jpg，a/b/test.txt），必须字段 */
          StorageClass: 'STANDARD',
          Body: data.file, // 上传文件对象
          onProgress: function(progressData) {
            console.log(JSON.stringify(progressData))
          }
        }, (err, data) => {
          if (!err && data.statusCode === 200) {
          // 成功或值失败均进入该函数
          // err null false 没有错
          // err 不为null true 有错
            if (err || data.statusCode !== 200) {
              return this.$message.error('上传失败,请重试')
            }
            this.$emit('onSuccess', {
              url: 'https://' + data.Location
            })
          }
        })
      }
    },
    onRemove(file, fileList) {
      // file 当前被删除的文件
      // 剩余的文件列表
      this.fileList = fileList
      this.$emit('onSuccess', { url: '' })
    }
  }
}

</script>

<style lang="scss">
.MQ{
  .avatar-uploader{
    width: 84px;
    height: 84px;
    line-height: 84px;
    text-align: center;
    color: #bac0cd;
    background: #f3f6fb;
    border: 1px dashed #d8dde3;
    border-radius: 4px;
    cursor: pointer;
    font-size: 24px;
    .el-upload--picture-card{
      width: 84px;
      height: 84px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
     }
     .hideAdd .el-upload--picture-card {
  display: none;
}
.el-upload-list__item{
  width: 84px;
      height: 84px;
}
.el-upload-list__item-thumbnail{
  width: 84px;
      height: 84px;
}
}
</style>
