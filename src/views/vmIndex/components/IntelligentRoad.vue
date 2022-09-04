<template>
  <el-dialog
    title="智能排货"
    :visible.sync="visible"
    width="740px"
    :before-close="handleClose"
  >
    <div class="container">
      <p> 该区域属于学校商圈适合销售一下商品：</p>
      <div class="imgBox">
        <div v-for="item,index in intelligentRoadList" :key="index" class="img">
          <div class="item">
            <img :src="item.image" alt="">
            <p>{{ item.skuName }}</p>
          </div>
        </div>
      </div>
    </div>
    <div class="btn">
      <el-button class="newBuild" @click="getSgt">采纳建议</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    intelligentRoadList: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    handleClose() {
      this.$emit('update:visible', false)
    },
    getSgt() {
      this.$emit('getSuggestRoad', this.intelligentRoadList)
      this.handleClose()
    }
  }
}
</script>

<style lang="scss" scoped>
.imgBox{
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  padding: 10px;
  .img{
   width: 20%;
   text-align: center;
   padding: 5px;
   .item{
    background-color: #f6f7fb;
    padding-top: 15px;
    padding-bottom: 5px;
    img{
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
