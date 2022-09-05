<template>
  <div>
    <el-dialog title="选择商品" :visible="showSelectGoods" @close="close">
      <search trigger="change" label="商品名称" @search="searchGoods" />
      <el-row type="flex" justify="space-between" align="middle">
        <el-col :span="1">
          <el-button :disabled="page.pageIndex === 1" icon="el-icon-arrow-left" type="text" @click="prev" />
        </el-col>
        <el-col>
          <div class="imgBox">
            <div v-for="(item,index) in list" :key="index" class="img">
              <div class="item" @click="currentGoods = item">
                <img v-show="item.skuId === currentGoods.skuId" class="selected" :src="selectedImg" alt="">
                <img :src="item.image" alt="">
                <p>{{ item.skuName }}</p>
              </div>
            </div>
          </div>
        </el-col>
        <el-col :span="1">
          <el-button :disabled="nextDisabled" icon="el-icon-arrow-right" type="text" @click="next" />
        </el-col>
      </el-row>

      <div class="btn">
        <el-button class="newBuild" @click="confirm">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getGoodsList } from '@/api/vm'
import selectedImg from '@/assets/images/download.png'

export default {
  name: 'SelectGoods',
  props: {
    showSelectGoods: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      list: [],
      selectedImg,
      page: {
        pageIndex: 1,
        pageSize: 10
      },
      currentGoods: {},
      formData: {
        skuName: ''
      },
      nextDisabled: false
    }
  },
  mounted() {
    this.getGoodsList()
  },
  methods: {
    close() {
      this.$emit('update:showSelectGoods', false)
      this.page = {
        pageIndex: 1,
        pageSize: 10,
        skuName: ''
      }
      this.currentGoods = {}
    },
    searchGoods(value) {
      this.page.skuName = value
      this.page.pageIndex = 1
      this.getGoodsList()
    },
    prev() {
      this.page.pageIndex--
      this.getGoodsList()
    },
    next() {
      this.page.pageIndex++
      this.getGoodsList()
    },
    async getGoodsList() {
      const res = await getGoodsList(this.page)
      this.list = res.data.currentPageRecords.map(item => {
        return {
          image: item.skuImage,
          skuName: item.skuName,
          skuId: item.skuId
        }
      })
      this.nextDisabled = res.data.pageIndex === res.data.totalPage
    },
    confirm() {
      this.$emit('confirm', this.currentGoods)
      this.close()
    }
  }
}
</script>

<style lang="scss" scoped>
.imgBox {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  padding: 10px;

  .img {
    width: 20%;
    text-align: center;
    padding: 5px;

    .item {
      background-color: #f6f7fb;
      padding-top: 15px;
      padding-bottom: 5px;
      position: relative;
      cursor: pointer;
      &:hover {
        background-color: #e6e6e6;
      }

      .selected {
        position: absolute;
        left: 0;
        top: 0;
        width: 20px;
        height: 20px
      }

      img {
        width: 83px;
        height: 84px;
      }
    }
  }
}
.btn{
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 15px;
}
</style>
