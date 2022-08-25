<template>
  <div>
    <el-table
      :data="tableDate"
      style="width: 100%"
      class="mq-table"
    >
      <el-table-column
        v-if="isShowIndex"
        type="index"
        label="序号"
      />
      <el-table-column
        v-for="item, index in thead"
        :key="index"
        :prop="item.prop"
        :label="item.label"
      />
      <el-table-column v-if="isShowDone" :label="done">
        <template v-slot="{row}">
          <div class="detail">
            <slot :row="row" />
          </div>
        </template>
      </el-table-column>
      <el-table-column
        v-if="tableDate.length === 0"
      >暂无数据</el-table-column>
    </el-table>
    <div v-if="tableDate.length !== 0 && isShowPage" class="page">
      <div>
        <span>共{{ totalCount }}条记录</span>
        <span>  第{{ pageIndex }}/{{ totalPage }}页</span>
      </div>
      <div>
        <el-button :disabled="pageIndex===1" size="small" @click="changePage(0)">上一页</el-button>
        <el-button :disabled="pageIndex==totalPage" size="small" @click="changePage(1)">下一页</el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    thead: {
      type: Array,
      default: () => []
    },
    tableDate: {
      type: Array,
      default: () => []
    },
    totalCount: {
      type: [String, Number],
      default: 0
    },
    pageIndex: {
      type: Number,
      default: 1
    },
    totalPage: {
      type: [String, Number],
      default: 1
    },
    isShowDone: {
      type: Boolean,
      default: true
    },
    isShowPage: {
      type: Boolean,
      default: true
    },
    isShowIndex: {
      type: Boolean,
      default: true
    },
    done: {
      type: String,
      default: '操作'
    }
  },
  data() {
    return {
      tableData: [{
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-04',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1517 弄'
      }, {
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1519 弄'
      }, {
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1516 弄'
      }]
    }
  },
  methods: {
    changePage(val) {
      this.$emit('changePageIndex', val)
    }
  }
}
</script>

<style scoped lang="scss">
.page{
  display: flex;
  padding: 20px;
  justify-content: space-between;
  align-items: center;
  span{
    font-size: 16px!important;
    color: #dbdfe5!important;
  }
  .el-button{
    background-color: #d5ddf8;
  }
}
::v-deep .el-table td {
  border: none;
}
</style>
