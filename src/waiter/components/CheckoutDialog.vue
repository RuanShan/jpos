<style lang="scss" >
.checkout-container {
    .checkboxGroup {
        width: 100%;
    }
    .switchButtons {
        height: 40px;
        line-height: 40px;
    }


}
.checkout-form-wrap{
  .checkout-form{
    width: 680px;
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
  .el-table{
    line-height: 1;
    .el-table__body-wrapper {
      &::-webkit-scrollbar{
        width: 5px;
        height: 5px;
      }
    }
  }
  .image-wrap {
    text-align: center;
    img{
      max-width: 60px;
      max-height: 60px;
      vertical-align: middle;
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
  .payment-card{
    .el-input-group__prepend{
      width: 110px;
    }
    .card-extra-info{
      position: absolute;
      right: 0;
    }
  }
}

</style>
<template>
<div class="checkout-container">
  <el-dialog :visible="computedVisible" :append-to-body="true"	:show-close="false" @open="handleDialogOpened"  class="cel-dialog">
    <div slot="title" class="dialog-title-wrap">
      <div class="right back"> <i class="el-icon-close" @click="handleCloseDialog"></i> </div>
      <div> 结账 </div>
    </div>

    <div class="checkout-form-wrap">
      <el-form :model="formData" :rules="rules" ref="formData" label-width="120px" class="checkout-form">
        <el-form-item label="订单信息" v-if="existedOrderId">
          <el-table ref="multipleTable" :data="existedLineItemGroups" border max-height="240" @selection-change="groupSelectionChange">
            <el-table-column  type="selection" width="40" label="" :selectable="isGroupUnpaid"> </el-table-column>
            <el-table-column prop="displayPaymentState" label="支付状态" width="80">  </el-table-column>
            <el-table-column prop="displayCreatedAt" label="订单日期" align="center" width="100" >
              <template slot-scope="scope">
                <div>{{scope.row.createdAt.format("YYYY-MM-DD")}}</div>
                  <div>{{scope.row.createdAt.format("H:mm")}}</div>
              </template>
            </el-table-column>

            <el-table-column label="物品条码" width="110" align="center">
              <template slot-scope="scope">
                <div class="image-wrap">
                  <img :src="scope.row.imageUrl" alt="">
                </div>
                <div class="group-number">{{scope.row.number}} </div>
              </template>
            </el-table-column>
            <el-table-column prop="name" label="服务项目[备注]">
              <template slot-scope="scope">
                <div v-for="item in scope.row.lineItems">{{item.cname}}<span v-show="item.memo">[{{item.memo}}] </span></div>
              </template>
            </el-table-column>
            <el-table-column prop="price" label="金额" width="60">
              <template slot-scope="scope">
                <span>{{computeGroupPrice( scope.row )}} </span>
              </template>
            </el-table-column>

          </el-table>

        </el-form-item>

        <el-form-item label="应收金额" prop="totalPrice">
          <el-input v-model.number="formData.totalPrice" readonly class="money align-right"> </el-input>
        </el-form-item>
        <el-form-item label="会员充值卡支付" v-if="currentPrepaidCard"  prop="prepaidCardAmount">
          <el-input v-model="formData.prepaidCardAmount" placeholder="" class="payment-card money align-right"  :disabled="!formData.enablePrepaidCard">
            <template slot="prepend">
              <div>
                <p>{{currentCard.name}}</p>
                <p>卡号{{currentCard.code}} 余额{{currentCard.amountRemaining}}</p>
              </div>
            </template>
          </el-input>
          <el-checkbox label="使用充值卡"  v-model="formData.enablePrepaidCard" @change="handleEnablePrepaidCard"></el-checkbox>
        </el-form-item>
        <el-form-item label="会员次卡支付" v-if="isShowTimesCard" required  prop="timesCardAmount">
          <el-input v-model="formData.timesCardAmount" placeholder="" class="payment-card money align-right"  :disabled="!formData.enableTimesCard"  @change="handleTimesCardAmountChanged">
            <template slot="prepend">
              <div>
                <p>{{currentCard.name}}</p>
                <p>卡号{{currentCard.code}} 剩余次数{{currentCard.cardTimesRemaining}}</p>
              </div>
            </template>
          </el-input>
          <el-checkbox label="使用次卡"  v-model="formData.enableTimesCard" @change="handleEnablePrepaidCard"></el-checkbox>
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
            <el-button type="success" @click="handleCreateOrderAndPayment" :disabled="selectedOrderItems.length==0" :loading="checkoutLoading">结账</el-button>
            <el-button @click="handleCloseDialog">取消</el-button>
          </div>
        </el-form-item>
      </el-form>
    </div>
  </el-dialog>

</div>
</template>

<script>
import _ from "lodash"

import { checkout, addPayments, repay, validateCardPassword } from "@/api/getData"
import {
  PrintUtil
} from '@/utils/ipcService'

import {
  DialogMixin
} from '@/components/mixin/DialogMixin'


export default {
  props: {
    dialogVisible: Boolean,
    isRepay: { type: Boolean, default: false },
    orderItemList: { type: Array, default: []},
    totalMoney: [String,Number],
    customer: Object,
    card: Object
  },
  components: {  },
  data() {
    var checkPrepaidCardAmount = (rule, value, callback) => {
      if( this.formData.enablePrepaidCard ){
        if (value> this.currentCard.amountRemaining) {
          return callback(new Error('支付金额超过会员卡余额'));
        }
      }
      callback()
    }
    var checkTimesCardAmount = (rule, value, callback) => {
      if( this.formData.enableTimesCard ){
        if (value> this.currentCard.cardTimesRemaining) {
          return callback(new Error('支付次数超过次数卡余额'));
        }
      }
      callback()
    }
    return {
      //微信,支付宝
      //支付方式
      paymentMethodList: [      ],
      formData:{
        prepaidCardAmount: 0,
        timesCardAmount: 0,
        paymentAmount: 0,
        paymentPassword: null,
        enablePrepaidCard: false,
        enableTimesCard: false,
        selectPaymentMethodId: null,
        checkList:[],
        isPrintLabel: true,
        isPrintReceipt: false,
        enableSms: false,
        enableMpMsg: true,
        totalPrice: 0
      },
      rules:{
        totalPrice: [{ required: true, type: 'number', trigger: 'change', message: '请输入应收金额' }],
        paymentAmount:[
          { required: true, type: 'number', trigger: 'change' }
        ],
        prepaidCardAmount:[{validator: checkPrepaidCardAmount, trigger: 'blur'}],
        timesCardAmount:[{validator: checkTimesCardAmount, trigger: 'blur'}]
      },
      checkoutLoading: false,
      //payments: [], //支付被方式选择数字,返回已经被选择的lable,如""现金","微信"等
      selectedOrderItems: []

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
    computedTotalPrice: function() {
      let discount = 1
      if( this.currentPrepaidCard  && this.formData.enablePrepaidCard ){
        discount = this.currentPrepaidCard.discountPercent /100
      }
      let t = this.selectedOrderItems.reduce((total, item)=>{
        total+= ( item.saleUnitPrice * item.quantity *  discount )
        return total
      }, 0)
      return parseInt(t)
    },
    currentCard: function(){
      // card maybe nil, it would cause error, card.code
      return this.card == null ? {} : this.card
    },
    currentPrepaidCard: function(){
      let card = this.currentCard
      // 充值卡 && 可用状态 && !余额>0
      if( card.style == this.CardStyleEnum.prepaid && card.state == this.CardStateEnum.enabled ){
        return card
      }else{
        return null
      }
    },
    currentTimesCard: function(){
      let card = this.currentCard
      // 充值卡 && 可用状态 && 余额>0
      if( card.style == this.CardStyleEnum.times && card.state == this.CardStateEnum.enabled && card.cardTimesRemaining > 0 ){
        return card
      }else{
        return null
      }
    },

    isShowTimesCard: function(){
      return this.currentCard.style == this.CardStyleEnum.times
    },
    isPasswordRequired(){
      let isCardBelongsOtherStore = false
      if( this.currentPrepaidCard ){
        isCardBelongsOtherStore = (this.currentPrepaidCard.storeId != this.storeId)
      }
      //使用会员卡支付 && （店铺设置必须支付密码 || 这张卡是其它店铺的卡）
      console.log("store.checkoutPasswordRequired=",this.storeInfo.checkoutPasswordRequired, isCardBelongsOtherStore)
      return this.currentPrepaidCard && this.formData.enablePrepaidCard && (this.storeInfo.checkoutPasswordRequired || isCardBelongsOtherStore)
    },
    prepaidCardPaymentMethod(){
      if( this.paymentMethodList == null ) {
        return []
      }
      return this.paymentMethodList.find((pm)=>{
        return (pm.type.indexOf('PrepaidCard') >= 0 )
      })
    },
    //检查订单ID是否存在，如果存在结账时，只需要付款，无需创建订单
    existedOrderId(){
      let item = this.orderItemList.find( (item)=>{
        return item.orderId != null
      })
      return ( item != null ? item.orderId : null )
    },
    existedLineItemGroups(){

      let groups = this.orderItemList.map((item)=>{ return item.group})
      //console.log( "existedLineItemGroups=", groups)
      return _.chain(groups).uniq().compact(  ).value()

    },
    //结账请求参数
    checkoutParams: function(){
      //"payment_source": {this.currentPrepaidCard.id
      //  "1": {
      //    "number": "4111111111111111",
      //  }
      //}
      let paymentsAttributes = []
      console.log(" prepaidCardPaymentMethod =", this.prepaidCardPaymentMethod)
      if( this.formData.enablePrepaidCard ){
        paymentsAttributes.push( { source_id: this.currentPrepaidCard.id, source_type: "Spree::Card",
          amount: this.formData.prepaidCardAmount, payment_method_id: this.prepaidCardPaymentMethod.id } )
      }
      if( this.formData.enableTimesCard ){
        let amount = this.formData.totalPrice - this.formData.paymentAmount
        paymentsAttributes.push( { source_id: this.currentTimesCard.id, source_type: "Spree::Card",
          amount: amount, card_times: this.formData.timesCardAmount,
          payment_method_id: this.prepaidCardPaymentMethod.id } )
      }

      console.log( "this.orderRemainder=",this.orderRemainder)
      console.log( "this.selectedOrderItems=",this.selectedOrderItems)
      //需要其他支付方式
      if( this.formData.paymentAmount > 0 ){
        paymentsAttributes.push( { payment_method_id: this.formData.selectPaymentMethodId, amount: this.formData.paymentAmount } )
      }
      //  index  cname  discountPercent  groupPosition memo name  price productId quantity
      //  saleUnitPrice  variantId  variantName
      let order =  { store_id: this.storeId, user_id: this.customer.id,  payments: paymentsAttributes, enable_sms: this.formData.enableSms, enable_mp_msg: this.formData.enableMpMsg }
      order.line_items_attributes = this.selectedOrderItems.map((item)=>{
        return { quantity: item.quantity, variant_id: item.variantId, cname: item.cname,
          group_position: item.groupPosition, memo: item.memo,
          sale_unit_price: item.saleUnitPrice, discount_percent: item.discountPercent, price: item.price,
        }
      })

      return { order: order }
    },
    // 除了会员支付方式之外，其他支付方式余额
    orderRemainder() {
      let remainder = this.formData.totalPrice
      if( this.currentTimesCard ){
        return (this.formData.timesCardAmount == 0 ? (remainder - this.formData.paymentAmount) : 0)
      }else {
        return remainder - this.formData.prepaidCardAmount - this.formData.paymentAmount
      }
    }
  },
  methods: {
    handleDialogOpened(){
      // by default selectedOrderItems is  this.orderItemList,
      // user could dicard some lineitem before checkout on post pay situation
      this.selectedOrderItems = Array.from( this.orderItemList )
      console.log( "handleDialogOpened-orderItemList = ", this.orderItemList, this.selectedOrderItem, "existedOrderId=", this.existedOrderId)

      this.checkoutLoading = false
      this.getPaymentMethods().then(()=>{
        this.paymentMethodList = this.paymentMethods
        if( this.activePaymentMethods.length>0){
          this.formData.selectPaymentMethodId = this.activePaymentMethods[0].id
          console.log( "this.formData.selectPaymentMethodId=", this.formData.selectPaymentMethodId)
        }
      })

      this.formData.paymentAmount = 0
      this.formData.prepaidCardAmount = 0

      if( this.currentPrepaidCard != null){
        //会员卡的余额是否够用
        this.formData.enablePrepaidCard = true
      }else{
        this.formData.enablePrepaidCard = false
      }
      if( this.currentTimesCard != null){
        this.formData.enableTimesCard = true
      }else{
        this.formData.enableTimesCard = false
      }

      // check all lineItemGroups by default
      if( this.$refs.multipleTable ){
        // this.$refs.multipleTable could be null
        this.$refs.multipleTable.clearSelection()
        this.$refs.multipleTable.toggleAllSelection()
      }

      this.formData.totalPrice = this.computedTotalPrice
      this.computePaymentAmount()

    },
    computePaymentAmount(){
      console.log( "this.formData.enablePrepaidCard=", this.formData.enablePrepaidCard )
      if( this.formData.enablePrepaidCard ){
        let card = this.currentPrepaidCard
        this.formData.prepaidCardAmount = ( card.amountRemaining >= this.formData.totalPrice ? this.formData.totalPrice : (this.formData.totalPrice - card.amountRemaining) )
      }else{
        this.formData.prepaidCardAmount = 0
      }
      if( this.orderRemainder>0){
        this.formData.paymentAmount = this.orderRemainder
      }else{
        this.formData.paymentAmount = 0
      }

      console.log( "handleDialogOpened customer=",this.customer, this.paymentMethodList, this.activePaymentMethods )
    },

    //创建订单
    createOrder( params ) {
      console.log( " CreateOrder params=", params )
        checkout( params ).then((res)=>{
          if( res.id> 0){
            let order = this.buildOrder( res )
            console.log("checkout dialog res->",params, res, order)
            this.$emit('order-created-event', res )
            this.$emit('update:dialogVisible', false)
            //if( this.formData.isPrintReceipt ){
            order.displayCreatedDateTime = order.createdAt.format('YYYY年MM月DD日 HH时 mm分 ss秒') //'2018年07月11日 20时 35分 05秒'
            let printParams = { labelPrinter: this.storeInfo.labelPrinter,
              labelPrintCount: this.storeInfo.labelPrintCount, // 打印多少个条码
              receiptTitle: this.storeInfo.receiptTitle, receiptFooter: this.storeInfo.receiptFooter,
              storeName: this.storeInfo.name,  order: order }
            if( this.formData.isPrintLabel ){
              PrintUtil.printLabel( printParams )
            }
            if( this.formData.isPrintReceipt ){
              PrintUtil.printReceipt( printParams )
            }

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
    createPayment( orderId, params ) {
      // params = { payments, line_item_ids}
        addPayments( orderId, params ).then((res)=>{
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
    //创建支付，客户领取物品时付款
    recreatePayment( orderId, params ) {
      // params = { payments, line_item_ids}
        repay( orderId, params ).then((res)=>{
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
    handleCreateOrderAndPayment(){
      //250毫秒以后才可以调用，以防鼠标多次点击
      if( this.isPasswordRequired){
        this.promptPassword()
      }else{
        console.log( "formData.validate0")
        this.$refs.formData.validate((valid) => {
          console.log( "formData.validate1")
          if (valid) {
            this.handleCreateOrderAndPaymentAsync(this)
          } else {
            console.log('error submit!!', valid);
            return false;
          }
        });
      }
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
      this.createOrder( params )
    },
    handleCreateOrderAndPaymentAsync:_.debounce(( vm) => {
      //防抖，防止多次提交
      let that = vm
      that.checkoutLoading = true
      let params = that.checkoutParams
      console.log( "handleCreateOrderAndPayment", that.existedOrderId )
      if( that.existedOrderId != null){
        let payments = params.order.payments
        let line_item_ids = that.selectedOrderItems.map((item)=>{ return item.id })
        if( that.isRepay ){
          that.recreatePayment( that.existedOrderId, { payments, line_item_ids } )

        }else{
          that.createPayment( that.existedOrderId, { payments, line_item_ids } )
        }
      }else{
        that.createOrder( params )
      }
      that.checkoutLoading = false
    }, 250),
    handleEnablePrepaidCard(newValue){
      //重新计算各个支付方式需要支付多少
      console.log( "handleEnablePrepaidCard=", newValue, this.computedTotalPrice)
      this.formData.totalPrice = this.computedTotalPrice

      this.computePaymentAmount()
    },
    promptPassword(){
        this.$prompt('请输入会员支付密码', '会员支付密码', {
          showInput: true,
          inputType: 'password',
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputValidator: (value)=>{  return value== this.currentPrepaidCard.paymentPassword  },
          inputErrorMessage: '会员支付密码不正确'
        }).then(({ value }) => {
          console.log( " $prompt then ", value)
          this.handleCreateOrderAndPaymentAsync(this)
        }).catch((err) => {
          console.log( " $prompt catch ", err)
        })
    },
    async handleValidateCardPassword( password ){

       let response = await validateCardPassword(this.currentPrepaidCard.id, password )
       console.log( "handleValidateCardPassword=",password, response, response.result == true )
       return response.result == true
    },
    handleTimesCardAmountChanged( newValue){
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
    computeGroupPrice(group){
      let total = group.lineItems.reduce((sum, item)=>{
        if( this.currentPrepaidCard ){
          sum+= ( item.saleUnitPrice * item.quantity * this.currentPrepaidCard.discountPercent /100 )
        }else{
          sum+= ( item.saleUnitPrice * item.quantity   )
        }
        return sum
      }, 0)
      return parseInt( total )
    },
    isGroupUnpaid(row,index){
      return row.paymentState == this.LineItemGroupPaymentStateEnum.unpaid
    },
    groupSelectionChange( selection){
      let ids = selection.map((item)=>{ return item.id })
      console.log( "groupSelectionChange selection=",selection, "ids=",ids, this.orderItemList)
      this.selectedOrderItems = this.orderItemList.filter((item)=>{ return ids.includes(item.groupId) })
      this.formData.totalPrice = this.computedTotalPrice

    },
    testPrint(){
      PrintUtil.printLabel()
      PrintUtil.printReceipt()
    }

  },

};
</script>
