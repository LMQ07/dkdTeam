<template>
  <el-dialog
    title="设备详情"
    :visible.sync="dialogVisible"
    width="630px"
    :before-close="handleClose"
  >
    <div class="top">
      <div>
        销售量：<span>{{ getSaleNum }}个</span>
      </div>
      <div>
        销售额：<span>{{ getSumSale }}万元</span>
      </div>
      <div>
        补货次数：<span>{{ addTimes }}次</span>
      </div>
      <div>
        维修次数：<span>{{ repairTimes }}次</span>
      </div>
    </div>
    <div class="bottom">
      <p class="title">商品销量（月）</p>
    </div>
  </el-dialog>
</template>

<script>
import { getTime, currmonthStarttime } from '@/utils/time'
import { getSaleMQ, getCaptureMQ, getRepairNumMQ, getGoodsNumMQ, getSalaryMQ } from '@/api/vm'
export default {
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    rowDetail: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      end: getTime(),
      start: currmonthStarttime(),
      addTimes: 0,
      repairTimes: 1,
      saleList: [],
      getSumSale: 0,
      getSaleNum: 0
    }
  },
  computed: {
    id() {
      return this.rowDetail.innerCode
    }
  },
  methods: {
    handleClose() {
      this.$parent.detailShow = false
    },
    async getDate() {
      // 补货次数
      const res = await getCaptureMQ(this.id, this.start, this.end)
      this.addTimes = res.data
      // 售货机维修次数
      const res1 = await getRepairNumMQ(this.id, this.start, this.end)
      this.repairTimes = res1.data
      // 获取商品销量
      const res2 = await getGoodsNumMQ(this.id, this.start, this.end)
      this.saleList = res2.data
      console.log(res2)
      // 获取销售额度
      const res3 = await getSalaryMQ({
        start: `${this.start} 00:00:00`,
        // start: '+',
        end: `${this.end} 23:59:59`,
        innerCode: this.id
      })
      this.getSumSale = (res3.data / 10000).toFixed(2)
      // 获取销售量 getSaleNum
      const res4 = await getSaleMQ(
        { start: `${this.start} 00:00:00`,
          // start: '+',
          end: `${this.end} 23:59:59`, innerCode: this.id
        })
      this.getSaleNum = res4.data
    }
  }
}
</script>

<style lang="scss" scoped>
.top{
    height: 54px;
    background: rgba(227,233,245,.39);
    text-align: center;
    line-height: 54px;
    display: flex;
    div{
      flex:1;
      span {
        color: #5f84ff;
      }
    }
}
.bottom {
  .title{
    margin: 20px 0 12px 6px;
  }
}
</style>
