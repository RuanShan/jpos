<style lang="scss">
.login-content {
  height: 700px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  .logo {
    margin-top: 3%;
    border: 3px solid #ffb895;
  }
  .user-name {
    margin: auto;
  }
  .input-user {
    width: 75%;
  }
  .login {
    width: 75%;
  }
  .jpos {
    color: #b3b3d9;
    margin: 0;
  }
}
</style>

<template>
  <div>
    <mint-ui v-if="memberVisible"></mint-ui>
    <div class="login-content" ref="loginPage" v-if="loginVisible">
      <!-- <div class="logo"> -->
      <img :src="logoImage" width="50%" height="50%" />
      <!-- </div> -->
      <div class="input-user">
        <el-input placeholder="请输入用户名" clearable v-model="inputUser">
          <template slot="prepend">名称</template>
        </el-input>
      </div>
      <div class="input-user">
        <el-input placeholder="请输入密码" clearable type="password" v-model="inputPW">
          <template slot="prepend">密码</template>
        </el-input>
      </div>
      <div class="login">
        <mt-button type="primary" size="large" @click="login">Login</mt-button>
      </div>
      <div class="jpos">
        <h6>汪永峰 JPos系统</h6>
      </div>
      <mt-popup class="popup" v-model="popupVisible" popup-transition="popup-fade" position="top">用户名或者密码错误,请重试.</mt-popup>
    </div>
  </div>

</template>

<script>
import MintUI from '@/components/mobile/common/MintUI.vue'

export default {
  components: {
    'mint-ui': MintUI
  },
  data() {
    return {
      /*********************UI相关***********************/
      loginVisible: true,  //login 窗口显示标志位
      memberVisible: false,  //memberOrderInfo 窗口显示标志位
      logoImage: require('../assets/images/W-logo.jpg'),
      popupVisible: false,  //弹窗控制位
      /********************数据处理相关*******************/
      inputUser: "",
      inputPW: "",
    }
  },
  mounted() {
    // 获取浏览器可视区域高度
    let clientHeight = `${document.documentElement.clientHeight}`; //document.body.clientWidth;
    console.log(clientHeight);
    this.$refs.loginPage.style.height = clientHeight + 'px';
    console.log(this.$refs.loginPage.style.height);
  },
  methods: {
    login() {
      if ((this.inputUser == "abc") && (this.inputPW == "88888")) {
        console.log("login  is   OK !!!!");
        this.loginVisible = false;
        this.memberVisible = true;
      } else {
        this.popupVisible = true;
      }
    }
  },


}
</script>
