<template>
  <div class="dashboard-container">
    <div class="dashboard-text">
      <el-row style="margin-left: -10px; margin-right: -10px;">
        <el-col class="left" :span="12" style="padding-left: 10px; padding-right: 10px;">
          <!-- 运营人员 -->
          <div class="leftStatistics">
            <div class="header">
              <div class="title">运营人员(当天)</div>
            </div>
            <div class="body">
              <el-row>
                <el-col :span="6">
                  <div class="num">{{ yunying. total }}</div>
                  <div class="text">工单总数（个）</div>
                </el-col>
                <el-col :span="6">
                  <div class="num">{{ yunying .completedTotal }}</div>
                  <div class="text">完成工单（个）</div>
                </el-col>
                <el-col :span="6">
                  <div class="num">{{ yunying.cancelTotal }}</div>
                  <div class="text">拒绝工单（个）</div>
                </el-col>
                <el-col :span="6">
                  <div class="num">{{ yunying.workerCount }}</div>
                  <div class="text">运营人员数（个）</div>
                </el-col>
              </el-row>
            </div>
          </div>
        </el-col>
        <!-- 运维人员 -->
        <el-col :span="12" style="padding-left: 10px; padding-right: 10px;">
          <div class="rightStatistics">
            <div class="header">
              <div class="title">运维人员(当天)</div>
            </div>
            <div class="body">
              <el-row>
                <el-col :span="6">
                  <div class="num">{{ yunwei.total }}</div>
                  <div class="text">工单总数（个）</div>
                </el-col>
                <el-col :span="6">
                  <div class="num">{{ yunwei.completedTotal }}</div>
                  <div class="text">完成工单（个）</div>
                </el-col>
                <el-col :span="6">
                  <div class="num">{{ yunwei.cancelTotal }}</div>
                  <div class="text">拒绝工单（个）</div>
                </el-col>
                <el-col :span="6">
                  <div class="num">{{ yunwei.workerCount }}</div>
                  <div class="text">运维人员数（个）</div>
                </el-col>
              </el-row>
            </div>
          </div>
        </el-col>
      </el-row>
      <el-row style="margin-left: -10px; margin-right: -10px;">
        <el-col :span="18" style="padding-left: 10px; padding-right: 10px;">
          <!-- 工单状态 -->
          <div class="box user-task-status">
            <div class="header">
              <div class="title">工单状态</div>
              <el-date-picker
                v-model="formInline.value1"
                type="daterange"
                align="right"
                unlink-panels
                range-separator="~"
                size="mini"
                @change="dateChange(formInline.value1)"
              />
              <div class="week-month-year">
                <div :class="['item',{isChecked:changeStyle === 'day'}]" @click="changeDates('day')">日</div>
                <div :class="['item',{isChecked:changeStyle === 'month'}]" @click="changeDates('month')">月</div>
                <div :class="['item',{isChecked:changeStyle === 'year'}]" @click="changeDates('year')">年</div>
              </div>
            </div>
            <div class="main">
              <img src="@/assets/images/404.png" alt="">
              <span class="no">暂无数据</span>
            </div>
          </div>
        </el-col>
        <!-- 人效排名 -->
        <el-col :span="6" style="padding-left: 10px; padding-right: 10px;">
          <div class="box user-task-rank">
            <div class="header">
              <div class="title">人效排名（月度）</div>
              <el-select v-model="vale" placeholder="全部" size="small">
                <el-option
                  v-for="item in regionList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </div>
            <div class="role-group">
              <div class="role-list">
                <div :class="['item',{isChecked:changeStyle1 === 'yy'}]" @click="changeList('yy')">运营人员</div>
                <div :class="['item',{isChecked:changeStyle1 === 'yw'}]" @click="changeList('yw')">运维人员</div>
              </div>
              <div class="main">
                <img src="@/assets/images/404.png" alt="">
                <span class="no">暂无数据</span>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { getTaskReportInfo, getCollectReport, getRegionList } from '@/api/user'
