<style lang="scss" >
.card-add-dialog {
  .box-card {
  }
  .new-member-form {
    margin: 20px 10px;
  }
  .actions {
    margin: 0 auto 20px ;
    text-align: center;
  }
  .el-dialog{
    width: 65%;
    margin-top: 10vh;
  }
  .order-wrap{
    width: 90%;
    margin: auto;
  }
  .table  {

    td,th{
      padding: 12px 10px;
      border: 1px solid #ebeef5;
    }
    tr {
      vertical-align: top;
    }
  }
}
</style>

<template>
  <div class=" ">
    <!-- 会员添加窗口 -> START -->
    <el-dialog  :visible="computedVisible"  :show-close="false" class="cel-dialog card-add-dialog"  append-to-body @open="handleOpenDialog">

      <div slot="title" class="title-wrap">
        <div class="left back">
          <i class="el-icon-back" @click="handleCloseDialog()"></i>
        </div>
        <div> 添加会员卡支付订单</div>
      </div>
      <div class="order-wrap">
        <table class="table">
        <tr>
        <th>客户电话</th><th>支付状态</th><th>订单日期</th><th>金额</th>
        </tr>
        <tr><td> {{orderData.customer.mobile}}</td>
          <td>{{orderData.displayPaymentState}} </td>
          <td> {{orderData.createdAt.format("YYYY-MM-DD H:mm")}}</td>
          <td> {{ orderData.total }}</td>
        </tr>
      </table>
      </div>

      <el-row type="flex" justify="center">
        <el-col :span="11">
          <el-form :model="customerFormData" :rules="memberRules" ref="customerFormData" status-icon label-width="100px" class="new-member-form">
            <el-card class="box-card">
              <div slot="header" class="clearfix">
                <span>客户基本信息</span>
                 <el-checkbox label="添加会员卡" name="cardFlag" v-model="cardFlag" style="float: right; " class="hide"></el-checkbox>
              </div>
              <el-form-item label="电话" prop="mobile" required>
                <el-input v-model="customerFormData.mobile"></el-input>
              </el-form-item>
              <el-form-item label="姓名" prop="userName">
                <el-input v-model="customerFormData.userName"></el-input>
              </el-form-item>
              <el-form-item label="性别" prop="gender">
                <el-select v-model="customerFormData.gender" placeholder="请选择" style="width:100%">
                  <el-option v-for="item in sex" :key="item.value" :value="item.value" :label="item.label">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="生日">
                <el-form-item prop="birth">
                  <el-date-picker type="date" placeholder="选择日期" v-model="customerFormData.birth" format="yyyy 年 MM 月 dd 日" style="width: 100%;"></el-date-picker>
                </el-form-item>
              </el-form-item>
              <el-form-item label="联系地址" prop="address">
                <el-input v-model="customerFormData.address"></el-input>
              </el-form-item>
              <el-form-item label="备注" prop="address">
                <el-input type="textarea" v-model="customerFormData.memo" style="height: 102px;"></el-input>
              </el-form-item>
            </el-card>
          </el-form>

        </el-col>
        <el-col :span="11" v-show="cardFlag">
          <el-form :model="cardFormData" :rules="cardRules" ref="cardFormData" status-icon label-width="100px" class="new-member-form">
            <el-card class="box-card">
              <div slot="header" class="clearfix">
                <span>会员卡信息</span>
              </div>
              <el-form-item label="会员卡号" prop="code" required>
                <el-input v-model="cardFormData.code"></el-input>
              </el-form-item>
              <el-form-item label="会员卡类型" prop="variantId" required>
                <el-select v-model="cardFormData.variantId" placeholder="" @change="handleCardChanged">
                  <el-option v-for="item in cardTypeList" :key="item.masterId" :label="item.name" :value="item.masterId">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="到期时间">
                <el-form-item prop="expireAt">
                  <el-date-picker type="date" placeholder="选择日期" v-model="cardFormData.expireAt"
                    format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd" style="width: 100%;" :pickerOptions="pickerOptions"></el-date-picker>
                </el-form-item>
              </el-form-item>
              <el-form-item label="会员密码" prop="paymentPassword" required>
                <el-input type="password" v-model="cardFormData.paymentPassword" ></el-input>
              </el-form-item>
              <el-form-item label="付款方式" prop="paymentMethodId" required>
                <el-select v-model="cardFormData.paymentMethodId" placeholder="请选择支付方式">
                  <el-option v-for="item in activePaymentMethods" :key="item.id" :label="item.name" :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-row >
                <el-col :span="12" >
                  <el-form-item label="充值金额" required>
                    <el-input type="number" v-model="cardFormData.amount"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12" >
                  <el-form-item label="付款金额" required>
                    <el-input type="number" v-model="cardFormData.money"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-form-item label="备注" prop="address">
                <el-input v-model="cardFormData.memo"></el-input>
              </el-form-item>
            </el-card>
          </el-form>

        </el-col>
      </el-row>
      <el-row type="flex" justify="center">
        <el-col :span="10">
          <div class="actions">
            <el-button type="primary" @click="depositCard">立即创建</el-button>
            <el-button @click="closeDialog">关闭</el-button>
          </div>
        </el-col>
      </el-row>

    </el-dialog>
    <!-- 会员添加窗口 -> END -->
  </div>
