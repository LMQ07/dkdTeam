<template>
  <div class="dashboard-container">
    <div class="search">
      <search label="设备编号" @search="searchByInnerCode" />
    </div>
    <div class="result">
      <div style="margin-bottom:20px">
        <VmButton @click="setShowCheckAll" @show="isShowNewAdd= true" />
      </div>
      <Table
        :show-box="true"
        :thead="thead"
        :table-date="tableDate"
        :total-count="totalCount"
        :page-index="pageIndex"
        :total-page="totalPage"
        :is-checked="isCheck"
        @click="changeIndex"
        @change="doneAll"
      >

        <!-- <template v-slot:img="{row}">
          <el-avatar src="https://pics3.baidu.com/feed/cf1b9d16fdfaaf51055aeb850e4a2de7f01f7a73.jpeg?token=13a989ae26c8c26689240bf4a3c776a0" />
        </template> -->
        <template v-slot:action="{row}">
          <el-button type="text" @click="showGoodsRoad(row)">
            货道
          </el-button>
          <el-button type="text" @click="setOneRow(row)">
            策略
          </el-button>
          <el-button type="text" @click="showDialog(row)">
            修改
          </el-button>
        </template>
      </Table>
    </div>
    <setAllCheck :dialog-visible="isShowCheckAll" @submit="changeCheckWay" />
    <addNew :dialog-visible="isShowNewAdd" />
    <change :dialog-visible="changeShow" :row-detail="changeRow" />
    <showStragory :dialog-visible="showAction" :current-stragory="currentStragory" />
    <goodsRoad :road-number="roadNumber" :goods-road-list="goodsRoadList" :dialog-visible.sync="showRoad" />
  </div>
</template>

<script>
import { getVmIndexMsg, submitPolicy, getStragory, getGoodsRoad, getRoadNumber } from '@/api/vm'
import setAllCheck from './components/setAllCheck.vue'
import addNew from './components/addNew.vue'
import change from './components/change.vue'
import showStragory from './components/showStragory.vue'
import goodsRoad from './components/goodsRoad.vue'

export default {
  components: {
    setAllCheck,
    addNew,
    change,
    showStragory,
    goodsRoad
  },
  data() {
    return {
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      totalCount: 0,
      tableDate: [],
      checkItemList: [],
      isCheck: true,
      thead: [
        { label: '设备编号', prop: 'innerCode' },
        { label: '设备型号', prop: 'type.name' },
        { label: '详细地址', prop: 'node.addr' },
        { label: '合作商', prop: 'ownerName' },
        { label: '设备状态', prop: 'vmStatus' },
        // { label: '图片', prop: 'img', slotName: 'img' },
        { label: '操作', prop: 'action', slotName: 'action' }
      ],
      isShowCheckAll: false,
      isShowNewAdd: false,
      AllorOne: 1,
      innerCodeList: [],
      changeShow: false,
      changeRow: {},
      showAction: false,
      showRoad: false,
      currentStragory: {},
      goodsRoadList: [],
      roadNumber: {}
    }
  },
  computed: {
    // 如果说没有勾选的话 那么批量操作的弹框就不可以出来
    isChecked() {
      return this.checkItemList.length === 0
    }
  },
  mounted() {
    this.getDate()
  },
  methods: {
    getDate() {
      this.getVmIndexDate({
        pageIndex: this.pageIndex,
        pageSize: this.pageSize
      })
    },
    searchByInnerCode(value) {
      this.pageIndex = 1
      this.getVmIndexDate({
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
        innerCode: value
      })
    },
    async getVmIndexDate(obj) {
      const { data } = await getVmIndexMsg(obj)
      const statusObj = {
        0: '未投放',
        1: '运营',
        3: '撤机'
      }
      // 处理好数据
      data.currentPageRecords.forEach((element) => {
        element.node.addr = element.node.addr.split('-')[3]
        element.vmStatus = statusObj[element.vmStatus]
      })
      this.tableDate = data.currentPageRecords
      this.totalCount = data.totalCount
      this.totalPage = data.totalPage
      console.log(this.tableDate)
    },
    // 点击页面
    changeIndex(val) {
      if (val === 0) {
        this.pageIndex -= 1
        this.getVmIndexDate({
          pageIndex: this.pageIndex,
          pageSize: this.pageSize
        })
      } else {
        this.pageIndex += 1
        this.getVmIndexDate(
          {
            pageIndex: this.pageIndex,
            pageSize: this.pageSize
          }
        )
      }
    },
    // 批量操作
    doneAll(val) {
      // val就是选中的数组是哪些 哪些需要批量操作
      this.checkItemList = val.map(item => item.innerCode)
      console.log(this.checkItemList)
      this.getVmIndexDate({
        pageIndex: this.pageIndex,
        pageSize: this.pageSize
      })
    },
    // 是否展示
    setShowCheckAll() {
      this.isCheck = true
      // console.log(this.isChecked)
      if (this.isChecked) {
        this.$message({
          showClose: true,
          message: '请勾选售货机',
          type: 'warning'
        })
      } else {
        // 有勾选的时候就直接跳出来了
        this.isShowCheckAll = true
      }
    },
    // 修改策略请求
    async changeCheckWay(id) {
      if (this.AllorOne === 1) {
        await submitPolicy({
          innerCodeList: this.checkItemList,
          policyId: id
        })
        this.$message.success('修改策略成功')
        this.isCheck = false
        this.getVmIndexDate({
          pageIndex: this.pageIndex,
          pageSize: this.pageSize
        })
      } else {
        await submitPolicy({
          innerCodeList: this.innerCodeList,
          policyId: id
        })
        this.$message.success('修改策略成功')
        this.isCheck = false
        this.getVmIndexDate({
          pageIndex: this.pageIndex,
          pageSize: this.pageSize
        })
      }
    },
    async setOneRow(row) {
      const { data } = await getStragory(row.row.innerCode)
      console.log(data)
      if (data && data.policyName) {
        this.showAction = true
        this.currentStragory = data
      } else {
        this.isShowCheckAll = true
        this.AllorOne = 2
        this.innerCodeList.push(row.row.innerCode)
      }
    },
    showDialog(row) {
      this.changeShow = true
      this.changeRow = row.row
      console.log(row.row)
    },
    async showGoodsRoad({ row }) {
      this.showRoad = true
      this.getRoadNumber(row)
      const res = await getGoodsRoad(row.innerCode)
      this.goodsRoadList = res.data
    },
    async getRoadNumber(row) {
      console.log(row)
      const res = await getRoadNumber(row.type && row.type.typeId)
      this.roadNumber = res.data
      console.log(res)
    }
  }
}
</script>

<style lang="scss" scoped>
.search {
  display: flex;
  align-items: center;
  height: 64px;
  margin-bottom: 20px;
  padding-left: 17px;
  background-color: #fff;
}

.result {
  padding: 20px 15px 19px 17px;
  background-color: #fff;
}

.detail {
  span {
    color: #5f84ff;
  }
}
</style>
