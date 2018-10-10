<style lang="scss">

.header.is-fixed {
    top: 0;
    right: 0;
    left: 0;
    position: fixed;
    z-index: 1;
}
.header {
    align-items: center;
    background-color: #f4b22c;
    box-sizing: border-box;
    font-size: 14px;
    padding: 0 10px;
    position: relative;
    text-align: center;
    white-space: nowrap;
    *{
      color: #3e3a39;
    }
    .left{
      height: 50px;
     }
    .logo{
      height: 100%;
      vertical-align: middle;
    }
    span{
      line-height: 50px;
    }
}

</style>

<template>
  <header class="header is-fixed"   >
    <div class=" left">
      <img class="logo" alt="LOGO" :src="logoImage">
      <span> 大连永峰皮具养护-新开路店</span>
    </div>
    <div class="right">
      <el-dropdown @command="handleCommand" >
        <span class="el-dropdown-link">
          {{userInfo.name}}<i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="singout">退出</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </header>
</template>

<script>
import {signout} from '@/api/getData'

export default {
  data() {
    return {
      logoImage: require('@assets/mobile/img/logo.jpg'),
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
