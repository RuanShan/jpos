<template>
 <div class="customer_container">
    <div class="customer-button" @click="dialogVisible = true">添加会员</div>
   
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
  <member-center v-if="memberCenterWindowVisible" :memberData="memberData"></member-center>
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
      memberData: "" //用户Id
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
    }
  }
};
</script>
<style lang="scss" scoped >
.customer-button {
  height: 80px;
  text-align: center;
  font-size: 21px;
  color: #fff;
  background-color: #909399;
  border-color: #909399;
}
</style>
