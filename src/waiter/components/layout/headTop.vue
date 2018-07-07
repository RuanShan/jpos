<template>
  <div class="header_container">
    <div class="title left">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">{{storeInfo.name}}</el-breadcrumb-item>
        <el-breadcrumb-item> {{$store.state.title}}</el-breadcrumb-item>

      </el-breadcrumb>

    </div>
    <div class="header-right ">
      <div class="header-user-con">
        <div> <img :src="userAvatarUrl" class="avator"></div>
        <el-dropdown @command="handleCommand" class='right'>
          <span class="el-dropdown-link">
            {{userInfo.name}}<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="home">打卡</el-dropdown-item>
            <el-dropdown-item command="home">我的</el-dropdown-item>
            <el-dropdown-item command="singout">退出</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
  </div>
</template>

<script>
import {signout} from '@/api/getData'
import {baseImgPath} from '@/config/env'

export default {
  data () {
    return {
      baseImgPath
    }
  },
  computed: {
    userAvatarUrl:function(){
      return baseImgPath + '/img/' + this.userInfo.avatar
    }
  },
  methods: {

    async handleCommand (command) {
      if (command == 'home') {
        this.$router.push('/manage')
      } else if (command == 'singout') {
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
  }
}
</script>

<style lang="scss">
  @import '~@/style/mixin';
  .header_container{
    background-color: #EFF2F7;
    border-top: 1px solid #d3dce6;
    height: 50px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-left: 50px;
    .title{
      padding: 0 10px;
    }
    .header-right {
        float: right;
        padding-right: 50px;
        .header-user-con{
            display: flex;
            align-items: center;
        }
    }
  }
  .avator{
    @include wh(36px, 36px);
    border-radius: 50%;
    margin: 0 8px;
  }
  .el-dropdown-menu__item{
        text-align: center;
    }
</style>
