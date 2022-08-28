<template>
  <el-dialog
    title="工单信息"
    :visible="channelVisible"
    width="630px"
    :before-close="handleClose"
  >
    <div class="main">
      <MyTable
        :tableDate="channelList"
        :thead="channelLabel"
        :isShowIndex="false"
        :isShowPage="false"
      >
        <template #skuName="{ row }">
          {{ computedSkuName(row.row) }}
        </template>
        <template #currentCapacity="{ row }">
          {{ computedCurrentCapacity(row.row) }}
        </template>
        <template #num="{ row }">
          {{ getNum(row.row) }}
        </template>
        <template #buhuo="{ row }">
          <span v-if="!row.row.sku">货道暂无商品</span>
          <el-input-number
            v-model="channelList[row.$index].expectCapacity"
            v-else
            :max="row.row.num"
            :min="0"
            size="mini"
            controls-position="right"
          />
        </template>
      </MyTable>
    </div>
    <div class="button">
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="submit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import MyTable from "@/components/Table";
export default {
  name: "AddGoodsList",
  components: {
    MyTable,
  },
  props: {
    channelVisible: {
      type: Boolean,
      default: false,
    },
    innerCode: {
      type: String,
      default: "",
    },
    channelList: {
      type: Array,
      default: () => [],
    },
    channelLabel: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      canAddNum: 0,
      details: [],
    };
  },
  methods: {
    // 关闭弹框
    handleClose() {
      this.details = [];
      this.$parent.channelVisible = false;
    },

    getNum(data) {
      if (data.sku?.skuName) {
        return data.maxCapacity - data.currentCapacity;
      } else {
        return "-";
      }
    },
    computedSkuName(data) {
      return data.sku?.skuName ?? "-";
    },
    computedCurrentCapacity(data) {
      return data.sku?.skuName ? data.currentCapacity : "-";
    },
    submit() {
      this.channelList.forEach((item, index) => {
        if (item.sku && item.expectCapacity != 0) {
          let obj = {};
          obj.channelCode = item.channelCode;
          obj.expectCapacity = item.expectCapacity;
          obj.skuId = item.skuId;
          obj.skuImage = item.sku.skuImage;
          obj.skuName = item.sku.skuName;
          this.details.push(obj);
        } else {
          return;
        }
      });
      this.$emit("sendDetails", this.details);
      this.handleClose();
    },
  },
};
</script>

<style scoped lang="scss">
.main {
  height: 400px;
  overflow: auto;
  .el-input-number--mini {
    width: 88px;
  }
}
.button {
  margin-top: 22px;
  padding-left: 220px;
}
</style>
