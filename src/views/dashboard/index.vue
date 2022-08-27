<template>
  <div class="dashboard-container">
    <div class="dashboard-text">
      <el-row>
        <el-col :span="18">
          <el-row style="margin-left: -10px; margin-right: -10px;" />
          <!-- 工单统计 -->
          <el-col class="left" :span="13" style="padding-left: 10px; padding-right: 10px;">
            <!-- 工单统计 -->
            <div class="leftStatistics">
              <div class="header">
                <div class="title">工单统计</div>
                <span>{{ start }} ~ {{ end }}</span>
              </div>
              <div class="body">
                <el-row>
                  <el-col :span="6">
                    <div class="num">{{ taskTotal }}</div>
                    <div class="text">工单总数（个）</div>
                  </el-col>
                  <el-col :span="6">
                    <div class="num">{{ completedTotal }}</div>
                    <div class="text">完成工单（个）</div>
                  </el-col>
                  <el-col :span="6">
                    <div class="num">{{ progressTotal }}</div>
                    <div class="text">进行工单（个）</div>
                  </el-col>
                  <el-col :span="6">
                    <div class="num">{{ cancelTask }}</div>
                    <div class="text">取消工单（个）</div>
                  </el-col>
                </el-row>
              </div>
            </div>
          </el-col>
          <!-- 销售统计 -->
          <el-col :span="11" style="padding-left: 10px; padding-right: 10px;">
            <div class="rightStatistics">
              <div class="header">
                <div class="title">销售统计</div>
                <span>{{ start }} ~ {{ end }}</span>
              </div>
              <div class="body">
                <el-row>
                  <el-col :span="12">
                    <div class="num">{{ OrderCount }}</div>
                    <div class="text">订单量（个）</div>
                  </el-col>
                  <el-col :span="12">
                    <div class="num">{{ money }}</div>
                    <div class="text">销售额（万元）</div>
                  </el-col>
                </el-row>
              </div>
            </div>
          </el-col>
          <el-row>
            <el-col :span="23" class="sku-sale-collect">
              <div class="header">
                <div class="title">销售数据
                  <span class="sub-title">{{ start }} ~ {{ end }}</span>
                </div>
                <div class="week-month-year">
                  <div class="item is-checked">周</div>
                  <div class="item">月</div>
                  <div class="item">年</div>
                </div>
              </div>
            </el-col>
          </el-row>
        </el-col>

        <!-- 商品热搜 -->
        <el-col :span="6">
          <div class="hotlist">
            <div class="header">
              <div class="title">
                商品热榜
                <span class="sub-title">{{ start }} ~ {{ end }}</span>
              </div>
            </div>
            <div class="body">
              <el-row v-for="(item,index) in list" :key="index" class="body-row">
                <el-col :span="5">
                  <div class="top">{{ index+1 }}</div>
                </el-col>
                <el-col :span="13">
                  <div class="sku-name">
                    {{ item.skuName }}
                  </div>
                </el-col>
                <el-col :span="6">
                  <div class="count">{{ item.count }}单</div>
                </el-col>
              </el-row>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import {
  getBussinessTop,
  getAmountCollect,
  getOrderCount,
  getTaskReportInfo,
  getMoneyApi
}
from '@/api/dashboard'
export default {
  data() {
    return {
      // start: '2022-07-01',
      // end: '2022-07-31	',
      list: [],
      collectType: 1, // 按月统计 销售
      OrderCount: 0, // 销售统计 总数量
      taskCount: [], // 工单统计
      money: 0 // 销售总额
    }
  },
  computed: {
    end() {
      return this.getTime(+new Date())
    },
    start() {
      return this.currmonthStarttime()
    },
    taskTotal() { // 工单总数
      return this.taskCount.reduce((per, cur) => {
        return per + cur.total
      }, 0)
    },
    cancelTask() { // 取消工单总数
      return this.taskCount.reduce((per, cur) => {
        return per + cur.cancelTotal
      }, 0)
    },
    completedTotal() { // 完成工单
      return this.taskCount.reduce((per, cur) => {
        return per + cur.completedTotal
      }, 0)
    },
    progressTotal() { // 进行中的工单
      return this.taskCount.reduce((per, cur) => {
        return per + cur.progressTotal
      }, 0)
    }
  },
  created() {
    this.getBussinessTop()
    // this.getAmountCollect()
    this.getOrderCount()
    this.getTaskReportInfo()
    this.getMoney()
  },
  methods: {
    // 获取榜单前十
    async getBussinessTop() {
      try {
        const res = await getBussinessTop(this.start, this.end)
        // console.log(res.data)
        this.list = res.data
      } catch (e) {
        console.log(e)
      }
    },
    // 毫秒转年月日
    getTime(timestamp) {
      const time = new Date(timestamp)
      const year = time.getFullYear()
      let month = time.getMonth() + 1
      let date = time.getDate()

      if (month < 10) { month = '0' + month }
      if (date < 10) { date = '0' + date }
      return year + '-' + month + '-' + date
    },
    // 获取当前月的第一天
    // 获取当前月的第一天 例如 2022-04-01
    currmonthStarttime() {
      const today = new Date() // 中国标准时间 当前时间
      // 设置一个月的某一天
      today.setDate(1)
      const oYear = today.getFullYear()
      let oMoth = (today.getMonth() + 1).toString()
      if (oMoth.length <= 1) oMoth = '0' + oMoth
      let oDay = today.getDate().toString()
      if (oDay.length <= 1) oDay = '0' + oDay

      return oYear + '-' + oMoth + '-' + oDay
    },
    // 获取销售
    async  getAmountCollect() {
      try {
        const res = await getAmountCollect(this.collectType, this.start, this.end)
        console.log(res)
      } catch (e) {
        console.log(e)
      }
    },
    // 获取一定时间范围之内的订单总数
    async getOrderCount() {
      try {
        const res = await getOrderCount({
          start: `${this.start} 00:00:00`,
          end: `${this.end} 23:59:59`
        })
        // console.log(res.data)
        this.OrderCount = res.data
      } catch (e) {
        console.log(e)
      }
    },
    // 获取当时工单汇总信息 就是工单统计
    async  getTaskReportInfo() {
      try {
        const res = await getTaskReportInfo(`${this.start} 00:00:00`, `${this.end} 23:59:59`)
        // console.log(res.data)
        this.taskCount = res.data
        // console.log(this.taskCount)
      } catch (e) {
        console.log(e)
      }
    },
    // 获取销售额
    async getMoney() {
      try {
        const res = await getMoneyApi({
          start: `${this.start} 00:00:00`,
          end: `${this.end} 23:59:59`
        })
        // console.log(res.data)
        const result = Number(res.data) / 1000000
        this.money = result.toFixed(2)
      } catch (e) {
        console.log(e)
      }
    }
  }

}
</script>

