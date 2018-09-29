<style lang="scss">
  .order-detail-wrap{
    .images{
      img{ width: 100%; }
    }
  }
</style>

<template>
<div class="order-detail-wrap" v-if="orderDetail">
  <div class="customer box">
    <div class="box-head"> 客户信息</div>
    <div>
      <table border="1" cellspacing="0">
        <tr>
          <th>客户电话 </th>
          <td> {{ orderCustomer.mobile }} </td>
          <th>客户姓名 </th>
          <td> {{ orderCustomer.userName }} </td>
          <th>客户类型 </th>
          <td> {{ orderCustomer.displayType }} </td>
        </tr>
        <tr>
          <th>会员卡号 </th>
          <td> {{ orderCustomer.prepaidCard.code }} </td>
          <th>会员卡类型 </th>
          <td> {{ orderCustomer.prepaidCard.name }} </td>
          <th>会员卡余额 </th>
          <td> {{ orderCustomer.prepaidCard.amountRemaining }} </td>
        </tr>
      </table>
    </div>
  </div>
  <div class="box">
    <div class=""> 订单信息 {{orderDetail.number}} </div>
    <div class="box">
      <div class="box-head"> 支付信息 </div>
      <div>
        <table border="1" cellspacing="0" style="width: 100%">
          <tr >
            <th>支付方式</th>
            <th>支付金额</th>
            <th style="width:8em">状态</th>
            <th style="width:8em">支付时间</th>
          </tr>
          <tr v-for="(payment,index ) in orderDetail.payments">
            <td>{{payment.cname}}</td>
            <td>{{payment.amount}}</td>
            <td style="width:8em">{{payment.displayState}}</td>
            <td style="width:8em">{{payment.displayCreatedAt}}</td>
          </tr>
        </table>
      </div>
    </div>

    <div v-for="group in orderDetail.lineItemGroups" class="box line-item-group">
      <div class="box-head"> 物品编号: {{group.number}}  状态: {{group.displayState}} </div>
      <div class="box-body">
        <table border="1"   cellspacing="0" style="width: 100%">
        <tr>
          <th style="width:8em">序号</th>
          <th>服务项目</th>
          <th>项目备注<i class="el-icon-edit"></i></th>
          <th style="width:8em">状态</th>
        </tr>
        <template v-for="(lineItem,index ) in group.lineItems">
          <tr>
            <td>{{ index+1 }}</td>
            <td>{{ lineItem.cname }}</td>
            <td>
              {{ lineItem.memo }}
            </td>
            <td>{{ lineItem.displayState }}</td>
          </tr>
        </template>
      </table>
      </div>
      <div class="box-head"> 物品图片 </div>
      <div class="box-body clear">
        <div v-show="group.images.length==0">  </div>
        <el-row :gutter="20" class="images">
          <el-col :span="8" v-for="image in group.images" >
            <img :src="image.bigUrl" class="image"></el-col>
        </el-row>
      </div>
    </div>
  </div>
</div>
</template>

<script>

export default {
  data() {
    return {
    }
  },
  props: ['orderDetail'],
  computed:{
    orderCustomer(){
      return this.orderDetail ? this.orderDetail.customer : {}
    }
  }

}
</script>
