<template>

  <el-form size="medium" :inline="true" class="demo-form-inline">
    <el-form-item :label="`${label}:`">
      <el-input v-model="value" placeholder="请输入" :clearable="true" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" icon="el-icon-search" @click="searchMsg">查询</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: 'Search',
  props: {
    label: {
      type: String,
      require: true,
      default: ''
    }
  },
  data() {
    return {
      value: ''
    }
  },
  methods: {
    searchMsg() {
      this.$emit('search', this.value)
    }
  }
}
</script>

<style lang="scss">
.el-form-item{
  margin-bottom: 0 !important;
 }
</style>
