<template>
    <div class="login_page fillcontain">
      <transition name="form-fade" mode="in-out">
        <section class="form_contianer" v-show="showLogin">
          <div class="manage_tip">
            <p>JPOS系统</p>
          </div>
          <el-form :model="loginForm" :rules="rules" ref="loginForm">
          <el-form-item prop="username">
            <el-input v-model="loginForm.username" placeholder="用户名"><span>dsfsf</span></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input type="password" placeholder="密码" v-model="loginForm.password"></el-input>
          </el-form-item>
          <el-form-item>
              <el-button type="primary" @click="submitForm('loginForm')" class="submit_btn">登陆</el-button>
            </el-form-item>
        </el-form>
        <p class="tip">温馨提示：</p>      
        </section>
      </transition>
    </div>
</template>

<script>
  import _ from 'lodash'
  import { getUserInfo, login} from '@/api/getData'
  import { getStore } from "@/config/mUtils"

  export default {
    data () {
      return {
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
    mounted () {
      this.showLogin = true
      this.getCurrentUser().then((()=>{
        if (this.userInfo.id) {
          this.initializeApp()
          this.$message({
            type: 'success',
            message: '检测到您之前登录过，将自动登录'
          })
          this.$router.push({ name: 'first' })
        }
      }))
    },
    computed:{
      localStoreId(){
         return  _.toInteger( getStore('storeId') )
      }
    },
    methods: {

      async submitForm (formName) {
        this.$refs[formName].validate(async (valid) => {
          if (valid) {
            const res = await login({ user: { username: this.loginForm.username, password: this.loginForm.password}})
            if (res.id) {
              this.$message({
                type: 'success',
                message: '登录成功'
              })
              this.$store.commit("saveUser", this.buildUser( res))
              console.log( " current localstorage=", getStore('storeId'))
              let storeId = this.localStoreId
              if( storeId > 0 ){
                // 取得所有店铺信息，保存在store中，
                await this.initializeApp()
                // 缺省是收银界面
                this.$router.push({ name: 'first' })
              }else{
                this.$message({
                  type: 'warning',
                  message: '请先设置店铺'
                })
                this.$router.push({ name: 'setting' })
              }

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
      initializeApp(){
        console.log( "..initializeApp..")
        //初始化 localstorage storeId
        this.getStores().then((stores)=>{
          let currentStore = stores.find((item)=>{ return item.id == this.localStoreId })
          this.$store.commit('saveStore', currentStore)
        })
      },
      async getCurrentUser() {
        try {
          // 检查是否有cookies  _jpos_session,
          // 如果没有，说明session过期
          const userResult = await getUserInfo()

          if (userResult.id) {
            const user = this.buildUser( userResult )
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

<style lang="scss" scoped>
  @import '../style/mixin';
  .login_page{
    background-color: #324057;
  }
  .manage_tip{
    position: absolute;
    width: 100%;
    top: -100px;
    left: 0;
    p{
      font-size: 34px;
      color: #fff;
    }
  }
  .form_contianer{
    @include wh(320px, 210px);
    @include ctp(320px, 210px);
    padding: 25px;
    border-radius: 5px;
    text-align: center;
    background-color: #fff;
    .submit_btn{
      width: 100%;
      font-size: 16px;
    }
  }
  .tip{
    font-size: 12px;
    color: red;
  }
  .form-fade-enter-active, .form-fade-leave-active {
      transition: all 1s;
  }
  .form-fade-enter, .form-fade-leave-active {
      transform: translate3d(0, -50px, 0);
      opacity: 0;
  }
</style>
