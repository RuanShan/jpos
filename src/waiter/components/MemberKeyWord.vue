<template>
 <div class="customer_container">
    <div class="customer-button" @click="dialogVisible = true">
      <div>
        <h4 style='padding-top:10px;'>{{buttonName}}&nbsp;&nbsp;&nbsp;&nbsp;
          <span style="font-size:12px;background:#ebb563;" v-if="NoVisible">No:&nbsp;&nbsp;{{buttonNum}}
          </span>
        </h4>
      </div>
      <div>
        <h6 style='padding-top:10px; padding-bottom:5px'>余额:&nbsp;&nbsp;{{buttonRemaining}}&nbsp;&nbsp;元</h6>
      </div>
    </div>
   
  <!-- 会员关键字窗口 -> START -->
  <el-dialog  title="会员关键字"  :visible.sync="dialogVisible"  width="30%"  :before-close="handleClose" >
    <el-input v-model="inputNumber" placeholder="请输入会员/手机号"></el-input>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="openAddMemberWindws">确 定</el-button>
    </span>
  </el-dialog> 
  <!-- 会员关键字窗口 -> END -->

  <!-- 添加会员组件 Start-->
  <member-add v-if="memberAddWindowVisible" :inputNumber="inputNumber" 
    v-on:AddMemberReturnData="AddMemberReturnData($event)"></member-add>
  <!-- 添加会员组件 END-->
    
  <!-- 会员中心组件 Start-->
  <member-center v-if="memberCenterWindowVisible" :memberData="memberData" v-on:SelectMemberButton="SelectMemberButton"></member-center>
  <!-- 会员中心组件 END-->
 </div>
</template>

<script>
import MemberAdd from "@/components/MemberAdd.vue";
import MemberCenter from "@/components/MemberCenter.vue";

export default {
  components: {
    "member-add": MemberAdd,
    "member-center": MemberCenter
  },
  data() {
    return {
      dialogVisible: false, //是否显示窗口标志位
      memberAddWindowVisible: false, //添加会员窗口显示标志位
      memberCenterWindowVisible: false, //会员中心窗口显示标志位
      inputNumber: "", //输入框
      memberData: "", //用户数据
      buttonName: "来宾",//按钮姓名显示
      buttonRemaining: "", //按钮余额显示
      buttonNum: "",  //按钮编号显示
      NoVisible: false,  //按钮中"No"显示标志位
    };
  },
  methods: {
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then(_ => {
          done();
        })
        .catch(_ => {});
    },
    openAddMemberWindws() {
      this.memberAddWindowVisible = true;
      this.memberCenterWindowVisible = false;
    },
    AddMemberReturnData(returnData) {
      this.memberAddWindowVisible = false;
      this.memberCenterWindowVisible = true;
      this.memberData = returnData;
    },
    SelectMemberButton(memberCenterData){
      this.dialogVisible = false; //关闭查询会员窗口
      this.memberCenterWindowVisible = false;  //关闭会议中心窗口
      this.memberData = memberCenterData; //会员中心的修改数据给memberData
      this.buttonName = this.memberData.memberName; //改变会员按钮上的"来宾"名称,显示会员姓名
      this.buttonRemaining = this.memberData.memberCardRemaining; //改变会员按钮上的"余额"信息,显示会员余额
      this.NoVisible = true;
      this.buttonNum = this.memberData.memberNum; //按钮上显示会员编号
      this.inputNumber = "";
      console.log("选好了***");
      
    },
  }
};
</script>
<style lang="scss" scoped >
.customer-button {
  // height: 80px;
  text-align: center;
  font-size: 21px;
  color: #fff;
  background-color: #909399;
  border-color: #909399;
}
</style>
