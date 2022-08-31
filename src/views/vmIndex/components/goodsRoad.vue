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
          <el-col :span="3" class="right">货道行数：</el-col>
          <el-col :span="4" class="right">货道列数：</el-col>
          <el-col :span="12" class="middle">货道容量（个）：</el-col>
          <el-col :span="5" class="left">
            <el-button type="primary" size="medium">智能排货</el-button>
          </el-col>
        </el-row>
      </div>

      <div class="img-container">
        <el-carousel trigger="click" :autoplay="false">
          <el-carousel-item v-for="item in 2" :key="item">
            <el-row v-for="item1 in 6" :key="item1">
              <div v-for="index in 5" :key="index" class="item">
                <div class="img">
                  <img src="@/assets/images/nogoods.png" alt="">
                </div>
                <div class="button">
                  <el-button type="text">
                    添加
                  </el-button>
                  <el-button type="text" style="color: red">
                    修改
                  </el-button>
                </div>
              </div>
            </el-row>
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
.container{
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  .channel-list{
    width: 847px;
    height: 56px;
    margin-bottom: 16px;
    background: #f3f6fb;
    .right{
      display: flex;
    align-items: center;
    justify-content: flex-end;
    height: 56px;
    }
    .middle{
      display: flex;
    align-items: center;
    height: 56px;
    padding: 0 0 0 55px;
    }
    .left{
    display: flex;
    align-items: center;
    height: 56px;
    }
  }
}
.img-container{
  width: 814px;
  min-height: 384px;
  margin: 0 auto;
  overflow: hidden;
  .el-row{
      display: flex;
    }
  .item{
    width: 20%;
    height: 180px;
    background-color: #fff;
    border-radius: 4px;
    padding-left: 8px;
    padding-right: 8px;
    .img{
      display:flex;
      align-items: center;
      justify-content: center;
    height: 135px;
    padding-top: 16px;
    background-color: #f6f7fb;
    border-radius: 4px;
    img{
    width: 84px;
    height: 78px;
    }
    }
    .button{
      display:flex;
      align-items: center;
      justify-content: center;
    }
    }
  }

</style>
