<template>
  <div>
    <el-table :data="tableDate" style="width: 100%" class="mq-table">
      <el-table-column v-if="showBox" type="selection" width="55" />
      <el-table-column
        v-if="isShowIndex"
        type="index"
        label="序号"
        width="80"
      />
      <template v-for="(item, index) in thead">
        <el-table-column
          v-if="item.slotName"
          :key="index"
          :prop="item.prop"
          :label="item.label"
        >
          <template v-slot="row">
            <slot :name="item.slotName" :row="row" />
          </template>
        </el-table-column>
        <el-table-column
          v-else
          :key="index"
          :prop="item.prop"
          :label="item.label"
        />
      </template>
      <el-table-column v-if="tableDate.length === 0">暂无数据 </el-table-column>
    </el-table>
    <div v-if="tableDate.length !== 0 && isShowPage" class="page">
      <div>
        <span>共{{ totalCount }}条记录</span>
        <span> 第{{ pageIndex }}/{{ totalPage }}页</span>
      </div>
      <div>
        <el-button
          :disabled="pageIndex == 1"
          size="small"
          @click="changePage(0)"
          >上一页</el-button
        >
        <el-button
          :disabled="pageIndex == totalPage"
          size="small"
          @click="changePage(1)"
          >下一页</el-button
        >
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Table",
  props: {
    thead: {
      type: Array,
      default: () => [],
    },
    tableDate: {
      type: Array,
      default: () => [],
    },
    totalCount: {
      type: [String, Number],
      default: 0,
    },
    pageIndex: {
      type: [Number, String],
      default: 1,
    },
    totalPage: {
      type: [String, Number],
      default: 1,
    },
    isShowPage: {
      type: Boolean,
      default: true,
    },
    isShowIndex: {
      type: Boolean,
      default: true,
    },
    showBox: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {};
  },
  methods: {
    changePage(val) {
      this.$emit("click", val);
    },
  },
};
</script>

<style scoped lang="scss">
.page {
  display: flex;
  padding: 20px;
  justify-content: space-between;
  align-items: center;
  span {
    font-size: 16px !important;
    color: #dbdfe5 !important;
  }
  .el-button {
    background-color: #d5ddf8;
  }
}
::v-deep .el-table td {
  border: none;
}
</style>
