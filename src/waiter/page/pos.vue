<template>
  <el-container>
    <headTop :store-name="storeName"></headTop>
    <leftNav></leftNav>

    <div class="pos">
      <div class="loading" v-if="false">
        <i class="fa fa-spinner fa-pulse fa-1x"></i>
        <span class="sr-only">Loading...</span>
      </div>
      <el-row class="pos-content">
        <el-col :span="9" class="pos-order" id="orderList">
          <el-tabs>
            <el-tab-pane label="点餐">
              <el-table :data="orderList" border stripe style="width:100%;">
                <el-table-column prop="name" label="商品名"></el-table-column>
                <el-table-column prop="variantName" label="明细"></el-table-column>
                <el-table-column prop="count" label="数量" width="70"></el-table-column>
                <el-table-column prop="price" label="金额" width="70"></el-table-column>
                <el-table-column label="操作" width="100" fixed="right">
                  <template slot-scope="scope">
                    <el-button type="danger" size="mini" @click="delSingleGoods(scope.row)">删除</el-button>
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
                <div class="btn-group">
                  <!-- <el-button type="success" size="mini" @click="checkout">结账</el-button>
                  <el-button type="warning" size="mini">挂单</el-button> -->
                  <el-button type="danger" size="mini" @click="clearAllGoods">清空</el-button>
                </div>
                <!-- <customerButton>  </customerButton> -->
                <MemberKeyWord @MemberData="MemberData($event)"></MemberKeyWord>
                <checkou-button :order-list="orderList" :totalMoney="totalMoney" :customerData="customerData"> </checkou-button>
              </div>
            </el-tab-pane>
            <!-- <el-tab-pane label="挂单">挂单</el-tab-pane>
          <el-tab-pane label="外卖">外卖</el-tab-pane>
          <el-tab-pane label="配送">配送</el-tab-pane>
          <el-tab-pane label="卖萌">卖萌</el-tab-pane> -->
          </el-tabs>
        </el-col>
        <el-col :span="15">
          <div class="hot-goods">
            <div class="title">
              热销商品
            </div>
            <!-- <div>
              <el-row class="hot-list">
                <el-col class="hot-item" :span="12" v-for="goods in hotGoods" :key="goods.id" @click.native="addOrderList(goods)">
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
                    <el-col class="cook-item" :span="24" v-for="goods in getTaxonProducts(menu.id)" :key="goods.id" @click.native="openClassify(goods)">
                      <div class="food-wrapper">
                        <div class="food-img">
                          <img :src="getProductImageUrl(goods)" width="100%" />
                        </div>
                        <div class="good-info">
                          <span class="food-name">{{goods.name}}</span>
                          <!-- <span class="food-price">￥&nbsp;{{goods.price}}&nbsp; 元</span> -->
                        </div>
                      </div>
                      <el-row>
                        <el-col :span="6" v-for="(variants,index) in goods.variants" :key="index">
                          <div>
                            <el-button type="primary" plain @click="addOrderList(goods,index)">
                              <span >{{variants.name}}</span>
                              <el-tag type="danger">{{variants.price}}</el-tag>
                            </el-button>
                          </div>
                        </el-col>
                      </el-row>
                    </el-col>
                  </el-row>
                </div>
              </el-tab-pane>
            </el-tabs>
          </div>
        </el-col>
      </el-row>
    </div>
  </el-container>
</template>

<script>
import leftNav from "@/components/LeftNav/LeftNav.vue";
import headTop from "@/components/headTop.vue";
import customerButton from "@/components/customerButton.vue";
import checkoutButton from "@/components/checkoutButton.vue";
import MemberKeyWord from "@/components/MemberKeyWord.vue";

