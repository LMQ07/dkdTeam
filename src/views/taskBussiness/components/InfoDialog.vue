<template>
  <div>
    <el-dialog
      title="详情信息"
      :visible="infoDialogVisible"
      width="630px"
      :before-close="handleClose"
    >
      <div class="task-status">
        <div class="img">
          <img :src="icon" alt="" />
          <span>{{ statusText }}</span>
        </div>
        <img :src="iconperson" alt="" />
      </div>
      <div class="detail-two">
        <el-row>
          <el-col :span="12">
            <span>设备编号:</span>
            <span>{{ detailsInfo.innerCode }}</span>
          </el-col>
          <el-col :span="12">
            <span>创建日期:</span>
            <span>{{ detailsInfo.createTime }}</span>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <span>{{ statusText }}日期: </span>
            <span>{{ detailsInfo.updateTime }}</span>
          </el-col>
          <el-col :span="12">
            <span>运营人员: </span>
            <span>{{ detailsInfo.userName }}</span>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <span>工单类型: </span>
            <span>{{ taskType }}</span>
          </el-col>
          <el-col :span="12" v-if="formType == 'Bussiness'">
            <span>补货数量: </span>
            <!-- taskId -->
            <span
              style="color: #5f84ff; font-weight: bold"
              @click="getReplenishInfo"
              >补货详情</span
            >
          </el-col>
          <el-col :span="12" v-else>
            <span>工单方式: </span>
            <span>{{ detailsInfo.createType == 0 ? "自动" : "手动" }}</span>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12" v-if="formType == 'Bussiness'">
            <span>工单方式: </span>
            <span>{{ detailsInfo.createType == 0 ? "自动" : "手动" }}</span>
          </el-col>
          <el-col :span="12">
            <span>{{ id == 3 ? "取消原因" : "备注" }}: </span>
            <span>{{ detailsInfo.desc || "无" }}</span>
          </el-col>
        </el-row>
      </div>
      <el-row class="button-two-detail">
        <el-button
          @click="handleCancel"
          v-if="detailsInfo.taskStatusTypeEntity.statusId == 1"
          >取消工单</el-button
        >
        <el-button
          @click="rebuild"
          v-if="detailsInfo.taskStatusTypeEntity.statusId == 3"
          >重新创建</el-button
        >
      </el-row>
    </el-dialog>
    <ReplenishInfoDialog
      :replenishInfoDialogVisible="replenishInfoDialogVisible"
      :replenishInfo="replenishInfo"
      :dataLabel="dataLabel"
    />
    <NewDialog
      :dialogFormVisible="dialogFormVisible"
      :taskTypeOption="taskTypeLabel"
      dialogType="rebuild"
      :detailsInfo="detailsInfo"
      :operatorList="operatorList"
      @getTaskInfo="taskRequest"
      @showChannelDialog="showChannelDialog"
      v-if="dialogFormVisible"
    />
    <ChannelListDialog
      :channelVisible="channelVisible"
      :channelList="channelList"
      v-if="channelVisible"
      :channelLabel="channelLabel"
      @sendDetails="getDetails"
    />
  </div>
</template>

