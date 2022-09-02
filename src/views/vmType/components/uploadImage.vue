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
  SecretId: 'AKIDzqRmqd9QQBftqVtzqQjmeS7WfYAbnjPo',
  SecretKey: '92f15tQgeLlulLegRu70dz4sOdcLnyrU'
})
// const cos = new COS({
//   SecretId: 'AKIDUpxrZ8TZQ4UVLzQeezGLDsKZcR3FG4e2',
//   SecretKey: 'MTMApHWZSBj4DAuRkspZ5QYTBfy4xc8U'
// })
export default {
  data() {
    return {
      fileList: []
    }
  },
  // watch: {
  //   fileList(val) {
  //     this.onChange('', val)
  //   }
  // },
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
      if (data) {
        console.log(data)
        cos.putObject({
          Bucket: 'wuxiaohui-1254415986', // 存储桶
          Region: 'ap-nanjing', // 地域
          Key: data.filename, // 文件名
          Body: data.file, // 要上传的文件对象
          StorageClass: 'STANDARD', // 上传的模式类型 直接默认 标准模式即可
          onProgress: function(progressData) {
            console.log(JSON.stringify(progressData))
          }
        }, (err, data) => {
          console.log(err)
          if (!err && data.statusCode === 200) {
          // 成功或值失败均进入该函数
          // err null false 没有错
          // err 不为null true 有错
            if (err || data.statusCode !== 200) {
              return this.$message.error('上传失败,请重试')
            }
            console.log(23)
            this.fileList = [
              {
                url: 'https://' + data.Location
              }
            ]
            this.$emit('onSuccess', {
              url: 'https://' + data.Location
            })
            this.$emit('update:img', 'https://' + data.Location)
          }
        })
      }
    },
    onRemove(file, fileList) {
      // file 当前被删除的文件
      // 剩余的文件列表
      this.fileList = fileList
      this.$emit('onSuccess', { url: '' })
      this.$emit('update:img', '')
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
