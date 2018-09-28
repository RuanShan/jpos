
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
                    width: 20%;
                }
                td,
                th {
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
        height: 30px;
        text-align: center;
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
        }
        .wrap{
          background-color: #f4f4f4;
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
    .wrap {
        margin: 10px;
        height: calc(100% - 20px);
        width: calc(100% - 20px);
        position: relative;
    }
}
</style>

<template>
<div>
  <headTop></headTop>
  <leftNav></leftNav>
  <!-- 结账组件 Start-->
  <CheckoutDialog :order-item-list="orderItemList" :totalMoney="totalMoney" :customer="currentCustomer" :dialog-visible.sync="checkoutDialogVisible" @order-created-event="handleOrderCreated"></CheckoutDialog>
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
          <el-tabs>
            <el-tab-pane label="订单" class="new-order">
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
                        <td>{{currentCustomer.customerType}}</td>
                        <th>移动电话</th>
                        <td>{{currentCustomer.mobile}}</td>
                        <th>消费金额</th>
                        <td>{{currentCustomer.normalOrderTotal}}元</td>
                      </tr>
                      <tr>
                        <th>会员卡号</th>
                        <td>{{currentCard.code}}</td>
                        <th>会员卡类型</th>
                        <td>{{currentCard.name}}</td>
                        <th>会员卡余额</th>
                        <td>{{currentCard.amountRemaining}}</td>
                      </tr>
                    </table>
                  </div>
                </div>
              </div>
              <div class="order-item-list">
                <el-table class="fillcontain" :data="sortedOrderItemList" border style="width:100%;">
                <el-table-column label="物品序号" :render-header="renderEditableTableHeader" width="100">
                  <template slot-scope="scope">
                 <vue-xeditable  :name="'groupPosition_'+scope.row.index+'_xeditable'" v-model="scope.row.groupPosition" type="number" @value-did-change="handleXeditableChanged"></vue-xeditable>
               </template>
                </el-table-column>
                <el-table-column prop="cname" label="服务项目" width="160"></el-table-column>
                <el-table-column prop="unitPrice" label="单价" :render-header="renderEditableTableHeader" width="80">
                  <template slot-scope="scope">
                 <vue-xeditable  :name="'unitPrice_'+scope.row.index+'_xeditable'" v-model="scope.row.unitPrice" type="number" @value-did-change="handleXeditableChanged"></vue-xeditable>
               </template>
                </el-table-column>
                <el-table-column prop="quantity" label="数量" width="50"></el-table-column>
                <el-table-column prop="discount" label="折扣%" width="65">折扣</el-table-column>
                <el-table-column prop="price" label="金额" width="50">金额</el-table-column>
                <el-table-column prop="memo" label="备注" :render-header="renderEditableTableHeader">
                  <template slot-scope="scope">
                 <vue-xeditable  :name="'memo_'+scope.row.index+'_xeditable'" v-model="scope.row.memo" type="text" @value-did-change="handleXeditableChanged" empty="无"></vue-xeditable>
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
                <div class="order-sum">
                  <i>数量：</i>
                  <span>{{totalCount}}</span>&nbsp;&nbsp;&nbsp;
                  <i>金额：</i>
                  <span>¥{{totalMoney}}</span>&nbsp;
                  <el-button type="danger" size="mini" @click="clearAllGoods">清空</el-button>
                </div>
                <div>
                  <el-button class="check-button" @click="openCheckoutDialog()"> 收款 ：&nbsp;¥&nbsp;{{totalMoney}}</el-button>
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane label="取单" class="ready-order">
              <!-- 取单组件 Start-->
              <OrderDelivery></OrderDelivery>
              <!-- 取单组件 End-->
            </el-tab-pane>
            <el-tab-pane label="支出" class="ready-order">
              <!-- 取单组件 Start-->
              <ExpenseItems></ExpenseItems>
              <!-- 取单组件 End-->
            </el-tab-pane>
          </el-tabs>
        </div>
      </el-col>
      <el-col :span="11" class="goods-type">

        <div class="wrap ">
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
import leftNav from "@/components/layout/LeftNav.vue"
import headTop from "@/components/layout/headTop.vue";

import CustomerButton from "@/components/CustomerButton.vue"
import CheckoutDialog from "@/components/CheckoutDialog.vue"
import MemberAdd from "./MemberAdd.vue"
import OrderDelivery from "./OrderDelivery.vue"
import ExpenseItems from "./ExpenseItems.vue"
import _ from "lodash"