</template>


<script>
// ***接口***
// 入口:props: ["member"]
// 出口:this.$emit("AddMemberReturnData", this.returnData);
// **********
import moment from 'moment'

import { repayByNewcard, updateCustomer, customerMobileValidate, isCodeAvailable } from "@/api/getData";

import {
  DialogMixin
} from '@/components/mixin/DialogMixin'

export default {
  props: ["customerData", "orderData", 'dialogVisible'],
  mixins: [DialogMixin],
  data() {
    //验证卡号--1.不能空;2.必须是数字;3.四至十一个字符
    var validateCardCode = (rule, value, callback) => {
      isCodeAvailable(value).then(function (response) {
        if (response.ret) {
          callback();
        } else {
          callback(new Error("会员卡号码已经存在。"))
        }
      }, function (error) {
        callback(new Error(error))
      });
    };

    //验证规则---电话号码
    var validPhone = (rule, value, callback) => {
      let cid = this.customerData.id
      customerMobileValidate(value, cid).then(function (response) {
        if (response.ret) {
          callback();
        } else {
          callback(new Error("电话号码已经注册过。"))
        }
      }, function (error) {
        callback(new Error(error))
      });
    };

    return {
      paymentMethodList: [],
      cardTypeList: [],
      customerFormData: {
        userName: "",
        mobile: "",
        birth: "",
        address: "",
        gender: 'male',
        memo: ''
      },
      sex: [{
        value: 'male',
        label: '男',
      }, {
        value: 'female',
        label: '女',
      }],
      cardFormData: {
        code: "",
        amount: null,
        money: null,
        expireAt: "",
        paymentMethodId: null,
        paymentPassword: null,
        variantId: null,
        memo: ""
      },
      returnData: {}, //添加会员方法,异步,请求服务器,调用getData.js中createCustomer
      memberRules: {
        mobile: [
          { type: "string", required: true, message: "请输入正确的电话号码", pattern: /^1[3|4|5|7|8][0-9]\d{8}$/, trigger: "blur" },
          { validator: validPhone, message: "电话号码已经注册过。", trigger: "blur" }
        ]
      },
      cardRules: {
        code: [
          {
            required: true,
            min: 4,
            max: 11,
            message: "卡号为长度在 4 到 11 个数字和字母",
            trigger: "blur"
          },
          { validator: validateCardCode, trigger: "blur" }
        ],
        paymentPassword: [
          { type: "string", required: true, message: "请输入支付密码"},
          {
            min: 6,
            max: 12,
            message: "长度在 6 到 12 个字符",
            trigger: "blur"
          }
        ],
        amount: [
          { type: "integer", required: true, message: "请输入充值金额", trigger: "blur" },
          {
            min: 0,
            max: 1000000,
            message: "请输入有效充值金额",
            trigger: "blur"
          }
        ],
      },

      pickerOptions: {
         shortcuts: [{
           text: '一年',
           onClick(picker) {
             picker.$emit('pick', moment().add(1, 'years').toDate());
           }
         }, {
           text: '不限',
           onClick(picker) {
             picker.$emit('pick', null);
           }
         }]
       },
      cardFlag: true
    };
  },
  computed: {
    isAddingCard: function () {
      return this.cardFlag
    },
    activePaymentMethods: function () {
      return this.paymentMethodList.filter((pm) => {
        return pm.posable
      })
    }
  },
  methods: {
    async handleOpenDialog() {
      console.log("MemberCardAdd handleOpenDialog", this.customerData)
      this.paymentMethodList = await this.getPaymentMethods()

      if (this.activePaymentMethods.length > 0) {
        this.cardFormData.paymentMethodId = this.activePaymentMethods[0].id
      }
      // 按照类型排序，按照名称排序
      this.cardTypeList = await this.getCardTypes()

      if (this.cardTypeList.length > 0) {
        this.cardFormData.variantId = this.cardTypeList[0].masterId
      }

      //this.$nextTick(function () {
        this.$refs.customerFormData.resetFields();
        this.$refs.cardFormData.resetFields();
      //})
      this.customerFormData = Object.assign({}, this.customerData)

      console.log("MemberAdd handleOpenDialog end")
    },
    closeDialog(){
      this.resetForm('customerFormData')
      this.handleCloseDialog()
    },
    // 重新支付，客户领取物品时付款
    depositCard(formName) {
      let validations = [this.$refs["customerFormData"].validate()]
      //如果创建会员卡，需要验证会员卡的表单
      if (this.isAddingCard) {
        validations.push(this.$refs["cardFormData"].validate())
      }

      Promise.all(validations).then((val) => {
        let cid = this.customerData.id

        let params = this.buildCheckoutParams()

        repayByNewcard( this.orderData.id, params ).then((result)=>{
          if( result.id ){
            this.$message( {
              message: '恭喜你，会员卡创建成功',
              type: 'success'
            });
            let order = this.buildOrder( result )

            this.$emit("order-changed-event", order);

            let cparams = this.buildCustomerParams()
            updateCustomer(cid, cparams).then((cresult) => {
              //const customer = this.buildCustomer(cresult)
              // POS选择刚创建的客户
              this.handleCloseDialog()
            })

          }else {
            //判读返回的数据中是否有错误
            //如果返回数据中有错误
            this.$alert(this.returnData.error, "错误提示", {
              confirmButtonText: "确定"
            });
            return false;
          }
        })

      }).catch(error => {
        console.error( error )
        this.$alert("请仔细检测表格", "错误提示", {
          confirmButtonText: "确定"
        })
        return false
      })
    },
    //
    recreatePayment( orderId, params ) {
      // params = { payments, line_item_ids}
        repayByNewcard( orderId, params ).then((res)=>{
          if( res.id){
            //发送支付创建时间
            let order = this.buildOrder( res )

            this.$emit('payment-created-event',  order )
            this.$emit('update:dialogVisible', false)
            this.$message({
              type: 'success',
              message: "恭喜你，订单支付成功"
            });

          }else{
            this.$message({
              title: "订单支付失败",
              message: res.error
            });
          }
        })
    },
    //重置
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    //改变选择的充值卡类型
    handleCardChanged(val){
      let card = this.cardTypeList.find((o)=>o.masterId == val)
      console.log( " handle card changed .", val, card )
      this.cardFormData.amount = card.price
      this.cardFormData.money = card.price
    },
    //转换成SerVer需要的数据
    buildCustomerParams() {
      let user = {
        username: this.customerFormData.userName,
        mobile: this.customerFormData.mobile,
        address: this.customerFormData.address,
        birth: this.customerFormData.birth,
        gender: this.customerFormData.gender,
        store_id: this.storeId,
        memo: this.customerFormData.memo
      }

      return { user }
    },
    buildCheckoutParams(){
      let orderParams = {
        //enable_mp_msg: true,
        store_id: this.storeId,
        user_id: this.customerData.id,
        order_type: 'card',
        line_items: [
          { variant_id: this.cardFormData.variantId, price: this.cardFormData.paymentAmount, quantity: 1, sale_unit_price: this.cardFormData.money, card_code: this.cardFormData.code  }
        ],
        payments: [{
            payment_method_id:  this.cardFormData.paymentMethodId,
            amount: this.cardFormData.paymentAmount
          }]
      }
      let cardParams = {code: this.cardFormData.code,
        payment_password: this.cardFormData.paymentPassword,
        expire_at: this.cardFormData.expireAt,
        memo: this.cardFormData.memo
      }

      return {order: orderParams, card: cardParams}

    },
    computeGroupPrice(group){
      // let total = group.lineItems.reduce((sum, item)=>{
      //   if( this.currentPrepaidCard ){
      //     sum+= ( item.saleUnitPrice * item.quantity * this.currentPrepaidCard.discountPercent /100 )
      //   }else{
      //     sum+= ( item.saleUnitPrice * item.quantity   )
      //   }
      //   return sum
      // }, 0)
      return parseInt( 100 )
    },
  }
};
</script>
