<template>
<div>
  <!-- 结账组件 Start-->
  <CheckoutDialog :order-list="orderItemList" :totalMoney="totalMoney" :customer="currentCustomer" :dialog-visible.sync="checkoutDialogVisible"></CheckoutDialog>
  <!-- 结账组件 End-->

  <!-- 添加会员组件 Start-->
  <member-add  v-on:AddMemberReturnData="AddMemberReturnData($event)" :dialog-visible.sync="memberAddWindowVisible"></member-add>
  <!-- 添加会员组件 End-->

  <div class="pos">
    <div class="loading" v-if="false">
      <i class="fa fa-spinner fa-pulse fa-1x"></i>
      <span class="sr-only">Loading...</span>
    </div>
    <el-row class="pos-content">
      <el-col :span="13" class="pos-order">
        <el-tabs>
          <el-tab-pane label="订单" class="new-order">
            <div class="customer-container clear">
              <el-form ref="customerForm" size="mini"  :inline="true" class="search-form">
                <el-form-item label="会员搜索">
                  <el-select v-model="customerComboId" :remote-method="searchCustomers" placeholder="请输入会员/手机号" filterable remote clearable @change="handleCustomerChanged" @clear="handleCustomerChanged">
                    <el-option v-for="item in computedCustomerOptions" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                  </el-select> {{customerComboId}}
                </el-form-item>

                <el-button type="" size="mini" @click="handleNewCustomerButtonClicked" class="right">添加会员</el-button>

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
                <el-button type="danger" size="mini" @click="clearAllGoods">清空</el-button>
              </div>
              <div class="check-button" @click="openCheckoutDialog()" > 收款 ：&nbsp;￥&nbsp;{{totalMoney}} </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="取单" class="ready-order">
            <!-- 取单组件 Start-->
            <OrderDelivery ></OrderDelivery>
            <!-- 取单组件 End-->
          </el-tab-pane>
        </el-tabs>
      </el-col>
      <el-col :span="11">
        <div class="hot-goods">
        </div>
        <div class="goods-type">
          <el-tabs>
            <el-tab-pane v-for="menu in menuList" :key="menu.id" v-bind:label="menu.name">
              <div>
                <el-row class="cook-list">
                  <el-col class="cook-item" :span="6" v-for="goods in getTaxonProducts(menu.id)" :key="goods.id">
                    <div class="food-wrapper">
                      <div class="food-img">
                        <img :src="getProductImageUrl(goods)" width="100%" />
                      </div>
                      <div class="good-info">
                        <span class="food-name">{{goods.name}}</span>
                        <!-- <span class="food-price">￥&nbsp;{{goods.price}}&nbsp; 元</span> -->
                      </div>

                      <div class="variants-wrapper">
                        <div class="clear">
                          <div v-for="(variant,index) in goods.variants" :key="index" class="left">
                            <el-button size="mini" @click="addOrderItem(goods,index)">
                              <span>{{variant.optionValueTexts.join()}}({{variant.price}})</span>
                            </el-button>
                          </div>
                        </div>
                      </div>
                    </div>

                  </el-col>
                </el-row>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
      </el-col>
    </el-row>
  </div>
</div>
</template>

<script>
import CustomerButton from "@/components/CustomerButton.vue"
import CheckoutDialog from "@/components/CheckoutDialog.vue"
import MemberAdd from "@/components/MemberAdd.vue"
import OrderDelivery from "@/components/OrderDelivery.vue"
import _ from "lodash"

import {
  mapState,
  mapActions
} from "vuex";
import {
  userDataMixin
} from "@/components/userDataMixin";
import {
  apiResultMixin
} from '@/components/apiResultMixin'

