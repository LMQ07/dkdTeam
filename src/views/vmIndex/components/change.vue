<template>
  <el-dialog
    title="修改设备"
    :visible.sync="dialogVisible"
    width="30%"
    :before-close="handleClose"
    :model="form"
  >
    <el-form>
      <el-form-item label="机器编号:"><span>{{ rowDetail.innerCode }}</span></el-form-item>
      <el-form-item label="供货时间:"><span>{{ rowDetail.lastSupplyTime }}</span></el-form-item>
      <el-form-item label="设备类型:"><span>{{ rowDetail.type&&rowDetail.type.name }}</span></el-form-item>
      <el-form-item label="设备容量:"><span>{{ rowDetail.type&&rowDetail.type.channelMaxCapacity }}</span></el-form-item>
      <el-form-item label="设备点位:">
        <el-select v-model="form.nodeId" @change="getId">
          <el-option v-for="item,index in nodeList" :key="index" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="合作商:"><span>{{ rowDetail.ownerName }}</span></el-form-item>
      <el-form-item label="所属区域:"><span>{{ rowDetail.node&& rowDetail.node.region &&rowDetail.node.region.name }}</span></el-form-item>
      <el-form-item label="设备地址:"><span>{{ rowDetail.node&& rowDetail.node.addr }}</span></el-form-item>
      <el-form-item class="btn-change-MQ">
        <el-button class="cancel" @click="handleClose">取消</el-button>
        <el-button type="primary" class="confirm" @click="submit">确认</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import { getNodeList, changeNode } from '@/api/vm'
export default {
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    rowDetail: {
      type: Object,
      default: () => [{}]
    }
  },
  data() {
    return {
      nodeList: [],
      createUserId: '',
      form: {
        nodeId: ''
      }
    }
  },
  watch: {
    rowDetail(val) {
      console.log(val)
      this.form.nodeId = val.node.id
    }
  },
  mounted() {
    this.getNodeList()
  },
  methods: {
    handleClose() {
      this.$parent.changeShow = false
    },
    // 获取点位列表
    async getNodeList() {
      const res = await getNodeList({
        pageIndex: 1,
        pageSize: 10000
      })
      console.log(res)
      this.nodeList = res.data.currentPageRecords
    },
    // id修改了一下
    getId(val) {
      this.form.nodeId = val
      this.createUserId = this.nodeList.filter(item => { if (item.id === val) { return item } })[0].createUserId
      // console.log(this.createUserId)
    },
    async submit() {
      try {
        const res = await changeNode(this.rowDetail.id, this.form.nodeId)
        console.log(res)
        this.handleClose()
        this.$parent.getDate()
      } catch (e) {
        console.log(e)
      }
    }
  }

}
</script>

<style lang="scss">
.btn-change-MQ{
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
