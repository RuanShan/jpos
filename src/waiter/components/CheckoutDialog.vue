<style lang="scss" >

.checkout-form {
    margin: 50px 0;
    table {
        width: 100%;
    }
    .input-with-select .el-select {
        min-width: 100px;
    }
}
.check-button {
    line-height: 50px;
    height: 50px;
    text-align: center;
    font-size: 21px;
    color: #fff;
    background-color: #67c23a;
    border-color: #67c23a;
}

.checkout-container {

    .el-col {
        border-radius: 4px;
    }
    .bg-purple-dark {
        background: #99a9bf;
    }
    .bg-purple {
        background: #d3dce6;
    }
    .bg-purple-light {
        background: #e5e9f2;
    }
    .grid-content {
        border-radius: 4px;
        min-height: 36px;
    }
    .row-bg {
        padding: 10px 0;
        background-color: #f9fafc;
    }
    .checkboxGroup {
        width: 100%;
    }
    .switchButtons {
        height: 40px;
        line-height: 40px;
    }
    .checkout-form-wrap{
      .checkout-form{
        width: 400px;
        margin: 0 auto;
        .align-right input{
          text-align: right;
        }
        .el-form-item__content{
          margin-right: 50px;
        }
      }
      table{
        width: 440px;
        margin: 0 auto;
        th{
          width: 8em;
        }
      }
    }
    .payment-card{
      .el-input-group__prepend{
        width: 110px;
      }
      .card-extra-info{
        position: absolute;
        right: 0;
      }
    }
    .payment{
      .el-select{
        width: 110px;
      }
      .el-input-group > .el-input__inner {
          text-align: right;
      }
    }
}
</style>
<template>
<div class="checkout-container">
  <el-dialog :visible="computedVisible" :show-close="false" @open="handleDialogOpened" @close="handleDialogClosed">
    <div slot="title" class="dialog-title-wrap">
      <div class="right back"> <i class="el-icon-close" @click="handleCloseDialog()"></i> </div>
      <div> 结算</div>
    </div>

    <div class="checkout-form-wrap">
      <el-form :model="formData" :rules="rules" ref="formData" status-icon label-width="100px" class="checkout-form">
        <el-form-item label="应收金额">
          <el-input v-model="totalMoney" readonly class="money align-right"></el-input>
        </el-form-item>

        <el-form-item label="会员卡支付" v-if="isShowPrepaidCard">

          <el-input v-model="formData.prepaidCardAmount" placeholder="" class="payment-card money align-right">
            <template slot="prepend">
              <div>
                <p>{{availablePrepaidCard.code}}</p>
                <p>{{availablePrepaidCard.code}}</p>
              </div>
            </template>
          </el-input>
          <div class=" card-extra-info"> extra </div>
        </el-form-item>

        <el-form-item label="会员支付密码" v-if="false">
          <el-input v-model="formData.paymentPassword" placeholder="" class="money align-right" type="password"></el-input>
        </el-form-item>

        <el-form-item label="支付方式"  class="payment">
          <el-input v-model="formData.paymentAmount" placeholder="" class="money">
            <el-select v-model="formData.selectPaymentMethodId" placeholder=""  slot="prepend" >
              <el-option v-for="item in activePaymentMethods" :key="item.id" :label="item.name" :value="item.id">
              </el-option>
            </el-select>
          </el-input>
        </el-form-item>

      </el-form>

    </div>


    <div slot="footer" class="dialog-footer">
      <el-row>
        <el-button @click="handleCloseDialog()">取消</el-button>
        <el-button type="success" @click="handlePlaceOrder()">确定</el-button>
      </el-row>
    </div>
  </el-dialog>
</div>
</template>

<script>
import { checkout } from "@/api/getData"
import { orderDataMixin } from "@/components/mixin/commonDataMixin"

import {
  DialogMixin
} from '@/components/mixin/DialogMixin'

import {
  mapState
} from "vuex"

