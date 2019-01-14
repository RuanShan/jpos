<style lang="scss" >
@import '~@/style/mixin';

.pos {
    position: absolute;
    top: 50px;
    left: 50px;
    right: 0;
    bottom: 50px;
    border-bottom: 1px solid #d3dce6;
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

        }
    }
    .pos-order {
      /*background-color: #f9fafc;
      border-right: 1px solid #c0ccda;*/
        .vue-xeditable-empty {
            font-style: normal;
        }
        .el-tabs__content{
          padding: 0 10px;
        }
        .el-tabs__item {
            min-width: 80px;
            text-align: center;
        }
        .el-tabs__content {}
        .customer-container {
            padding: 10px;
            margin-bottom: 10px;
            background-color: #fff;
            /*border-top: 1px solid #ebeef5;
            border-bottom: 1px solid #ebeef5;
          */
            .search-form {
                .el-form-item {
                    margin-bottom: 5px;
                }
            }

            .search-result {
                position: relative;
                .left {
                    position: absolute;
                    top: 0;
                    bottom: 0;
                    left: 0;
                }
                .right {
                    position: absolute;
                    top: 0;
                    bottom: 0;
                    right: 0;
                }
                .card-type{
                  max-width: 8em;
                }
                .cards {
                    position: relative;
                    border: 1px solid #ebeef5;
                    height: 100%;
                    overflow-y: auto;
                    .card {
                        font-size: 14px;
                        padding: 5px;
                        position: relative;
                        height: 3em;
                        div {
                            position: absolute;
                            top: 0;
                            left: 2em;
                            span {
                                display: inline-block;
                                padding: 5px 0 0;
                            }
                        }
                    }
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
            top: 140px;
            bottom: 80px;
            left: 10px;
            right: 10px;
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
        .wrap{
          background-color: #f4f4f4;
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
    .goods-type {
        height: 100%;
        .el-tabs__item {
            min-width: 80px;
            text-align: center;
        }
        .el-tabs__content {
            position: absolute;
            top: 55px;
            bottom: 0;
            overflow-y: auto;
            width: 100%;
        }
        .wrap{
          background-color: #f4f4f4;
        }
        .image-list{
          padding: 0 10px 10px;
          &.group-image-list{
            .el-upload.el-upload--picture-card{
              display: none;
            }
            .el-icon-delete{
              display: none;
            }
          }
        }
    }
    .cook-list {
        padding: 0 10px 10px;
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
                    padding: 6px 6px;
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
                .variants-wrapper{
                  display: flex;
                  justify-content: center;
                  .item{ margin: 4px;}
                  height: 34px;
                }
                .el-button--mini{
                  padding: 6px;
                }
            }

        }
    }
    .wrap {
        margin: 10px;
        height: calc(100% - 20px);
        width: calc(100% - 20px);
        position: relative;
    }
    .empty{
      min-height: 60px;
      text-align: center;
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
    }
}
.pos-cover{
  position: absolute;
  top: 50px;
  left: 50px;
  right: 0;
  bottom: 0;
  background-color: #fff;
  opacity: 0.8;
  z-index: 10;
  color: red;
 .msg{
      @include center();
      background-color: #E6A23C;
       color: #fff;
       display: inline-block;
       padding: 15px;
  }

  text-align: center;
}
</style>

<template>
<div>
  <headTop></headTop>
  <leftNav></leftNav>
  <!-- 结账组件 Start-->
  <CheckoutDialog :order-item-list="orderItemList" :totalMoney="totalPrice" :customer="currentCustomer" :card="currentCard" :dialog-visible.sync="checkoutDialogVisible" @order-created-event="handleOrderCreated"></CheckoutDialog>
  <!-- 结账组件 End-->

  <!-- 添加会员组件 Start-->
  <member-add @customer-created-event="handleCustomerCreatedEvent" :dialog-visible.sync="memberAddWindowVisible"></member-add>
  <!-- 添加会员组件 End-->

  <div class="pos">
    <div class="loading" v-if="false">
      <i class="fa fa-spinner fa-pulse fa-1x"></i>
      <span class="sr-only">Loading...</span>
    </div>
    <el-row class="pos-content">
      <el-col :span="13" class="pos-order">
        <div class="wrap">
          <el-tabs v-model="selectedTabName" @tab-click="handleTabClick">
            <el-tab-pane label="订单"  name="newOrderTab" class="new-order">
              <div class="customer-container clear">
                <el-form ref="customerForm" size="mini" :inline="true" class="search-form">
                  <el-form-item label="会员搜索">
                    <el-select v-model="customerComboId" :remote-method="searchCustomers" placeholder="请输入会员/手机号" filterable remote clearable @change="handleCustomerChanged" @clear="handleCustomerChanged">
                      <el-option v-for="item in computedCustomerOptions" :key="item.value" :label="item.label" :value="item.value">
                      </el-option>
                    </el-select>
                  </el-form-item>

                  <el-button type="" size="mini" @click="handleNewCustomerButtonClicked" class="right">添加会员</el-button>

                </el-form>
                <div class="search-result clear">
                  <div>
                    <table style="width:100%">
                      <tr>
                        <th>客户类型</th>
                        <td>{{currentCustomer.customerType}} <span v-show="isCustomerFromOtherStore">({{currentCustomer.storeName}}) </span></td>
                        <th>移动电话</th>
                        <td>{{currentCustomer.mobile}}</td>
                        <th>消费金额</th>
                        <td> <span v-show="currentCustomer.normalOrderTotal">¥</span> {{currentCustomer.normalOrderTotal}}</td>
                      </tr>
                      <tr>
                        <th>会员卡号</th>
                        <td>{{currentCard.code}}</td>
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
                <el-table class="fillcontain cel-scrollable-table" :data="sortedOrderItemList" border style="width:100%;">
                <el-table-column label="物品序号" :render-header="renderEditableTableHeader" width="100">
                  <template slot-scope="scope">
                  <vue-xeditable  :name="'groupPosition_'+scope.row.uid+'_xeditable'" v-model="scope.row.groupPosition" type="number" @value-did-change="handleXeditableChanged"></vue-xeditable>
                  </template>
                </el-table-column>
                <el-table-column prop="cname" label="服务项目" width="160"></el-table-column>
                <el-table-column prop="saleUnitPrice" label="单价" :render-header="renderEditableTableHeader" width="80">
                  <template slot-scope="scope">
                 <vue-xeditable  :name="'saleUnitPrice_'+scope.row.uid+'_xeditable'" v-model="scope.row.saleUnitPrice" type="number" @value-did-change="handleXeditableChanged"></vue-xeditable>
               </template>
                </el-table-column>
                <el-table-column prop="quantity" label="数量" width="50"></el-table-column>
                <el-table-column prop="displayDiscount" label="折扣" width="65">折扣</el-table-column>
                <el-table-column prop="price" label="金额" width="80">金额</el-table-column>
                <el-table-column prop="memo" label="备注" :render-header="renderEditableTableHeader">
                  <template slot-scope="scope">
                 <vue-xeditable  :name="'memo_'+scope.row.uid+'_xeditable'" v-model="scope.row.memo" type="text" @value-did-change="handleXeditableChanged" empty="无"></vue-xeditable>
                </template>
                </el-table-column>
                <el-table-column label="操作" width="60" align="center">
                  <template slot-scope="scope">
                  <el-button type="danger" icon="el-icon-delete" circle @click="delOrderItem(scope.row)" size="mini"></el-button>
               </template>
                </el-table-column>
                </el-table>
              </div>
              <div class="order-final">
                <div class="order-sum clear">
                  <div class="count left" >
                    <i>物品数量：</i> <span>{{totalGroupCount}}</span>&nbsp;&nbsp;&nbsp;
                    <i>工作数量：</i> <span>{{totalItemCount}}</span>&nbsp;&nbsp;&nbsp;
                  </div>
                  <el-button type="danger" size="mini" @click="clearAllGoods" class="right" >清空</el-button>
                </div>
                <div>
                  <el-button class="check-button" @click="openCheckoutDialog">
                    <div  v-show="currentCard.id" >
                      <span > 应收：¥ {{totalSalePrice}} </span>&nbsp;&nbsp;&nbsp;<span> 实收：¥ {{totalPrice}}</span>
                    </div>
                    <div  v-show="!currentCard.id" >
                      <span> 收款：¥ {{totalPrice}}</span>
                    </div>
                  </el-button>
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane label="取单"  name="readyOrderTab" class="ready-order">
              <!-- 取单组件 Start-->
              <OrderDelivery @current-group-changed="handleCurrentGroupChanged"></OrderDelivery>
              <!-- 取单组件 End-->
            </el-tab-pane>
            <el-tab-pane label="支出"  name="expenseItemTab" class="ready-order">
              <!-- 取单组件 Start-->
              <ExpenseItems @current-item-changed="handleCurrentExpenseItemChanged"></ExpenseItems>
              <!-- 取单组件 End-->
            </el-tab-pane>
            <el-tab-pane label="库存"  name="stockMovementTab" class="ready-order">
              <!-- 取单组件 Start-->
              <StockMovements @current-item-changed="handleCurrentGroupChanged"></StockMovements>
              <!-- 取单组件 End-->
            </el-tab-pane>
          </el-tabs>
        </div>
      </el-col>
      <el-col :span="11" class="goods-type">
        <div class="wrap ">
          <el-tabs v-show="selectedTabName=='newOrderTab'">
            <el-tab-pane v-for="menu in menuList" :key="menu.id" v-bind:label="menu.name">
              <div>
                <el-row class="cook-list">
                  <el-col class="cook-item" :span="8" v-for="goods in getTaxonProducts(menu.id)" :key="goods.id">
                    <div class="food-wrapper">
                      <div class="food-img">
                        <img :src="getProductImageUrl(goods)" width="100%" />
                      </div>
                      <div class="good-info">
                        <span class="food-name">{{goods.name}}</span>
                        <!-- <span class="food-price">￥&nbsp;{{goods.price}}&nbsp; 元</span> -->
                      </div>

                      <div class="variants-wrapper">
                          <div v-for="(variant,index) in goods.variants" :key="index" class="item">
                            <el-button size="mini" @click="addOrderItem(goods,index)">
                              <span>{{variant.optionValueTexts.join()}}</span>
                            </el-button>
                          </div>
                      </div>
                    </div>

                  </el-col>
                </el-row>
              </div>
            </el-tab-pane>
          </el-tabs>
          <el-tabs v-show="selectedTabName=='readyOrderTab'" >
            <el-tab-pane  label="物品图片">
              <div class="empty" v-show="computedGroupImages.length==0">
                暂无数据
              </div>
              <div class="group-image-list image-list">
                <el-upload
                  action=""
                  :auto-upload="false"
                  list-type="picture-card"
                  :file-list="computedGroupImages" :on-preview="handlePreviewImage">
                  <i class="el-icon-plus"></i>
                </el-upload>

              </div>
            </el-tab-pane>
          </el-tabs>
          <el-tabs v-show="selectedTabName=='expenseItemTab'">
            <el-tab-pane  label="费用图片" >
              <div class="expense-image-list image-list">
                <el-upload
                  :file-list="computedGroupImages"
                  :action="computedImageUploadPath"
                  name="image[attachment]"
                  list-type="picture-card"
                  :with-credentials="true"
                  :before-upload="handleBeforeUploadExpenseItemImage"
                  :before-remove="handleImageRemoveConfirm"
                  :on-remove="handleRemoveImage"
                  :on-success="handleExpenseItemImagesUploadSuccess"
                  :on-preview="handlePreviewExpenseItemImage" v-show="computedImageUploadPath">
                  <i class="el-icon-plus"></i>
                </el-upload>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
      </el-col>
    </el-row>
  </div>
  <div class="pos-cover" v-show="(!isUserEntryExist)&&(storeId>0)"> <span class="msg"> 请先打卡，再处理业务！</span> </div>
  <CelSwiper :carousel-images="carouselImages" :dialog-visible.sync="carouselDialogVisible"> </CelSwiper>
</div>
</template>

<script>
import _ from "lodash"
import leftNav from "@/components/layout/LeftNav.vue"
import headTop from "@/components/layout/headTop.vue";
import CelSwiper from "@/components/dialog/CelSwiper.vue";

import CheckoutDialog from "@/components/CheckoutDialog.vue"
import MemberAdd from "./MemberAdd.vue"
import OrderDelivery from "./OrderDelivery.vue"
import ExpenseItems from "./ExpenseItems.vue"
import StockMovements from "./StockMovements.vue"


import {
  foodMenu,
  getProducts,
  findCustomers,
  getCustomer,
  deleteExpenseItemImage
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
      showLoading: true, //显示加载动画
      shopDetailData: null, //商铺详情
      menuList: [], //食品列表
      menuIndex: 0, //已选菜单索引值，默认为0
      selectedTabName: 'newOrderTab',
      productList: [],
      defaultCustomer: {
        customerType: "无", //客户类型：无，散客，会员
        name: "来宾",
        balance: 0,
        cards: []
      }, //改变当前选择会员，显示会员相关信息
      defaultCard: {
        code: ""
      },
      orderItemList: [], //订单 {variantId, price, quantity}
      selectedItems: {}, // 当前选择的物品/费用 { readyOrderTab: lineItemGropu, expenseItemTab: expenseItem}
      checkoutDialogVisible: false,
      memberAddWindowVisible: false,
      customerList: [], //按关键字搜索到的客户列表
      currentCustomer: null,
      currentCard: null,
      //由于搜索列表的每一项是 会员+会员卡，即如果会员有两个卡就有两项，
      //所以select的值为customerId+cardId, 当没有会员卡时，只有customerId
      customerComboId: null,
      carouselImages: [],//图片走马灯
      carouselDialogVisible: false,
      currentExpenseItemImages: [], // 允许编辑费用图片，所以在图片改变事件中设置当前费用图片列表
      currentGroupImages: []
    };
  },
  components: {
    loading,
    leftNav,
    headTop,
    CheckoutDialog,
    MemberAdd,
    OrderDelivery,
    ExpenseItems,
    StockMovements,
    CelSwiper
  },
  computed: {
    customerId () {
      console.log(" this.customerComboId=", this.customerComboId)
      return (this.customerComboId ? this.customerComboId.split('_')[0] : null)
    },
    cardId () {
      return (this.customerComboId ? this.customerComboId.split('_')[1] : null)
    },
    selectedTaxonProducts () {
      return this.productList.filter(function (product) {
        //return product.taxon_ids.includes( 0 )
        return false;
      });
    },
    sortedOrderItemList () {
      return this.orderItemList.sort((a, b) => {
        return (a.groupPosition - b.groupPosition)
      })
    },
    computedCustomerOptions () {
      let ops = this.customerList.map((customer) => {
        if (customer.cards.length > 0) {
          return customer.cards.filter((card)=>{
            return card.state == this.CardStateEnum.enabled
          }).map((card) => {
            return {
              value: [customer.id, card.id].join('_'),
              label: `${customer.mobile} (${card.displayStyle} ${card.code})`
            }
          })
        } else {
          return [{
            value: customer.id.toString(),
            label: customer.mobile
          }]
        }
      })
      return _.flatten(ops)
    },

    totalItemCount () { // 工作数量
      return this.orderItemList.reduce((total, item) => {
        return total += item.quantity
      }, 0)
    },
    totalGroupCount () { //物品数量
      return  _.uniq( this.orderItemList.map((item) => {
        return item.groupPosition
      })).length
    },
    totalPrice () { // 实收
      let t = this.orderItemList.reduce((total, item) => {
        return total += item.price
      }, 0)
      return Number(t).toFixed(2)
    },
    totalSalePrice () { // 应收
      let t = this.orderItemList.reduce((total, item) => {
        return total += ( item.saleUnitPrice * item.quantity )
      }, 0)
      return Number(t).toFixed(2)
    },
    addNewCardButtonAvailable () {
      return this.currentCustomer.id && this.currentCustomer.cards.length == 0
    },
    maxGroupPosition () {
      // 返回 0 或 >0
      let max = this.orderItemList.map((item) => {
        return item.groupPosition
      }).sort().pop()
      return max ? max : 0
    },
    nextGroupPosition () {
      //取当前的最大数，再加 +1
      return this.maxGroupPosition + 1
    },
    computedGroupImages(){
      let selectedItem = this.selectedItems[this.selectedTabName]
      return selectedItem ? selectedItem.images : []
    },
    computedImageUploadPath(){
      let selectedItem = this.selectedItems[this.selectedTabName]
      return selectedItem ? selectedItem.imageUploadPath : ''
    },
    isUserEntryExist(){
      //以便检验用户是否打卡，是否可以下单
      let entry = this.userEntries.find((entry)=>{ return entry.state=='clockin' })
      return entry != null
    },
    isCustomerFromOtherStore(){
      return this.currentCustomer && this.currentCustomer.storeId && this.currentCustomer.storeId!=this.storeId
    }
  },
  created() {
    this.currentCustomer = this.defaultCustomer
    this.currentCard = this.defaultCard
    this.initData();
    //新订单创建以后，需要更新当前选择客户的会员卡余额数据
    this.$bus.$on('order-created-gevent', (newOrder) => {
      console.log('order-created-gevent', 'this.currentCustomer', this.currentCustomer, this.currentCustomer.id)
    })

  },
  methods: {
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
    getTaxonProducts (taxonId) {
      return this.productList.filter(function (product) {
        return product.taxonIds.includes(taxonId);
      });
    },
    getProductImageUrl (product) {
      let image = product.master.images[0];
      return image ?
        image.large_url :
        baseImgPath + "/img/noimage/product.jpg";
    },
    addOrderItem(goods, index) {
      // 增加商品
      let vid = goods.variants[index].id

      // 根据判断的值编写业务逻辑
      let newGoods = {
        // uid用来命名xeditable, 根据名称查找 orderItem, 修改对应值
        // [column]_[uid]_[suffix] 示例：groupnumber_0_xeditable
        uid: new Date().getTime(),
        productId: goods.id,
        variantId: vid,
        name: goods.name,
        variantName: goods.variants[index].optionsText,
        cname: goods.name + goods.variants[index].optionValueTexts.join(),
        saleUnitPrice: Number(goods.variants[index].price), // 单价
        price: Number(goods.variants[index].price), // 金额
        groupPosition: this.nextGroupPosition,
        quantity: 1,
        memo: "",
        discountPercent: this.getDiscountOfVariant(vid) //计算选择商品对应当前客户会员卡的折扣率
      }
      newGoods.displayDiscount = this.getDisplayDiscount( newGoods.discountPercent )
      this.computePrice(newGoods)
      this.orderItemList.push(newGoods);
      console.log("orderItemList", this.orderItemList)
    },

    delOrderItem(selectedOrderItem) {
      // 删除当个商品
      this.orderItemList = this.orderItemList.filter(o => {
        return !(o == selectedOrderItem)
      });
      this.$message({
        message: selectedOrderItem.cname + " > 删除成功",
        type: "success"
      });
    },

    clearAllGoods() {
      if (!this.totalItemCount) {
        // 这个条件应该是根据后台返回的数据判断
        this.$message({
          message: "已经为空!",
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
      if (!this.totalItemCount) {
        // 这个条件应该是根据后台返回的数据判断
        this.$message({
          message: "还没有商品哦，请添加后在结账",
          type: "warning"
        });
        return;
      }
      this.$message({
        message: "结账成功，已到账￥" + this.totalPrice + "，感谢使用",
        type: "success"
      });
      this.orderItemList = [];
    },
    // 更新groupPosition后，更新订单列表，
    handleXeditableChanged(newValue, xeditableName) {
      console.log("newValue=" + newValue + " xeditableName=" + xeditableName)
      //示例：groupPosition_0_xeditable
      // here should be uid, index would not work.
      let [column, uid] = xeditableName.split('_')
      uid = parseInt(uid)
      let index = this.orderItemList.findIndex((item)=>{ return item.uid == uid})
      let item = this.orderItemList[index]
      item[column] = newValue
      if (column == 'saleUnitPrice') {
        this.computePrice(item)
      }
      if (column == 'groupPosition') {
        item.groupPosition = parseInt( item.groupPosition )
      }
      console.log(" new=", item)
      this.$set(this.orderItemList, index, item )
    },
    // select order tabs
    handleTabClick(tab, event) {
      console.log(this.selectedTabName)

    },
    // 客户搜索事件处理
    openCheckoutDialog() {
      //检查是否真的有订单
      if( this.totalItemCount == 0){
        return
      }
      //检查是否选择了人
      if( this.totalItemCount == 0){
        return
      }
      console.log("openCheckoutDialog")
      this.checkoutDialogVisible = true
    },
    //根据关键字查找客户
    //从SerVer上获取模糊搜索的用户数据,异步获取
    searchCustomers(keyword) {
      this.searchCustomersAsync(keyword, this);
    },
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
    handleCustomerChanged(selectedComboCustomerId) {
      if (selectedComboCustomerId) {
        //当前选择的客户
        this.currentCustomer = this.customerList.find((customer, index, arr) => {
          return customer.id == this.customerId
        })

        //当前选择的会员卡
        if( this.cardId ){
          this.currentCard = this.currentCustomer.cards.find((card)=>{
            return card.id == this.cardId
          })
        }


        this.orderItemList.forEach((item) => {
          item.discountPercent = this.getDiscountOfVariant(item.variantId)
          item.displayDiscount =this.getDisplayDiscount( item.discountPercent )
          this.computePrice(item)
        })
      } else {
        this.setCurrentCustomer( this.defaultCustomer )

        this.orderItemList.forEach((item) => {
          item.discountPercent = 100
          item.displayDiscount =this.getDisplayDiscount( item.discountPercent )
          this.computePrice(item)
        })
      }
    },
    handleOrderCreated(newOrder) {
      this.orderItemList = []
      this.$bus.$emit('order-created-gevent', newOrder)
      getCustomer(this.currentCustomer.id).then(result => {
        const customer = this.buildCustomer(result)
        const card = customer.cards.find((c)=>{ return c.id== this.currentCard.id })
        this.setCurrentCustomer(customer, card)
      })
    },
    // in ready group tab, current group change event
    handleCurrentGroupChanged(selected){
      console.log( "selectedGroup=", selected)
      this.$set(this.selectedItems, this.selectedTabName, selected)
      if( selected ){
        this.currentGroupImages = Array.of( ...selected.images )
      }
    },
    handleCurrentExpenseItemChanged(selected){
      console.log( "selectedExpenseItem=", selected)
      this.$set(this.selectedItems, this.selectedTabName, selected)
      if( selected ){
        this.currentExpenseItemImages = Array.of( ...selected.images )
      }
    },

    findProductByVariantId(variantId) {
      let product = this.productList.find((product) => {
        let vids = product.variants.map((v) => {
          return v.id
        })
        return vids.indexOf(variantId) >= 0
      })
      return product
    },
    handleNewCustomerButtonClicked() {
      this.memberAddWindowVisible = true
    },
    handleCustomerCreatedEvent(customer) {
      console.log(" handleCustomerCreatedEvent", customer)
      //如果创建了用户，选择新创建的客户
      if (customer) {
        //如果创建了会员卡，同时设置会员卡
        this.setCurrentCustomer(customer, customer.card)
      }
    },
    handlePreviewImage(file){
      console.log(" handlePreviewImage", file)
      this.carouselImages = this.currentGroupImages
      this.carouselDialogVisible = true
    },
    handlePreviewExpenseItemImage(file){
      console.log(" handlePreviewImage", this.currentExpenseItemImages)
      this.carouselImages = this.currentExpenseItemImages
      this.carouselDialogVisible = true
    },
    handleImageRemoveConfirm(file, fileList){
      return this.$confirm('此操作将永久删除该图片, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
    },
    handleRemoveImage(file, fileList) {
      // file.id( original file) or file.uid( new uploaded file)
      let imageIndex = this.currentExpenseItemImages.findIndex((image)=>{
        return (file.id && file.id==image.id) || (file.uid && file.uid==image.uid)
      })
      if( imageIndex >=0 ){
        let foundImage = this.currentExpenseItemImages[imageIndex]
        deleteExpenseItemImage( foundImage.viewableId, foundImage.id ).then(()=>{
          this.currentExpenseItemImages.splice( imageIndex, 1 )
          console.log("file=",file,"filelist", fileList);
        })

      }
    },
    handleExpenseItemImagesUploadSuccess(response, file, fileList){
      // donot call change event, file maybe uploading, so can not get image url for list
      //费用图片改变时，重新设置当前费用图片列表
      // OrderDelivery,重新读取expenseItem数据，并发送事件current-item-changed
      const image = this.buildGroupImage( response )
      image.uid = file.uid
      this.currentExpenseItemImages.push( image )
      console.log( "handleExpenseItemImagesUploadSuccess=", response, file)
      //this.$bus.$emit('expense-item-image-changed-gevent')
    },
    handleBeforeUploadExpenseItemImage( file ){
      console.log( "handleBeforeUploadExpenseItemImage=", file)
    },
    getDiscountOfVariant(variantId) {
      // 找到这个订单对应的商品
      let discount = 100
      const product = this.findProductByVariantId(variantId)

      // 找到会员卡的分类ID，每个分类对应一些打折产品
        let pid = this.currentCard.productId
        product.relateds.forEach((related) => {
          if (related.relatableId == pid) {
            if (related.discountPercent < discount) {
              discount = related.discountPercent
            }
          }
        })
      // 找到商品对应用户会员卡的打折信息，设置折扣率
      return discount
    },
    getDisplayDiscount( discount ){
      // 显示几折， 60， 6折
      return  discount==100 ? '无' : `${discount/10}折`
    },
    computePrice(item) {
      item.price = item.discountPercent * item.saleUnitPrice * item.quantity / 100
    },
    setCurrentCustomer(customer, card) {
      this.currentCustomer = customer
      // card 可能为空
      this.currentCard = card ? card : this.defaultCard
    },
    renderEditableTableHeader(h, {
      column
    }) {
      //显示添加编辑图标的表头
      return h('p', {}, [column.label, h('i', {
        class: "el-icon-edit"
      })])
    }
  }
};
</script>
