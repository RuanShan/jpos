<style lang="scss">
/* banner */
@import "~@assets/mobile/css/mixin.scss";
.orders-container {
    height: 100%;
    box-sizing: border-box;
    .main-content {
        padding-top: 60px;
        margin-left: 10px;
        margin-right: 10px;
        // background-color: rgb(250, 249, 214);
        .seach-tools {
            position: relative;
            padding-left: 0;
            .keyword {}
            .scan-button-wrap {
                position: absolute;
                left: 0;
                top: 0;
                width: 70px;
                text-align: center;
            }
            .seach-button-wrap {
                position: absolute;
                right: 0;
                top: 0;
                width: 100px;
                text-align: center;
            }
            .scan-button {}
            .el-form {
                margin: 0 100px 0 70px;
            }
        }
        .popup {
            width: 100%;
            height: 40px;
            background-color: #ffacfb;
            color: white;
            text-align: center;
            font-size: 26px;
        }
        .orders-wrap {
            .empty {
                padding: 10px;
                text-align: center;
            }
        }
        .orders {
            overflow: auto;
            position: absolute;
            left: 0;
            right: 0;
            bottom: 50px;
            top: 110px;
            border-top: 1px solid #e5e5e5;
            border-top: 1px solid #e5e5e5;
            .order {
                margin: 0 10px 10px;
                background-color: #FFFFFF;
            }
            .order:first-child,
            .order:last-child {
                margin: 10px;
            }
        }
    }
}
</style>

<template>
<div class="orders-container fillcontain">
  <head-top></head-top>

  <div class="main-content">
    <div class="seach-tools">
      <el-form :model="formData" :rules="rules">
        <el-form-item>
          <el-input placeholder="订单编号/物品编号/手机号" v-model="formData.keyword" class="keyword" clearable @clear="handleSeach">
            <i slot="prefix" class="el-input__icon el-icon-search"></i>
          </el-input>
        </el-form-item>
      </el-form>
      <div class="left scan-button-wrap">
        <img :src="scanIcon" width="44px" class="scan-button" @click="openCamera" />
      </div>
      <div class="right seach-button-wrap">
        <el-button class="seach-button" type="primary" @click="handleSeach">搜索</el-button>
      </div>
    </div>
    <div class="orders-wrap">
      <!-- 订单内容区域 -->
      <div class="orders scroll_content">
        <mt-loadmore :top-method="loadTop" :top-status.sync="topStatus" ref="loadmore">
          <div class="order" style="" v-for="(item,index) in orderList" :key="index">
            <OrderItem :order="item" />
          </div>
          <div slot="top" class="mint-loadmore-top">
            <span v-show="topStatus !== 'loading'" :class="{ 'rotate': topStatus === 'drop' }">释放更新</span>
            <span v-show="topStatus === 'loading'">Loading...</span>
          </div>
        </mt-loadmore>
        <div class="empty" v-show="noneNewOrder">
          <p>无待处理订单 <button type="button" @click="getOrders">刷新看一看</button></p>
        </div>
      </div>
    </div>

    <mt-popup class="popup" v-model="popupVisible" popup-transition="popup-fade" position="top">没有找到物品编码{{codeNum}},请重试.</mt-popup>
    <!-- 会员基本信息 -->
    <member-order-info v-if="tableIsVisible" :returnServerData="returnServerData" :codeNum="codeNum" @succeed="succeed($event)"></member-order-info>
    <!-- Scan子组件 -->
    <scan v-if="showScanVue" :cameraIsOpen="cameraIsOpen" @closeCamera="closeCamera($event)" @barCodeNum="barCodeNum($event)"></scan>
  </div>

  <footer-bar></footer-bar>

</div>
</template>

<script>
import FooterBar from '@/components/mobile/layout/FooterBar';
import HeadTop from '@/components/mobile/layout/HeadTop';

