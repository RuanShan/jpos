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
    .checkout-form{
      table{
        width: 440px;
        margin: 0 auto;
        th{
          width: 8em;
        }
      }
      td.money{
        text-align: right;
        span{
          display: inline-block;
          padding: 0 15px;
          line-height: 40px;
        }
      }
    }

    .payment{

      .el-select{
        width: 6em;
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

    <div class="checkout-form">
      <table>
        <tr>
          <th class="title">应收金额 </th>
          <td class="money">
            <span>{{totalMoney}}</span>
          </td>
          <td></td>
        </tr>
        <tr v-show="isShowPrepaidCard">
          <th>会员卡支付 </th>
          <td>
            <el-input v-model="prepaidCardAmount" placeholder="" class="money"></el-input>
          </td>
          <td>
          </td>
        </tr>
        <tr v-show="isShowPrepaidCard">
          <th>会员支付密码 </th>
          <td>
            <el-input v-model="paymentPassword" placeholder="" class="money"></el-input>
          </td>
          <td>
          </td>
        </tr>
        <tr class="payment">
          <th>
            支付方式
          </th>
          <td>
            <el-input v-model="orderRemainder" placeholder="" class="money">
              <el-select v-model="selectPaymentMethodId" placeholder=""  slot="prepend" >
                <el-option v-for="item in activePaymentMethods" :key="item.id" :label="item.name" :value="item.id">
                </el-option>
              </el-select>
            </el-input>
          </td>
          <td>
          </td>
        </tr>
      </table>

      <div class="">
      </div>
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
import { checkout, getPaymentMethods } from "@/api/getData"
import {
  DialogMixin
} from '@/components/mixin/DialogMixin'

import {
  mapState
} from "vuex"

export default {
  props: ["dialogVisible", "storeName", "orderList", "totalMoney", "customer"],
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
      prepaidCardAmount: 0,
      paymentPassword: "",
      enablePrepaidCard: true,
      selectPaymentMethodId: null,
      payments: [], //支付被方式选择数字,返回已经被选择的lable,如""现金","微信"等
    };
  },
  mixins: [DialogMixin],
  computed: {
    ...mapState(["userInfo", "cartList"]),
    activePaymentMethods: function(){
      return this.paymentMethodList.filter((pm)=>{
        return pm.active
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
        return card.style == 1 && card.status == 1 && card.currentValue > 0
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
        return pm.name.include('PrepaidCard')
      })
    },
    //结账请求参数
    checkoutParams: function(){
      //"payment_source": {
      //  "1": {
      //    "number": "4111111111111111",
      //  }
      //}
      let paymentSource = {}
      let paymentsAttributes = []
      if( this.availablePrepaidCard){
        if( this.prepaidCardPaymentMethod ){
          paymentsAttributes.push( { payment_method_id: this.prepaidCardPaymentMethod.id } )
          paymentSource[this.prepaidCardPaymentMethod.id] = { amount: 10 }
        }
      }
      //需要其他支付方式
      if( this.orderRemainder > 0 ){
        paymentsAttributes.push( { payment_method_id: this.selectPaymentMethodId } )
        paymentSource[this.selectPaymentMethodId] = { amount: this.orderRemainder }
      }

      let order =  { user_id: this.customer.id,  payments_attributes: paymentsAttributes }
      order.line_items = this.orderList.map((item)=>{ return { quantity: 1, variant_id: item.variantId, cname: item.cname, group_position: item.groupPosition}})

      return { order: order, payment_source: paymentSource }
    },
    // 除了会员支付方式之外，其他支付方式余额
    orderRemainder() {
      let remainder = this.totalMoney
      let card = this.availablePrepaidCard
      if( card != null){
        remainder = ( card.currentValue >= remainder ? 0 : remainder - card.currentValue)
      }
      return remainder ;
    }
  },
  methods: {
    async handleDialogOpened(){
      const result = await getPaymentMethods()
      result.payment_methods.forEach((pm)=>{
          this.paymentMethodList.push({id:pm.id, name:pm.name, active: pm.active})
      })

      if( this.paymentMethodList.length>0){
        this.selectPaymentMethodId = this.paymentMethodList[0].id
      }
      console.log( "handleDialogOpened customer=",this.customer )
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
