<template>
  <!-- 新建的弹层 -->
  <el-dialog :title="titleText" :before-close="quxiaoBtn" :visible.sync="showDialog" class="SkuTc" >
    <!-- 匿名插槽 -->
    <el-form label-width="120px" class="SkuBody" :model="form">
      <el-form-item label="商品类型名称：" :rules="[{required: true, message: '不能为空', trigger: 'blur'}]" prop="text">
       <el-input
        type="text"
        placeholder="请输入"
        v-model="form.text"
        maxlength="10"
        show-word-limit
></el-input>
      </el-form-item>
    </el-form>
    <!-- el-dialog有专门放置底部操作栏的 插槽  具名插槽 -->
    <el-row slot="footer" type="flex" justify="center" style="padding-right:80px" class="queren">
      <!-- 列被分为24 -->
      <el-col :span="6">
         <el-button class="quxiao" @click="quxiaoBtn">取消</el-button>
        <el-button class="qued" @click="quedBtn">确定</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
export default {
  name: 'AddSku',
  // 需要传入一个props变量来控制 显示或者隐藏
  props: {
    showDialog: {
      type: Boolean,
      default: false
    },
    nameFn: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      form: {
        text: ''
      },
      textarea: ''
    }
  },
  computed: {
    titleText() {
      return this.nameFn === '' ? '新增商品类型' : '修改商品类型'
    }
  },
  methods: {
    async quedBtn() {
      if (this.titleText === '新增商品类型') {
        this.$emit('QueBtn', this.form.text)
        this.$message.success('新增商品成功')
      } else {
        this.$message.success('修改商品成功')
        this.$parent.showDialogBtn = false
        this.$emit('clickqr', this.form.text)
        // console.log(13331);
      }
      this.form.text = ''
    },
    quxiaoBtn() {
      this.$parent.showDialogBtn = false
      this.form.text = ''
    }
  }
}
</script>

<style lang="scss" scoped>
.SkuTc{
  width: 1250px;
  margin-left: 150px;
}
.SkuBody{
  position: relative;
  margin-left: 20px;
  padding-right: 30px;
}

.queren{
  .el-col{
    width: 200px;
  }
  .quxiao{
      width: 80px;
    height: 40px;
    background-color: #faf4f0;
  }
  .qued{
    width: 80px;
    height: 40px;
  background-color: #ed773f;
  color: #fff;
  margin-left: 30px;
  }
}
</style>