import Scan from '@/components/mobile/common/Scan.vue'
import MemberOrderInfo from '@/components/mobile/common/MemberOrderInfo.vue'
import {
  findOrders,
  signout
} from "@/api/getData.js"

export default {
  components: {
    'scan': Scan,
    'member-order-info': MemberOrderInfo,
    'head-top': HeadTop,
    'footer-bar': FooterBar,
    OrderItem: r => {
      require.ensure([], () => r(require('./components/OrderItem'))), "OrderItem"
    }
  },
  name: 'orders',
  data() {
    return {
      topStatus: '',
      /*********************UI相关***********************/
      itemDefaultIcon: require('@assets/mobile/img/order/noimage.jpg'),
      scanIcon: require('@assets/mobile/img/scan.png'),
      showScanVue: false, //是否显示扫描子组件
      tableIsVisible: false, //表格是否显示标志位
      popupVisible: false, //popup是否显示标志位
      // selfVisible:false,
      /********************数据处理相关*******************/
      inputNum: '', //输入的会员号或手机号或订单号
      codeNum: "", //子组件传来的条码数
      cameraIsOpen: false, //相机开关
      returnServerData: "", //返回的服务器数据
      orderList: [], //得到订单接口数据
      formData: {
        keyword: ''
      },
      rules: {
        keyword: [{
          required: true,
          message: '请输入关键字',
          trigger: 'change'
        }, ],
      }
    }
  },
  created() {
    console.log('orders event created')
    this.initData()
  },
  computed: {
    noneNewOrder() {
      return this.orderList.length == 0
    }
  },
  methods: {
    handleClick: function () {
      this.$toast('Hello world!')
    },
    //扫描图标点击事件-----打开Scan子组件
    openCamera() {
      this.showScanVue = true;
      this.cameraIsOpen = true;
    },
    //Scan子组件传过来的消息-----关闭Scan子组件
    closeCamera(flag) {
      this.showScanVue = false;
      this.cameraIsOpen = false;
    },

    //得到子组件传来的条码数后得处理函数-----
    barCodeNum(code) {
      this.cameraIsOpen = false; //关闭相机
      this.showScanVue = false; //关闭相机界面
      this.codeNum = code; //得到条码数字
      console.log("条码数组是  => ", code);

      // this.inputNum = code;
      try {
        //  <router-link :to="{ name: 'orderDetail', params: {id: order.id} }">
        let params = {
          q: {
            line_item_groups_number_eq: code
          }
        }
        findOrders(params).then((result) => {
          console.log('find orders by code ', code)
          if (result.count == 1) {
            this.$router.push({
              name: 'orderDetail',
              params: {
                lineItemGroupNumber: code
              }
            })
          } else {
            this.popupVisible = true; //弹popup提醒
          }
        });
      } catch (error) {
        this.popupVisible = true; //弹popup提醒
      }
    },
    initData() {
      this.getOrders()
    },
    buildParams() {
      let params = {
        page: this.currentPage,
        per_page: this.perPage,
        q: {
          group_state_eq: 'pending',
          store_id_eq: this.storeId,
          s: ["created_at desc"]
        },

      }
      if (this.formData.keyword.length > 0) {
        // order.number ||  || order.users.username
        params.q.number_or_line_item_groups_number_or_user_mobile_cont = this.formData.keyword
      }
      return params
    },
    async getOrders() {
      let params = this.buildParams()
      const result = await findOrders(params)

      const orders = this.buildOrders(result)

      this.orderList = orders
      console.log(" orderList =", this.orderList)
    },
    //搜索按钮点击事件-----
    handleSeach() {
      this.getOrders()
    },
    loadTop() {
      console.log(" load top ...")
      this.getOrders()
      this.$refs.loadmore.onTopLoaded();

    },
    async signout() {
      const res = await signout()
      if (res.id == null) {
        this.$message({
          type: 'success',
          message: '退出成功'
        })
        this.$store.commit("resetUser")
      } else {
        this.$message({
          type: 'error',
          message: res.message
        })
      }
    }
  },
}
</script>
