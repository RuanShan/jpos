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
  .main-content{
    padding-top: 60px;
    margin-left: 10px;
    margin-right: 10px;
  }
  .customer-container {
    .search-result{
      margin-bottom: 10px;
      background-color: #fff;
    }
    .search-form {
        .el-form-item {
            margin-bottom: 5px;
        }
        .search-input{
          width: 18em;
        }
    }
    table {
        td {
            max-width: 20%;
        }
        th{ width: 9em;}
        td,
        th {
            border: 1px solid #ebeef5;
            padding: 6px 10px;
            font-size: 14px;
            box-sizing: border-box;
            white-space: normal;
            line-height: 23px;
        }
        th span{ font-weight: bold;}
    }
  }

  .order-item-list {
      position: absolute;
      top: 190px;
      bottom: 140px;
      left: 10px;
      right: 10px;
  }
  .order-final {
      position: absolute;
      bottom: 60px;
      left: 10px;
      right: 10px;
      .check-button {
          padding: 0;
          width: 100%;
          line-height: 50px;
          height: 50px;
          text-align: center;
          font-size: 21px;
          background-color: #67c23a;
          border-color: #67c23a;
          span {
              color: #fff;
          }
      }
      .order-sum {
        line-height: 30px;
        height: 30px;
        text-align: center;
        margin: 0 10px;
        i {
              font-size: 12px;
          }
      }
  }

  .algolia-autocomplete {
    width: 100%;
  }
  .algolia-autocomplete .aa-input, .algolia-autocomplete .aa-hint {
    width: 100%;
  }
  .algolia-autocomplete .aa-hint {
    color: #999;
  }
  .algolia-autocomplete .aa-dropdown-menu {
    width: 100%;
    background-color: #fff;
    border: 1px solid #999;
    border-top: none;
  }
  .algolia-autocomplete .aa-dropdown-menu .aa-suggestion {
    cursor: pointer;
    padding: 5px 4px;
  }
  .algolia-autocomplete .aa-dropdown-menu .aa-suggestion.aa-cursor {
    background-color: #B2D7FF;
  }
  .algolia-autocomplete .aa-dropdown-menu .aa-suggestion em {
    font-weight: bold;
    font-style: normal;
  }
}
</style>

<template>
<!-- 为了便于查看订单状态，这里允许查看搜索任意状态的物品 -->

  <div class="order-delivery-container">
    <head-top></head-top>
    <CelSwiper :carousel-images="carouselImages" :dialog-visible.sync="imageDialogVisible" :enable-download="false"> </CelSwiper>
    <!-- 结账组件 Start-->
    <CheckoutDialog :order-item-list="checkoutRequiredLineItems" :totalMoney="totalMoney" :customer="currentCustomer"  :card="currentCard"  :dialog-visible.sync="checkoutDialogVisible" @payment-created-event="handlePaymentCreated"></CheckoutDialog>
    <!-- 结账组件 End-->
    <div class="main-content">
      <div class="customer-container clear">
        <el-form ref="customerForm"    :inline="true" class="search-form">
          <el-form-item label="客户搜索">
<!-- el-select 在ipad上面没有输入框，必须用 autocomplete -->
            <el-autocomplete ref="customerSelect" v-model="customerComboId" :fetch-suggestions="searchCustomers" :default-first-option="true"
            placeholder="请输入手机号/姓名/会员卡号"
            filterable remote clearable @select="handleCustomerChanged" @clear="handleCustomerChanged">
              <template slot-scope="{ item }">
                {{ item.label }}
              </template>
            </el-autocomplete>

          </el-form-item>

          <el-form-item label="订单搜索">
            <el-autocomplete  v-model="orderComboId" :fetch-suggestions="searchOrders" placeholder="请输入订单/物品号" filterable remote clearable
            @select="handleOrderChanged" @clear="handleOrderChanged">
              <template slot-scope="{ item }">
                {{ item.label }}
              </template>
           </el-autocomplete>
          </el-form-item>

        </el-form>
        <div class="search-result clear">
          <div >
            <table style="width:100%">
              <tr><th>客户</th><td>{{currentCustomer.userName}}<span > [{{currentCustomer.customerType}}]</span></td><th>移动电话</th><td>{{currentCustomer.mobile}}</td>
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
        <el-table :data="computedLineItemGroups" border style="width:100%;" class="fillcontain cel-scrollable-table" highlight-current-row  @current-change="handleCurrentGroupChange">
          <el-table-column prop="displayCreatedAt" label="订单日期" align="center" width="120" >
            <template slot-scope="scope">
              <div>{{scope.row.createdAt.format("YYYY-MM-DD")}}</div>
                <div>{{scope.row.createdAt.format("H:mm")}}</div>
            </template>
          </el-table-column>
          <el-table-column label="物品条码" width="120" align="center">
            <template slot-scope="scope">
              <div class="image-wrap">
                <img :src="scope.row.imageUrl" alt="" @click="handleGroupImageClick(scope.row)" >
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
    <footer-bar></footer-bar>

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
import FooterBar from '@/components/mobile/layout/FooterBar'
import HeadTop from '@/components/mobile/layout/HeadTop'
import CelSwiper from "@/components/mobile/dialog/CelSwiper.vue";

import CheckoutDialog from "@/components/mobile/CheckoutDialog.vue"

export default {
  mixins: [DialogMixin],
  components: {
    'head-top': HeadTop,
    'footer-bar': FooterBar,
    CheckoutDialog,
    CelSwiper
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
      imageDialogVisible: false,
      carouselImages: [],//图片文件列表
      search: null
    }
  },
  created: function(){
    this.currentCustomer = this.defaultCustomer
    this.currentCard = {}

  },
  mounted(){
    console.log( " customerSelect", this.$refs.customerSelect )
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
    searchCustomers(keyword, cb) {
      //this.searchCustomersAsync(keyword, this);
      // 11位为电话号码
      // 5位为会员卡号
      // YFOxxxx 为订单号
      // YFIxxxx 为物品号 17
      if( keyword.length<3){
        return cb([])
      }
      let q = { mobile_or_username_or_cards_code_cont: keyword }
      findCustomers({ q }).then((customersResult) => {
        this.customerList = this.buildCustomers(customersResult)
        cb(this.computedCustomerOptions)
      })
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
    searchOrders(keyword, cb ) {
      //this.searchOrdersAsync(keyword, this);
      if( keyword.length<4){
        return cb([])
      }
      let q = { line_item_groups_number_or_number_cont: keyword }
      findOrders({ q }).then((ordersResult) => {
        this.orderList = this.buildOrders(ordersResult)
        cb(this.computedOrderOptions)
      })
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
      this.customerComboId = this.currentCustomer.mobile
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
      if( this.computedLineItemGroups.length > 0){
        this.orderComboId = this.computedLineItemGroups[0].number
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
    handleGroupImageClick(group){
      //
      let images = group.images
      console.log("group image clicked..", group)
      this.carouselImages = images
      //this.dialogImageUrl = file.originalUrl;
      if( images.length > 0 ){
        this.imageDialogVisible = true
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
