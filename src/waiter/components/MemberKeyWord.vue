<template>
 <div class="customer_container">
    <div class="customer-button" @click="dialogVisible = true">添加会员</div>
   
  <!-- 会员关键字窗口 -> START -->
  <el-dialog  title="会员关键字"  :visible.sync="dialogVisible"  width="30%"  :before-close="handleClose" >
    <el-input v-model="inputNumber" placeholder="请输入会员/手机号"></el-input>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="openAddMemberwindws">确 定</el-button>
    </span>
  </el-dialog> 
  <!-- 会员关键字窗口 -> END -->
  <member-add v-if="memberAddWindowVisible" :inputNumber="inputNumber"></member-add>
 </div>
 
</template>



<script>
import MemberAdd from "@/components/MemberAdd.vue";

export default {
  data() {
    return {
      dialogVisible: false, //是否显示窗口标志位
      memberAddWindowVisible:false, //添加会员窗口显示标志位
      inputNumber: ""             //输入框
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
    openAddMemberwindws() {
      // this.dialogVisible = false; //关闭窗口
      this.memberAddWindowVisible = true;
      console.log(this.inputNumber);
      
    }
  },
  components: {
    'member-add' : MemberAdd
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
