<template>
 <div class="customer_container">
  <!-- 会员添加窗口 -> START -->
    <el-dialog  title="会员添加"  :visible.sync="dialogVisible" :close-on-press-escape="false" width="70%"  >
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="会员卡号" prop="name">
          <el-input v-model="ruleForm.memberCardNum" ></el-input>
        </el-form-item>
        <el-form-item label="会员密码" prop="name">
          <el-input v-model="ruleForm.passWord_1"></el-input>
        </el-form-item>
        <el-form-item label="密码确认" prop="name">
          <el-input v-model="ruleForm.passWord_2"></el-input>
        </el-form-item>
        <el-form-item label="会员姓名" prop="name">
          <el-input v-model="ruleForm.memberName"></el-input>
        </el-form-item>
        <el-form-item label="会员电话" prop="name">
          <el-input v-model="ruleForm.menberPhone"></el-input>
        </el-form-item>
        <el-form-item label="过期时间" required>
            <el-form-item prop="outTime">
              <el-date-picker type="date" placeholder="选择日期" v-model="ruleForm.date1" style="width: 100%;"></el-date-picker>
            </el-form-item>
        </el-form-item>
        <el-form-item label="会员生日" required>
            <el-form-item prop="birthday">
              <el-date-picker type="date" placeholder="选择日期" v-model="ruleForm.date1" style="width: 100%;"></el-date-picker>
            </el-form-item>
        </el-form-item>
        <el-form-item label="联系地址" prop="name">
          <el-input v-model="ruleForm.address"></el-input>
        </el-form-item>
        <el-form-item label="输入备注" prop="desc">
          <el-input type="textarea" v-model="ruleForm.desc"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog> <!-- 会员添加窗口 -> END -->
 </div>
</template>



<script>
export default {
  props:['inputNumber'],
  data() {
    return {
      dialogVisible: true, //窗口显示标志位
      ruleForm: {
        memberCardNum: "",
        passWord_1:"",
        passWord_2:"",
        memberName: "",
        menberPhone:"",
        // region: "",
        outTime: "",
        birthday: "",
        address: "",
        // delivery: false,
        type: [],
        resource: "",
        desc: ""
      },
      rules: {
        memberCardNum: [
          { required: true, message: "请输入会员卡号", trigger: "blur" },
          { min: 3, max: 11, message: "长度在 3 到 5 个字符", trigger: "blur" }
        ],
        outTime: [
          {
            type: "date",
            required: true,
            message: "请选择日期",
            trigger: "change"
          }
        ],
        birthday: [
          {
            type: "date",
            required: true,
            message: "请选择日期",
            trigger: "change"
          }
        ],
        desc: [{ required: true, message: "请填写活动形式", trigger: "blur" }]
      }
    };
  },
  mounted:function(){
    this.ruleForm.memberCardNum = this.inputNumber;
    this.ruleForm.memberName = this.inputNumber;
    // console.log(this.inputNumber);
    
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          alert("submit!");
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
};
</script>

<style scoped>

</style>
