<template>
  <div>
    <el-dialog
      title="补货详情"
      class="replenish"
      :visible="replenishInfoDialogVisible"
      width="630px"
      :before-close="handleClose"
    >
      <MyTable
        :tableDate="replenishInfo"
        :thead="dataLabel"
        :isShowPage="false"
      />
    </el-dialog>
  </div>
</template>

<script>
import MyTable from "@/components/Table";
export default {
  props: {
    replenishInfoDialogVisible: {
      type: Boolean,
      default: false,
    },
    replenishInfo: {
      type: Array,
      default: () => [],
    },
    dataLabel: {
      type: Array,
      default: () => [],
    },
  },
  components: {
    MyTable,
  },
  methods: {
    handleClose() {
      console.log(1);
      this.$parent.replenishInfoDialogVisible = false;
    },
  },
};
</script>

<style scoped lang="scss">
::v-deep.replenish {
  .el-dialog {
    height: 430px;
  }
  .el-dialog__body {
    height: 380px;
    overflow: auto;
  }
}
</style>