<style lang="scss" scoped>

.dashboard-container{
  background-color: #f8fafd;
  // padding: 20px;
  .header {
      display: flex;

      .title{
      font-size: 16px;
      font-family: PingFangSC-Semibold,PingFang SC;
      font-weight: 600;
      color: #333;
      }

      span {
       margin-left: 10px;
       font-size: 12px;
       font-family: PingFangSC-Regular,PingFang SC;
       font-weight: 400;
       color: #999;
      }
    }

  // 工单统计
  .leftStatistics {
    padding: 0px 20px 20px;
    min-height: 166px;
    border-radius: 20px;
    background: #e9f3ff;
    background-image:  url('~@/assets/images/gongdan1.png'), url('~@/assets/images/gongdan2.png');
    background-repeat: no-repeat, no-repeat;
    background-position: 0 0, right bottom;

    .body {
      text-align: center;
      .num {
        color: #072074;
        text-shadow: 2px 4px 7px rgb(85 132 255 / 50%);
        height: 50px;
        font-size: 36px;
        font-family: PingFangSC-Semibold,PingFang SC;
        font-weight: 600;
        line-height: 50px;
      }
      .text {
        height: 17px;
        margin-top: 3px;
        font-size: 12px;
        font-family: PingFangSC-Regular,PingFang SC;
        font-weight: 400;
        color: #91a7dc;
        line-height: 17px;
      }
    }
  }
  // 销售统计
 .rightStatistics{
     padding: 0px 20px 20px;
     min-height: 166px;
     background: #fbefe8 url('~@/assets/images/sales.png') no-repeat  right bottom;
     border-radius: 20px;

  .body {
    text-align: center;
    .num {
      color: #ff5757;
      text-shadow: 2px 4px 7px rgb(255 99 85 / 50%);
      height: 50px;
      font-size: 36px;
      font-family: PingFangSC-Semibold,PingFang SC;
      font-weight: 600;
      line-height: 50px;
    }

    .text {
      color: #de9690;
      height: 17px;
      margin-top: 3px;
      font-size: 12px;
      font-family: PingFangSC-Regular,PingFang SC;
      font-weight: 400;
      line-height: 17px;
    }
  }
 }

// 销售数据
  .sku-sale-collect{
    flex-direction: column;
    height: calc(40vh - 68px);
    min-height: 352px;
    margin-top: 20px;
    background: #fff;
    border-radius: 20px;
    margin-left: 10px;
    margin-right: 10px;
    padding:10px 20px;

    .header {
      display: flex;
      justify-content: space-between;
    }

    .title {
    font-size: 16px;
    font-family: PingFangSC-Semibold,PingFang SC;
    font-weight: 600;
    color: #333;
    }

    .sub-title {
    margin-left: 10px;
    font-size: 12px;
    font-family: PingFangSC-Regular,PingFang SC;
    font-weight: 400;
    color: #999;
    }

    &.el-col-23 {
    width: 97.83333%;
}
  }

 // 商品热榜
 .hotlist {
    padding:0 20px 20px;
    flex-direction: column;
    height: calc(60vh - 72px);
    min-height: 538px;
    background: #fff;
    border-radius: 20px;
    // 头部
    .header {
      display: flex;
      .title {
        align-items: center;
        font-size: 16px;
        font-family: PingFangSC-Semibold,PingFang SC;
        color: #333;
      }
      .sub-title {
        margin-left: 10px;
        font-size: 12px;
        font-family: PingFangSC-Regular,PingFang SC;
        font-weight: 400;
        color: #999;
      }
    }
    // 主体
    .body {
      .body-row {
        margin-bottom: 30px;
      }
      .top {
        // display: inline-block;
        margin-left: 10px;
        text-align: center;
        font-size: 12px;
        line-height: 14px;
        width: 21px;
        height: 20px;
        background: url('~@/assets/images/one.png') no-repeat;
      }
      .sku-name {
        height: 20px;
        font-size: 14px;
        font-family: PingFangSC-Medium,PingFang SC;
        font-weight: 500;
        color: #333;
        line-height: 20px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      .count{
        height: 20px;
        font-size: 14px;
        font-family: PingFangSC-Regular,PingFang SC;
        font-weight: 400;
        color: #737589;
        line-height: 20px;
        text-align: right;
      }
    }
 }
}
.dashboard {
  // &-container {
  //   margin: 30px;
  // }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}

.top1 {
   background: url('~@/assets/images/one.png') no-repeat;
   color: #8e5900;
   width: 21px;
   height: 20px;
}

</style>
