<template>
 <div>
   <el-button type="text" @click="dialogVisible = true">添加会员</el-button>
  <!-- 会员关键字窗口 -> START -->
  <el-dialog  title="会员关键字"  :visible.sync="dialogVisible"  width="30%"  :before-close="handleClose">
    <el-input v-model="input" placeholder="请输入会员/手机号"></el-input>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="openAddMember">确 定</el-button>
    </span>
  </el-dialog> 
  <!-- 会员关键字窗口 -> END -->
 </div>
</template>



<script>
export default {
    data() {
      return {
        dialogVisible: false, //是否显示窗口标志位
        input: ''   //输入框
      };
    },
    methods: {
      handleClose(done) {
        this.$confirm('确认关闭？')
          .then(_ => {
            done();
          })
          .catch(_ => {});
      },
      openAddMember() {
          this.dialogVisible = false; //关闭窗口
          console.log("发财");
      },
    }
      
  };
</script>
<style scoped>

</style>
