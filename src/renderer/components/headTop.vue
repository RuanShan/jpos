<template>
    <header class="header">

    <!-- header start  -->
      <router-link class="logo" :to="{path: '/manage'}">JPOS Admin</router-link>
        <div class="user-info" >
          <span v-text="userInfo.username">&nbsp;</span>
          <el-dropdown trigger="click">
            <span class="el-dropdown-link">
              <img :src="baseImgPath + userInfo.avatar" class="user-logo">
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>个人信息</el-dropdown-item>
              <el-dropdown-item>设置</el-dropdown-item>
              <el-dropdown-item command="singout">注销</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      <!-- header end  -->
    </header>
</template>

<script>
import {signout} from '@/api/getData'
import {baseImgPath} from '@/config/env'
import {mapActions, mapState} from 'vuex'

export default {
  data () {
    return {
      baseImgPath
    }
  },
  created(){
    this.getAdminData().then(res=>{
      console.log('created',this.userInfo)
      if (!this.userInfo.id) {
        this.$router.push('/')
      }
    })
  },

  computed: {
    ...mapState(['userInfo'])
  },
  methods: {
    ...mapActions(['getAdminData']),
    async handleCommand (command) {
      if (command == 'home') {
        this.$router.push('/home')
      } else if (command == 'singout') {
        const res = await signout()
        if (res.status == 1) {
          this.$message({
            type: 'success',
            message: '退出成功'
          })
          this.$router.push('/')
        } else {
          this.$message({
            type: 'error',
            message: res.message
          })
        }
      }
    }
  }
}
</script>

<style lang="scss">
  @import '../style/mixin';
  .header {
    position: relative;
    box-sizing: border-box;
    width: 100%;
    height: 70px;
    font-size: 22px;
    line-height: 70px;
    color: #fffff;
    background-color: #242f42;
    .logo {
        float: left;
        width: 250px;
        text-align: center;
        color: #fff;
    }
  }
  .user-info{
    float: right;
    padding-right: 50px;
    font-size: 16px;
    color: #fff;
   .el-dropdown-link {
       color: #fff;
      .user-logo{
        width: 25px;
        height: 25px;
        vertical-align: -7px;
        margin: 0 0 0 10px;
        cursor: pointer;
      }
    }
  }

  .el-dropdown-menu__item{
        text-align: center;
    }
</style>
