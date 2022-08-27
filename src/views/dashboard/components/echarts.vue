<template>
  <div id="main" ref="main">
    <!-- 123 -->
  </div>
</template>

<script>
import * as echarts from 'echarts'
export default {
  props: {
    option: {
      type: Object,
      require: true,
      default: () => ({})
    }
  },
  watch: {
    option: {
      deep: true,
      immediate: true,
      handler(option) {
        // console.log('234')
        this.myChart?.setOption(option)
      }
    }
  },
  mounted() {
    // 基于准备好的dom，初始化echarts实例
    // console.log(document.getElementById('main'))
    this.myChart = echarts.init(this.$refs.main)
    // this.$nextTick(() => {
    //   this.myChart.setOption(this.option)
    // })
  },
  methods: {
  }
}
</script>

<style scoped>
#main{
  width:100%;
  height: 278px;
}
</style>
