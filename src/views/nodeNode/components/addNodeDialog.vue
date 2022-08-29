<template>
  <el-dialog :title="formDate.id ?'修改点位':'新增点位' " :visible.sync="dialogFormVisible" :before-close="handleClose">
    <el-form ref="formDate" :model="formDate" :rules="rules">
      <el-form-item label="点位名称：" :label-width="formLabelWidth" prop="name">
        <el-input
          v-model="formDate.name"
          placeholder="请输入"
          maxlength="15"
          show-word-limit
        />
      </el-form-item>
      <el-form-item label="所在区域：" :label-width="formLabelWidth" prop="regionId">
        <el-select v-model="formDate.regionId" placeholder="请选择">
          <el-option
            v-for="item in tableDate"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="所属商圈：" :label-width="formLabelWidth" prop="businessId">
        <el-select v-model="formDate.businessId" placeholder="请选择">
          <el-option
            v-for="item in businessList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="归属合作商：" :label-width="formLabelWidth" prop="ownerId">
        <el-select ref="ownerSelect" v-model="formDate.ownerId" placeholder="请选择" @change="optionChange">
          <el-option
            v-for="item in partnerList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="详细地址：" :label-width="formLabelWidth">
        <el-cascader
          ref="addrSelect"
          v-model="value"
          :options="options"
          placeholder="请选择"
          @change="handleChange"
        />
      </el-form-item>
      <el-form-item :label-width="formLabelWidth" prop="addr">
        <el-input
          v-model="formDate.addr"
          type="textarea"
          :rows="3"
          placeholder="请输入详细地址"
          maxlength="60"
          show-word-limit
        />
      </el-form-item>
      <div class="dialog-footer">
        <el-button class="cancel" @click="handleClose">取 消</el-button>
        <el-button class="confirm" type="primary" @click="addRagion">确 定</el-button>
      </div>
    </el-form>
  </el-dialog>
</template>

<script>
import { addNode, editNode } from '@/api/vm-node'
import addr from '../addr'
export default {
  props: {
    dialogFormVisible: {
      type: Boolean,
      default: false
    },
    tableDate: {
      type: Array,
      default: () => []
    },
    businessList: {
      type: Array,
      default: () => []
    },
    partnerList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      formLabelWidth: '140px',
      formDate: {
        name:	'',	// 名称
        regionId:	'',	// 所属区域Id
        businessId:	'',	// 所属商圈Id
        ownerName:	'',	// 合作商名称
        ownerId: '',		// 合作商Id
        addr:	'',	// 详细地址
        createUserId:	1, // 创建人Id
        areaCode: '' // 最后一级区域Id
      },
      addrInfo: '',
      rules: {
        name: [{ required: true, message: '请输入', trigger: 'blur' }],
        regionId: [{ required: true, message: '请输入', trigger: 'blur' }],
        businessId: [{ required: true, message: '请输入', trigger: 'blur' }],
        ownerId: [{ required: true, message: '请输入', trigger: 'blur' }],
        addr: [{ required: true, message: '请输入', trigger: 'blur' }]
      },
      value: [],
      options: []
    }
  },
  created() {
    console.log(addr.options)
    this.options = addr.options
  },
  methods: {
    handleClose() {
      this.$refs.formDate.resetFields()
      this.$emit('offAddDialog')
      this.formDate = {
        name:	'',	// 名称
        regionId:	'',	// 所属区域Id
        businessId:	'',	// 所属商圈Id
        ownerName:	'',	// 合作商名称
        ownerId: '',		// 合作商Id
        addr:	'',	// 详细地址
        createUserId:	1, // 创建人Id
        areaCode: '' // 最后一级区域Id
      }
      this.value = []
    },
    addRagion() {
      this.$refs.formDate.validate(async(vali) => {
        if (vali) {
          if (!this.formDate.id) {
            this.formDate.addr = this.addrInfo + '  ' + this.formDate.addr
            this.formDate.areaCode = this.value[3]
            await addNode(this.formDate)
          } else {
            await editNode(this.formDate)
          }
          this.$message.success(`${this.formDate.id ? '修改区域' : '新增区域'}成功`)
          this.$emit('refreshList')
          this.handleClose()
        }
      })
    },
    handleChange(value) {
      console.log(value)
      this.$nextTick(() => {
        console.log(this.$refs.addrSelect.presentText)
        this.addrInfo = this.$refs.addrSelect.presentText
      })
    },
    optionChange() {
      this.$nextTick(() => {
        console.log(this.$refs.ownerSelect.selectedLabel)
        this.formDate.ownerName = this.$refs.ownerSelect.selectedLabel
      })
    }
  }
}
</script>

<style lang='scss'>
.el-dialog {
  width: 630px;
  border-radius: 10px;
  .el-dialog__body {
    padding: 20px 20px 30px;
  }
  .el-form-item {
    margin-bottom: 22px !important;
    .el-form-item__content {
        width: 396px;
    }
  }
  .dialog-footer {
    display: flex;
    justify-content: center;
    .cancel {
        background-color: #fbf4f0;
        border:none
    }
    .confirm {
        background: linear-gradient(135deg,#ff9743,#ff5e20);
        border:none
    }
  }
  .el-select,.el-cascader {
    width: 396px;
  }
}
</style>
