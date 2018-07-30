<template>
  <div class="login_page fillcontain">
    <div class="login-content" ref="loginPage">
      <div class="logo">
      <img :src="logoImage" />
      </div>

      <el-form class="el-form" :model="loginForm" :rules="rules" ref="loginForm">
        <el-form-item prop="username">
          <div class="input-user">
            <el-input placeholder="请输入用户名" clearable v-model="loginForm.username">
              <template slot="prepend">名称</template>
            </el-input>
          </div>

        </el-form-item>

        <el-form-item prop="password">
          <!-- <el-input type="password" placeholder="密码" v-model="loginForm.password"></el-input> -->
          <div class="input-user">
            <el-input placeholder="请输入密码" clearable type="password" v-model="loginForm.password">
              <template slot="prepend">密码</template>
            </el-input>
          </div>

        </el-form-item>
        <el-form-item>
          <div class="login">
            <button type="primary"  @click="submitForm('loginForm')" class="mint-button mint-button--large mint-button--primary">登录</button>
          </div>

        </el-form-item>
      </el-form>
      <div class="jpos">
        <h6>汪永峰 JPos系统</h6>
      </div>
      <!-- <mt-popup class="popup" v-model="popupVisible" popup-transition="popup-fade" position="top">用户名或者密码错误,请重试.</mt-popup> -->
    </div>

    <!-- <transition name="form-fade" mode="in-out">
      <section class="form_contianer" v-show="showLogin">
        <div class="manage_tip">
          <p>JPOS系统移动端</p>
        </div>
        <el-form :model="loginForm" :rules="rules" ref="loginForm">
          <el-form-item prop="username">
            <el-input v-model="loginForm.username" placeholder="用户名">
              <span>dsfsf</span>
            </el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input type="password" placeholder="密码" v-model="loginForm.password"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('loginForm')" class="submit_btn">登陆</el-button>
          </el-form-item>
        </el-form>
        <p class="tip">温馨提示：</p>
        <p class="tip">请先在电脑端打卡，再登录当前订单系统</p>

      </section>
    </transition> -->
  </div>
</template>

<script>
import { login } from '@/api/getData'

export default {
  data() {
    return {
      loginVisible: true,  //login 窗口显示标志位
      logoImage: require('../assets/images/W-logo.jpg'),
      loginForm: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ]
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
          const res = await login({ user: { username: this.loginForm.username, password: this.loginForm.password } })
          if (res.id) {
            this.$message({
              type: 'success',
              message: '登录成功'
            })
            this.$store.commit("saveUser", this.buildUser(res))
            // 取得所有店铺信息，保存在store中，
            this.initializeApp()
            this.$router.push('orders')

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
      console.log("..initializeApp..")
      this.getStores()
    }
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

<style lang="scss" scoped>
@import "../style/mixin";
.login_page {
  background-color: #324057;
}
.manage_tip {
  position: absolute;
  width: 100%;
  top: -100px;
  left: 0;
  p {
    font-size: 34px;
    color: #fff;
  }
}
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
  font-size: 12px;
  color: red;
}
.form-fade-enter-active,
.form-fade-leave-active {
  transition: all 1s;
}
.form-fade-enter,
.form-fade-leave-active {
  transform: translate3d(0, -50px, 0);
  opacity: 0;
}
.el-form{
  width: 50%;
}
.login-content {
  height: 700px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  .logo {
    // margin-top: 6%;
    // border: 3px solid #ffb895;

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
  .jpos {
    color: #b3b3d9;
    margin: 0;
  }
}
</style>