import { mapState, mapActions } from "vuex";
import { userDataMixin } from "@/components/userDataMixin";
import { shopDetails, foodMenu, getProducts } from "@/api/getData";
import loading from "@/components/common/loading";
import { baseImgPath } from "@/config/env";
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
      customerData: {},
      orderList: [], //订单 {variant_id, price, quantity}
      hotGoods: [],
      hamburgers: [],
      snack: [],
      drinks: [],
      packages: [],
      totalMoney: 0, //合计
      totalCount: 0,
      openClassVisible: false, //分类试图可见开关
      variants: [], //分类数组
      testData: {}
    };
  },
  components: {
    loading,
    leftNav,
    headTop,
    "checkou-button": checkoutButton, //收款按钮组件
    customerButton,
    MemberKeyWord
  },
  mixins: [userDataMixin],
  computed: {
    ...mapState(["userInfo", "latitude", "longitude", "cartList"]),
    selectedTaxonProducts: function() {
      return this.productList.filter(function(product) {
        //return product.taxon_ids.includes( 0 )
        return false;
      });
    }
  },
  created() {
    this.getAdminData().then(res => {
      console.log("created");
      if (this.userInfo.id) {
        this.storeId = this.userInfo.storeId;
        this.initData();
      } else {
        this.$router.push("/");
      }
    });
  },
  mounted: function() {
    //let orderListHeight = document.body.clientHeight;
    //document.getElementById('orderList').style.minHeight = orderListHeight + 'px';
  },
  methods: {
    ...mapActions(["getAdminData"]),
    async initData() {
      //获取商铺信息
      this.shopDetailData = await shopDetails(
        this.storeId,
        this.latitude,
        this.longitude
      );
      //获取商铺食品列表 //获取商铺食品列表
      let taxonsData = await foodMenu(1);

      if (taxonsData) {
        this.menuList = taxonsData.taxons;
      }

      let productsData = await getProducts();
      this.testData = productsData; //测试使用
      console.log(this.shopDetailData, taxonsData, productsData);

      if (productsData) {
        this.productList = productsData.products;
      }

      this.storeName = this.shopDetailData.name;
    },
    getTaxonProducts: function(taxonId) {
      return this.productList.filter(function(product) {
        return product.taxon_ids.includes(taxonId);
      });
    },
    getProductImageUrl: function(product) {
      let image = product.master.images[0];
      return image
        ? baseImgPath + image.product_url
        : baseImgPath + "/img/noimage/product.jpg";
    },
    addOrderList(goods, index) {
      // 增加商品
      this.totalMoney = 0;
      this.totalCount = 0;
      // 根据判断的值编写业务逻辑
      let newGoods = {
        id: goods.id,
        product_id: goods.id,
        variant_id: goods.variants[index].id,
        name: goods.name,
        variantName:goods.variants[index].options_text,
        price: Number(goods.variants[index].price),
        count: 1
      };
      this.orderList.push(newGoods);
      this.getSum();
    },
    //求和
    getSum() {
      // 汇总数量和金额
      let temp = 0;
      this.totalCount = 0;
      this.totalMoney = 0;
      if (this.orderList) {
        this.orderList.forEach((el, i) => {
          this.totalCount += el.count;
          temp += el.count * el.price;
        });
      }
      console.log(temp);
      this.totalMoney = temp.toFixed(2);
    },

    delSingleGoods(goods) {
      // 删除当个商品
      this.orderList = this.orderList.filter(o => {
        return o.variant_id !== goods.variant_id;
      });
      this.getSum();
      this.$message({
        message: goods.name + " > 删除成功",
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
      this.orderList = [];
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
      this.orderList = [];
      this.totalCount = 0;
      this.totalMoney = 0;
    },

    openClassify(goods) {
      this.openClassVisible = true;
      this.variants = goods.variants;
      this.testData = goods;
    },
    //MemberKeyWord组件关闭后事件处理-----传过来memberData对象
    MemberData(memberData){
      this.customerData = memberData;
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
  .pos-content {
    height: 100%;
    .pos-order {
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
}

.pos-order {
  background-color: #f9fafc;
  border-right: 1px solid #c0ccda;
  min-height: 100%;
}

.btn-group {
  margin-top: 10px;
  text-align: center;
}

.order-sum {
  padding: 10px;
  text-align: center;
  background-color: #fff;
  border-bottom: 1px solid #d3dce6;
  i {
    font-size: 12px;
  }
  span {
    color: #fe5916;
  }
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

.cook-list {
  padding: 20px;
  .cook-item {
    height: auto;
    padding: 2px;
    margin: 2px;
    overflow: hidden;
    background-color: #fff;
    cursor: pointer;
    transition: 0.5s;
    &:hover {
      box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
      transform: translate3d(0, -2px, 0);
      border: none;
    }
    .food-wrapper {
      display: flex;
      .good-info {
        margin-left: 4px;
        height: 54px;
      }
    }
    .food-img {
      flex-basis: 54px;
      width: 54px;
    }
    .food-name {
      display: block;
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
</style>
