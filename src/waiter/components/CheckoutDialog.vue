<style lang="scss" >
.checkout-container {
    .checkboxGroup {
        width: 100%;
    }
    .switchButtons {
        height: 40px;
        line-height: 40px;
    }
    .checkout-form-wrap{
      .checkout-form{
        width: 600px;
        margin: 0 auto;
        .align-right input{
          text-align: right;
        }
        .el-form-item__content{
          margin-right: 50px;
        }
        .input-with-select .el-select {
            min-width: 100px;
        }
        .el-checkbox+.el-checkbox {
            margin-left: 20px;
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
  <el-dialog :visible="computedVisible" :show-close="false" @open="handleDialogOpened" @close="handleDialogClosed" class="cel-dialog">
    <div slot="title" class="dialog-title-wrap">
      <div class="right back"> <i class="el-icon-close" @click="handleCloseDialog()"></i> </div>
      <div> 结账 </div>
    </div>

    <div class="checkout-form-wrap">
      <el-form :model="formData" :rules="rules" ref="formData" label-width="100px" class="checkout-form">
        <el-form-item label="应收金额">
          <el-input v-model="totalMoney" readonly class="money align-right">
          </el-input>
        </el-form-item>
        <el-form-item label="会员卡支付" v-if="isShowPrepaidCard" required  prop="prepaidCardAmount">
          <el-input v-model="formData.prepaidCardAmount" placeholder="" class="payment-card money align-right"  :disabled="!formData.enablePrepaidCard">
            <template slot="prepend">
              <div>
                <p>{{availablePrepaidCard.name}}</p>
                <p>卡号{{availablePrepaidCard.code}}余额{{availablePrepaidCard.amountRemaining}}</p>
              </div>
            </template>
          </el-input>
          <el-checkbox label="使用会员卡"  v-model="formData.enablePrepaidCard" @change="handleEnablePrepaidCard"></el-checkbox>
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
        <el-form-item label="备注" prop="memo" >
          <el-input type="textarea" v-model="formData.memo"></el-input>
        </el-form-item>
        <el-form-item>
            <el-checkbox label="打印条码" v-model="formData.isPrintLabel"></el-checkbox>
            <el-checkbox label="打印小票" v-model="formData.isPrintReceipt"></el-checkbox>
            <el-checkbox label="公众号电子小票" v-model="formData.enableMpMsg"></el-checkbox>
            <el-checkbox label="短信息" v-model="formData.enableSms"></el-checkbox>
        </el-form-item>
        <el-form-item>
          <el-button type="warning" @click="handleCreateOrderWithoutPayment" v-show="!existedOrderId">取单时结账</el-button>
          <div class="right">
            <el-button type="success" @click="handleCreateOrderAndPayment" :disabled="disableCheckoutButton">结账</el-button>
            <el-button @click="handleCloseDialog()">取消</el-button>
          </div>
        </el-form-item>
      </el-form>
    </div>
  </el-dialog>
</div>
</template>

<script>
import _ from "lodash"

import { checkout, addPayments } from "@/api/getData"
import {
  PrintUtil
} from '@/utils/ipcService'

import {
  DialogMixin
} from '@/components/mixin/DialogMixin'

export default {
  props: ["dialogVisible", "orderItemList", "totalMoney", "customer", "disableCheckoutWidthoutPayment"],
  components: {  },
  data() {
    return {
      //微信,支付宝
      //支付方式
      paymentMethodList: [      ],

      formData:{
        prepaidCardAmount: 0,
        paymentAmount: 0,
        paymentPassword: null,
        enablePrepaidCard: false,
        selectPaymentMethodId: null,
        checkList:[],
        isPrintLabel: true,
        isPrintReceipt: false,
        enableSms: false,
        enableMpMsg: true,
      },
      rules:{
        paymentAmount:[
          { required: true, type: 'number', trigger: 'change' }
        ]
      },
      disableCheckoutButton: false,
      //payments: [], //支付被方式选择数字,返回已经被选择的lable,如""现金","微信"等
    };
  },
  mixins: [DialogMixin],
  computed: {
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
      return t.toFixed(0)
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
    //检查订单ID是否存在，如果存在结账时，只需要付款，无需创建订单
    existedOrderId: function(){
      let item = this.orderItemList.find( (item)=>{
        return item.orderId != null
      })
      return ( item != null ? item.orderId : null )
    },
    //结账请求参数
    checkoutParams: function(){
      //"payment_source": {this.availablePrepaidCard.id
      //  "1": {
      //    "number": "4111111111111111",
      //  }
      //}
      let paymentsAttributes = []
      if( this.formData.enablePrepaidCard ){
        paymentsAttributes.push( { source_id: this.availablePrepaidCard.id, source_type: "Spree::Card",
          amount: this.formData.prepaidCardAmount, payment_method_id: this.prepaidCardPaymentMethod.id } )
      }
      console.log( "this.orderRemainder=",this.orderRemainder)
      console.log( "this.orderItemList=",this.orderItemList)
      let remain = this.formData.prepaidCardAmount - this.totalMoney
      //需要其他支付方式
      if( remain < 0 ){
        paymentsAttributes.push( { payment_method_id: this.formData.selectPaymentMethodId, amount: this.formData.paymentAmount } )
      }
      //  index  cname  discount  groupPosition memo name  price productId quantity
      //  unitPrice  variantId  variantName
      let order =  { user_id: this.customer.id,  payments: paymentsAttributes, enable_sms: this.formData.enableSms, enable_mp_msg: this.formData.enableMpMsg }
      order.line_items_attributes = this.orderItemList.map((item)=>{
        return { quantity: item.quantity, variant_id: item.variantId, cname: item.cname,
          group_position: item.groupPosition, memo: item.memo,
          sale_unit_price: item.unitPrice, discount_percent: item.discount, price: item.price,
        }
      })

      return { order: order }
    },
    // 除了会员支付方式之外，其他支付方式余额
    orderRemainder() {
      let remainder = this.totalMoney
      return remainder - this.formData.prepaidCardAmount - this.formData.paymentAmount
    }
  },
  methods: {
    handleDialogOpened(){
      this.disableCheckoutButton = false
      this.getPaymentMethods().then(()=>{
        this.paymentMethodList = this.paymentMethods
        if( this.activePaymentMethods.length>0){
          this.formData.selectPaymentMethodId = this.activePaymentMethods[0].id
          console.log( "this.formData.selectPaymentMethodId=", this.formData.selectPaymentMethodId)
        }
      })

      this.formData.paymentAmount = 0
      this.formData.prepaidCardAmount = 0



      if( this.availablePrepaidCard != null){
        //会员卡的余额是否够用
        if( this.availablePrepaidCard.amountRemaining>0){
          this.formData.enablePrepaidCard = true
        }
      }
      this.computePaymentAmount()
    },
    computePaymentAmount(){
      console.log( "this.formData.enablePrepaidCard=", this.formData.enablePrepaidCard )
      if( this.formData.enablePrepaidCard ){
        let card = this.availablePrepaidCard
        this.formData.prepaidCardAmount = ( card.amountRemaining >= this.totalPrice ? this.totalPrice : (this.totalPrice - card.amountRemaining) )
      }else{
        this.formData.prepaidCardAmount = 0
      }
      if( this.orderRemainder>0){
        this.formData.paymentAmount = this.orderRemainder
      }

      console.log( "handleDialogOpened customer=",this.customer, this.paymentMethodList,this.activePaymentMethods )
    },
    handleDialogClosed() {
      this.paymentMethodList = [];
    },
    //创建订单
    CreateOrder( params ) {
      console.log( " CreateOrder params=", params )
        checkout( params ).then((res)=>{
          if( res.id> 0){
            let order = this.buildOrder( res )
            console.log("checkout dialog res->",params, res, order)
            this.$emit('order-created-event', res )
            this.$emit('update:dialogVisible', false)
            //if( this.formData.isPrintReceipt ){
            order.displayCreatedDateTime = order.createdAt.format('YYYY年MM月DD日 HH时 mm分 ss秒') //'2018年07月11日 20时 35分 05秒'
            let printParams = { labelPrinter: this.storeInfo.labelPrinter, receiptTitle: this.storeInfo.receiptTitle, receiptFooter: this.storeInfo.receiptFooter, storeName: this.storeInfo.name,  order: order }
            PrintUtil.printReceipt( printParams )
            PrintUtil.printLabel( printParams )

            //}
            this.$message({
              type: 'success',
              message: "恭喜你，订单提交成功"
            });

          }else{
            this.$message({
              title: "订单提交失败",
              message: res.error
            });
          }
        })
    },
    //创建支付，客户领取物品时付款
    CreatePayment( orderId, payments ) {
        addPayments( orderId, payments ).then((res)=>{
          if( res.count> 0){
            //发送支付创建时间
            this.$emit('payment-created-event', res )
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
    handleCreateOrderAndPayment(){
      //250毫秒以后才可以调用，以防鼠标多次点击
      this.handleCreateOrderAndPaymentAsync(this)
    },
    handleCreateOrderWithoutPayment(){
      if( this.orderRemainder > 0){
        this.$message({
          type: "error",
          message: '请输入正确金额！'
        });
        return
      }
      let params = this.checkoutParams
      params.order.payments = null
      this.CreateOrder( params )
    },
    handleCreateOrderAndPaymentAsync:_.debounce(( vm) => {
      //防抖，防止多次提交
      let that = vm
      that.disableCheckoutButton = true
      let params = that.checkoutParams
      console.log( "handleCreateOrderAndPayment", that.existedOrderId )
      if( that.existedOrderId != null){
        let payments = params.order.payments
        that.CreatePayment( that.existedOrderId, payments )
      }else{
        that.CreateOrder( params )
      }
      that.disableCheckoutButton = false
    }, 250),
    handleEnablePrepaidCard(newValue){
      //重新计算各个支付方式需要支付多少
      this.computePaymentAmount()
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
    },
    testPrint(){
      PrintUtil.printLabel()
      PrintUtil.printReceipt()
    }
  },

};
</script>
