<template>
  <el-form :inline="true" :model="formInline" class="demo-form-inline">
    <el-form-item label="点位搜索：">
      <el-input v-model="formInline.name" placeholder="请输入" :clearable="true" />
    </el-form-item>
    <el-form-item label="区域搜索：">
      <el-select v-model="formInline.regionId" clearable placeholder="请选择">
        <el-option v-for="item in tableDate" :key="item.id" :label="item.name" :value="item.id" />
      </el-select>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" icon="el-icon-search" @click="onSubmit">查询</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  props: {
    tableDate: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      formInline: {
        name: '',
        regionId: ''
      }
    }
  },
  methods: {
    onSubmit() {
      this.$emit('searchNode', this.formInline)
    }
  }
}
</script>

<style>

</style>
