<template>
  <div>
    <el-row>
      <el-col :span="12" class="left">
        <span class="title">日销售统计</span>
        <div class="data">
          <span>
            <div class="number">{{ todaySale }}</div>
            <div class="text">当日销售量（个）</div>
          </span>
          <span>
            <div class="number">{{ todayAmount }}</div>
            <div class="text">当日销售额（元）</div>
          </span>
          <span>
            <div class="number">{{ todayBill }}</div>
            <div class="text">当日分成（元）</div>
          </span>
        </div>
      </el-col>
      <el-col :span="12" class="right">
        <span class="title">月销售统计</span>
        <div class="data">
          <span>
            <div class="number">{{ monthSale }}</div>
            <div class="text">当月销售量（个）</div>
          </span>
          <span>
            <div class="number">{{ monthAmount }}</div>
            <div class="text">当月销售额（元）</div>
          </span>
          <span>
            <div class="number">{{ monthBill }}</div>
            <div class="text">当月分成（元）</div>
          </span>
        </div>
      </el-col>
    </el-row>
    <el-row class="body">
      <el-row class="search">
        <span>
          <span style="margin-right: 10px">合作商：</span>
          <el-select v-model="cooperation" clearable placeholder="请选择">
            <el-option
              v-for="item in partnerList"
              :key="item.id"
              :label="item.name"
              :value="item.name"
            >
            </el-option>
          </el-select>
        </span>
        <span style="margin-right: 20px">
          <span style="margin: 0 10px">日期：</span>
          <el-date-picker
            v-model="date"
            type="daterange"
            range-separator="~"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          >
          </el-date-picker>
        </span>
        <el-button type="primary" @click="search">查询</el-button>
      </el-row>
      <el-row class="info">
        <span class="label">笔数统计：</span>
        <span class="value">{{ count }}</span
        ><span class="unit">个</span>
        <span class="label">收入统计：</span>
        <span class="value">{{ amount }}</span
        ><span class="unit">元</span>
        <span class="label">分成统计：</span>
        <span class="value">{{ bill }}</span
        ><span class="unit">元</span>
      </el-row>
      <el-row>
        <MyTable
          :isShowIndex="false"
          :thead="dataLabel"
          :tableDate="list"
          :totalCount="totalCount"
          :pageIndex="pageIndex"
          :totalPage="totalPage"
          @click="changePage"
        >
          <template #ratio="{ row }">
            {{ row.row.ratio + "%" }}
          </template>
          <template #orderTotalMoney="{ row }">
            {{ "+" + row.row.orderTotalMoney / 100 }}
          </template>
          <template #totalBill="{ row }">
            {{ "+" + row.row.totalBill / 100 }}
          </template>
        </MyTable>
      </el-row>
    </el-row>
  </div>
</template>

