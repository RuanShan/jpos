<template>
<el-container>
  <headTop></headTop>
  <leftNav></leftNav>

  <div class="pos">
    <div class="loading" v-if="false">
      <i class="fa fa-spinner fa-pulse fa-1x"></i>
      <span class="sr-only">Loading...</span>
    </div>
    <el-row class="pos-content">
      <el-col :span="7" class="pos-order" id="orderList">
        <el-tabs>
          <el-tab-pane label="点餐">
            <el-table :data="tableData" style="width:100%;">
              <el-table-column prop="goodsName" label="商品名"></el-table-column>
              <el-table-column prop="count" label="数量" width="70"></el-table-column>
              <el-table-column prop="price" label="金额" width="70"></el-table-column>
              <el-table-column label="操作" width="100" fixed="right">
                <template scope="scope">
                  <el-button type="text" size="mini" @click="delSingleGoods(scope.row)">删除</el-button>
                  <el-button type="text" size="mini" @click="addOrderList(scope.row)">增加</el-button>
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
                <el-button type="success" size="mini" @click="checkout">结账</el-button>
                <el-button type="warning" size="mini">挂单</el-button>
                <el-button type="danger" size="mini" @click="clearAllGoods">清空</el-button>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="挂单">挂单</el-tab-pane>
          <el-tab-pane label="外卖">外卖</el-tab-pane>
          <el-tab-pane label="配送">配送</el-tab-pane>
          <el-tab-pane label="卖萌">卖萌</el-tab-pane>
        </el-tabs>
      </el-col>
      <el-col :span="17">
        <div class="hot-goods">
          <div class="title">热销商品</div>
          <div>
            <el-row class="hot-list">
              <el-col class="hot-item" :span="4" v-for="goods in hotGoods" :key="goods.goodsId" @click.native="addOrderList(goods)">
                <div class="grid-content bg-purple">
                  <span>{{goods.goodsName}}</span>
                  <span class="price">￥{{goods.price}}元</span>
                </div>
              </el-col>
            </el-row>
          </div>
        </div>
        <div class="goods-type">
          <el-tabs >

            <el-tab-pane v-for="menu in menuList" v-bind:label="menu.name">
              <div>
                <el-row class="cook-list">
                  <el-col class="cook-item" :span="4" v-for="goods in menu.foods" :key="goods.id" @click.native="addOrderList(goods)">
                    <div class="food-wrapper">
                      <div class="food-img">
                        <img :src="imgBaseUrl + goods.image_path" width="100%" />
                      </div>
                      <div class="good-info">
                        <span class="food-name">{{goods.name}}</span>
                        <span class="food-price">￥&nbsp;{{goods.specfoods[0].price}}&nbsp;元</span>
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
</el-container>
</template>

<script>
import leftNav from '@/components/LeftNav/LeftNav.vue';
import headTop from '@/components/header.vue';
import {mapState, mapMutations} from 'vuex'
import { shopDetails, foodMenu } from '@/api/getData'
import loading from '@/components/common/loading'
import {imgBaseUrl} from '@/config/env'

// import buyCart from '@/components/common/buyCart'

