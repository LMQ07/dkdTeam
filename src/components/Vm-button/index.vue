<template>
  <el-row>
    <el-button size="medium" class="newBuild"> <i class="el-icon-circle-plus-outline" /> 新建</el-button>
    <el-button v-if="twoShow" size="medium" class="two">批量操作</el-button>
  </el-row>
</template>

<script>
export default {
  name: 'VmButton',
  props: {
    twoShow: {
      type: Boolean,
      default: true
    }
  }
}
</script>

<style lang="scss">
.newBuild{
    width: 80px!important;
    color: white;
    height: 36px;
    padding: 0;
    background: linear-gradient(135deg,#ff9743,#ff5e20)!important;
    border: none;
}
.two{
    width: 80px!important;
    height: 36px;
    padding: 0;
    background-color: #fbf4f0!important;
    border: none;
    color: #655b56!important;
}
</style>
