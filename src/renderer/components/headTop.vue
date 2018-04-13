<template>
    <header class="header">

    <!-- header start  -->
      <router-link class="logo" :to="{path: '/manage'}">Element Dashboard</router-link>
        <div class="user-info" >
          <span v-text="userInfo.username"></span>
          <el-dropdown trigger="click">
            <span class="el-dropdown-link">
              <img :src="userInfo.avatar">
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>个人信息</el-dropdown-item>
              <el-dropdown-item>设置</el-dropdown-item>
              <el-dropdown-item @click.native="logout">注销</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      <!-- header end  -->


    <el-dropdown @command="handleCommand" menu-align='start'>
      <img :src="baseImgPath + userInfo.avatar" class="avator">
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item command="home">首页</el-dropdown-item>
        <el-dropdown-item command="singout">退出</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
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
  created () {
    if (!this.userInfo.id) {
      this.getAdminData()
    }
  },
  computed: {
    ...mapState(['userInfo'])
  },
  methods: {
    ...mapActions(['getAdminData']),
    async handleCommand (command) {
      if (command == 'home') {
        this.$router.push('/manage')
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
  .header{
      position: relative;
      box-sizing: border-box;
      width: 100%;
      height: 70px;
      font-size: 22px;
      line-height: 70px;
      color: #fff;
  }
  .header {
    background-color: #242f42;
    .logo {
        float: left;
        width: 250px;
        text-align: center;
    }
  }
  .avator{
    @include wh(36px, 36px);
    border-radius: 50%;
    margin-right: 37px;
  }
  .el-dropdown-menu__item{
        text-align: center;
    }
</style>
