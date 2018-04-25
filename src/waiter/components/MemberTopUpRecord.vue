<template>
  <div class="customer_container">
    <el-dialog title="充值记录" :visible.sync="dialogVisible" :close-on-press-escape="false" :fullscreen="true" center @close="closeWindow()" style="font-size: 36px;color: #115df5; !important">
      <el-row>
        <el-col :span="6">
          <div class="grid-content bg-purple">
            会员编号 :&nbsp;&nbsp;&nbsp;{{this.memberTopUpRecordData.memberNum}}
          </div>
        </el-col>
        <el-col :span="6">
          <div class="grid-content bg-purple-light">
            会员姓名:&nbsp;&nbsp;&nbsp;{{this.memberTopUpRecordData.memberName}}
          </div>
        </el-col>
        <el-col :span="6">
          <div class="grid-content bg-purple">
            <!-- <el-button type="primary" @click="test()">主要按钮</el-button> -->
          </div>
        </el-col>
        <el-col :span="6">
          <div class="grid-content bg-purple-light">
            可用余额:&nbsp;&nbsp;&nbsp;{{current_value}}
          </div>
        </el-col>
      </el-row>
      <div class="block">
        <span class="demonstration">时间区间</span>
        <el-date-picker v-model="section" type="datetimerange" :picker-options="pickerOptions" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" align="right">
        </el-date-picker>
      </div>

      <el-table :data="memberTransactionsTable" :stripe="true" height="250" style="width: 100%">
        <el-table-column type="index" label="序号" :index="indexMethod">
        </el-table-column>
        <el-table-column prop="serialNum" label="流水号" width="180">
        </el-table-column>
        <el-table-column prop="creat_at" label="充值时间" width="180">
        </el-table-column>
        <el-table-column prop="amount" label="金额">
        </el-table-column>
        <el-table-column prop="status" label="状态">
        </el-table-column>
      </el-table>
    </el-dialog>

  </div>
</template>



<script>
import { getUserCards } from "@/api/getData";

export default {
  props: ["memberCenterData"],
  data() {
    return {
      dialogVisible: true, //当前窗口是否开启标志位
      memberTopUpRecordData: {}, //会员中心的会员数据
      memberCardsData: {}, //会员卡数据
      memberTransactionsTable: [], //会员充值记录表数据
      current_value: "", //余额
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      },
      section: "" //时间区间选择结果
    };
  },
  methods: {
    //获取SerVer会员卡数据,异步获取
    async getSverVerUserCards(Id) {
      this.returnSerVerData = await getUserCards(Id);
    },
    indexMethod(index) {
      return index + 1;
    },
    closeWindow(){
      this.dialogVisible = false;
      console.log("充值记录窗口被关闭了!!!");
      this.$emit("topUpRecordButton",this.memberTopUpRecordData.Id)
    },
    test() {}
  },

  mounted() {
    this.memberTopUpRecordData = this.memberCenterData; //会员中心的数据赋值给充值查询窗口数据
    this.getSverVerUserCards(this.memberTopUpRecordData.Id).then(() => {
      this.memberCardsData = this.returnSerVerData;
      this.current_value = this.memberCardsData.cards[0].current_value;
      this.memberTransactionsTable = this.memberCardsData.cards[0].transactions;
    });
    console.log("成功");
  }
};
</script>
<style scoped>
.center {
  text-align: center;
}
.el-form.MCenter-el-form {
  padding: 0 10%;
}
el-table__row {
  background-color: oldlace !important;
}
.el-col {
  border-radius: 4px;
}
.bg-purple-dark {
  background: #aaffff;
}
.bg-purple {
  background: #46c2ff;
}
.bg-purple-light {
  background: #46a3ff;
}
.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}
</style>