<script>
import {
  getreplenishInfo,
  cancelTask,
  getOperatorListAPI,
  getChannelListAPI,
  createTaskAPI,
} from "@/api/task";
import ReplenishInfoDialog from "./ReplenishInfoDialog.vue";
import NewDialog from "./NewDialog";
import ChannelListDialog from "./ChannelListDialog.vue";
export default {
  name: "Detail",
  props: {
    infoDialogVisible: {
      type: Boolean,
      default: false,
    },
    detailsInfo: {
      type: Object,
      default: () => ({}),
    },
    formType: {
      type: String,
      default: "Bussiness",
    },
  },
  components: {
    ReplenishInfoDialog,
    NewDialog,
    ChannelListDialog,
  }, // 表单类型

  data() {
    return {
      replenishInfo: [],
      channelLabel: [],
      replenishInfoDialogVisible: false,
      dialogFormVisible: false,
      channelVisible: false,
      dataLabel: [
        {
          prop: "channelCode",
          label: "货道编号",
        },
        {
          prop: "skuName",
          label: "商品",
        },
        {
          prop: "expectCapacity",
          label: "补货数量",
        },
      ],
      // 工单类型
      taskTypeLabel: [],
      // 运营人员
      operatorList: [],
      channelList: [],
      channelLabel: [],
      details: [],
      taskInfo: [],
    };
  },
  created() {
    console.log(this.detailsInfo);
  },
  methods: {
    handleClose() {
      this.$parent.infoDialogVisible = false;
    },
    // 获取补货数量
    async getReplenishInfo() {
      const { data: res } = await getreplenishInfo(this.detailsInfo.taskId);
      this.replenishInfo = res;
      console.log(res);
      this.replenishInfoDialogVisible = true;
    },
    // 取消工单
    handleCancel() {
      this.$confirm("取消工单后，将不能恢复，是否确认取消？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "error",
      }).then(async () => {
        await cancelTask({ taskId: this.detailsInfo.taskId, desc: "" });
        this.$parent.getTaskList();
        this.handleClose();
        this.$message({
          type: "success",
          message: "取消成功!",
        });
      });
    },
    // 重新创建
    async rebuild() {
      if (this.formType == "Bussiness") {
        this.taskTypeLabel = [{ label: "补货工单", value: 2 }];
        const { data: res } = await getOperatorListAPI(
          this.detailsInfo.innerCode
        );
        console.log(res);
        this.operatorList = res;
        this.dialogFormVisible = true;
      } else {
        this.$emit("rebuildTask");
      }
    },
    showChannelDialog() {
      this.channelLabel = [
        { label: "货道编号", prop: "channelCode" },
        { label: "商品名称", prop: "sku.skuName", slotName: "skuName" },
        {
          label: "当前数量",
          prop: "currentCapacity",
          slotName: "currentCapacity",
        },
        { label: "还可添加", prop: "num", slotName: "num" },
        { label: "补满商品", prop: "buhuo", slotName: "buhuo" },
      ];
      this.channelVisible = true;
      this.getChannelList();
    },
    // 获取货道详情列表
    async getChannelList() {
      const { data: res } = await getChannelListAPI(this.detailsInfo.innerCode);
      this.channelList = res;
      this.channelList.forEach((item, index) => {
        let num = item.maxCapacity - item.currentCapacity;
        this.$set(this.channelList[index], "expectCapacity", num);
        this.$set(this.channelList[index], "num", num);
      });

      console.log(res);

      this.channelVisible = true;
    },
    getDetails(val) {
      console.log(val);
      this.details = val;
    },
    // 新增工单或重建工单
    async taskRequest(taskInfo) {
      this.taskInfo = taskInfo;
      this.taskInfo.details = this.details;
      const res = await createTaskAPI(this.taskInfo);
      this.$parent.getTaskList();
      console.log(res);
      this.$children[2].handleClose();
      this.$parent.infoDialogVisible = false;
      this.$message.success("创建成功");
    },
  },
  computed: {
    id() {
      return this.detailsInfo.taskStatusTypeEntity.statusId;
    },
    icon() {
      // let id = this.detailsInfo.taskStatusTypeEntity.statusId;
      if (this.id == 1) {
        return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAYAAACpSkzOAAADQklEQVRIS72WWWyMURTHf3dGSOqB2pWSCGKZllRLPGjsW1GDIUhjQkwrliBiXhpUmkhFEEu0pUIaRAe1xFZUwoOgRKqWILZqa6vlQYPoXLn9Zjrzzfd12hLO4z3/c/73LPecK2hEZFqKDa91FoIRSNkPaO8zqUaIx0iuY6k9JrLzy8K5Eg0p5WLnYITMAsY3dhmfvggp3GLvgXtmeAORdDisRLbeAnIFYGkiiR/mBbGDz9/WCI+nNthWRyRdjjbICA+Ccc0k0MMllxA1DpHr+epX1BPVRdI24vxfk/g9K7IvNZP8kQWIXM5tIFfWXy1hGEy1Q7v2UFUBp05AWan+5rZYSJ4BXbvBp2o4Uwi3bwZhxHaRe2CVOqgj8hX+Tn1Nhg6HRakBg/JXUHIbLp4D6dXOhQUmTIb4BIjuGcDm5cCtG4GaSTFENYhG5FpwUdddmZuhYyf48B4KDkPpPejTF/oPhHYdNCefPsKjB/D0CcQOhtnzAjbpa4MjLxK5BycImbbIhvfXfV1OdubC82eQsxu6RsHcFIjuYd4f5a/hSD5UVULqUujVG5a79FhLixghXc4NINfrNOp2qiZxQyBlIVit4Zuwthby98PdO5Bsh4IjIXiRIWSq8wpSjjZ4Uqla5daTVH+EC2dB1VDpg0WRbcvSUhkqQhSriCpARul0QkD6RugerTd5+QI2ZcB8JySONDp8Uw6Z60DKUF2lkK4F34FWOo3Kszvd6KgxImWRlanVVy8/zIkmJoHd8WdEhR4tvUYik9TNmQ+jTaaQPyLViZGRmivbIBgTNHeLL8HRQyapM2uGaXZISjZGVPkG9mXrz+MSYEoQ9uwpOF2ox/iawdjecfGQuix8SzekzdkFd0tM2tvswbZsBVlbIaJ188hqvoF7Nfz8obezeGPMR5CCqbyrh9scUePqSlGohTaC1KlhqPqhi5dA/LCmUZXchL17QrFegodqHVnomlCHFgtMnwljJzY8htREuHwBTh4Hr2+y19OFrIk6onCLr3MXSBwFA2zaflKi9s/DMrh2Fd69NUbd0OLTovoPq9x/pf/yOQmO/59/t0KTLV3OGGCm9oGkH0hfkUQ1At8H0npMZOeF/UD+BpwnSWqJuP2NAAAAAElFTkSuQmCC";
      } else if (this.id == 3) {
        return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAYAAACpSkzOAAABqUlEQVRIS72WvUrDUBTH/6cGMjq4qO0DOFgQSocbcBFUnDWvURQER+0oCEpfI+5ii12E3KEEBB18gEZdHNwMxBy5tQ39sr1JaDLmnv/93Xu+7iHM+SzL2gRwxMzbADYArPQlnwBeiegRwK3rui+ztqL/Fi3L2mLmSwB78w7TX28S0Znruk/T7CdAtm0vdbvdK2auEVFBE9IzY+aIiBqlUunUcZyfYe0IqFKpLJum6TDzbhLAuC0RtYIgsD3P+xqsxSB1E9/377JC4o2JWsVi8WBwsxgkhLgGcJzlJlO0N1LKE/W/B1KBj6LI04iJE4ZhTWkMw2gAsGcdTMWsUChUVIL0QEKIe53sCsNwrdPpfChNtVpdNQzjXcMDTSnlPqk6YeZnDQFSgkBEZQW6YOZzHRCARK4bSow6CSEeAOxogtKatRXIB7Cus4OUcqTuhBCsowPwpkDfAEwdQQZQkCsoN9dpJ0MG17UTpXdaEBHVExVsBlA5UQtKCfprQQmbqk4VxDYTTbXfWBf/TChQbg+fguXylA8cm8twMhzphY9b42klhCgT0WHWAfIXFPYBcBvJ9uQAAAAASUVORK5CYII=";
      } else if (this.id == 4) {
        return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAYAAACpSkzOAAADT0lEQVRIS62WX0hTcRTHv+d3V7MkKsVAbHdSLwWhkVEvBZVRL72UvURhRFQ09SpBqZPklrU5oayZkyD68xaYUFH0h5wP9dQfqCAqonST6ikjs2jr7p64103mNndndd8u58/n/M7vnN85BIvPPRwoY12rArAWwBIABXGTEQBvADwkYevzOFwvs7miqYRNobMVBPIBqLQKJi7vZ3Bju7P+WSb9NJDKqi0yXNAJwAWGyBEyrkbQwdRtl78cUknVkm0ngZpC3vmE/GsANkwLkK4cZPzY3u5s/poQTYDMk4QL7v0HSMJ30C6PbE6cbALUHPZ3gVH7jydJMacur7NOGc8qAPPiiR5P+06soiLozLzKKBAT1BzyP5hGdVm5HyPwXiapEKwHAPR7ncpGivfJCyvrXOREeCex2NrmrH3lDvk7GDhspk3Yyqk55D8GoDUXRxYNefunHts1r/TbaDRc2MPg/Un6xw1QEMD6vwYRdAKdnOn4on56ViwVLoheAfOOFH8DBugTgOK/AjFGdcHVPrn+hjp4KS8ixnoB3pLB12cD9AuAPSFkIEJADMDs7Kmi18ImbT1R4np75I1vjpQ36yYI66awiaSBSMJuTYs9kYR0FYyyjIaE67FZ+dUdRXu/q8OnC6I8445RxlkCM0GTUkeEPR5ZuawOqnlRqfAUAwfBnGhsnYhaPY46DwjsHuosZiHdB2OZRerN1KUWg06EfR5ZuWj22JB/GwgXxsuUdnocdXfMJv/cU0rR30b/Lc7hfgfIHT57nJmOpijrJMQBj6PWBLQM95RoIiL5ShrCxv+Roc6l0vhJFuYAARG3UeMHf7mQ8DzNwHzy4fI6lfPJMvfQuRUs9LtgFOUCMXT0GJYnnqD+TK82A0yEGq+s9Jgn+9i9RtditwDMzRUCIOh1KpXxRzVQAWhPKP7IJjsxYEJQPcfoPUjvtSr7SQEQdAFafVKue5o8Js6BUTONSK1VCd1eWTFHT+rgu/9Pz9Fk9IBdHtmUNvjMkg0F5hO0vv8AG2DYqtqdrvRRnggmvpycYYYr051ly1e8eAJ2x0hD1uUk2UlLuGulzmysW7kuKkFB1GhcfKZgptzrEspGn0k2rmKmNZkWSCJ+FNOoz7dIyTo8/wDHwkf9fxFtzQAAAABJRU5ErkJggg==";
      }
    },
    iconperson() {
      // let id = this.detailsInfo.taskStatusTypeEntity.statusId;
      if (this.id == 1) {
        return "http://likede2-admin.itheima.net/img/pic_1.834b274c.png";
      } else if (this.id == 3) {
        return "http://likede2-admin.itheima.net/img/pic_3.e8208e34.png";
      } else if (this.id == 4) {
        return "http://likede2-admin.itheima.net/img/pic_4.3b5af41c.png";
      }
    },
    statusText() {
      // let id = this.detailsInfo.taskStatusTypeEntity.statusId;
      if (this.id == 1) {
        return "待办";
      } else if (this.id == 3) {
        return "取消";
      } else if (this.id == 4) {
        return "完成";
      }
    },
    taskType() {
      let typeId = this.detailsInfo.taskType.typeId;
      if (typeId == 1) {
        return "投放工单";
      } else if (typeId == 2) {
        return "补货工单";
      } else if (typeId == 3) {
        return "维修工单";
      } else if (typeId == 4) {
        return "撤机工单";
      }
    },
  },
};
</script>

<style lang="scss">
.task-status {
  height: 54px;
  margin-bottom: 25px;
  background-color: hsla(0, 0%, 92.5%, 0.39);
  padding: 0 50px 0 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .img {
    display: flex;
    align-items: center;
    span {
      margin-left: 20px;
    }
  }
}
.detail-two {
  padding-left: 40px;
  .el-row {
    display: flex;
    align-items: center;
    line-height: 36px;
    span {
      margin-left: 20px;
    }
  }
}

.button-two-detail {
  margin: 20px auto;
  width: 80px !important;
  height: 36px;
  padding: 0;
  background-color: #fbf4f0 !important;
  border: none;
  color: #655b56 !important;
}
</style>
