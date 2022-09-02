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
                  <div :class="['item',{isChecked:changeStyle === 'week'}]" @click="changeDates('week')">周</div>
                  <div :class="['item',{isChecked:changeStyle === 'month'}]" @click="changeDates('month')">月</div>
                  <div :class="['item',{isChecked:changeStyle === 'year'}]" @click="changeDates('year')">年</div>
                </div>
              </div>
              <div class="body">
                <el-row>
                  <el-col :span="12">
                    <div>
                      <echarts :option="saleNumoption" />
                    </div>
                  </el-col>
                  <el-col :span="12">
                    <div>
                      <echarts :option="saleTotaloption" />
                    </div>
                  </el-col>
                </el-row>
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
    <!-- 合作商点位数Top5 -->
    <div class="bottom">
      <el-row :gutter="20" style="margin-left: 0px;">
        <el-col :span="14">
          <el-card class="common">
            <div class="header">
              <div class="title">合作商点位数Top5</div>
              <span class="dian el-icon-more" />
            </div>
            <div>
              <el-col :span="17">
                <echarts :option="partneroption" />
              </el-col>
              <el-col :span="7">
                <div class="collect">
                  <div class="count">{{ nodeCount }}</div>
                  <div class="name">点位数</div>
                  <div class="count count2">{{ partnerCount }}</div>
                  <div class="name">合作商数</div>
                </div>
              </el-col>
            </div>
          </el-card>
        </el-col>
        <el-col :span="10">
          <el-card class="common">
            <div class="header">
              <span class="title">异常设备监控</span>
            </div>
            <div class="main">
              <img src="@/assets/images/404.png" alt="">
              <span class="no">暂无数据</span>
            </div>
          </el-card>
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
  getMoneyApi,
  getSaleTotal,
  getTogetherPartner
}
from '@/api/dashboard'
import echarts from './components/echarts.vue'
export default {
  components: {
    echarts
  },
  data() {
    return {
      // start: '2022-07-01',
      // end: '2022-07-31	',
      list: [],
      collectType: 1, // 按月统计 销售
      OrderCount: 0, // 销售统计 总数量
      taskCount: [], // 工单统计
      money: 0, // 销售总额
      changeStyle: 'week',
      saleNumoption: {}, // 获取销售数据趋势
      saleTotaloption: {}, // 销售额分布
      partneroption: {}, // 合作商点位
      partnerList: [] // 合作商列表
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
    },
    nodeCount() { // 点位数
      return this.partnerList.reduce((per, cur) => {
        return per + cur.value
      }, 0)
    },
    partnerCount() { // 合作商总数
      return this.partnerList.length
    }
  },
  created() {
    this.getBussinessTop()
    this.getAmountCollect()
    this.getOrderCount()
    this.getTaskReportInfo()
    this.getMoney()
    this.getSaleTotal()
    this.getPartner()
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
    // 获取销售数据趋势
    async getAmountCollect() {
      try {
        const res = await getAmountCollect(this.collectType, this.start, this.end)
        // console.log(res.data)
        const dateArr = res.data.series.map(item => {
          return parseInt((item / 100))
        })
        // console.log(dateArr)
        const option = {
          title: {
            text: '销售额趋势图',
            left: 'center'
          },
          grid: {
            left: '2%',
            containLabel: true
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日']
          },
          yAxis: {
            type: 'value'
          },
          series: [
            {
              data: dateArr,
              type: 'line',
              smooth: true,
              symbol: 'circle',
              itemStyle: {
                color: 'white',
                borderColor: 'red'
              },
              lineStyle: {
                color: 'red'
              },
              areaStyle: {
                color: {
                  type: 'linear',
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [{ // 渐变颜色
                    offset: 0,
                    color: 'rgba(234,151,27,0.52)'
                  },
                  {
                    offset: 1,
                    color: 'rgba(230,162,60,0.09)'
                  }],
                  global: false
                }
              }
            }
          ]
        }
        this.saleNumoption = option
      } catch (e) {
        console.log(e)
      }
    },
    //  获取销售额分布
    async getSaleTotal() {
      const res = await getSaleTotal(this.start, this.end)
      // console.log(res)
      const option = {
        title: {
          text: '销售额分布图',
          left: 'center'
        },
        grid: {
          left: '2%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: res.data.xAxis
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            data: res.data.series,
            type: 'bar',
            itemStyle: {
              borderRadius: [11, 11, 0, 0]
            },
            barWidth: 16
          }
        ]
      }
      this.saleTotaloption = option
    },
    // 获取合作商
    async getPartner() {
      const res = await getTogetherPartner()
      // console.log('partner', res.data)
      this.partnerList = res.data
      console.log(this.partnerList)
      const date = res.data.map(item => { return { name: item['name'], value: item['value'] } })
      // console.log(date)
      const option = {
        legend: {
          top: 'bottom'
        },
        toolbox: {
          show: true
        },
        series: [
          {
            name: 'Nightingale Chart',
            type: 'pie',
            radius: [50, 100],
            center: ['50%', '50%'],
            roseType: 'area',
            itemStyle: {
              borderRadius: 0
            },
            data: date
          }
        ]
      }
      this.partneroption = option
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
    },
    // 改变点击年月日的样式
    changeDates(val) {
      this.changeStyle = val
    },
    // 获取当前日期的周一
    getCurrentWeekMondadyDate() {
      const currentTimeStamp = new Date().getTime() // 获取当天的时间戳
      const currentWeek = new Date().getDay() === 0 ? 7 : new Date().getDay() // 因为星期天在js里返回的是 0 所以要给他弄成7
      const daysApartCount = currentWeek - 1 // 用今天星期几 - 1  就得出了 今天星期几 离 当前星期的星期一有多少天
      const timeStampOfOneDay = 24 * 60 * 60 * 1000 // 计算 一天的时间戳  一共有多少毫秒
      const countTimeStamp = daysApartCount * timeStampOfOneDay // 用相隔的天数 乘 一天的时间戳（毫秒）得出相隔的天的毫秒
      const date = new Date(currentTimeStamp - countTimeStamp) // 最后 拿当日的时间戳（毫秒）减去 相隔天数的时间戳（毫秒），放进
      // new Date 里 他会自动识别时间戳 所对应的 日期

      return {
        // 从而得到 一系列的参数
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: date.getDate()
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

    .week-month-year  {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 129px;
      height: 34px;
      background: rgba(233,243,255,.37);
      border-radius: 10px;

     .item{
       display: flex;
       align-items: center;
       justify-content: center;
       width: 37px;
       height: 25px;
       font-size: 14px;
       color: #9ca3b4;
       cursor: pointer;
     }

     .isChecked{
        background: #fff;
        -webkit-box-shadow: 0 0 4px 0 rgb(0 0 0 / 11%);
        box-shadow: 0 0 4px 0rgba(0,0,0,.11);
        border-radius: 7px;
        font-weight: 600;
        color: #333;
     }
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
    display: flex;
    justify-content: space-between;

    .dian {
      width: 17px;
      height: 17px;
      color: #5f84ff;
      cursor: pointer;
      border: 1px solid #5f84ff;
      border-radius: 50%;
      text-align: center;
      line-height: 14px;
    }
    }
    .collect {
      width: 154px;
      height: 230px;
      padding-top: 47px;
      padding-left: 38px;
      background: linear-gradient(135deg,transparent,#f8f8f9 0) 0 0,linear-gradient(-135deg,transparent 12px,#f8f8f9 0) 100% 0,linear-gradient(-45deg,transparent,#f8f8f9 0) 100% 100%,linear-gradient(45deg,transparent 12px,#f8f8f9 0) 0 100%;
      background-size: 50% 50%;
      background-repeat: no-repeat;

      .count{
      height: 33px;
      font-size: 24px;
      font-family: PingFangSC-Semibold,PingFang SC;
      font-weight: 600;
      color: #072074;
      line-height: 33px;
      }

      .count2 {
        margin-top: 20px;
      }
      .name {
       height: 17px;
       margin-top: 6px;
       font-size: 12px;
       font-family: PingFangSC-Regular,PingFang SC;
       font-weight: 400;
       color: #000412;
       line-height: 17px;
      }

    }
    .main {
      display: flex;
      height: 260px;
      flex-direction: column;
      align-items: center;
      justify-content: center;

      .no {
        margin-top: 25px;
        color: #20232a;
        font-size: 14px;
      }
    }
  }
}

</style>
 <style lang="scss">
 .dashboard-container{
  margin: 0px;
 }
 </style>
