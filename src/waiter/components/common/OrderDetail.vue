<style lang="scss">
  .order-detail-wrap{
    .images{
      img{ width: 100%; }
    }
    .customer table, .payments table  {
      width: 100%;
      td,th{
        padding: 12px 10px;
        border: 1px solid #ebeef5;
      }
      tr {
        vertical-align: top;
      }
    }
    .el-table {
      td,th{
        padding: 10px 0;
      }
    }
    .head{
      span{
        display: inline-block;
        padding: 6px;
        color: #fff;
        background-color: #6a3906;
        border-radius: 3px;
      }
      i{
        color: #fff;
      }
      padding: 10px 0 10px 0;
    }
    .subtitle {
        padding: 6px;
        color: #6a3906;
    }
  }
</style>

<template>
<div class="order-detail-wrap" v-if="currentOrder">
  <CheckoutDialog :order-item-list="currentOrder.lineItems" :customer="currentCustomer" :card="currentCard" :dialog-visible.sync="checkoutDialogVisible"
   @payment-created-event="handlePaymentCreated" > </CheckoutDialog>


  <div class="customer box">
    <div class="head">  <span> <i class="fa fa-user">  客户信息</i> </span> </div>
    <div>
      <table border="1" cellspacing="0">
        <tr>
          <th>客户电话 </th>
          <td> {{ currentCustomer.mobile }} </td>
          <th>客户姓名 </th>
          <td> {{ currentCustomer.userName }} </td>
          <th>客户类型 </th>
          <td> {{ currentCustomer.displayType }} </td>
        </tr>
        <tr>
          <th>会员卡号 </th>
          <td> {{ currentCustomer.prepaidCard.code }} </td>
          <th>会员卡类型 </th>
          <td> {{ currentCustomer.prepaidCard.name }} </td>
          <th>会员卡余额 </th>
          <td> {{ currentCustomer.prepaidCard.amountRemaining }} </td>
        </tr>
      </table>
    </div>
  </div>
  <div class="box">
    <div class="head"> <span> <i class="fa fa-calendar">   订单信息 {{currentOrder.number}}</i> </span> </div>
    <div class="box payments">
      <div class="subtitle"> 支付信息
        <div class="right hide"> <el-button  type="danger" size="mini"  :disabled="isRepayDisabled()" @click="openCheckoutDialog">重新支付</el-button></div>
      </div>
      <div>
        <table border="1" cellspacing="0" style="width: 100%">
          <tr >
            <th>支付方式</th>
            <th>支付金额</th>
            <th style="width:8em">状态</th>
            <th style="width:8em">支付时间</th>
          </tr>
          <tr v-for="(payment,index ) in currentOrder.payments">
            <td>{{payment.cname}}</td>
            <td>{{payment.amount}}</td>
            <td style="width:8em">{{payment.displayState}}</td>
            <td style="width:8em">{{payment.displayCreatedAt}}</td>
          </tr>
        </table>
      </div>
    </div>

    <div v-for="group in currentOrder.lineItemGroups" class="box line-item-group">
      <div class="subtitle"> 物品编号: {{group.number}} 状态: {{group.displayState}}
        <div class="right"> <el-button  type="danger" size="mini" :disabled="isReworkDisabled(group.state)" @click="handleRework(group.number)">返工</el-button></div>
      </div>
      <div class="box-body">

        <el-table :data="group.lineItems" border :row-key="row => row.id">
          <el-table-column label="序号"  type="index" width="80">
          </el-table-column>
          <el-table-column label="服务项目[备注]"  >
            <template slot-scope="scope">
              <div >{{scope.row.cname}}<span v-show="scope.row.memo">[{{scope.row.memo}}] </span></div>
            </template>
          </el-table-column>

          <el-table-column prop="displayState" label="状态" width="120" align="center"></el-table-column>

        </el-table>

      </div>
      <div class="subtitle"> 物品图片 </div>
      <div class="box-body clear">
        <div v-show="group.images.length==0">  </div>
        <el-row :gutter="20" class="images">
          <el-col :span="8" v-for="image in group.images" :key="image.id" >
            <img :src="image.largeUrl" class="image"></el-col>
        </el-row>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import {
  getCustomer,
  reworkLineItemGroup
}
from '@/api/getData'

import CheckoutDialog from "@/components/CheckoutDialog.vue"

export default {
  data() {
    return {
      checkoutDialogVisible: false
    }
  },
  props: ['customerData','orderData'], // customerData is newest, card could be updated, ex. disabled
  components: { CheckoutDialog },
  computed:{
    currentOrder(){
      return this.orderData
    },
    currentCustomer(){
      return this.customerData
    },
    currentCard(){
      return this.customerData.card
    }
  },
  methods:{

    isRepayDisabled(){
      //isReworkDisabled(scope.row.state)
      return !( this.currentOrder.paymentState == this.OrderPaymentStateEnum.paid  )
    },
    isReworkDisabled(state){
      //isReworkDisabled(scope.row.state)
      return !( state == this.LineItemGroupStateEnum.ready || state == this.LineItemGroupStateEnum.shipped )
    },
    // 客户搜索事件处理
    openCheckoutDialog() {
      console.log("openCheckoutDialog")

      this.checkoutDialogVisible = true
    },
    handlePaymentCreated(newOrder) {
      // update card order list
      this.$bus.$emit('order-changed-gevent', newOrder)

      getCustomer(this.currentCustomer.id).then(result => {
        const newCustomer = this.buildCustomer(result)
        // update customer card amount
        this.$bus.$emit('customer-changed-gevent', newCustomer)
      })
    },
    handleRework(groupNumber){
      console.log( "handleRework(groupNumber)=", groupNumber)
      let validateReturnedMemo = (val)=>{
        return val && val.length >=2
      }
      this.$prompt('请输入返工理由', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputValidator: validateReturnedMemo,
        inputErrorMessage: '请输入2-128个字符的返工理由'
      }).then(({ value }) => {
        reworkLineItemGroup( groupNumber, {line_item_group: { returned_memo: value }} ).then((res)=>{
          if( res.id ){
            //this.$emit('order-state-changed')

            let group = this.buildLineItemGroup( res )
            let index = this.currentOrder.lineItemGroups.findIndex( (g)=>{ return g.number==groupNumber})
            this.$set( this.currentOrder.lineItemGroups, index, group)

            this.$message({
              type: 'success',
              message: "恭喜你，物品退回成功"
            })
          }
        })

      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消返工'
        });
      });


    }
  }

}
</script>
