<template>
  <div class="customer_container">
    <!-- 会员添加窗口 -> START -->
    <el-dialog title="会员添加" :visible.sync="dialogVisible" :close-on-press-escape="false" :fullscreen="true">
      <!-- <el-button type="primary" @click="test">主要按钮</el-button> -->
      <el-form :model="memberAddData" :rules="rules" ref="memberAddData" status-icon label-width="100px" class="demo-memberAddData">

        <el-form-item label="会员编号" prop="memberNum">
          <el-input v-model="memberAddData.memberNum"></el-input>
        </el-form-item>
        <el-form-item label="会员密码" prop="passWord">
          <el-input v-model="memberAddData.passWord"></el-input>
        </el-form-item>
        <el-form-item label="密码确认" prop="passWord_confirm">
          <el-input v-model="memberAddData.passWord_confirm"></el-input>
        </el-form-item>
        <el-form-item label="会员姓名" prop="memberName">
          <el-input v-model="memberAddData.memberName"></el-input>
        </el-form-item>
        <el-form-item label="会员电话" prop="memberPhone">
          <el-input v-model="memberAddData.memberPhone"></el-input>
        </el-form-item>
        <el-form-item label="过期时间" required>
          <el-form-item prop="outTime">
            <el-date-picker type="date" placeholder="选择日期" v-model="memberAddData.outTime" style="width: 100%;"></el-date-picker>
          </el-form-item>
        </el-form-item>
        <el-form-item label="会员生日" required>
          <el-form-item prop="birthday">
            <el-date-picker type="date" placeholder="选择日期" v-model="memberAddData.birthday" format="MM 月 dd 日" value-format="MM-dd" style="width: 100%;"></el-date-picker>
          </el-form-item>
        </el-form-item>
        <el-form-item label="联系地址" prop="address">
          <el-input v-model="memberAddData.address"></el-input>
        </el-form-item>
        <el-form-item label="输入备注" prop="desc">
          <el-input type="textarea" v-model="memberAddData.desc"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('memberAddData')">立即创建</el-button>
          <el-button @click="resetForm('memberAddData')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 会员添加窗口 -> END -->
  </div>
</template>


<script>
// ***接口***
// 入口:props: ["inputNumber"]
// 出口:this.$emit("AddMemberReturnData", this.returnData);
// **********

import { createCustomer } from "@/api/getData";

export default {
  props: ["inputNumber"],
  data() {
    //验证卡号--1.不能空;2.必须是数字;3.四至十一个字符
    var checkmemberNum = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("不能为空"));
      }
      if (!isvalidNumber(value)) {
        callback(new Error("请输入数字值"));
      } else {
        callback();
      }
    };
    //验证规则---两次密码是否一致
    var validatePassConfirm = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.memberAddData.passWord) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    //验证规则---电话号码
    var validPhone = (rule, value, callback) => {
      if (!isvalidPhone(value)) {
        // console.log(value);
        callback(new Error("请输入正确的11位手机号码"));
      } else {
        callback();
      }
    };
    function isvalidNumber(str) {
      var regNumber = /^[0-9]*$/;
      return regNumber.test(str);
    }
    function isvalidPhone(str) {
      var reg = /^1[3|4|5|7|8][0-9]\d{8}$/;
      return reg.test(str);
    }
    return {
      dialogVisible: true, //窗口显示标志位
      memberAddData: {
        memberNum: "",
        passWord: "",
        passWord_confirm: "",
        memberName: "",
        memberPhone: "",
        outTime: "",
        birthday: "",
        address: "",
        type: [],
        desc: ""
      },
      returnData: {},
      rules: {
        memberNum: [
          {
            required: true,
            min: 4,
            max: 11,
            message: "长度在 4 到 11 个数字",
            trigger: "blur"
          },
          { required: true, validator: checkmemberNum, trigger: "blur" }
        ],
        passWord: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            required: true,
            min: 6,
            max: 11,
            message: "长度在 6 到 8 个字符",
            trigger: "blur"
          }
        ],
        passWord_confirm: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            required: true,
            min: 6,
            max: 11,
            message: "长度在 6 到 8 个字符",
            trigger: "blur"
          },
          { validator: validatePassConfirm, trigger: "blur" }
        ],
        memberPhone: [
          { required: true, message: "请输入电话号码", trigger: "blur" },
          {
            min: 4,
            max: 11,
            message: "长度在 8 到 12 个字符",
            trigger: "blur"
          },
          { required: true, validator: validPhone, trigger: "blur" }
        ],
        outTime: [
          {
            type: "date",
            required: true,
            message: "请选择日期",
            trigger: "change"
          }
        ]
        // birthday: [
        //   {
        //     type: "date",
        //     required: true,
        //     message: "请选择日期",
        //     trigger: "change"
        //   }
        // ],
        // desc: [{ required: true, message: "请填写备注内容", trigger: "blur" }]
      }
    };
  },
  mounted: function() {
    this.memberAddData.memberNum = this.inputNumber;
    this.memberAddData.memberName = this.inputNumber;
  },
  methods: {
    //添加会员方法,异步,请求服务器,调用getData.js中createCustomer
    async addCustomer(data) {
      this.returnData = await createCustomer(data);
    },

    //提交
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.addCustomer(this.memberAddData).then(() => {
            //判断返回的数据,Id不为空且不等于undefined时,提交Id数据给父组件
            if (
              this.returnData.Id != "" &&
              typeof this.returnData.Id != "undefined"
            ) {
              this.$emit("AddMemberReturnData", this.returnData);
              // console.log(this.returnData.Id);
            }
          });
          // alert("submit!");
        } else {
          this.$alert("请仔细检测表格", "错误提示", {
            confirmButtonText: "确定"
          });
          return false;
        }
      });
    },

    //重置
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
};
</script>

<style scoped>

</style>