export default {
  props: ["dialogVisible", "storeName", "orderItemList", "totalMoney", "customer"],
  components: {  },
  data() {
    return {
      //微信,支付宝
      //支付方式
      paymentMethodList: [      ],

      paymentList: [{
        type: "cash",
        amount: 0
      }],
      formData:{
        prepaidCardAmount: 0,
        paymentAmount: 0,
        paymentPassword: null,
        enablePrepaidCard: true,
        selectPaymentMethodId: null,
      },
      rules:{
        paymentAmount:[
          { required: true, type: 'number', trigger: 'change' }
        ]
      },
      payments: [], //支付被方式选择数字,返回已经被选择的lable,如""现金","微信"等
    };
  },
  mixins: [DialogMixin, orderDataMixin],
  computed: {
    ...mapState(["userInfo", "cartList"]),
    activePaymentMethods: function(){
      return this.paymentMethodList.filter((pm)=>{
        return pm.posable
      })
    },
    // 订单总价
    totalPrice: function() {
      let t = this.orderItemList.reduce((total, item)=>{
        return total += item.price
      }, 0)
      return t.toFixed(2)
    },
    availablePrepaidCard: function(){
      let card = this.customer.cards.find((card)=>{
        // 充值卡 && 可用状态 && 余额>0
        return card.style == 'prepaid' && card.status == 'enabled' && card.amountRemaining > 0
      })
      return card
    },
    isShowPrepaidCard: function(){
      return this.availablePrepaidCard != null
    },
    isShowCustomerPassword: function(){
      return this.isShowPrepaidCard && this.customer.paymentPassword.length>0
    },
    prepaidCardPaymentMethod: function(){
      return this.paymentMethodList.find((pm)=>{
        return (pm.name.indexOf('PrepaidCard') >= 0 )
      })
    },
    //结账请求参数
    checkoutParams: function(){
      //"payment_source": {this.availablePrepaidCard.id
      //  "1": {
      //    "number": "4111111111111111",
      //  }
      //}
      let paymentsAttributes = []
      if( this.availablePrepaidCard){
        if( this.prepaidCardPaymentMethod ){
          paymentsAttributes.push( { source_id: this.availablePrepaidCard.id, source_type: "Spree::Card",
            amount: this.formData.prepaidCardAmount, payment_method_id: this.prepaidCardPaymentMethod.id } )
        }
      }
      //需要其他支付方式
      if( this.orderRemainder > 0 ){
        paymentsAttributes.push( { payment_method_id: this.selectPaymentMethodId } )
      }

      let order =  { user_id: this.customer.id,  payments: paymentsAttributes }
      order.line_items = this.orderItemList.map((item)=>{ return { quantity: 1, variant_id: item.variantId, cname: item.cname, group_position: item.groupPosition, memo: item.memo}})
console.log( " this.checkoutParams", order)
      return { order: order }
    },
    // 除了会员支付方式之外，其他支付方式余额
    orderRemainder() {
      let remainder = this.totalMoney
      return remainder - this.formData.prepaidCardAmount - this.formData.paymentAmount
    }
  },
  methods: {
    async handleDialogOpened(){
      await this.getPaymentMethods()
      this.formData.paymentAmount = 0
      this.formData.prepaidCardAmount = 0

      this.paymentMethodList = this.paymentMethods
      if( this.paymentMethodList.length>0){
        this.selectPaymentMethodId = this.paymentMethodList[0].id
      }

      let card = this.availablePrepaidCard
      if( card != null){
        //会员卡的余额是否够用
        this.formData.prepaidCardAmount = ( card.amountRemaining >= this.totalPrice ? this.totalPrice : (this.totalPrice - card.amountRemaining) )
      }
      if( this.orderRemainder>0){
        this.formData.paymentAmount = this.orderRemainder
      }

      console.log( "handleDialogOpened customer=",this.customer, this.paymentMethodList,this.activePaymentMethods )
    },
    handleDialogClosed() {
      this.paymentList = [];
    },

    //确认按钮单击事件处理函数-----
    handlePlaceOrder() {

        checkout( this.checkoutParams  ).then((res)=>{
          if( res.id> 0){
            this.$bus.$emit('OrderCreatedEvent')

            this.$emit('update:dialogVisible', false)

            this.$message({
              title: "订单提交成功",
              message: "这是虚拟的,假设的,实验用的,非真实的.请注意!!!!!"
            });
          }else{
            this.$message({
              title: "订单提交失败",
              message: res.error
            });
          }

        })

    },
    messageBox(string1, string2) {
      this.$alert(string1, string2, {
        confirmButtonText: "确定",
        callback: action => {
          this.$message({
            type: "info",
            message: `action: ${action}`
          });
        }
      });
    }
  },

};
</script>
<style lang="scss" >
.checkout-form {
    margin: 50px 0;
    table {
        width: 100%;
    }
}
.check-button {
    line-height: 50px;
    height: 50px;
    text-align: center;
    font-size: 21px;
    color: #fff;
    background-color: #67c23a;
    border-color: #67c23a;
}

.checkout-container {
    .el-col {
        border-radius: 4px;
    }
    .bg-purple-dark {
        background: #99a9bf;
    }
    .bg-purple {
        background: #d3dce6;
    }
    .bg-purple-light {
        background: #e5e9f2;
    }
    .grid-content {
        border-radius: 4px;
        min-height: 36px;
    }
    .row-bg {
        padding: 10px 0;
        background-color: #f9fafc;
    }
    .checkboxGroup {
        width: 100%;
    }
    .switchButtons {
        height: 40px;
        line-height: 40px;
    }
}
</style>
