<template>
  <div>
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
              <el-button type="primary" size="medium" @click="showItelligentRoad">智能排货</el-button>
            </el-col>
          </el-row>
        </div>

        <div class="img-container">
          <el-carousel height="384px" trigger="click" :autoplay="false" class="carousel">
            <el-carousel-item v-for="(item, index) in resultList" :key="index">
              <el-scrollbar
                :noresize="true"
                style="height: 100%;"
              >
                <div type="flex">
                  <el-col v-for="(subItem, subIndex) in item" :key="subIndex" :span="4" class="item">
                    <div class="img">
                      <el-image :src="subItem.skuImage" alt="">
                        <div slot="error" class="image-slot">
                          <i class="el-icon-picture-outline" />
                        </div>
                      </el-image>
                      <p> {{ subItem.brandName || '暂无商品' }} </p>
                      <p class="channelCode">{{ subItem.channelCode }}</p>
                    </div>
                    <div class="button">
                      <el-button type="text" @click="handleShowSelectedGoods(index, subIndex)">
                        添加
                      </el-button>
                      <el-button :disabled="subItem.skuId === '0'" type="text" style="color: red" class="disabled" @click="delBtn(index, subIndex)">
                        删除
                      </el-button>
                    </div>
                  </el-col>
                </div>
              </el-scrollbar>
            </el-carousel-item>
          </el-carousel>
        </div>
        <div class="btn">
          <el-button class="newBuild" @click="allSubmit">确认</el-button>
        </div>
      </div>
    </el-dialog>
    <IntelligentRoadVue :intelligent-road-list="IntelligentRoadList" :visible.sync="showRoad" @getSuggestRoad="getSuggestRoad" />
    <SelectGoods :show-select-goods.sync="showSelectGoods" @confirm="confirmGoods" />
  </div>
</template>

<script>
import IntelligentRoadVue from './IntelligentRoad.vue'
import { getGoodsRoad, getIntelligentRoad, submitRoad } from '@/api/vm'
import SelectGoods from '@/views/vmIndex/components/SelectGoods'
export default {
  name: 'GoodsRoad',
  components: { SelectGoods, IntelligentRoadVue },
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    // goodsRoadList: {
    //   type: Array,
    //   default: () => []
    // },
    roadNumber: {
      type: Object,
      default: () => ({})
    },
    businessId: {
      type: [Number, String],
      default: null
    }
  },
  data() {
    return {
      showRoad: false,
      IntelligentRoadList: [],
      resultList: [],
      goodsRoadList: [],
      showSelectGoods: false,
      selectedAddRoad: [0, 0],
      innerCode: ''
    }
  },
  methods: {
    calcResultList() {
      const arr = [[], []]
      this.goodsRoadList.forEach(item => {
        const currentCode = +item.channelCode.split('-')[1]
        const currentObj = {
          skuId: item.skuId,
          channelCode: item.channelCode,
          brandName: item.sku && item.sku.brandName,
          skuImage: item.sku && item.sku.skuImage
        }
        if (currentCode >= 6) {
          arr[1].push(currentObj)
        } else {
          arr[0].push(currentObj)
        }
      })
      return arr
    },
    handleClose() {
      this.$emit('update:dialogVisible', false)
    },
    async getGoodsRoad(innerCode) {
      this.innerCode = innerCode
      const res = await getGoodsRoad(innerCode)
      this.goodsRoadList = res.data
      this.resultList = this.calcResultList()
    },
    async showItelligentRoad() {
      this.showRoad = true
      const res = await getIntelligentRoad(this.businessId)
      this.IntelligentRoadList = res.data
    },
    getSuggestRoad(obj) {
      // 获取到当前的智能排货的列表
      // 使用推荐货道
      this.resultList[0] = this.resultList[0].map((item, index) => {
        if (obj[index]) {
          return {
            skuImage: obj[index].image,
            skuId: obj[index].skuId,
            brandName: obj[index].skuName,
            channelCode: item.channelCode
          }
        } else {
          return item
        }
      })
    },
    handleShowSelectedGoods(index, subIndex) {
      this.showSelectGoods = true
      this.selectedAddRoad = [index, subIndex]
    },
    delBtn(index, subIndex) {
      console.log(index, subIndex)
      this.$set(this.resultList[index], subIndex, {
        skuId: '0',
        channelCode: this.resultList[index][subIndex].channelCode,
        brandName: '',
        skuImage: ''
      })
    },
    confirmGoods(currentGoods) {
      this.resultList[this.selectedAddRoad[0]][this.selectedAddRoad[1]] = {
        skuImage: currentGoods.image,
        skuId: currentGoods.skuId,
        brandName: currentGoods.skuName,
        channelCode: this.resultList[this.selectedAddRoad[0]][this.selectedAddRoad[1]].channelCode
      }
    },
    async allSubmit() {
      const arr = []
      this.resultList.forEach(item => {
        item.forEach(subItem => {
          arr.push({
            skuId: subItem.skuId,
            channelCode: subItem.channelCode
          })
        })
      })
      await submitRoad({
        innerCode: this.innerCode,
        channelList: arr
      })
      this.$message.success('操作成功')
      this.handleClose()
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

  .carousel {
    min-height: 384px;
  }

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
.btn{
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 15px;
}

.disabled {
  color: #999;
}
</style>