<script>
import {
  getOrderCount,
  getOrderAmount,
  getOrdertotalBill,
  getPartnerCollect,
  searchPartner,
} from "@/api/report";
import MyTable from "@/components/Table";
import moment from "moment";
export default {
  data() {
    return {
      startTime: new Date(new Date(new Date().toLocaleDateString()).getTime()),
      endTime: new Date(
        new Date(new Date().toLocaleDateString()).getTime() +
          24 * 60 * 60 * 1000 -
          1
      ),
      mStartTime: this.getStartDay() + " 00:00:00",
      mEndTime: this.getLastDay() + " 23:59:59",
      todaySale: "",
      monthSale: "",
      todayAmount: "",
      monthAmount: "",
      todayBill: "",
      monthBill: "",
      cooperation: "",
      date: [`${this.getStartDay()}`, `${this.getLastDay()}`],
      dataLabel: [
        { label: "订单日期", prop: "date" },
        { label: "合作商", prop: "ownerName" },
        { label: "分成比例", prop: "ratio", slotName: "ratio" },
        {
          label: "收入(元)",
          prop: "orderTotalMoney",
          slotName: "orderTotalMoney",
        },
        { label: "笔数", prop: "orderCount" },
        { label: "分成金额(元)", prop: "totalBill", slotName: "totalBill" },
      ],
      list: [],
      totalCount: "",
      totalPage: "",
      pageSize: 10,
      pageIndex: 1,
      partnerList: [],
      count: "",
      amount: "",
      bill: "",
    };
  },
  created() {
    this.getOrderCount();
    this.getOrderAmount();
    this.getOrdertotalBill();
    this.getPartnerCollect();
    this.searchPartner();
  },
  methods: {
    async getOrderCount() {
      const { data } = await getOrderCount({
        start: this.toDayStart,
        end: this.toDayEnd,
      });
      this.todaySale = data;
      const res = await getOrderCount({
        start: this.mStartTime,
        end: this.mEndTime,
      });
      this.monthSale = res.data;
    },
    async getOrderAmount() {
      const { data } = await getOrderAmount({
        start: this.toDayStart,
        end: this.toDayEnd,
      });
      this.todayAmount = data;
      const res = await getOrderAmount({
        start: this.mStartTime,
        end: this.mEndTime,
      });
      this.monthAmount = (res.data / 1000000).toFixed(2);
    },
    async getOrdertotalBill() {
      const { data } = await getOrdertotalBill({
        start: this.toDayStart,
        end: this.toDayEnd,
      });
      this.todayBill = data;
      const res = await getOrdertotalBill({
        start: this.mStartTime,
        end: this.mEndTime,
      });
      this.monthBill = res.data / 100;
    },
    async getPartnerCollect(
      start = this.searchTimeStart,
      end = this.searchTimeEnd,
      partnerName = ""
    ) {
      const { data } = await getPartnerCollect({
        start,
        end,
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
        partnerName,
      });
      this.totalCount = data.totalCount;
      this.totalPage = data.totalPage;
      this.list = data.currentPageRecords;
      console.log(data.currentPageRecords);
    },
    async searchPartner() {
      const { data } = await searchPartner({ pageSize: 500 });
      this.partnerList = data.currentPageRecords;
    },
    async search() {
      let id = "";
      if (this.cooperation) {
        id = this.partnerList.filter((item) => {
          return item.name == this.cooperation;
        })[0].id;
      }

      this.getPartnerCollect(
        this.searchTimeStart,
        this.searchTimeEnd,
        this.cooperation
      );
      //     getOrderCount,
      // getOrderAmount,
      // getOrdertotalBill,
      const res1 = await getOrderCount({
        start: this.searchTimeStart1,
        end: this.searchTimeEnd1,
        partnerId: id,
      });
      this.count = res1.data;
      const res2 = await getOrderAmount({
        start: this.searchTimeStart1,
        end: this.searchTimeEnd1,
        partnerId: id,
      });
      this.amount = res2.data / 100;
      const res3 = await getOrdertotalBill({
        start: this.searchTimeStart1,
        end: this.searchTimeEnd1,
        partnerId: id,
      });
      this.bill = res3.data / 100;
    },
    changePage(val) {
      if (val == 1) {
        this.pageIndex = +this.pageIndex + 1;
      } else {
        this.pageIndex = +this.pageIndex - 1;
      }
      this.getPartnerCollect();
    },
    getStartDay() {
      var y = new Date().getFullYear(); //获取年份
      var m = new Date().getMonth() + 1; //获取月份
      var d = "01";
      m = m < 10 ? "0" + m : m; //月份补 0

      return [y, m, d].join("-");
    },

    getLastDay() {
      var y = new Date().getFullYear(); //获取年份
      var m = new Date().getMonth() + 1; //获取月份
      var d = new Date(y, m, 0).getDate(); //获取当月最后一日
      m = m < 10 ? "0" + m : m; //月份补 0
      d = d < 10 ? "0" + d : d; //日数补 0

      return [y, m, d].join("-");
    },
  },
  computed: {
    toDayStart() {
      return moment(this.startTime).format("yyyy-MM-DD HH:mm:ss");
    },
    toDayEnd() {
      return moment(this.endTime).format("yyyy-MM-DD HH:mm:ss");
    },
    searchTimeStart() {
      return moment(this.date[0]).format("yyyy-MM-DD");
    },
    searchTimeEnd() {
      return moment(this.date[1]).format("yyyy-MM-DD");
    },
    searchTimeStart1() {
      return moment(this.date[0]).format("yyyy-MM-DD") + " 00:00:00";
    },
    searchTimeEnd1() {
      return moment(this.date[1]).format("yyyy-MM-DD") + " 23:59:59";
    },
  },
  components: {
    MyTable,
  },
};
</script>

<style lang="scss">
.left,
.right {
  width: 49%;
  height: 204.25px;
  padding: 20px;
  background-color: skyblue;
  border-radius: 20px;
  .title {
    font-size: 16px;
    font-family: PingFangSC-Semibold, PingFang SC;
    font-weight: 600;
    color: #333;
  }
  .data {
    display: flex;
    flex-direction: row;

    span {
      flex: 1;
      display: flex;
      flex-direction: column;
      height: 145.86px;
      align-items: center;
      justify-content: center;
      /* background-color: #fff; */
      .number {
        height: 50px;
        font-size: 36px;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
        line-height: 50px;
      }
      .text {
        height: 17px;
        margin-top: 3px;
        font-size: 12px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
      }
    }
  }
}
.left {
  margin-right: 10px;
  background: #e9f3ff;
  background-image: url(data:image/png;base64,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),
    url(http://likede2-admin.itheima.net/img/day.4272ef60.png);
  background-repeat: no-repeat, no-repeat;
  background-position: 0 0, calc(100% - 12px) 100%;
  .number {
    color: #072074;
    text-shadow: 2px 4px 7px rgb(85 132 255 / 50%);
  }
  .text {
    color: #91a7dc;
    line-height: 17px;
  }
}
.right {
  margin-left: 10px;
  background: #fbefe8
    url(http://likede2-admin.itheima.net/img/month.5c71f45f.png) no-repeat
    calc(100% - 12px) 100%;
  .number {
    color: #ff5757;
    text-shadow: 2px 4px 7px rgb(255 99 85 / 50%);
  }
  .text {
    color: #de9690;
    line-height: 17px;
  }
}

.body {
  background: #fff;
  margin-top: 20px;
  padding: 10px;
  .search {
    font-size: 14px;
    color: #606266;
    margin-bottom: 30px;
  }
  .info {
    .label {
      font-size: 14px !important;
      color: #333;
      font-weight: 500;
    }
    .value {
      font-size: 20px;
      color: #ff5757;
      font-weight: 500;
      margin: 0 10px;
    }
    .unit {
      margin-right: 50px;
    }
    margin-bottom: 20px;
  }
}
</style>