import axios from 'axios';
export default {
  name: 'pos',
  data() {
    return {
      geohash: '', //geohash位置信息
      shopId: null, //商店id值
      showLoading: true, //显示加载动画
      shopDetailData: null, //商铺详情
      menuList: [], //食品列表
      menuIndex: 0, //已选菜单索引值，默认为0
      imgBaseUrl,

      tableData: [],
      hotGoods: [],
      hamburgers: [],
      snack: [],
      drinks: [],
      packages: [],
      totalMoney: 0,
      totalCount: 0
    };
  },
  components: {
    loading,
    leftNav,
    headTop
  },
  computed: {
    ...mapState([
        'latitude','longitude','cartList'
    ]),
  },
  created(){
    this.shopId = 4
    this.initData()

  },
  beforeCreatex: function () {
    axios.get('http://jspang.com/DemoApi/oftenGoods.php').then(res => {
      // console.log(res.data);
      this.hotGoods = res.data;
    }).catch(err => {
      console.log(err);
      alert('网络错误，不能访问');
    });

    axios.get('http://jspang.com/DemoApi/typeGoods.php').then(res => {
      // console.log(res.data);
      this.hamburgers = res.data[0];
      this.snack = res.data[1];
      this.drinks = res.data[2];
      this.packages = res.data[3];
    }).catch(err => {
      console.log(err);
      alert('网络错误，不能访问');
    });
  },
  mounted: function () {
    let orderListHeight = document.body.clientHeight;
    document.getElementById('orderList').style.minHeight = orderListHeight + 'px';
  },
  methods: {
    ...mapMutations([
        'RECORD_ADDRESS','ADD_CART','REDUCE_CART','INIT_BUYCART','CLEAR_CART','RECORD_SHOPDETAIL'
    ]),
    async initData(){
      //获取商铺信息
      this.shopDetailData = await shopDetails(this.shopId, this.latitude, this.longitude);
      //获取商铺食品列表
      this.menuList = await foodMenu(this.shopId);

    },
    addOrderList(goods) { // 增加商品
      this.totalMoney = 0;
      this.totalCount = 0;
      // 商品是否已经存在于订单列表中
      let isExist = false;
      this.tableData.forEach((el, i) => {
        if (el.goodsId === goods.goodsId) {
          isExist = true;
          return;
        }
      })

      // 根据判断的值编写业务逻辑
      if (isExist) {  // 如果存在，改变列表中的数量
        let arr = this.tableData.filter((o) => o.goodsId === goods.goodsId);
        arr[0].count++;
      } else {
        let newGoods = { goodsId: goods.goodsId, goodsName: goods.goodsName, price: goods.price, count: 1 };
        this.tableData.push(newGoods);
      }

      this.getSum();
    },
    delSingleGoods(goods) { // 删除当个商品
      this.tableData = this.tableData.filter(o => {
        return o.goodsId !== goods.goodsId
      });
      this.getSum();
      this.$message({
        message: goods.goodsName + ' > 删除成功',
        type: 'success'
      });
    },
    clearAllGoods() {
      if (!this.totalCount) { // 这个条件应该是根据后台返回的数据判断
        this.$message({
          message: '已经为空咯',
          type: 'warning'
        });
        return;
      }
      this.tableData = [];
      this.totalCount = 0;
      this.totalMoney = 0;
      this.getSum();
      this.$message({
        message: '清空成功，请重新下单',
        type: 'warning'
      });
    },
    checkout() { // 模拟结账
      if (!this.totalCount) { // 这个条件应该是根据后台返回的数据判断
        this.$message({
          message: '还没有商品哦，请添加后在结账',
          type: 'warning'
        });
        return;
      }
      this.$message({
        message: '结账成功，已到账￥' + this.totalMoney + '，感谢使用',
        type: 'success'
      });
      this.tableData = [];
      this.totalCount = 0;
      this.totalMoney = 0;

    },
    getSum() { // 汇总数量和金额
      this.totalCount = 0;
      this.totalMoney = 0;
      if (this.tableData) {
        this.tableData.forEach((el, i) => {
          this.totalCount += el.count;
          this.totalMoney += el.count * el.price;
        });
      }
    }
  }
};
</script>

<style lang="scss" >
.pos {
  position:absolute;
  top: 50px;
  left: 50px;
  right: 0;
  bottom: 50px;
  .pos-content{
    height: 100%;
    .pos-order{
      height: 100%;
      .el-tabs{
        height: 100%;
        display: flex;
        flex-direction: column;
      }
      .el-tabs__content{
        flex-grow: 1;
        .el-tab-panel{
          height: 100%;
        }
      }

    }
    .order-final{
      position: absolute;
      bottom: 0;
      left:0;
      right:0;
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
    height: 20px;
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
      transition: .3s;
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
    transition: .5s;
    &:hover {
      box-shadow: 0 15px 30px rgba(0, 0, 0, .1);
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
