<template>
  <div class="dialog-content">
    <el-dialog
      title="订单详情"
      :visible.sync="dialogVisible"
      width="630px"
      :before-close="handleClose"
    >
      <div class="order-status">
        <img v-if="orderInfo.status === '未支付'" src="@/assets/shijizeImg/2.png" class="img">
        <img v-else src="@/assets/shijizeImg/1.png" class="img">
        <span class="status">{{ orderInfo.status }}</span>
        <img src="@/assets/shijizeImg/pic_2.3b5af41c.png" class="pic">
      </div>

      <el-form>
        <el-row>
          <el-col :span="12">
            <el-form-item label="订单编号:">
              <span>{{ orderInfo.orderNo }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="商品名称:">
              <span>{{ orderInfo.skuName }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="设备编号:">
              <span>{{ orderInfo.innerCode }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="订单金额:">
              <span>{{ orderInfo.price }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="完成时间:">
              <span>{{ orderInfo.createTime | formatDate }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="创建时间:">
              <span>{{ orderInfo.createTime | formatDate }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="设备地址:">
              <span>{{ orderInfo.addr }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="支付方式:">
              <span>{{ orderInfo.payType }}</span>
            </el-form-item>
          </el-col></el-row>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    orderInfo: {
      type: Object,
      default: () => ({})
    },
    dialogVisible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {

    }
  },
  computed: {
    changeImg() {
      return this.orderInfo.status === 0 ? '@/assets/shijizeImg/2.png' : '@/assets/shijizeImg/1.png'
    }
  },
  mounted() {
    console.log(this.orderInfo)
  },
  methods: {
    handleClose() {
      this.$emit('update:dialogVisible', false)
    }
  }
}
</script>

<style scoped lang="scss">
.dialog-content {
      ::v-deep .el-dialog__title {
        font-weight:800;
    }
      ::v-deep .el-dialog {
            border-radius: 10px;
    }
    .order-status {

    display: flex;
    -webkit-box-align: center;

    align-items: center;
    height: 54px;
    margin-bottom: 30px;
    background-color: hsla(0,0%,92.5%,.39);

    .img {
        margin-left:20px;
    }

    .status {
            flex: 1;
    margin-left: 16px;
    color: rgba(0,0,0,.85);
    }

    .pic {
            margin-right: 76px;
    margin-bottom: 7px;
    }
    }
}
</style>