import {
  foodMenu,
  getProducts,
  findCustomers
} from "@/api/getData";
import loading from "@/components/common/loading";
import {
  baseImgPath
} from "@/config/env";
// import buyCart from '@/components/common/buyCart'
export default {
  name: "pos",
  data() {
    return {
      storeName: "", //店铺名称
      showLoading: true, //显示加载动画
      shopDetailData: null, //商铺详情
      menuList: [], //食品列表
      menuIndex: 0, //已选菜单索引值，默认为0
      selectedTaxonId: 0,
      productList: [],
      baseImgPath,
      defaultCustomer: {
        customerType: "无", //客户类型：无，散客，会员
        name: "来宾",
        balance: 0,
        cards: []
      }, //改变当前选择会员，显示会员相关信息
      defaultCard:{
        code: "无"
      },
      orderItemList: [], //订单 {variantId, price, quantity}
      packages: [],
      checkoutDialogVisible: false,
      memberAddWindowVisible: false,
      customerList: [], //按关键字搜索到的客户列表
      //由于搜索列表的每一项是 会员+会员卡，即如果会员有两个卡就有两项，
      //所以select的值为customerId+cardId, 当没有会员卡时，只有customerId
      customerComboId: null,

    };
  },
  components: {
    loading,
    CustomerButton,
    CheckoutDialog,
    MemberAdd,
    OrderDelivery
  },
  mixins: [userDataMixin, apiResultMixin],
  computed: {
    ...mapState(["userInfo", "cartList"]),
    customerId: function(){
      return ( this.customerComboId ? this.customerComboId.split('_')[0] : null )
    },
    cardId: function(){
      return ( this.customerComboId ? this.customerComboId.split('_')[1] : null )
    },
    selectedTaxonProducts: function() {
      return this.productList.filter(function(product) {
        //return product.taxon_ids.includes( 0 )
        return false;
      });
    },
    sortedOrderItemList: function() {
      return this.orderItemList.sort((a, b) => {
        return (a.groupPosition - b.groupPosition)
      })
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
    totalCount: function(){
      return this.orderItemList.reduce((total, item)=>{
        return total += item.quantity
      }, 0)
    },
    totalMoney: function(){
      let t = this.orderItemList.reduce((total, item)=>{
        return total += item.price
      }, 0)
      return Number(t).toFixed(2)
    },
    addNewCardButtonAvailable: function(){
      return this.currentCustomer.id && this.currentCustomer.cards.length == 0
    },
    maxGroupPosition: function() {
      // 返回 0 或 >0
      let max = this.orderItemList.map((item) => {
        return item.groupPosition
      }).sort().pop()
      return max ? max : 0
    },
    nextGroupPosition: function() {
      //取当前的最大数，再加 +1
      return this.maxGroupPosition + 1
    }
  },
  created() {
    this.initData();
    // this.getAdminData().then(res => {
    //   console.log("created");
    //   if (this.userInfo.id) {
    //     this.initData();
    //   } else {
    //     this.$router.push("/");
    //   }
    // });
  },
  mounted: function() {
    //let orderItemListHeight = document.body.clientHeight;
    //document.getElementById('orderItemList').style.minHeight = orderItemListHeight + 'px';
  },
  methods: {
    ...mapActions(["getAdminData"]),
    async initData() {
      //获取商铺食品列表 //获取商铺食品列表
      let taxonsData = await foodMenu(1);
      if (taxonsData) {
        this.menuList = taxonsData.taxons;
      }
      let productsResult = await getProducts();
      console.log(this.shopDetailData, productsResult);
      if (productsResult) {
        this.productList = this.buildProducts(productsResult)
      }

    },
    getTaxonProducts: function(taxonId) {
      return this.productList.filter(function(product) {
        return product.taxonIds.includes(taxonId);
      });
    },
    getProductImageUrl: function(product) {
      let image = product.master.images[0];
      return image ?
        baseImgPath + image.product_url :
        baseImgPath + "/img/noimage/product.jpg";
    },
    addOrderItem(goods, index) {
      // 增加商品
      let vid = goods.variants[index].id

      // 根据判断的值编写业务逻辑
      let newGoods = {
        // index用来命名xeditable, 根据名称查找 orderItem, 修改对应值
        // [column]_[index]_[suffix] 示例：groupnumber_0_xeditable
        index: this.orderItemList.length,
        productId: goods.id,
        variantId: vid,
        name: goods.name,
        variantName: goods.variants[index].optionsText,
        fullName: goods.name + goods.variants[index].optionValueTexts.join(),
        unitPrice: Number(goods.variants[index].price), // 单价
        price: Number(goods.variants[index].price), // 金额
        groupPosition: this.nextGroupPosition,
        quantity: 1,
        discount: this.getDiscountOfVariant(vid) //计算选择商品对应当前客户会员卡的折扣率
      }
      this.computePrice(newGoods)
      this.orderItemList.push(newGoods);
      console.log("orderItemList", this.orderItemList)
    },

    delOrderItem(selectedOrderItem) {
      // 删除当个商品
      this.orderItemList = this.orderItemList.filter(o => {
        return !((o.variantId == selectedOrderItem.variantId) && (o.groupPosition == selectedOrderItem.groupPosition));
      });
      this.$message({
        message: selectedOrderItem.fullName + " > 删除成功",
        type: "success"
      });
    },

    clearAllGoods() {
      if (!this.totalCount) {
        // 这个条件应该是根据后台返回的数据判断
        this.$message({
          message: "已经为空咯",
          type: "warning"
        });
        return;
      }
      this.orderItemList = [];
      this.$message({
        message: "清空成功，请重新下单",
        type: "warning"
      });
    },

    checkout() {
      // 模拟结账
      if (!this.totalCount) {
        // 这个条件应该是根据后台返回的数据判断
        this.$message({
          message: "还没有商品哦，请添加后在结账",
          type: "warning"
        });
        return;
      }
      this.$message({
        message: "结账成功，已到账￥" + this.totalMoney + "，感谢使用",
        type: "success"
      });
      this.orderItemList = [];
    },
    // 更新groupPosition后，更新订单列表，
    handleGroupPositionChanged(newValue, xeditableName) {
      console.log("newValue=" + newValue + " xeditableName=" + xeditableName)
      //示例：groupnumber_0_xeditable
      let [column, index] = xeditableName.split('_')
      index = parseInt(index)
      let newOrderItem = Object.assign({}, this.orderItemList[index], {
        [column]: newValue
      })
      console.log(" old=", this.orderItemList[index], "new=", newOrderItem)
      this.orderItemList.splice(index, 1, newOrderItem)
    },
    // 客户搜索事件处理
    openCheckoutDialog() {
      console.log("openCheckoutDialog")
      this.checkoutDialogVisible = true
    },
    //MemberKeyWord组件关闭后事件处理-----传过来memberData对象
    MemberData(memberData) {
      //this.customer = memberData;
    },
    //根据关键字查找客户
    //从SerVer上获取模糊搜索的用户数据,异步获取
    searchCustomers(keyword) {
      this.searchCustomersAsync(keyword, this);
    },
    //通过电话号码得从SerVer上获取用户数据,异步获取
    async customerFromMobile(mobile) {},
    //远程搜索输入框函数-----提示功能
    searchCustomersAsync: _.debounce((keyword, vm) => {
      findCustomers({
        q: {
          mobile_or_username_cont: keyword
        }
      }).then((customersResult) => {
        vm.customerList = vm.buildCustomers(customersResult)
      })
    }, 450),
    //店员改变当前选择客户,更新订单列表折扣率
    handleCustomerChanged(selectedCustomerId){
      if( selectedCustomerId ){
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
    findProductByVariantId( variantId ){
      let product = this.productList.find((product)=>{
        let vids = product.variants.map((v)=>{ return v.id})
        return vids.indexOf( variantId ) >= 0
      })
      return product
    },
    handleNewCustomerButtonClicked(){
      this.memberAddWindowVisible = true
    },
    getDiscountOfVariant( variantId ){
      // 找到这个订单对应的商品
      let discount = 100
      const product = this.findProductByVariantId( variantId )

      // 找到会员卡的分类ID，每个分类对应一些打折产品
      this.currentCustomer.cards.forEach((card)=>{
        let pid = card.productId
        product.relateds.forEach((related) =>{
          if( related.relatableId == pid){
            if( related.discountPercent < discount){
              discount = related.discountPercent
            }
          }
        })
      })
      // 找到商品对应用户会员卡的打折信息，设置折扣率
      return discount
    },
    computePrice( item ){
      item.price = item.discount * item.unitPrice * item.quantity /100
    }
  },
  watch: {
    userInfo: function(newValue) {
      if (!newValue.id) {
        this.$message({
          type: "error",
          message: "检测到您 session expired, please login again"
        });
        this.$router.push("login");
      }
    }
  }
};
</script>

<style lang="scss" >
.pos {
    position: absolute;
    top: 50px;
    left: 50px;
    right: 0;
    bottom: 50px;
    border-bottom: 1px solid #d3dce6;
    border-top: 1px solid #d3dce6;
    span.vue-xeditable-value {
        display: block;
    }
    input.vue-xeditable-form-control {
        width: 100%;
        padding: 0;
    }
    .pos-content {
        height: 100%;
        .pos-order {
            position: relative;
            height: 100%;
            .el-tabs {
                height: 100%;
                display: flex;
                flex-direction: column;
            }
            .el-tabs__content {
                flex-grow: 1;
                .el-tab-panel {
                    height: 100%;
                }
            }
        }
        .order-final {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
        }
    }
    .pos-order {
        background-color: #f9fafc;
        border-right: 1px solid #c0ccda;
        .el-tabs__item {
            min-width: 80px;
            text-align: center;
        }
        .el-tabs__content {
            }
        .customer-container {
          height: 118px;
          border-top: 1px solid #ebeef5;
          border-bottom: 1px solid #ebeef5;
          background-color: #fff;
          padding: 5px;
          .search-form{
            height: 33px;
            .el-form-item {
              margin-bottom: 5px;
            }
          }

          .search-result{
            position: relative;
            height: 78px;
            .left {
              position: absolute;
              top:0;bottom: 0;
              left:0;
            }
            .right{
              position: absolute;
              top:0;bottom: 0;
              right:0;
            }
            .cards{
              position: relative;
              border: 1px solid #ebeef5;
              height: 100%;
              overflow-y: auto;
              .card{
                font-size: 14px;
                padding: 5px;
                position: relative;
                height: 3em;
                div{
                  position: absolute;
                  top: 0;
                  left: 2em;
                  span{
                    display: inline-block;
                    padding: 5px 0 0;
                  }
                }
              }
            }
          }
          table{
            td{
              width: 20%;
            }
            td,th{
              border: 1px solid #ebeef5;
              padding: 6px 10px;
              font-size: 14px;
              box-sizing: border-box;
              white-space: normal;
              line-height: 23px;
            }
          }
        }
        .order-item-list {
            position: absolute;
            top: 130px;
            bottom: 80px;
        }
        .el-table__body-wrapper {
            position: absolute;
            top: 48px;
            bottom: 0;
            overflow-y: auto;
        }
        .customer-button {
            height: 60px;
            text-align: center;
            font-size: 21px;
            color: #fff;
            background-color: #909399;
            border-color: #909399;
        }
    }
}

.order-sum {
    height: 30px;
    text-align: center;
    background-color: #fff;
    border-bottom: 1px solid #d3dce6;
    i {
        font-size: 12px;
    }
    span {}
}

.hot-goods {
    .title {
        padding: 10px;
        line-height: 20px;
        border-bottom: 1px solid #d3dce6;
        background-color: #f9fafc;
        font-size: 14px;
        letter-spacing: 1px;
    }
    .hot-list {
        margin: 0;
        padding: 10px;
        .hot-item {
            margin: 5px 10px;
            padding: 5px 10px;
            border: 1px solid #e5e9f2;
            font-size: 12px;
            background-color: #f9f9f9;
            border-radius: 8px;
            cursor: pointer;
            transition: 0.3s;
            &:hover {
                color: #58b7ff;
                background-color: #f1f1f1;
            }
        }
    }
    .price {
        color: #58b7ff;
    }
}
.goods-type {
    .el-tabs__item {
        min-width: 80px;
        text-align: center;
    }
    .el-tabs__content {
        position: absolute;
        top: 40px;
        bottom: 0;
        overflow-y: auto;
    }
}
.cook-list {
    padding: 20px;
    .cook-item {
        height: auto;
        padding: 2px;
        overflow: hidden;

        cursor: pointer;
        transition: 0.5s;
        &:hover {

            transform: translate3d(0, -2px, 0);
            border: none;
        }
        .food-wrapper {
            background-color: #fff;
            .food-img {
                width: 100%;
            }
            .good-info {
                text-align: center;
            }
            .food-name {
                color: brown;
                font-size: 14px;
                letter-spacing: 1px;
            }
            .food-price {
                display: block;
                font-size: 12px;
                padding-top: 4px;
            }
        }

    }
}
</style>
