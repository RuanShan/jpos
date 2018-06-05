<template>
  <div class="add-member-container cel-window">
    <!-- 会员添加窗口 -> START -->
    <el-dialog :visible="computedVisible" :close-on-press-escape="false" :show-close="false" :top="top" :modal="false" @open="handleOpenDialog">
      <div slot="title" class="title-wrap">
        <div class="left back"> <i class="el-icon-back" @click="handleCloseDialog()"></i> </div>
        <div> 会员添加</div>
      </div>
      <el-form :model="memberAddData" :rules="rules" ref="memberAddData" status-icon label-width="100px" class="new-member-form">

      <el-row :gutter="20" type="flex"  justify="center">
        <el-col :span="10">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>客户基本信息</span>
              <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>
            </div>
              <el-form-item label="电话" prop="mobile">
                <el-input v-model="memberAddData.mobile"></el-input>
              </el-form-item>
              <el-form-item label="姓名" prop="username">
                <el-input v-model="memberAddData.username"></el-input>
              </el-form-item>
              <el-form-item label="生日" required>
                <el-form-item prop="birth">
                  <el-date-picker type="date" placeholder="选择日期" v-model="memberAddData.birth" format="MM 月 dd 日" value-format="MM-dd" style="width: 100%;"></el-date-picker>
                </el-form-item>
              </el-form-item>
              <el-form-item label="联系地址" prop="address">
                <el-input v-model="memberAddData.address"></el-input>
              </el-form-item>
              <el-form-item label="备注" prop="address">
                <el-input type="textarea" v-model="memberAddData.memo"></el-input>
              </el-form-item>
          </el-card>
        </el-col>
        <el-col :span="10">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>会员卡信息</span>
              <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>
            </div>
              <el-form-item label="会员卡号" prop="mobile">
                <el-input v-model="memberAddData.mobile"  size="small"></el-input>
              </el-form-item>
              <el-form-item label="会员卡类型" prop="username">
                <el-select v-model="memberAddData.variantId" placeholder="" >
                  <el-option v-for="item in memberCardTypes" :key="item.id" :label="item.name" :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="到期时间" required>
                <el-form-item prop="birth">
                  <el-date-picker type="date" placeholder="选择日期" v-model="memberAddData.birth" format="MM 月 dd 日" value-format="MM-dd" style="width: 100%;"></el-date-picker>
                </el-form-item>
              </el-form-item>
              <el-form-item label="会员密码" prop="paymentPassword">
                <el-input v-model="memberAddData.paymentPassword"></el-input>
              </el-form-item>
              <el-form-item label="付款方式" >
                <el-select v-model="memberAddData.paymentMethodId" placeholder="" >
                  <el-option v-for="item in paymentMethods" :key="item.id" :label="item.name" :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="充值金额" >
                <el-input v-model="memberAddData.paymentAmount"></el-input>
              </el-form-item>
              <el-form-item label="备注" prop="address">
                <el-input v-model="memberAddData.memo"></el-input>
              </el-form-item>
          </el-card>
        </el-col>
      </el-row>

      <el-row :gutter="20" type="flex"  justify="center">
        <el-col :span="10">
          <div>
            <el-button type="primary" @click="addCustomer('memberAddData')">立即创建</el-button>
            <el-button @click="resetForm('memberAddData')">重置</el-button>
            <el-button @click="fillIn()" type="danger">测试填入</el-button>
          </div>
        </el-col>
      </el-row>
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
import { orderDataMixin } from "@/components/mixin/commonDataMixin"
import {  apiResultMixin} from '@/components/apiResultMixin'

import {
  DialogMixin
} from '@/components/mixin/DialogMixin'

export default {
  props: ["inputNumber", 'dialogVisible'],
  mixins: [DialogMixin, orderDataMixin, apiResultMixin],
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
      } else if (value !== this.memberAddData.paymentPassword) {
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
      top: '0', /* 去除直接传 0 产生的 需要参数为string的警告 */
      memberAddData: {
        // memberNum: "",
        paymentPassword: "",
        paymentPasswordConfirm: "",
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
        paymentPassword: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            required: true,
            min: 6,
            max: 11,
            message: "长度在 6 到 8 个字符",
            trigger: "blur"
          }
        ],
        paymentPasswordConfirm: [
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
    handleOpenDialog(){
      if( !this.paymentMethods ){
        this.getPaymentMethods()
      }
      if( !this.memberCardTypes ){
        this.getMemberCardTypes()
      }
    },

    //提交
    addCustomer(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let params = this.buildParams() //转换成SerVer需要的数据
          createCustomer(params).then((result)=>{
            this.returnData = result
            //判断返回的数据,Id不为空且不等于undefined时,提交Id数据给父组件
            if ( this.returnData.id ) {
              const customer = this.buildCustomer( this.returnData  )
              this.$emit("customerCreatedEvent",customer);
              this.handleCloseDialog()
            } else {
              //判读返回的数据中是否有错误
                //如果返回数据中有错误
                this.$alert(this.returnData.error, "错误提示", {
                  confirmButtonText: "确定"
                });
                return false;
            }
          })
        } else {
          this.$alert("请仔细检测表格", "错误提示", {
            confirmButtonText: "确定"
          })
          return false
        }
      })
    },

    //重置
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    //转换成SerVer需要的数据
    buildParams() {
      this.createCustomerData.user.username = this.memberAddData.username;
      this.createCustomerData.user.mobile = this.memberAddData.mobile;
      this.createCustomerData.user.payment_password = this.memberAddData.paymentPassword;
      this.createCustomerData.user.address = this.memberAddData.address;
      this.createCustomerData.user.birth = this.memberAddData.birth;
      let user = {
        username:  this.memberAddData.username,
        mobile:  this.memberAddData.mobile,
        paymentPassword:  this.memberAddData.paymentPassword,
        address:  this.memberAddData.address,
        birth:  this.memberAddData.birth
      }

      let order = null
      if( false ){
        order = {
          line_items: [
            { variant_id: this.memberAddData.variantId, price: 2000, quantity: 1 }
          ],
          payments:[
            { payment_method_id: this.memberAddData.paymentMethodId, amount:this.memberAddData.paymentAmount }
          ]
        }
      }
      return { user, order }
    },

    fillIn() {
      this.memberAddData.memberNum = "9874556";
      this.memberAddData.paymentPassword = "9874556";
      this.memberAddData.paymentPasswordConfirm = "9874556";
      this.memberAddData.mobile = "13000000000";
      this.memberAddData.outTime = new Date();
      this.memberAddData.birth = new Date();
    }
  }
};
</script>

<style lang="scss" >
.add-member-container{
  .box-card{
  }
  .new-member-form{
    margin: 24px 0 0 0;
  }
}
</style>