import {
  foodMenu,
  getProducts,
  findCustomers,
  getCustomer
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
      selectedTaxonId: 0,
      productList: [],
      baseImgPath,
      defaultCustomer: {
        customerType: "无", //客户类型：无，散客，会员
        name: "来宾",
        balance: 0,
        cards: []
      }, //改变当前选择会员，显示会员相关信息
      defaultCard: {
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
    leftNav,
    headTop,
    CustomerButton,
    CheckoutDialog,
    MemberAdd,
    OrderDelivery,
    ExpenseItems
  },
  computed: {
    customerId: function () {
      console.log(" this.customerComboId=", this.customerComboId)
      return (this.customerComboId ? this.customerComboId.split('_')[0] : null)
    },
    cardId: function () {
      return (this.customerComboId ? this.customerComboId.split('_')[1] : null)
    },
    selectedTaxonProducts: function () {
      return this.productList.filter(function (product) {
        //return product.taxon_ids.includes( 0 )
        return false;
      });
    },
    sortedOrderItemList: function () {
      return this.orderItemList.sort((a, b) => {
        return (a.groupPosition - b.groupPosition)
      })
    },
    computedCustomerOptions: function () {
      let ops = this.customerList.map((customer) => {
        if (customer.cards.length > 0) {
          return customer.cards.map((card) => {
            return {
              value: [customer.id, card.id].join('_'),
              label: customer.mobile + '(#' + card.code + ')'
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
    //当前选择的客户
    currentCustomer: function () {
      let customer = this.defaultCustomer
      let cid = this.customerId
      if (cid) {
        customer = this.customerList.find((customer, index, arr) => {
          return customer.id == cid
        })
        if (!customer) {
          customer = this.defaultCustomer
        }
      }
      return customer
    },
    currentCard: function () {
      let card = this.defaultCard
      let customer = this.currentCustomer
      let cid = this.cardId
      if (customer.cards.length > 0) {
        card = customer.cards.find((card, index, arr) => {
          return card.id == cid
        })
      }
      return card
    },
    totalCount: function () {
      return this.orderItemList.reduce((total, item) => {
        return total += item.quantity
      }, 0)
    },
    totalMoney: function () {
      let t = this.orderItemList.reduce((total, item) => {
        return total += item.price
      }, 0)
      return Number(t).toFixed(2)
    },
    addNewCardButtonAvailable: function () {
      return this.currentCustomer.id && this.currentCustomer.cards.length == 0
    },
    maxGroupPosition: function () {
      // 返回 0 或 >0
      let max = this.orderItemList.map((item) => {
        return item.groupPosition
      }).sort().pop()
      return max ? max : 0
    },
    nextGroupPosition: function () {
      //取当前的最大数，再加 +1
      return this.maxGroupPosition + 1
    }
  },
  created() {
    this.initData();
    //新订单创建以后，需要更新当前选择客户的会员卡余额数据
    this.$bus.$on('order-created-gevent', () => {
      getCustomer(this.currentCustomer.id).then(result => {
        const customer = this.buildCustomer(result)
        this.setCurrentCustomer(customer)
      })
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
    getTaxonProducts: function (taxonId) {
      return this.productList.filter(function (product) {
        return product.taxonIds.includes(taxonId);
      });
    },
    getProductImageUrl: function (product) {
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
        cname: goods.name + goods.variants[index].optionValueTexts.join(),
        unitPrice: Number(goods.variants[index].price), // 单价
        price: Number(goods.variants[index].price), // 金额
        groupPosition: this.nextGroupPosition,
        quantity: 1,
        memo: "",
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
        message: selectedOrderItem.cname + " > 删除成功",
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
    handleXeditableChanged(newValue, xeditableName) {
      console.log("newValue=" + newValue + " xeditableName=" + xeditableName)
      //示例：groupnumber_0_xeditable
      let [column, index] = xeditableName.split('_')
      index = parseInt(index)
      let newOrderItem = Object.assign({}, this.orderItemList[index], {
        [column]: newValue
      })
      if (column == 'unitPrice') {
        this.computePrice(newOrderItem)
      }
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
    handleCustomerChanged(selectedCustomerId) {
      if (selectedCustomerId) {
        this.orderItemList.forEach((item) => {
          item.discount = this.getDiscountOfVariant(item.variantId)
          this.computePrice(item)
        })
      } else {
        this.orderItemList.forEach((item) => {
          item.discount = 100
          this.computePrice(item)
        })
      }
    },
    handleOrderCreated(newOrder) {
      this.orderItemList = []
      this.$bus.$emit('order-created-gevent')
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
        this.setCurrentCustomer(customer)
      }
    },

    getDiscountOfVariant(variantId) {
      // 找到这个订单对应的商品
      let discount = 100
      const product = this.findProductByVariantId(variantId)

      // 找到会员卡的分类ID，每个分类对应一些打折产品
      this.currentCustomer.cards.forEach((card) => {
        let pid = card.productId
        product.relateds.forEach((related) => {
          if (related.relatableId == pid) {
            if (related.discountPercent < discount) {
              discount = related.discountPercent
            }
          }
        })
      })
      // 找到商品对应用户会员卡的打折信息，设置折扣率
      return discount
    },
    computePrice(item) {
      item.price = item.discount * item.unitPrice * item.quantity / 100
    },
    setCurrentCustomer(customer) {
      //
      this.customerList = [customer]
      this.$nextTick(() => {
        // DOM updated
        console.log(" this.computedCustomerOptions=", this.computedCustomerOptions)
        this.customerComboId = this.computedCustomerOptions[0].value

      })
    },
    renderEditableTableHeader(h, {
      column
    }) {
      //显示添加编辑图标的表头
      return h('p', {}, [column.label, h('i', {
        class: "el-icon-edit"
      })])
    }
  },
  watch: {
    // userInfo: function(newValue) {
    //   if (!newValue.id) {
    //     this.$message({
    //       type: "error",
    //       message: "检测到您的登录信息过期, 请重新登录"
    //     });
    //     this.$router.push("login");
    //   }
    // }
  }
};
</script>
