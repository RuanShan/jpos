
<style lang="scss" >
@import "../style/mixin";
.login_page {
    background-color: #324057;
    background-image: url('../assets/mobile/img/login-bg.jpg');
    background-size: cover;
    .form_contianer {
        @include wh(320px, 210px);
        @include ctp(320px, 210px);
        padding: 25px;
        border-radius: 5px;
        text-align: center;
        background-color: #fff;
        .submit_btn {
            width: 100%;
            font-size: 16px;
        }
    }
    .tip {      
      text-align: center;
      font-size: 12px;
      color: red;
    }

    .el-form {
        /*width: 50%;*/
    }
    .login-content {
        height: 700px;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        align-items: center;

        .logo-wrap{
          padding: 15px;
          height: 110px;
          img{
            height: 100%;
          }
        }
        .form-head{
          color: #fff;
          padding: 15px 0;
          text-align: center;
          font-size: 1.5em;
        }
        .user-name {
            margin: auto;
        }
        .input-user {
            width: 100%;
        }
        .login {
            width: 100%;
        }
        .jpos-ver {
            position: absolute;
            bottom: 50px;
            left: 0;
            right: 0;
            text-align: center;
            color: #b3b3d9;
            margin: 0;
        }
    }

}
</style>

<template>
<div class="login_page ">
  <div class="login-content" ref="loginPage">
    <div class="wrap">
      <div class="logo-wrap">
        <img v-bind:src="logoImage" />
      </div>
      <p class="form-head"> 订单系统登录 </p>
      <el-form :model="loginForm" :rules="rules" ref="loginForm">

        <el-form-item prop="username">
          <div class="input-user">
            <el-input placeholder="请输入用户名" clearable v-model="loginForm.username">
              <template slot="prepend"><i class="fa fa-user"></i></template>
            </el-input>
          </div>

        </el-form-item>

        <el-form-item prop="password">
          <!-- <el-input type="password" placeholder="密码" v-model="loginForm.password"></el-input> -->
          <div class="input-user">
            <el-input placeholder="请输入密码" clearable type="password" v-model="loginForm.password">
              <template slot="prepend"><i slot="prepend" class="fa fa-lock"></i></template>
            </el-input>
          </div>

        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click.native="submitForm('loginForm')" class="login">登录</el-button>
        </el-form-item>
      </el-form>
      <p class="tip"> Ver : {{version}}</p>

    </div>
    <div class="jpos-ver">
      <h6>汪永峰皮具养护订单系统IPAD版</h6>
    </div>
    <!-- <mt-popup class="popup" v-model="popupVisible" popup-transition="popup-fade" position="top">用户名或者密码错误,请重试.</mt-popup> -->
  </div>

</div>
</template>

<script>
import {
  loginByEntry,
  getUserInfo
} from '@/api/getData'
import _ from 'lodash'
export default {
  data() {
    return {
      loginVisible: true, //login 窗口显示标志位
      logoImage: require('@assets/mobile/img/logo.png'),
      loginForm: {
        username: '',
        password: ''
      },
      rules: {
        username: [{
          required: true,
          message: '请输入用户名',
          trigger: 'blur'
        }],
        password: [{
          required: true,
          message: '请输入密码',
          trigger: 'blur'
        }]
      },
      showLogin: false
    }
  },
  mounted() {

    let clientHeight = `${document.documentElement.clientHeight}`; //document.body.clientWidth;
    console.log(clientHeight);
    this.$refs.loginPage.style.height = clientHeight + 'px';
    console.log(this.$refs.loginPage.style.height);

    this.showLogin = true
    this.getCurrentUser().then((() => {
      if (this.userInfo.id) {
        this.initializeApp()
        this.$message({
          type: 'success',
          message: '检测到您之前登录过，将自动登录'
        })
        this.$router.push('orders')
      }
    }))
  },
  methods: {

    async submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          const res = await loginByEntry({
            user: {
              username: this.loginForm.username,
              password: this.loginForm.password
            }
          })
          if (res.id) {
            //检查用户是否有签到记录，
            const user = this.buildUser(res)
            this.$store.commit("saveUser", user)

            // 取得所有店铺信息，保存在store中，
            this.initializeApp()
            this.$router.push('orders')
            this.$message({
              type: 'success',
              message: '登录成功'
            })

          } else {
            this.$message({
              type: 'error',
              message: res.error
            })
          }
        } else {
          this.$notify.error({
            title: '错误',
            message: '请输入正确的用户名密码',
            offset: 100
          })
          return false
        }
      })
    },
    initializeApp() {
      // 初始化店铺信息
      console.log("..initializeApp..", this.userInfo)

      const entry = _.last(this.userInfo.todayEntries)
      let storeId = entry.storeId
      this.$store.commit("saveStoreId", storeId)

      this.getStores().then(() => {
        const store = this.stores.find((store) => {
          return store.id == storeId
        })
        this.$store.commit("saveStore", store)
      })
    },
    async getCurrentUser() {
      try {
        // 如果没有，说明session过期
        const userResult = await getUserInfo()

        if (userResult.id) {
          const user = this.buildUser(userResult)
          console.log( "user=", user )
          this.$store.commit('saveUser', user)
        } else {
          throw new Error(userResult)
        }
      } catch (err) {
        console.log('您尚未登陆或者session失效')
      }
    },
  },
  watch: {
    userInfo: function (newValue) {
      // if (newValue.id) {
      //   this.$message({
      //     type: 'success',
      //     message: '检测到您之前登录过，将自动登录'
      //   })
      //   this.$router.push('waiter')
      // }
    }
  }
}
</script>
