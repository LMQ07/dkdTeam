<template>
  <div class="dashboard-container">
    name
  </div>
</template>

<script>

export default {

}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
::v-deep .el-card__body{
// padding-left: 10px;
// padding-right: 10px;
padding-top: 10px;
}
.card{
  background-color: #fff;
  border-radius: 20px;
  .header-box{
    font-size: 12px;
    font-weight: 400;
    color: #999;
    .header{
    margin-right: 10px;
    font-weight: 600;
    color: #333;
    font-size: 16px;
    }
  }
}
.body{
.icon{
  width: 21px;
  height: 20px;
  color: #8e5900;
  font-size: 14px;
  }
 .title{
  font-weight: 500;
  color: #333;
  font-size: 14px;
 }
 .sale{
  font-weight: 400;
  color: #737589;
  font-size: 14px;
 }
}
.tickets{
  min-height: 166px;
  background: url(~@/assets/images/gongdan1.png),url(~@/assets/images/gongdan2.png);
  background-repeat: no-repeat,no-repeat;
  background-position: 0 0,calc(100% - 12px) 100%;
  background-color: #e9f3ff;
  padding-left: 10px; padding-right: 10px;
  box-sizing: border-box;
  .box{
  padding-left: 20px !important;
  padding-right: 20px  !important;
  }
}
   .body{
    display: flex;
    justify-content: space-around;
    .item{
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }
    .num{
      color: #072074;
      font-size: 36px;
      text-shadow: 2px 4px 7px rgb(85 132 255 / 50%);
      font-weight: 600;
    }
    .name{
      color: #91a7dc;
      font-size: 12px;
    }
  }
.sales{
  background: #e9f3ff;
  min-height: 166px;
  background: #fbefe8 url(../../assets/images/sales.png) no-repeat calc(100% - 12px) 100%;
  padding-left: 10px; padding-right: 10px;
  box-sizing: border-box;
 .box{
  padding-left: 20px !important;
  padding-right: 20px  !important;
  }
  .num{
  color: #ff5757;
  text-shadow: 2px 4px 7px rgb(255 99 85 / 50%);
  }
  .name{
    color: #de9690;
  }
}
.saleNumber{
  min-height: 352px;
  margin-top: 20px;
  background-color: #fff;
  border-radius: 20px;
  padding: 20px;
   .header-box{
    font-size: 12px;
    font-weight: 400;
    color: #999;
    display: flex;
    justify-content: space-between;
    .header{
    margin-right: 10px;
    font-weight: 600;
    color: #333;
    font-size: 16px;
    }
    .week-month-year{
      width: 129px;
    height: 34px;
    background: rgba(233,243,255,.37);
    border-radius: 10px;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    span{
    display: inline-block;
    text-align: center;
    line-height: 25px;
    font-weight: 600;
    color: #9ca3b4;
    width: 37px;
    height: 25px;
    font-size: 14px;
    cursor: pointer;
    &.active{
     color: #333;
      background-color: #fff;
      box-shadow: 0 0 4px 0 rgb(0 0 0 / 11%);
       border-radius: 7px;
    }
    }
    }
  }
}
.bottom{
  margin-top:15px;
  .common{
    border-radius:20px;
    min-height: 353px;
    background: #fff;
    padding: 10px;
    .header{
    font-weight: 600;
    color: #333;
    font-size: 16px;
    height: 16px;
    }
    .main{
      display: flex;
      height: 260px;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
  }
}
</style>
