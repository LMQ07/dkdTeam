<template>
  <el-dialog
    title="货道设置"
    :visible.sync="dialogVisible"
    width="940px"
    :before-close="handleClose"
  >
    <div class="container">
      <div class="channel-list">
        <el-row>
          <el-col :span="3" class="right">货道行数：{{ roadNumber.vmCol }}</el-col>
          <el-col :span="4" class="right">货道列数：{{ roadNumber.vmRow }}</el-col>
          <el-col :span="12" class="middle">货道容量（个）：{{ roadNumber.channelMaxCapacity }}</el-col>
          <el-col :span="5" class="left">
            <el-button type="primary" size="medium">智能排货</el-button>
          </el-col>
        </el-row>
      </div>

      <div class="img-container">
        <el-carousel trigger="click" :autoplay="false">
          <el-carousel-item v-for="(item, index) in resultList" :key="index">
            <el-scrollbar
              :noresize="true"
              style="height: 100%;"
            >
              <div type="flex">
                <el-col v-for="item1 in item" :key="item1.id" :span="4" class="item">
                  <div class="img">
                    <el-image :src="item1&& item1.sku && item1.sku.skuImage" alt="">
                      <div slot="error" class="image-slot">
                        <i class="el-icon-picture-outline" />
                      </div>
                    </el-image>
                    <p> {{ item1.sku && item1.sku.brandName }} </p>
                    <p class="channelCode">{{ item1.channelCode }}</p>
                  </div>
                  <div class="button">
                    <el-button type="text">
                      添加
                    </el-button>
                    <el-button type="text" style="color: red" @click="delBtn(index)">
                      删除
                    </el-button>
                  </div>
                </el-col>
              </div>
            </el-scrollbar>
          </el-carousel-item>
        </el-carousel>
      </div>

    </div>

  </el-dialog>
</template>

<script>
export default {
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    goodsRoadList: {
      type: Array,
      default: () => []
    },
    roadNumber: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    resultList() {
      const arr = [[], []]
      this.goodsRoadList.forEach(item => {
        const currentCode = +item.channelCode.split('-')[1]
        if (currentCode >= 6) {
          arr[1].push(item)
        } else {
          arr[0].push(item)
        }
      })
      return arr
    }
  },
  methods: {
    handleClose() {
      this.$emit('update:dialogVisible', false)
    }
  }

}
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  .channel-list {
    width: 847px;
    height: 56px;
    margin-bottom: 16px;
    background: #f3f6fb;

    .right {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      height: 56px;
    }

    .middle {
      display: flex;
      align-items: center;
      height: 56px;
      padding: 0 0 0 55px;
    }

    .left {
      display: flex;
      align-items: center;
      height: 56px;
    }
  }
}

.img-container {
  width: 814px;
  min-height: 384px;
  margin: 0 auto;
  overflow: hidden;

  .el-row {
    display: flex;
  }

  .item {
    width: 20%;
    height: 180px;
    background-color: #fff;
    border-radius: 4px;
    padding-left: 8px;
    padding-right: 8px;

    .img {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 135px;
      padding-top: 16px;
      background-color: #f6f7fb;
      border-radius: 4px;
      position: relative;

      .channelCode {
        position: absolute;
        text-indent: 5px;
        top: -10px;
        left: 0;
        width: 43px;
        height: 23px;
        line-height: 23px;
        background: #829bed;
        border-radius: 0 10px 10px 0;
        font-size: 12px;
        color: #fff;
      }

      img {
        width: 84px;
        height: 78px;
      }

      p {
        font-size: 12px;
      }
    }

    .button {
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}

</style>
