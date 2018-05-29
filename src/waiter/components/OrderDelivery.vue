<template>
  <div class="order-delivery-container">
    <div class="customer-container clear">
      <el-form ref="customerForm" size="mini"  :inline="true" class="search-form">
        <el-form-item label="会员搜索">
          <el-select v-model="customerId" :remote-method="searchCustomers" placeholder="请输入会员/手机号" filterable remote clearable @change="handleCustomerChanged" @clear="handleCustomerChanged">
            <el-option v-for="item in computedCustomerOptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select> {{customerId}}
        </el-form-item>

        <el-form-item label="订单搜索">
          <el-select v-model="customerId" :remote-method="searchCustomers" placeholder="请输入订单号/物品号" filterable remote clearable @change="handleCustomerChanged" @clear="handleCustomerChanged">
            <el-option v-for="item in computedCustomerOptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select> {{customerId}}
        </el-form-item>

      </el-form>
      <div class="search-result clear">
        <div class="left" style="width:60%;padding: 0 5px;">
          <table style="width:100%">
            <tr><th>客户类型</th><td>{{currentCustomer.customerType}}</td><th>移动电话</th><td>{{currentCustomer.mobile}}</td> </tr>
            <tr><th>消费次数</th><td>{{currentCustomer.normalOrderCount}}</td><th>消费金额</th><td>{{currentCustomer.normalOrderTotal}}</td> </tr>
          </table>
        </div>
        <div class="right"  style="width:40%;padding: 0 5px;">
          <div class="cards">
            <div v-for="card in currentCustomer.cards" class="card " >
              <el-checkbox label="" name="type"></el-checkbox>
              <div class="">
                <!-- <span >储值卡5000元6折卡(#10001) 余额:0元</span> -->
                <span >{{card.name}} </span><br/>
                <span>#{{card.code}} </span>
                <span>余额:{{card.currentValue}}元 </span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
    <el-table :data="sortedOrderItemList" border stripe style="width:100%;" class="order-item-list">
      <el-table-column label="物品序号">
        <template slot-scope="scope">
         <vue-xeditable  :name="'groupPosition_'+scope.row.index+'_xeditable'" v-model="scope.row.groupPosition" type="number" @value-did-change="handleGroupPositionChanged"></vue-xeditable>
       </template>
      </el-table-column>
      <el-table-column prop="fullName" label="商品名"></el-table-column>
      <el-table-column prop="unitPrice" label="单价"></el-table-column>
      <el-table-column prop="quantity" label="数量"></el-table-column>
      <el-table-column prop="discount" label="折扣">折扣</el-table-column>
      <el-table-column prop="price" label="金额">金额</el-table-column>
      <el-table-column label="操作" width="50">
        <template slot-scope="scope">
               <i class="el-icon-remove-outline" @click="delOrderItem(scope.row)"></i>
       </template>
      </el-table-column>
    </el-table>
    <div class="order-final">
      <div class="order-sum">
        <i>数量：</i>
        <span>{{totalCount}}</span>&nbsp;&nbsp;&nbsp;
        <i>金额：</i>
        <span>{{totalMoney}}</span>&nbsp;
        <i>元</i>
      </div>
      <div class="check-button" @click="openCheckoutDialog()" > 收款 ：&nbsp;￥&nbsp;{{totalMoney}} </div>
    </div>

  </div>
</template>


<script>
import _ from "lodash"
import {
  findCustomers, findOrders
} from "@/api/getData"
import {
  apiResultMixin
} from '@/components/apiResultMixin'

export default {
  mixins: [apiResultMixin],
  data() {
    return {

      defaultCustomer: {
        customerType: "无", //客户类型：无，散客，会员
        name: "来宾",
        balance: 0,
        cards: []
      }, //改变当前选择会员，显示会员相关信息
      orderItemList: [], //订单 {variantId, price, quantity}
      customerList: [], //按关键字搜索到的客户列表
      customerId: null,
      currentOrder:{
        lineItemGroup: [],
        total: 0
      }
    }
  },
  computed:{
    computedCustomerOptions: function() {
      return this.customerList.map((customer) => {
        return {
          value: customer.id,
          label: customer.mobile
        }
      })
    },
    //当前选择的客户
    currentCustomer: function(){
      let customer = this.defaultCustomer
      if( this.customerId ){
        customer = this.customerList.find((customer, index, arr) => {
          return customer.id ==   this.customerId
        })
        if( !customer ){
          customer = this.defaultCustomer
        }
      }
      return customer
    },
    sortedOrderItemList: function() {
      return this.orderItemList.sort((a, b) => {
        return (a.groupPosition - b.groupPosition)
      })
    },
  },
  methods:{
    //根据关键字查找客户
    //从SerVer上获取模糊搜索的用户数据,异步获取
    searchCustomers(keyword) {
      this.searchCustomersAsync(keyword, this);
    },
    //通过电话号码得从SerVer上获取用户数据,异步获取
    async customerFromMobile(mobile) {},
    //远程搜索输入框函数-----提示功能
    searchCustomersAsync: _.debounce((keyword, vm) => {
      // 11位为电话号码
      // 5位为会员卡号
      // YFOxxxx 为订单号
      // YFIxxxx 为物品号 17
      let q = { mobile_or_username_cont: keyword }
      findCustomers({ q }).then((customersResult) => {
        vm.customerList = vm.buildCustomers(customersResult)
      })
    }, 450),
    //店员改变当前选择客户,更新订单列表折扣率
    handleCustomerChanged(selectedCustomerId){
      if( selectedCustomerId ){
        //取得客户的最新订单，包括所有未完成的订单。
        this.orderItemList.forEach((item)=>{
          item.discount = this.getDiscountOfVariant( item.variantId )
          this.computePrice(item)
        })
      }else{
        this.orderItemList.forEach((item)=>{
          item.discount = 100
          this.computePrice(item)
        })
      }
    },
  }
}
</script>

<style lang="scss">

</script>
