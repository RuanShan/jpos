<style lang="scss">
/* banner */
@import "~@assets/mobile/css/mixin.scss";
$header-height: 50px; //头部高度值
.top-bar {
  height: $header-height;
  background-color: rgb(40, 95, 245);
  color: white;
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  .mint-header-title {
    font-size: x-large;
  }
}
.main-content {
  margin-top: $header-height + 10px;
  margin-left: 10px;
  margin-right: 10px;
  // background-color: rgb(250, 249, 214);
  .seach-tools {
    width: 100%;
    padding-left: 0;
    display: flex;
    justify-content: space-between;
    .seach-and-button {
      display: flex;
      align-items: center;
      .input-num {
        width: 200px;
        border: 1px solid #62b0ff;
      }
      .seach-button {
        margin-left: 30px;
      }
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
}
</style>

<template>
  <div class="home-container">
    <head-top></head-top>
    <!-- <footer-bar ></footer-bar> -->
    <div>
      <mt-header class="top-bar" fixed title="汪永峰JPos系统">
        <!-- <router-link to="/" slot="left">
          <mt-button icon="back"></mt-button>
        </router-link> -->
        <router-link to="/profile" slot="right">
          <mt-button icon="more" ></mt-button>
        </router-link>
      </mt-header>
    </div>

    <div class="main-content">
      this is home page
    </div>

    <div>
      <!-- <el-button type="" @click="signout">登出</el-button> -->
    </div>
  </div>
</template>

<script>
import FooterBar from '@/components/mobile/layout/FooterBar';
import HeadTop from '@/components/mobile/layout/HeadTop';

import Scan from '@/components/mobile/common/Scan.vue'
import MemberOrderInfo from '@/components/mobile/common/MemberOrderInfo.vue'
import {getOrder} from "@/api/getData.js"
// import { apiResultMixin } from '@/components/apiResultMixin'
import axios from 'axios';

import { shopDetails, signout } from "@/api/getData";

export default {
  components: {
    'scan': Scan,
    'member-order-info': MemberOrderInfo,
    'head-top': HeadTop,
    'footer-bar': FooterBar
  },
  name: 'page',
  data() {
    return {
      storeName: "", //店铺名称
      /*********************UI相关***********************/
      // scanIcon: require('../../assets/images/scanCode.png'),
      // scanIcon: require('../../assets/images/scanCode.png'),

      showScanVue: false,  //是否显示扫描子组件
      tableIsVisible: false, //表格是否显示标志位
      popupVisible: false, //popup是否显示标志位
      // selfVisible:false,
      /********************数据处理相关*******************/
      inputNum: '', //输入的会员号或手机号或订单号
      codeNum: "", //子组件传来的条码数
      cameraIsOpen: false, //相机开关
      returnServerData: "",   //返回的服务器数据
      axiosFlag: null,    //axios 返回标志位
      orderData:"",       //得到订单接口数据
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
    //搜索按钮点击事件-----
    seach() {
      // this.showScanVue = false;
      if (this.inputNum === '') {
        this.$alert('请输入订单号', '提示', {
          confirmButtonText: '确定',
        });
      }else{
        console.log("开始搜索订单了,id=",this.inputNum);
        this.getOrderByNumber(this.inputNum).then(()=>{
          console.log(this.returnServerData);
          this.tableIsVisible = true;
          return this.returnServerData;
        });
      }
    },
    //异步处理请求服务器函数---根据订单号码得到订单详情
    async getOrderByNumber(number) {
      let returnData = await getOrder(number);
      // console.log(returnData);
      this.returnServerData = this.buildOrder(returnData);
      console.log(this.returnServerData);
    },
    //得到子组件传来的条码数后得处理函数-----
    barCodeNum(code) {
      this.cameraIsOpen = false;  //关闭相机
      this.showScanVue = false;   //关闭相机界面
      this.codeNum = code;        //得到条码数字
      console.log("条码数组是  => ",code);

      // this.inputNum = code;
      try {
        this.axiosData().then(() => {
          this.tableIsVisible = true; //表格组件显示
        });
      } catch (error) {
        this.popupVisible = true;   //弹popup提醒
      }
    },
    async axiosData() {
      this.returnServerData = await axios.get('https://www.easy-mock.com/mock/5b409280aedea31f953c7898/test/OrderInfo');
      console.log(this.returnServerData);
    },
    succeed(succeed) {
      if (succeed == true) {
        this.tableIsVisible = false;
      }
    }
  },
    async initData() {
      //获取商铺信息
      this.shopDetailData = await shopDetails(
        this.storeId
      )
      this.storeName = this.shopDetailData.name;

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
  }
</script>
