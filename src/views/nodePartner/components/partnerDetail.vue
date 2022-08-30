<template>
  <el-dialog
    title="合作商详情"
    :visible.sync="detailVisible"
    width="30%"
    :before-close="handelClose"
  >
    <el-row class="row">
      <el-col :span="12">合作商名称：{{ detailData.name }}</el-col>
      <el-col :span="12">联系人：{{ detailData.contact }}</el-col>
    </el-row>
    <el-row class="row">
      <el-col :span="12">联系电话：{{ detailData.mobile }}</el-col>
      <el-col :span="12">分成比例：{{ detailData.ratio }}%</el-col>
    </el-row>
  </el-dialog>
</template>

<script>
export default {
  props: {
    detailVisible: {
      type: Boolean,
      default: true
    },
    detailData: {
      type: Object,
      default: function() {
        return {}
      }
    }
  },
  methods: {
    handelClose() {
      this.$emit('update:detailVisible', false)
    }
  }
}
</script>

<style lang="scss" scoped>
.row{
    margin-bottom: 20px;
}
</style>