import { getTime, currmonthStarttime } from '@/utils/time'
export default {
  data() {
    return {
      yunying: {},
      yunwei: {},
      changeStyle: 'day',
      changeStyle1: 'yy',
      // value2: '2022.8.30'
      formInline: {
        value1: this.getDateTime() // methods优先级高于data  (props==>methods==>data==>computed==>watch)
      },
      changeStart: '',
      changeEnd: '',
      pageIndex: 1,
      pageSize: 100000,
      regionList: [], // 区域列表
      vale: '全部'
    }
  },
  computed: {
    start() {
      return `${getTime(new Date())} 00:00:00`
    },
    end() {
      return `${getTime(new Date())} 23:59:59`
    }
  },
  created() {
    this.getTaskReportInfo()
    this.getRegionList()
  },
  methods: {
    async getTaskReportInfo() {
      try {
        const res = await getTaskReportInfo(this.start, this.end)
        // console.log(res)
        res.data.forEach(ele => {
          if (ele.repair) {
            this.yunwei = ele
          } else {
            this.yunying = ele
          }
        })
        // console.log(this.yunying)
        // console.log(this.yunwei)
      } catch (e) {
        console.log(e)
      }
    },
    // 改变点击年月日的样式
    changeDates(val) {
      this.changeStyle = val
      if (val === 'day') {
        this.formInline.value1 = this.getDateTime()
      }
      if (val === 'month') {
        const res = currmonthStarttime(new Date())
        this.formInline.value1 = [res, getTime(new Date())]
      }
    },
    getDateTime() {
      // console.log([new Date(new Date().getTime() - 3600 * 1000 * 24 * 1).getTime(), new Date().getTime()])
      return [new Date(new Date().getTime() - 3600 * 1000 * 24 * 1).getTime(), new Date().getTime()]
    },
    async  dateChange(val) {
      // console.log(val)
      this.changeStart = this.vertDate(val[0])
      this.changeEnd = this.vertDate(val[1])
      // console.log(this.changeStart, this.changeEnd)
      try {
        const res = await getCollectReport(this.changeStart, this.changeEnd)
        console.log(res)
      } catch (e) {
        console.log(e)
      }
    },
    vertDate(obj) {
    // 日期转yyyy-MM-dd
      var date = new Date(obj)
      var y = 1900 + date.getYear()
      var m = '0' + (date.getMonth() + 1)
      var d = '0' + date.getDate()
      return y + '-' + m.substring(m.length - 2, m.length) + '-' + d.substring(d.length - 2, d.length)
    },
    // 获取区域列表
    async  getRegionList() {
      try {
        const { data } = await getRegionList({
          pageIndex: this.pageIndex,
          pageSize: this.pageSize
        })
        // console.log(data)
        this.regionList = data.currentPageRecords
      } catch (e) {
        console.log(e)
      }
    },
    changeList(val) {
      this.changeStyle1 = val
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

    }

  // 工单统计
  .leftStatistics {
    padding: 0px 20px 20px;
    min-height: 166px;
    border-radius: 20px;
    background: #e9f3ff;
    background-image:  url('~@/assets/images/gongdan1.png'), url('~@/assets/images/car.png');
    background-repeat: no-repeat, no-repeat;
    background-position: 0 0,calc(100% - 13px) 100%;

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
     background: #fbefe8 url('~@/assets/images/spanner.png') no-repeat  right bottom;
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

 .box {
    padding: 20px;
    border-radius: 20px;
  }
 // 工单统计
 .user-task-status {
    display: flex;
    // -webkit-box-orient: vertical;
    // -webkit-box-direction: normal;
    flex-direction: column;
    height: calc(75vh - 90px);
    min-height: 542px;
    margin-top: 20px;
    background: #fff;

    .header {
      display: flex;
      .title {
         align-items: center;
         flex: 1;
         font-size: 16px;
         font-family: PingFangSC-Semibold,PingFang SC;
         font-weight: 600;
         color: #333;
      }

      .el-date-editor--daterange.el-input__inner {
        width: 230px;
        margin-right: 21px;
        // height: 32px;
      }

    }
  }
// 人效排名
.user-task-rank {
    display: flex;
    flex-direction: column;
    height: calc(75vh - 90px);
    min-height: 542px;
    margin-top: 20px;
    background: #fff;
}
.week-month-year {
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
.main{
      display: flex;
      height: 260px;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      img {
        margin-top: 120px;
      }

      .no {
        margin-top: 25px;
        color: #20232a;
        font-size: 14px;
      }
}

    .user-task-rank {
      display: flex;
    // -webkit-box-orient: vertical;
    // -webkit-box-direction: normal;
    flex-direction: column;
    height: calc(75vh - 90px);
    min-height: 542px;
    margin-top: 20px;
    background: #fff;
    .header {
      display: flex;
      .title {
         align-items: center;
         flex: 1;
         font-size: 16px;
         font-family: PingFangSC-Semibold,PingFang SC;
         font-weight: 600;
         color: #333;
      }

      .el-select {
       display: inline-block;
       position: relative;
       width: 94px;
       margin-right: 21px;
      }
    }
  }

 .role-group {
   width: 177px;
   margin: 15px auto 0;
    .role-list {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 34px;
     background: rgba(233,243,255,.37);
     border-radius: 10px;

     .item{
      width: 78px;
      height: 25px;
      font-size: 14px;
      color: #9ca3b4;
      cursor: pointer;
      display: flex;
      justify-content: center;
      align-items: center;
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
 }
}

</style>
