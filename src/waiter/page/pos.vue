<template>
<div>
  <MemberKeyWord @MemberData="MemberData($event)" :dialog-visible.sync="memberSearchDislogVisible"></MemberKeyWord>

  <div class="pos">
    <div class="loading" v-if="false">
      <i class="fa fa-spinner fa-pulse fa-1x"></i>
      <span class="sr-only">Loading...</span>
    </div>
    <el-row class="pos-content">
      <el-col :span="12" class="pos-order">
        <el-tabs >
          <el-tab-pane label="订单" class="new-order">
            <div class="customer-container">
              <div> customer search </div>
              <div> customer info </div>
            </div>
           <el-table :data="sortedOrderItemList" border stripe style="width:100%;" class="order-item-list">
             <el-table-column label="物品序号">
               <template slot-scope="scope">
                 <vue-xeditable  :name="'groupNumber_'+scope.row.index+'_xeditable'" v-model="scope.row.groupNumber" type="number" @value-did-change="handleGroupNumberChanged"></vue-xeditable>
               </template>
             </el-table-column>
             <el-table-column prop="fullName" label="商品名"></el-table-column>
             <el-table-column prop="unitPrice" label="单价"></el-table-column>
             <el-table-column prop="quantity" label="数量" ></el-table-column>
             <el-table-column prop="discount" label="折扣" >折扣</el-table-column>
             <el-table-column prop="price" label="金额" >金额</el-table-column>
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
             <!-- <customerButton>  </customerButton> -->
             <div class="customer-button" @click="openMemberSearchDislog">
               <div>
                 <h4 style='padding-top:10px;'>{{customer.name}}&nbsp;&nbsp;&nbsp;&nbsp;
                         <span style="font-size:12px;background:#ebb563;" v-if="customer.cards">No:&nbsp;&nbsp;xxxxxx
                         </span>
                       </h4>
               </div>
               <div>
                 <h6 style='padding-top:10px; padding-bottom:5px'>余额:&nbsp;&nbsp;{{customer.balance}}&nbsp;&nbsp;元</h6>
               </div>
             </div>
             <checkou-button :order-list="orderItemList" :totalMoney="totalMoney" :customerData="customer"> </checkou-button>
           </div>
         </el-tab-pane >
         <el-tab-pane  label="取单" class="ready-order">
           客户取单
         </el-tab-pane >
        </el-tabs>


      </el-col>
      <el-col :span="12">
        <div class="hot-goods">
          <!-- <div>
              <el-row class="hot-list">
                <el-col class="hot-item" :span="12" v-for="goods in hotGoods" :key="goods.id" @click.native="addOrderItem(goods)">
                  <div class="grid-content bg-purple">
                    <span>{{goods.name}}</span>
                    <span class="price">￥{{goods.price}}恭喜发财元</span>
                  </div>
                </el-col>
              </el-row>
            </div> -->
        </div>
        <div class="goods-type">
          <el-tabs>
            <el-tab-pane v-for="menu in menuList" :key="menu.id" v-bind:label="menu.name">
              <div>
                <el-row class="cook-list">
                  <el-col class="cook-item" :span="6" v-for="goods in getTaxonProducts(menu.id)" :key="goods.id" @click.native="openClassify(goods)">
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
import customerButton from "@/components/customerButton.vue"
import checkoutButton from "@/components/checkoutButton.vue"
import MemberKeyWord from "@/components/MemberKeyWord.vue"


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
  getProducts
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
      geohash: "", //geohash位置信息
      storeId: null, //商店id值
      storeName: "", //店铺名称
      showLoading: true, //显示加载动画
      shopDetailData: null, //商铺详情
      menuList: [], //食品列表
      menuIndex: 0, //已选菜单索引值，默认为0
      selectedTaxonId: 0,
      productList: [],
      baseImgPath,
      customer: {
        name: "来宾",
        balance: 0
      }, //改变当前选择会员，显示会员相关信息
      orderItemList: [], //订单 {variantId, price, quantity}
      packages: [],
      totalMoney: 0, //合计
      totalCount: 0,
      openClassVisible: false, //分类试图可见开关
      variants: [], //分类数组
      testData: {},
      memberSearchDislogVisible: false
    };
  },
  components: {
    loading,
    "checkou-button": checkoutButton, //收款按钮组件
    customerButton,
    MemberKeyWord,
  },
  mixins: [userDataMixin, apiResultMixin],
  computed: {
    ...mapState(["userInfo", "cartList"]),
    selectedTaxonProducts: function() {
      return this.productList.filter(function(product) {
        //return product.taxon_ids.includes( 0 )
        return false;
      });
    },
    sortedOrderItemList:function(){
      return this.orderItemList.sort((a,b)=>{ return (a.groupNumber - b.groupNumber) })
    },
    maxGroupNumber: function(){
      // 返回 0 或 >0
      let max = this.orderItemList.map((item)=>{return item.groupNumber}).sort().pop()
      return max ? max : 0
    },
    nextGroupNumber: function(){
      //取当前的最大数，再加 +1
      return this.maxGroupNumber + 1
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
      this.totalMoney = 0;
      this.totalCount = 0;
      // 根据判断的值编写业务逻辑
      let newGoods = {
        // index用来命名xeditable, 根据名称查找 orderItem, 修改对应值
        // [column]_[index]_[suffix] 示例：groupnumber_0_xeditable
        index: this.orderItemList.length,
        productId: goods.id,
        variantId: goods.variants[index].id,
        name: goods.name,
        variantName: goods.variants[index].optionsText,
        fullName: goods.name + goods.variants[index].optionValueTexts.join(),
        unitPrice: Number(goods.variants[index].price), // 单价
        price: Number(goods.variants[index].price), // 金额
        groupNumber: this.nextGroupNumber,
        quantity: 1,
        discount: 100  //折扣率

      };
      this.orderItemList.push(newGoods);
      console.log( "orderItemList", this.orderItemList)
      this.getSum();
    },
    //求和
    getSum() {
      // 汇总数量和金额
      let temp = 0;
      this.totalCount = 0;
      this.totalMoney = 0;
      if (this.orderItemList) {
        this.orderItemList.forEach((el, i) => {
          this.totalCount += el.count;
          temp += el.count * el.price;
        });
      }
      console.log(temp);
      this.totalMoney = temp.toFixed(2);
    },

    delOrderItem(selectedOrderItem) {
      // 删除当个商品
      this.orderItemList = this.orderItemList.filter(o => {
        return ! (( o.variantId == selectedOrderItem.variantId) && ( o.groupNumber == selectedOrderItem.groupNumber)) ;
      });
      this.getSum();
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
      this.totalCount = 0;
      this.totalMoney = 0;
      this.getSum();
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
      this.totalCount = 0;
      this.totalMoney = 0;
    },
    openClassify(goods) {
      this.openClassVisible = true;
      this.variants = goods.variants;
      this.testData = goods;
    },
    // 更新groupNumber后，更新订单列表，
    handleGroupNumberChanged(newValue, xeditableName){
      console.log( "newValue=" + newValue +" xeditableName=" + xeditableName)
      //示例：groupnumber_0_xeditable
      let [ column, index ] = xeditableName.split('_')
      index = parseInt( index)
      console.log( " column="+column, "index="+index)
      let newOrderItem = Object.assign({}, this.orderItemList[index], { [column]:newValue})
      console.log(" old=",  this.orderItemList[index], "new=", newOrderItem)
      this.orderItemList.splice(index, 1, newOrderItem)
    },
    // 客户搜索事件处理
    openMemberSearchDislog() {
      console.log("openMemberSearchDislog")
      this.memberSearchDislogVisible = true
    },
    //MemberKeyWord组件关闭后事件处理-----传过来memberData对象
    MemberData(memberData) {
      this.customer = memberData;
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
    span.vue-xeditable-value{
      display: block;
    }
    input.vue-xeditable-form-control{
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
        .customer-container{
          height: 80px;
        }
        .order-item-list {
            position: absolute;
            top: 80px;
            bottom: 130px;
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

.btn-group {
    margin-top: 10px;
    text-align: center;
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
