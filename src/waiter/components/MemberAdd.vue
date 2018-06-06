<template>
  <div class="add-member-container cel-window">
    <!-- 会员添加窗口 -> START -->
    <el-dialog :visible="computedVisible" :close-on-press-escape="false" :show-close="false" :top="'0'" :modal="false" @open="handleOpenDialog">
      <div slot="title" class="title-wrap">
        <div class="left back"> <i class="el-icon-back" @click="handleCloseDialog()"></i> </div>
        <div> 会员添加</div>
      </div>

      <el-row :gutter="20" type="flex"  justify="center">
        <el-col :span="10">
          <el-form :model="memberFormData" :rules="rules" ref="memberFormData" status-icon label-width="100px" class="new-member-form">
            <el-card class="box-card">
              <div slot="header" class="clearfix">
                <span>客户基本信息</span>
                <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>
              </div>
                <el-form-item label="电话" prop="mobile"  required>
                  <el-input v-model="memberFormData.mobile"></el-input>
                </el-form-item>
                <el-form-item label="姓名" prop="username">
                  <el-input v-model="memberFormData.username"></el-input>
                </el-form-item>
                <el-form-item label="生日">
                  <el-form-item prop="birth">
                    <el-date-picker type="date" placeholder="选择日期" v-model="memberFormData.birth" format="MM 月 dd 日" value-format="MM-dd" style="width: 100%;"></el-date-picker>
                  </el-form-item>
                </el-form-item>
                <el-form-item label="联系地址" prop="address">
                  <el-input v-model="memberFormData.address"></el-input>
                </el-form-item>
                <el-form-item label="备注" prop="address">
                  <el-input type="textarea" v-model="memberFormData.memo"></el-input>
                </el-form-item>
            </el-card>
          </el-form>

        </el-col>
        <el-col :span="10">
          <el-form :model="cardFormData" :rules="rules" ref="cardFormData" status-icon label-width="100px" class="new-member-form">
            <el-card class="box-card">
              <div slot="header" class="clearfix">
                <span>会员卡信息</span>
                <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>
              </div>
                <el-form-item label="会员卡号" prop="cardNumber"  required>
                  <el-input v-model="cardFormData.cardNumber" ></el-input>
                </el-form-item>
                <el-form-item label="会员卡类型" prop="variantId"  required>
                  <el-select v-model="cardFormData.variantId" placeholder="" >
                    <el-option v-for="item in cardTypes" :key="item.id" :label="item.name" :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="到期时间">
                  <el-form-item prop="expireAt">
                    <el-date-picker type="date" placeholder="选择日期" v-model="cardFormData.expireAt" format="MM 月 dd 日" value-format="MM-dd" style="width: 100%;"></el-date-picker>
                  </el-form-item>
                </el-form-item>
                <el-form-item label="会员密码" prop="paymentPassword">
                  <el-input v-model="cardFormData.paymentPassword"></el-input>
                </el-form-item>
                <el-form-item label="付款方式" prop="paymentMethodId" required>
                  <el-select v-model="cardFormData.paymentMethodId" placeholder="请选择支付方式" >
                    <el-option v-for="item in paymentMethods" :key="item.id" :label="item.name" :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="充值金额"  required>
                  <el-input v-model="cardFormData.paymentAmount"></el-input>
                </el-form-item>
                <el-form-item label="备注" prop="address">
                  <el-input v-model="cardFormData.cardMemo"></el-input>
                </el-form-item>
            </el-card>
          </el-form>

        </el-col>
      </el-row>
        <el-row :gutter="20" type="flex"  justify="center">
          <el-col :span="10">
            <div class="actions">
              <el-button type="primary" @click="addCustomer">立即创建</el-button>
              <el-button @click="resetForm('memberFormData')">重置</el-button>
              <el-button @click="fillIn()" type="danger">测试填入</el-button>
            </div>
          </el-col>
        </el-row>

    </el-dialog>
    <!-- 会员添加窗口 -> END -->
  </div>
</template>


<script>
// ***接口***
// 入口:props: ["inputNumber"]
// 出口:this.$emit("AddMemberReturnData", this.returnData);
// **********

