<style lang="scss">


.order-delivery-container{
  .order-sum{
    line-height: 30px;
  }
  .font-color{
    color: white;
  }
  .image-wrap {
    text-align: center;
    img{
      max-width: 60px;
      max-height: 60px;
      vertical-align: middle;
    }
  }
}
</style>

<template>
<!--
为了便于查看订单状态，这里允许查看搜索任意状态的物品
-->

  <div class="order-delivery-container">
    <!-- 结账组件 Start-->
    <CheckoutDialog :order-item-list="checkoutRequiredLineItems" :totalMoney="totalMoney" :customer="currentCustomer"  :card="currentCard"  :dialog-visible.sync="checkoutDialogVisible" @payment-created-event="handlePaymentCreated"></CheckoutDialog>
    <!-- 结账组件 End-->

    <div class="customer-container clear">
      <el-form ref="customerForm" size="mini"  :inline="true" class="search-form">
        <el-form-item label="客户搜索">
          <el-select v-model="customerComboId" :remote-method="searchCustomers" placeholder="请输入手机号/姓名/会员卡号" filterable remote clearable @change="handleCustomerChanged" @clear="handleCustomerChanged">
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
              <th>消费金额</th>
              <td> <span v-show="currentCustomer.normalOrderTotal">¥</span> {{currentCustomer.normalOrderTotal}}</td>
            </tr>
            <tr ><th>会员卡号</th><td>{{currentCard.code}}</td>
              <th>会员卡类型</th>
              <td><span class="ellipsis card-type">{{currentCard.name}}</span></td>
              <th>会员卡余额</th>
              <td><span v-show="currentCard.style=='times'">{{currentCard.cardTimesRemaining}}次</span><span v-show="currentCard.style=='prepaid'">¥ {{currentCard.amountRemaining}}</span></td>
            </tr>
          </table>
        </div>
      </div>
    </div>
    <div class="order-item-list">
      <el-table :data="computedLineItemGroups" border stripe style="width:100%;" class="fillcontain cel-scrollable-table" highlight-current-row  @current-change="handleCurrentGroupChange">
        <el-table-column prop="displayCreatedAt" label="订单日期" align="center" width="120" >
          <template slot-scope="scope">
            <div>{{scope.row.createdAt.format("YYYY-MM-DD")}}</div>
              <div>{{scope.row.createdAt.format("H:mm")}}</div>
          </template>
        </el-table-column>
        <el-table-column label="物品条码" width="120" align="center">
          <template slot-scope="scope">
            <div class="image-wrap">
              <img :src="scope.row.imageUrl" alt="">
            </div>
            <div class="group-number">{{scope.row.number}} </div>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="物品-服务项目[备注]">
          <template slot-scope="scope">
            <div v-for="item in scope.row.lineItems">{{item.cname}}<span v-show="item.memo">[{{item.memo}}] </span></div>
          </template>
        </el-table-column>
        <el-table-column prop="displayState" label="物品状态" width="80" ></el-table-column>
        <el-table-column prop="order.displayPaymentState" label="支付状态" width="80" ></el-table-column>
        <el-table-column prop="price" label="金额" width="60">金额</el-table-column>
        <el-table-column label="操作" width="50">
          <template slot-scope="scope">
            <el-button type="danger" icon="el-icon-delete"  circle @click="discardLineItemGroup(scope.row)" size="mini"></el-button>
         </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="order-final">
      <div class="order-sum">
        <i>数量：</i>
        <span>{{totalCount}}</span>&nbsp;&nbsp;&nbsp;
        <i>金额：</i>
        <span>￥{{totalMoney}}</span>&nbsp;
      </div>
      <div class=" font-color"  >
        <el-button type="success" @click="handleDeliverOrders()" class="check-button">确认取单 ：&nbsp;￥{{totalMoney}}</el-button>
      </div>
    </div>

  </div>
</template>


<script>
import _ from "lodash"
import {
  findCustomers, findOrders, completeLineItemGroups
} from "@/api/getData"
import {
  DialogMixin
} from '@/components/mixin/DialogMixin'

import CheckoutDialog from "@/components/CheckoutDialog.vue"

