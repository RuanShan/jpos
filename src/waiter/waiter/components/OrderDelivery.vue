<template>
  <div class="order-delivery-container">
    <div class="customer-container clear">
      <el-form ref="customerForm" size="mini"  :inline="true" class="search-form">
        <el-form-item label="会员搜索">
          <el-select v-model="customerComboId" :remote-method="searchCustomers" placeholder="请输入手机/会员号" filterable remote clearable @change="handleCustomerChanged" @clear="handleCustomerChanged">
            <el-option v-for="item in computedCustomerOptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="订单搜索">
          <el-select v-model="orderComboId" :remote-method="searchOrders" placeholder="请输入订单/物品号" filterable remote clearable @change="handleOrderChanged" @clear="handleOrderChanged">
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
              <th>会员卡余额</th><td>{{currentCard.amount_remaining}}</td>
            </tr>
          </table>
        </div>
      </div>
    </div>
    <el-table :data="computedLineItemGroups" border stripe style="width:100%;" class="order-item-list">
      <el-table-column prop="displayCreatedAt" label="订单日期"></el-table-column>
      <el-table-column prop="number" label="物品条码"> </el-table-column>
      <el-table-column prop="order.number" label="订单号"></el-table-column>
      <el-table-column prop="name" label="服务项目"></el-table-column>
      <el-table-column prop="displayState" label="状态"></el-table-column>
      <el-table-column prop="price" label="金额">金额</el-table-column>
      <el-table-column label="操作" width="50">
        <template slot-scope="scope">
          <el-button type="danger" icon="el-icon-minus" circle @click="discardLineItemGroup(scope.row)" size="mini"></el-button>
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
      <div class="check-button font-color" @click="completeOrders()" > 确认取单 ：&nbsp;￥&nbsp;{{totalMoney}} </div>
    </div>

  </div>
</template>


<script>
import _ from "lodash"
import {
  findCustomers, findOrders, completeLineItemGroups
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
      orderList: [],    //按关键字搜索到订单列表
      customerList: [], //按关键字搜索到的客户列表
      customerComboId: '',
      orderComboId: '',
      currentOrders:[], // 当前选择的客户对应的订单列表, 按订单关键字搜索后，选择的订单列表
      currentCustomer: null,
    }
  },
  created: function(){
    this.currentCustomer = this.defaultCustomer
  },
  computed:{
    selectedCustomerId: function(){
      return ( this.customerComboId.length>0 ? this.customerComboId.split('_')[0] : null )
    },
    cardId: function(){
      return ( this.customerComboId.length>0 ? this.customerComboId.split('_')[1] : null )
    },
    orderId: function(){
      return ( this.orderComboId.length >0 ? this.orderComboId.split('_')[0] : null )
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
      let ops = this.currentOrders.map((order) => { return order.lineItemGroups } )
      return _.flatten( ops )
    },
    currentCard: function(){
      let card = this.defaultCard
      let customer = this.currentCustomer
console.log( " this.currentCustomer ", this.currentCustomer)
      if( customer.cards.length > 0 ){
        card = customer.cards.find((card, index, arr) => {
          return card.id ==   this.cardId
        })
      }
      return card
    },
    totalCount: function(){
      return this.orderList.length
    },
    totalMoney: function(){
      let t = this.currentOrders.reduce((total, item)=>{
        return total += item.total
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

      let q = { line_item_groups_number_or_number_cont: keyword }
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
        this.findOrderByCustomer()
      }else{
        this.currentCustomer = this.defaultCustomer
        this.orderList = []
        this.currentOrders = []
      }
    },
    handleOrderChanged(selectedId){
      if( selectedId ){
        this.currentOrders = this.orderList.filter((o)=>{ return (o.id == this.orderId) })

        //取得客户的最新订单，包括所有未完成的订单。
        this.findCustomerByOrder()
      }else{
        this.orderList = []
      }
    },
    async findOrderByCustomer(){
      let cid = this.selectedCustomerId
      let q = { user_id_eq: cid, group_state_in: ['ready', 'pending']}
      const ordersResult = await findOrders({ q })
      this.orderList = this.buildOrders(ordersResult)
      this.currentOrders = this.orderList
      console.log( "currentOrders", this.currentOrders)
    },
    async findCustomerByOrder(){
      let ids = this.currentOrders.map( (o)=>{ return o.userId})
      if(ids.length > 0){
        let q = { id_in: ids }
        const customersResult = await findCustomers({q})
        this.customerList = this.buildCustomers(customersResult)
        this.currentCustomer = this.customerList[0]
      }
    },
    discardLineItemGroup( row ){
      console.log( "row=",row)
      let order = this.currentOrders.find((o)=>{  return o.id == row.orderId })
      let i = order.lineItemGroups.indexOf( row )
      if( i >= 0 ){
        order.lineItemGroups.splice( i, 1)
      }
    },
    completeOrders(){
      //$confirm(message, title, options)
      this.$confirm("确定交付客户以上物品吗？").then(()=>{
        let ids = this.computedLineItemGroups.map((g)=>{ return g.id })
        completeLineItemGroups( { ids } ).then((result)=>{
          if( result.count == ids.length ){
            this.$bus.$emit('order-changed-gevent')

            this.$message({
              message: '客户物品状态已成功更新！',
              type: 'success'
            });
          }
        })

      })
    }
  }
}
</script>

<style lang="scss">
.font-color{
  color: white;
}

</style>
