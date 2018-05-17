<template>
  <div class="header_container">
    <div class="title left"> {{storeName}} </div>
    <div class="header-right ">
      <div class="header-user-con">
        <div> <img :src="userAvatarUrl" class="avator"></div>
        <el-dropdown @command="handleCommand" class='right'>
          <span class="el-dropdown-link">
            {{userInfo.name}}<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="home">首页</el-dropdown-item>
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
import {mapState} from 'vuex'

export default {
  data () {
    return {
      baseImgPath
    }
  },
  props: ['storeName'],

  created () {

  },
  computed: {
    ...mapState(['userInfo']),
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
  .header_container{
    background-color: #EFF2F7;
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