import { createCustomer, customerMobileValidate } from "@/api/getData";
import { orderDataMixin } from "@/components/mixin/commonDataMixin"
import { apiResultMixin } from '@/components/apiResultMixin'

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

    //验证规则---电话号码
    var validPhone = (rule, value, callback) => {

        customerMobileValidate( value ).then(function(response){
          if( response.result ){
            callback();
          }else{
            callback(new Error("电话号码已经注册过。"))
          }
        },function(error){
          callback(new Error(error))
        });
    };

    return {
      top: '0', /* 去除直接传 0 产生的 需要参数为string的警告 */
      memberFormData: {
        username: "",
        mobile: "",
        birth: "",
        address: "",
      },
      cardFormData: {
        cardNumber: "",
        paymentAmount: null,
        expireAt: "",
        paymentMethodId: null,
        variantId: null,
        memo: ""
      },

      createCustomerData: { user: {} },
      returnData: {}, //添加会员方法,异步,请求服务器,调用getData.js中createCustomer
      rules: {
        cardNumber: [
          {
             required: true,
             min: 4,
             max: 11,
             message: "卡号为长度在 4 到 11 个数字和字母",
             trigger: "blur"
          },
          //{ validator: checkmemberNum, trigger: "blur" }
        ],

        mobile: [
          { type:"string", required: true, message: "请输入正确的电话号码", pattern: /^1[3|4|5|7|8][0-9]\d{8}$/, trigger: "blur" },
          { validator: validPhone, message: "电话号码已经注册过。", trigger: "blur" }
        ],
        paymentPassword: [
          {
            min: 6,
            max: 11,
            message: "长度在 6 到 11 个字符",
            trigger: "blur"
          }
        ],
        paymentAmount: [
          {  type:"integer",  required: true, message: "请输入充值金额", trigger: "blur" },
          {
            min: 0,
            max: 1000000,
            message: "请输入有效充值金额",
            trigger: "blur"
          }
        ],
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
  methods: {
    handleOpenDialog(){
      this.$refs["memberFormData"].resetFields();
      this.$refs["cardFormData"].resetFields();

      if( !this.paymentMethods ){
        this.getPaymentMethods().then(()=>{
          if( this.paymentMethods.length > 0){
            this.cardFormData.paymentMethodId = this.paymentMethods[0].id
          }
        })
      }
      if( !this.cardTypes ){
        this.getCardTypes().then(()=>{
          if( this.cardTypes.length > 0){
            console.log(" this.cardTypes",  this.cardTypes )
            this.cardFormData.variantId = this.cardTypes[0].id
          }
        })
      }
    },

    //提交
    addCustomer(formName) {

      let validations = [this.$refs["memberFormData"].validate()]
      //如果创建会员卡，需要验证会员卡的表单
      if( this.cardFormData.cardNumber.length > 0){
        validations.push(this.$refs["cardFormData"].validate() )
      }

      Promise.all(validations).then((val)=>{
        console.log( "promise all ->", val )
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
      }).catch(error=>{
        this.$alert("请仔细检测表格", "错误提示", {
          confirmButtonText: "确定"
        })
        return false
      })

    },

    //重置
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    //转换成SerVer需要的数据
    buildParams() {
      this.createCustomerData.user.username = this.memberFormData.username;
      this.createCustomerData.user.mobile = this.memberFormData.mobile;
      this.createCustomerData.user.payment_password = this.cardFormData.paymentPassword;
      this.createCustomerData.user.address = this.memberFormData.address;
      this.createCustomerData.user.birth = this.memberFormData.birth;
      let user = {
        username:  this.memberFormData.username,
        mobile:  this.memberFormData.mobile,
        paymentPassword:  this.memberFormData.paymentPassword,
        address:  this.memberFormData.address,
        birth:  this.memberFormData.birth
      }

      let order = null
      if( false ){
        order = {
          line_items: [
            { variant_id: this.cardFormData.variantId, price: 2000, quantity: 1 }
          ],
          payments:[
            { payment_method_id: this.cardFormData.paymentMethodId, amount:this.cardFormData.paymentAmount }
          ]
        }
      }
      return { user, order }
    },

    fillIn() {
      this.memberFormData.memberNum = "9874556";
      this.memberFormData.paymentPassword = "9874556";
      this.memberFormData.paymentPasswordConfirm = "9874556";
      this.memberFormData.mobile = "13000000000";
      this.memberFormData.birth = new Date();
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
  .actions{
    margin: 16px auto;
    text-align: center;

  }
}
</style>
