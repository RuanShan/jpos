<template>
  <div class="order-delivery-container">
    <div class="customer-container clear">
      <el-form ref="customerForm" size="mini"  :inline="true" class="search-form">
        <el-form-item label="会员搜索">
          <el-select v-model="customerComboId" :remote-method="searchCustomers" placeholder="请输入手机/会员号" filterable remote clearable @change="handleCustomerChanged" @clear="handleCustomerChanged">
            <el-option v-for="item in computedCustomerOptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select> {{customerComboId}}
        </el-form-item>

        <el-form-item label="订单搜索">
          <el-select v-model="orderComboId" :remote-method="searchOrders" placeholder="请输入订单/物品号" filterable remote clearable @change="handleLineItemGroupChanged" @clear="handleLineItemGroupChanged">
            <el-option v-for="item in computedOrderOptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

      </el-form>
      <div class="search-result clear">
        <div >
          <table style="width:100%">
            <tr><th>客户类型</th><td>{{currentCustomer.customerType}}</td><th>移动电话</th><td>{{currentCustomer.mobile}}</td>
              <th>消费金额</th><td>{{currentCustomer.normalOrderTotal}}元</td>
            </tr>
            <tr ><th>会员卡号</th><td>{{currentCard.code}}</td><th>会员卡类型</th><td>{{currentCard.name}}</td>
              <th>会员卡余额</th><td>{{currentCard.currentValue}}</td>
            </tr>
          </table>
        </div>
      </div>
    </div>
    <el-table :data="computedLineItemGroups" border stripe style="width:100%;" class="order-item-list">
      <el-table-column prop="number" label="物品条码"> </el-table-column>
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
      defaultCard:{
        code: "无"
      },
      orderList: [], //订单 {variantId, price, quantity}
      customerList: [], //按关键字搜索到的客户列表
      customerComboId: null,
      orderComboId: null,
      currentOrder:{
        lineItemGroup: [],
        total: 0
      },
      currentCustomer: null,
    }
  },
  created: function(){
    this.currentCustomer = this.defaultCustomer
  },
  computed:{
    selectedCustomerId: function(){
      return ( this.customerComboId ? this.customerComboId.split('_')[0] : null )
    },
    cardId: function(){
      return ( this.customerComboId ? this.customerComboId.split('_')[1] : null )
    },
    orderId: function(){
      return ( this.orderComboId ? this.orderComboId.split('_')[0] : null )
    },
    computedCustomerOptions: function() {
      let ops = this.customerList.map((customer) => {
        if( customer.cards.length > 0 ){
          return customer.cards.map((card)=>{
            return { value: [customer.id,card.id].join('_'),
              label: customer.mobile + '(#'+card.code+')'
            }
          })
        }else{
          return [{
            value: customer.id.toString(),
            label: customer.mobile
          }]
        }
      })
      return _.flatten( ops )
    },
    computedOrderOptions: function() {
      console.log("orderList", this.orderList)
      let ops = this.orderList.map((order) => {
        return order.lineItemGroups.map((group)=>{
          return {
            value: [order.id, group.id ].join('_') ,
            label: order.number + '(#'+ group.number +')'
          }
        })
      })
      return _.flatten( ops )
    },
    computedLineItemGroups: function(){
      let order = this.currentOrder
      return ( order ? order.lineItemGroups : [] )
    },
    currentCard: function(){
      let card = this.defaultCard
      let customer = this.currentCustomer
      if( customer.cards.length > 0 ){
        card = this.customer.cards.find((card, index, arr) => {
          return card.id ==   this.cardId
        })
      }
      return card
    },
    currentOrder: function(){
      let order = this.orderList.find((o)=>{ return (o.id == this.orderId) })
      return order
    },
    totalCount: function(){
      return this.orderList.length
    },
    totalMoney: function(){
      let t = this.orderList.reduce((total, item)=>{
        return total += item.cost
      }, 0)
      return Number(t).toFixed(2)
    },
  },
  methods:{
    //根据关键字查找客户
    //从SerVer上获取模糊搜索的用户数据,异步获取
    searchCustomers(keyword) {
      this.searchCustomersAsync(keyword, this);
    },
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
    searchOrders(keyword) {
      this.searchOrdersAsync(keyword, this);
    },
    //远程搜索输入框函数-----提示功能
    searchOrdersAsync: _.debounce((keyword, vm) => {

      let q = { line_item_group_number_or_number_cont: keyword }
      findOrders({ q }).then((ordersResult) => {
        vm.orderList = vm.buildOrders(ordersResult)
      })
    }, 450),
    //店员改变当前选择客户,更新订单列表折扣率
    handleCustomerChanged(selectedId){
      if( selectedId ){
        this.currentCustomer = this.customerList.find((customer, index, arr) => {
          return customer.id ==   this.selectedCustomerId
        })
        //取得客户的最新订单，包括所有未完成的订单。
        this.findLineItemGroupByCustomer()
      }else{
        this.orderList = []
      }
    },
    handleLineItemGroupChanged(selectedId){
      if( selectedId ){
        //取得客户的最新订单，包括所有未完成的订单。
        this.findCustomerByLineItemGroup()
      }else{
        this.orderList = []
      }
    },
    async findLineItemGroupByCustomer(){
      let cid = this.selectedCustomerId
      let q = { user_id_eq: cid, group_state_in: ['ready', 'pending']}
      const ordersResult = await findOrders({ q })
      this.orderList = this.buildOrders(ordersResult)
    },
    async findCustomerByLineItemGroup(){
      let order = this.currentOrder
      if(order){
        let q = { id_in: [order.userId] }
        const customersResult = await findCustomers({q})
        this.customerList = this.buildCustomers(customersResult)
      }
    }

  }
}
</script>

<style lang="scss">

</script>
