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
          <el-input ref="tabindex1" tabindex="1" v-model="loginForm.username" placeholder="请输入用户名" suffix-icon="fa fa-user" autofocus @keyup.enter.native="handleKeyupEnter"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input ref="tabindex2" tabindex="2" type="password" placeholder="请输入密码" v-model="loginForm.password" suffix-icon="fa fa-lock" @keyup.enter.native="handleSubmitForm"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button tabindex="3" type="primary" @click="handleSubmitForm" class="submit_btn">登陆</el-button>
        </el-form-item>
        <input name="mockpassword2" type="password" class="hide-password">
      </el-form>
      <p class="tip"> Ver : {{version}}</p>
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
  StorageUtil
} from "@/utils/ipcService"

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

  },
  methods: {

    async handleSubmitForm() {
      console.log( " haha handleSubmitForm work...")
      let formName = "loginForm"
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
            // MissingStore组件处理无法找到当前店铺，它将提示设置店铺，这里无需检查。
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
      let sid = await this.getLocalStoreId()
      await this.getStores().then((stores) => {
        let currentStore = stores.find((item) => {
          return item.id == sid
        })
        // storeInfo 不能为null，很多地方调用 storeInfo.name
        if( currentStore ){
          console.log( "set currentStore", currentStore)
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
    async redirectDefaultPage(){
      let sid = await this.getLocalStoreId()

      if( this.userAuthorize('*')){ // 管理员
        if( sid>0 ){
          this.$router.push({ name: 'pos'   })
        }else{
          this.$router.push({ name: 'setting'   })
        }
      }else if( this.userAuthorize('fitems')){
        this.$router.push({
          name: 'fitems'
        })
      }else{
        this.$router.push({
          name: 'pos'
        })
      }
    },
    handleKeyupEnter(event){
      console.log( "handleKeyupEnter->", event)
      const i = event.target.tabIndex
      const nextDOM = this.$refs['tabindex'+(i+1)]
      nextDOM.focus()
    },
    async getLocalStoreId() {
      let json = await StorageUtil.getJson('storeId') || {}
      console.log( "storeId = ", json)
      return _.toInteger( json.storeId)
    }
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
