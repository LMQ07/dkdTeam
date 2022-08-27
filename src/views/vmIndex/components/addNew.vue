<template>
  <el-dialog
    title="新增设备"
    :visible.sync="dialogVisible"
    width="30%"
    :before-close="handleClose"
  >
    <el-form ref="form" label-width="90px" :model="form">
      <el-form-item prop="code" label="设备编号:">
        <span>系统自动生成</span>
      </el-form-item>
      <el-form-item prop="vmType" label="选择型号:" :rules="[{required:true, message:'请选择',trigger:'change'}]">
        <el-select v-model="form.vmType" placeholder="请选择" @focus="getVmType" @change="gettypeId">
          <el-option v-for="item,index in vmTypeList" :key="index" :label="item.name" :value="item.typeId" />
        </el-select>
      </el-form-item>
      <el-form-item prop="nodeId" label="选择点位:" :rules="[{required:true, message:'请选择',trigger:'change'}]">
        <el-select v-model="form.nodeId" placeholder="请选择" @focus="getNodeList" @change="getId">
          <el-option v-for="item,index in nodeList" :key="index" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button class="cancel" @click="handleClose">取消</el-button>
        <el-button type="primary" class="confirm" @click="submit">确认</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import { getVmType, getNodeList, getVmIndexMsg } from '@/api/vm'
export default {
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      form: {
        nodeId: '',
        vmType: '',
        createUserId: ''
      },
      vmTypeList: [],
      nodeList: []
    }
  },
  methods: {
    handleClose() {
      this.$parent.isShowNewAdd = false
      this.$refs.form.resetFields()
      this.form = {
        nodeId: '',
        vmType: '',
        createUserId: ''
      }
    },
    async getVmType() {
      const res = await getVmType({
        pageIndex: 1,
        pageSize: 10000
      })
      console.log(res)
      this.vmTypeList = res.data.currentPageRecords
    },
    async getNodeList() {
      const res = await getNodeList({
        pageIndex: 1,
        pageSize: 10000
      })
      console.log(res)
      this.nodeList = res.data.currentPageRecords
    },
    gettypeId(val) {
      this.form.vmType = val
    },
    getId(val) {
      this.form.nodeId = val
      this.createUserId = this.nodeList.filter(item => { if (item.id === val) { return item } })[0].createUserId
      // console.log(this.createUserId)
    },
    // 确认的时候需要的操作
    async submit() {
      try {
        await this.$refs.form.validate()
        const res = await getVmIndexMsg({ pageIndex: 1, pageSize: 10 })
        console.log(res)
      } catch (e) {
        console.log(e)
        console.log(2)
      }
    }

  }
}
</script>

<style>

</style>
