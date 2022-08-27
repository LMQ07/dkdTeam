<template>
  <el-dialog
    title="批量策略管理"
    :visible.sync="dialogVisible"
    width="30%"
    :before-close="handleClose"
  >
    <el-form ref="form" label-width="80px" :module="form">

      <el-form-item label="选择策略">
        <el-select v-model="form.policyId" placeholder="请选择" @focus="getWay" @change="change">
          <el-option v-for="item,index in wayList" :key="index" :label="item.policyName" :value="item.policyId" />
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
import { getPolicy } from '@/api/vm'
export default {
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      wayList: [],
      form: {
        policyId: ''
      }
    }
  },
  methods: {
    handleClose() {
      this.$parent.isShowCheckAll = false
      this.form.policyId = ''
      this.$parent.isCheck = false
    },
    async getWay() {
      const res = await getPolicy()
      console.log(res)
      this.wayList = res.data
    },
    change(val) {
      this.form.policyId = val
    },
    submit() {
      this.$emit('submit', this.form.policyId)
      this.handleClose()
    }
  }
}
</script>

<style lang="scss">
.cancel{
      width: 80px!important;
    height: 36px;
    padding: 0;
    background-color: #fbf4f0!important;
    border: none;
    color: #655b56!important;
}
.confirm{
  width: 80px!important;
    height: 36px;
    padding: 0;
    background: linear-gradient(135deg,#ff9743,#ff5e20)!important;
    border: none;
}
.el-select{
  width: 80%;
}
</style>
