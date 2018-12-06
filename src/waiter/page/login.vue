<template>
<div class="login_page fillcontain">
  <transition name="form-fade" mode="in-out">
    <section class="form_contianer" v-show="showLogin">
      <div class="manage_tip">
        <div class="logo-wrap">
          <img src="@assets/img/logo-w.png"/>
        </div>
      </div>
      <el-form :model="loginForm" :rules="rules" ref="loginForm">
        <input name="mockpassword1" type="password" class="hide-password">
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" placeholder="请输入用户名" suffix-icon="fa fa-user"><span>dsfsf</span></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input type="password" placeholder="请输入密码" v-model="loginForm.password" suffix-icon="fa fa-keyboard-o"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('loginForm')" class="submit_btn">登陆</el-button>
        </el-form-item>
        <input name="mockpassword2" type="password" class="hide-password">
      </el-form>
      <p class="tip"> </p>
    </section>
  </transition>
</div>
</template>

<script>
import _ from 'lodash'
import {
  getUserInfo,
  login
} from '@/api/getData'
import {
  getStore
} from "@/config/mUtils"

export default {
  data() {
    return {
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
  async mounted() {
    this.showLogin = true
    this.$store.commit('resetUser')
    this.getCurrentUser().then((() => {
      console.log("get current user =>", this.userInfo)
      if (this.userInfo.id) {
        this.initializeApp().then(()=>{
          this.$message({
            type: 'success',
            message: '检测到您之前登录过，将自动登录'
          })
          this.redirectDefaultPage()
        })
      }
    }))
  },
  computed: {
    localStoreId() {
      return _.toInteger(getStore('storeId'))
    }
  },
  methods: {

    async submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          const res = await login({
            user: {
              username: this.loginForm.username,
              password: this.loginForm.password
            }
          })
          if (res.id) {
            this.$message({
              type: 'success',
              message: '登录成功'
            })
            this.$store.commit("saveUser", this.buildUser(res))
            // 取得所有店铺信息，保存在store中，
            await this.initializeApp()
            console.log(" current localstorage=", getStore('storeId'))
            // MissingStore组件处理无法找到当前店铺，它将提示设置店铺，这里无需检查。
            // let storeId = this.localStoreId
            // 缺省是收银界面
            this.redirectDefaultPage()

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
    async initializeApp() {
      console.log("..initializeApp..")
      //初始化 localstorage storeId
      await this.getStores().then((stores) => {
        let currentStore = stores.find((item) => {
          return item.id == this.localStoreId
        })
        // storeInfo 不能为null，很多地方调用 storeInfo.name
        if( currentStore ){
          this.$store.commit('saveStore', currentStore)
        }
      })
    },
    async getCurrentUser() {
      try {
        // 检查是否有cookies  _jpos_session,
        // 如果没有，说明session过期
        const userResult = await getUserInfo()

        if (userResult.id) {
          const user = this.buildUser(userResult)
          this.$store.commit('saveUser', user)
        } else {
          throw new Error(userResult)
        }
      } catch (err) {
        console.log('您尚未登陆或者session失效')
      }
    },
    redirectDefaultPage(){
      if( this.userAuthorize('*')){ // 管理员
        this.$router.push({
          name: 'pos'
        })
      }else if( this.userAuthorize('fitems')){
        this.$router.push({
          name: 'fitems'
        })
      }else{
        this.$router.push({
          name: 'pos'
        })
      }
    }
  },
  watch: {
    //userInfo: function (newValue) {
    // if (newValue.id) {
    //   this.$message({
    //     type: 'success',
    //     message: '检测到您之前登录过，将自动登录'
    //   })
    //   this.$router.push('first')
    // }
    //}
  }
}
</script>

<style lang="scss" >
@import '../style/mixin';
.login_page {
    background-color: #324057;
    background-image: url('../assets/img/login-bg.jpg');
    background-size: cover;
    .manage_tip {
        position: absolute;
        width: 100%;
        top: -120px;
        left: 0;
        p {
            font-size: 34px;
            color: #fff;
        }
    }
    .logo-wrap{
      height: 110px;
      img{
        height: 100%;
      }
    }
    .form_contianer {
        @include wh(320px, 220px);
        @include ctp(320px, 220px);
        padding: 10px 25px;
        border-radius: 5px;
        text-align: center;
        background-color: #fff;
        .submit_btn {
            width: 100%;
            font-size: 16px;
        }
        .hide-password{
          width: 0;
          height: 0;
          opacity:0;
        }
    }
    .tip {
        font-size: 12px;
        color: red;
    }

}

</style>