export default {
  mixins: [DialogMixin],
  components: {
    CheckoutDialog,
  },
  data() {
    return {
      defaultCustomer: {
        customerType: "无", //客户类型：无，散客，会员
        name: "来宾",
        balance: 0,
        cards: []
      }, //改变当前选择会员，显示会员相关信息
      orderList: [],    //按关键字搜索到订单列表
      customerList: [], //按关键字搜索到的客户列表
      customerComboId: '',
      orderComboId: '',
      currentOrders:[], // 当前选择的客户对应的订单列表, 按订单关键字搜索后，选择的订单列表
      currentCustomer: null,
      currentCard: null,
      currentRow:null,
      checkoutDialogVisible: false,
      imageDialogVisible: false
    }
  },
  created: function(){
    this.currentCustomer = this.defaultCustomer
    this.currentCard = {}
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
          return customer.cards.filter((card)=>{
            return card.state == this.CardStateEnum.enabled
          }).map((card)=>{
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
      let ligs = this.currentOrders.map((order) => { return order.lineItemGroups.filter((g)=>{ return !g.deliveryDiscarded }) } )
      ligs = _.chain(ligs).flatten().orderBy('state').value()
      console.log("computedLineItemGroups=", ligs)
      return ligs
    },
    computedLineItems: function(){
      let ops = this.currentOrders.map((order) => { return order.lineItems } )
      return _.flatten( ops )
    },
    //物品数量
    totalCount: function(){
      return this.computedLineItemGroups.length
    },
    //物品价格
    totalMoney: function(){
      let t = this.computedLineItemGroups.reduce((total, item)=>{
        return total += parseInt( item.price )
      }, 0)
      return Number(t)
    },
    checkoutRequiredLineItems: function(){
      // checkout all lineItems of order
      let items = this.checkoutRequiredLineItemGroups.map((group) => { return group.order.lineItems } )
      return _.chain(items).flatten().uniq().sortBy(['orderId','groupId']).value()
    },
    //需要付款的物品
    checkoutRequiredLineItemGroups: function(){
      return this.computedLineItemGroups.filter( (item)=>{
        return item.paymentState== this.LineItemGroupPaymentStateEnum.unpaid
      })
    },
    //需要付款的金额
    checkoutRequiredTotal: function(){
      let t = this.checkoutRequiredLineItemGroups.reduce((total, item)=>{
        return total += item.price
      }, 0)
      return Number(t).toFixed(2)
    },
    isDeliverable(){
      let states = this.computedLineItemGroups.map((group)=>{ return group.state })
      console.log( "isDeliverable=", states)
      return _.uniq(states).length ==1 && states[0] == this.LineItemGroupStateEnum.ready
    }
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
      let q = { mobile_or_username_or_cards_code_cont: keyword }
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
        console.log( " vm.orderList =", vm.orderList )
      })
    }, 450),
    //店员改变当前选择客户,更新订单列表折扣率
    handleCustomerChanged(selectedId){
      if( selectedId ){
        this.currentCustomer = this.customerList.find((customer, index, arr) => {
          return customer.id ==   this.selectedCustomerId
        })
        if( this.currentCustomer.cards.length > 0 ){
          this.currentCard = this.currentCustomer.cards.find((card, index, arr) => {
            return card.id ==   this.cardId
          })
        }else{
          this.currentCard = {}
        }
        //取得客户的最新订单，包括所有未完成的订单。
        this.findOrderByCustomer()
      }else{
        this.currentCustomer = this.defaultCustomer
        this.currentCard = {}
        this.currentOrders = []
      }
    },
    handleOrderChanged(selectedId){
      console.log( " handleOrderChanged ->", selectedId)
      if( selectedId ){
        this.currentOrders = this.orderList.filter((o)=>{ return (o.id == this.orderId) })
        //取得客户的最新订单，包括所有未完成的订单。
        this.findCustomerByOrder()
      }else{
        this.currentCustomer = this.defaultCustomer
        this.currentCard = {}
        this.currentOrders = []
      }
    },
    handleCurrentGroupChange(val){
      this.currentRow = val
      console.log( "currentRow", this.currentRow)
      this.$emit('current-group-changed', val)
    },
    async findOrderByCustomer(){
      let cid = this.selectedCustomerId

      let q = { user_id_eq: cid, state_eq: this.OrderStateEnum.cart, group_state_in: this.lineItemGroupProgressStates }
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
        console.log( "findCustomers=>", customersResult )
        this.customerList = this.buildCustomers(customersResult)

        this.currentCustomer = this.customerList[0]
        this.currentCard = this.currentCustomer.prepaidCard
      }
    },
    discardLineItemGroup( row ){
      let order = this.currentOrders.find((o)=>{  return o.id == row.orderId })
      let i = order.lineItemGroups.indexOf( row )
      if( i >= 0 ){
        row.deliveryDiscarded = true
        // refresh view
        order.lineItemGroups.splice( i, 1, row)
      }

    },

    handlePaymentCreated(){
      this.completeOrders()
    },
    // 交付客户订单
    handleDeliverOrders(){
      if( this.computedLineItemGroups.length == 0 ){
        this.$message({
          message: '请输入客户手机或者订单编号！',
          type: 'error'
        });
        return
      }
      console.log( "checkoutRequiredLineItems=", this.checkoutRequiredLineItems)
      if( this.isDeliverable){
        //检查每件物品对应的Order用户是否付款， 如果没有，弹出结账对话框,
        if( this.checkoutRequiredTotal > 0){
          this.checkoutDialogVisible = true
        }else{
          //检查所有物品是否为待交付状态，如果是，弹出确认框
          //$confirm(message, title, options)
          this.$confirm("确定交付客户以上物品吗？").then(()=>{
            this.completeOrders()
          })
        }
      }else{
        this.$message({
          message: '抱歉，物品无法交付客户，请确认物品状态为“待交付”！',
          type: 'error'
        });
      }
    },
    completeOrders(){
      let ids = this.computedLineItemGroups.map((g)=>{ return g.id })
      completeLineItemGroups( { ids } ).then((result)=>{
        if( result.count == ids.length ){
          this.$bus.$emit('order-changed-gevent')

          this.$message({
            message: '客户物品状态已成功更新！',
            type: 'success'
          })
          this.currentOrders = []
        }
      })
    },
  }
}
</script>
