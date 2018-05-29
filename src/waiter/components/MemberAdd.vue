<template>
  <div class="add_member_container cel-window">
    <!-- 会员添加窗口 -> START -->
    <el-dialog :visible="computedVisible" :close-on-press-escape="false" :show-close="false" :top="0" :modal="false">
      <div slot="title" class="title-wrap">
        <div class="left back"> <i class="el-icon-back" @click="handleCloseDialog()"></i> </div>
        <div> 会员添加</div>
      </div>
      <!-- <el-button type="primary" @click="test">主要按钮</el-button> -->
      <el-form :model="memberAddData" :rules="rules" ref="memberAddData" status-icon label-width="100px" class="demo-memberAddData">

        <!-- <el-form-item label="会员卡号" prop="memberNum">
          <el-input v-model="memberAddData.memberNum"></el-input>
        </el-form-item> -->
        <el-form-item label="会员电话" prop="mobile">
          <el-input v-model="memberAddData.mobile"></el-input>
        </el-form-item>
        <el-form-item label="会员姓名" prop="username">
          <el-input v-model="memberAddData.username"></el-input>
        </el-form-item>
        <el-form-item label="会员密码" prop="password">
          <el-input v-model="memberAddData.password"></el-input>
        </el-form-item>
        <el-form-item label="密码确认" prop="password_confirm">
          <el-input v-model="memberAddData.password_confirm"></el-input>
        </el-form-item>

        <!-- <el-form-item label="过期时间" required>
          <el-form-item prop="outTime">
            <el-date-picker type="date" placeholder="选择日期" v-model="memberAddData.outTime" style="width: 100%;"></el-date-picker>
          </el-form-item>
        </el-form-item> -->
        <el-form-item label="会员生日" required>
          <el-form-item prop="birth">
            <el-date-picker type="date" placeholder="选择日期" v-model="memberAddData.birth" format="MM 月 dd 日" value-format="MM-dd" style="width: 100%;"></el-date-picker>
          </el-form-item>
        </el-form-item>
        <el-form-item label="联系地址" prop="address">
          <el-input v-model="memberAddData.address"></el-input>
        </el-form-item>
        <!-- <el-form-item label="输入备注" prop="desc">
          <el-input type="textarea" v-model="memberAddData.desc"></el-input>
        </el-form-item> -->
        <el-form-item>
          <el-button type="primary" @click="submitForm('memberAddData')">立即创建</el-button>
          <el-button @click="resetForm('memberAddData')">重置</el-button>
          <el-button @click="fillIn()" type="danger">测试填入</el-button>
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
import {
  DialogMixin
} from '@/components/mixin/DialogMixin'

export default {
  props: ["inputNumber", 'dialogVisible'],
  mixins: [DialogMixin],
  data() {
    //验证卡号--1.不能空;2.必须是数字;3.四至十一个字符
    // var checkmemberNum = (rule, value, callback) => {
    //   if (!value) {
    //     return callback(new Error("不能为空"));
    //   }
    //   if (!isvalidNumber(value)) {
    //     callback(new Error("请输入数字值"));
    //   } else {
    //     callback();
    //   }
    // };
    //验证规则---两次密码是否一致
    var validatePassConfirm = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.memberAddData.password) {
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
    // function isvalidNumber(str) {
    //   var regNumber = /^[0-9]*$/;
    //   return regNumber.test(str);
    // }
    function isvalidPhone(str) {
      var reg = /^1[3|4|5|7|8][0-9]\d{8}$/;
      return reg.test(str);
    }
    return {
      memberAddData: {
        // memberNum: "",
        password: "",
        password_confirm: "",
        username: "",
        mobile: "",
        outTime: "",
        birth: "",
        address: "",
        type: []
        // desc: ""
      },
      createCustomerData: { user: {} },
      returnData: {}, //添加会员方法,异步,请求服务器,调用getData.js中createCustomer
      rules: {
        // memberNum: [
        //   {
        //     required: true,
        //     min: 4,
        //     max: 11,
        //     message: "长度在 4 到 11 个数字",
        //     trigger: "blur"
        //   },
        //   { required: true, validator: checkmemberNum, trigger: "blur" }
        // ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            required: true,
            min: 6,
            max: 11,
            message: "长度在 6 到 8 个字符",
            trigger: "blur"
          }
        ],
        password_confirm: [
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
        mobile: [
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
        // birth: [
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
    this.memberAddData.username = this.inputNumber;
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
          this.switchData(); //转换成SerVer需要的数据
          this.addCustomer(this.createCustomerData).then(() => {
            //判断返回的数据,Id不为空且不等于undefined时,提交Id数据给父组件
            if (
              this.returnData.hasOwnProperty("id") &&
              this.returnData.id != "" &&
              typeof this.returnData.id != "undefined"
            ) {
              this.$emit("AddMemberReturnData", this.returnData);
              this.dialogVisible = false;
              // console.log(this.returnData.Id);
            } else {
              //判读返回的数据中是否有错误
              if (this.returnData.hasOwnProperty("error")) {
                //如果返回数据中有错误
                this.$alert(this.returnData.errors, "错误提示", {
                  confirmButtonText: "确定"
                });
                return false;
              } else {
                this.$alert("id错误", "错误提示", {
                  confirmButtonText: "确定"
                });
                return false;
              }
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
    },
    //转换成SerVer需要的数据
    switchData() {
      this.createCustomerData.user.username = this.memberAddData.username;
      this.createCustomerData.user.mobile = this.memberAddData.mobile;
      this.createCustomerData.user.password = this.memberAddData.password;
      this.createCustomerData.user.address = this.memberAddData.address;
      this.createCustomerData.user.birth = this.memberAddData.birth;
    },

    fillIn() {
      this.memberAddData.memberNum = "9874556";
      this.memberAddData.password = "9874556";
      this.memberAddData.password_confirm = "9874556";
      this.memberAddData.mobile = "13000000000";
      this.memberAddData.outTime = new Date();
      this.memberAddData.birth = new Date();
    }
  }
};
</script>

<style >
.add_member_container{

}
</style>
