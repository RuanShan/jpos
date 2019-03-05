
<style lang="scss">
  @import '~@/style/mixin';
  .header_container{
    background-color: #fff;
    border-bottom: 1px solid #d3dce6;
    height: 50px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-left: 50px;
    .logo{
      position: absolute;
      top:0;
      left: 0;
      width: 150px;
      height: 49px;
      line-height: 49px;
      background-color: #fff;
      overflow: hidden;
      img{
        height: 100%;
      }
    }
    .title{
      padding: 0 110px;
    }
    .header-right {
        float: right;
        padding-right: 50px;
        .header-user-con{
          float: right;
          display: flex;
          align-items: center;
        }
        .header-clockin-con{
          float: right;
          display: flex;
          align-items: center;
        }
    }
    .checkinout{
      padding-right: 20px;
      button *{
        color: #fff;
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

<template>
  <div class="header_container">
    <div class="logo">
      <img v-bind:src='logoImage' >
    </div>

    <UserClockin :dialog-visible.sync="userCheckinDialogVisible" :clock-state="clockState" @user-entry-created="handleUserEntryCreated" ></UserClockin>

    <div class="title left">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">{{storeInfo.name}}</el-breadcrumb-item>
        <el-breadcrumb-item> {{$store.state.title}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="header-right ">
      <div class="header-user-con">
        <el-button-group class="checkinout">
          <el-button type="success" size="small" icon="el-icon-time" @click="handleCheckinCommand('clockin')">上班</el-button>
          <el-button type="success" size="small" @click="handleCheckinCommand('clockout')">下班 <i class="el-icon-bell" ></i></el-button>
        </el-button-group>


        <div> <img :src="userAvatarUrl" class="avator"></div>
        <el-dropdown @command="handleCommand" class='right'>
          <span class="el-dropdown-link">
            {{userInfo.name}}<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <!-- <el-dropdown-item command="home">我的</el-dropdown-item> -->
            <el-dropdown-item command="signout">退出</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <div class="header-clockin-con">
      </div>
    </div>
  </div>
</template>

<script>
import _ from "lodash"
import { Loading } from 'element-ui';
import {signout, findUserEntries} from '@/api/getData'
import {baseImgPath} from '@/config/env'

import UserClockin from "@/components/dialog/UserClockin.vue"

export default {
  components:{
    UserClockin
  },
  data () {
    return {
      logoImage: require('@assets/img/logo-t.png'),
      userCheckinDialogVisible: false,
      baseImgPath,
      clockState: 'clockin',
      localUserEntries: []
    }
  },
  computed: {
    userAvatarUrl:function(){
      return baseImgPath + '/img/' + this.userInfo.avatar
    },
    computedUserAndEntries(){
      const users = this.localUserEntries.map( (entry)=>{ return { id: entry.userId, name: entry.username} })
      const uniqUsers = _.uniqWith( users, _.isEqual)
      uniqUsers.forEach((user)=>{
        const entries = this.localUserEntries.filter((entry)=>{ return entry.userId == user.id})
        user.entries = entries
      })
      console.log( "uniqUsers=",uniqUsers)
      return uniqUsers
    }
  },
  mounted: function(){
    this.initDate()
  },
  methods: {
    initDate(){
      let params = {q: { store_id_eq: this.storeId, day_eq: this.getQueryParamToday() }}
      findUserEntries( params ).then((result)=>{
        console.log( "headTop storeId =", this.storeId )
        this.localUserEntries = this.buildUserEntries( result )
        this.$store.commit( 'saveUserEntries', this.localUserEntries )
      })
    },

    async handleCommand (command) {
      if (command == 'home') {
        this.$router.push('/manage')
      } else if (command == 'signout') {
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
    },
    handleCheckinCommand(command){
        this.clockState = command
        this.openCheckinDialog()

    },
    openCheckinDialog(){
      this.userCheckinDialogVisible = true
    },
    handleUserEntryCreated( newEntry){
      this.localUserEntries.push( newEntry)
      console.log( "emit user-entry-created-gevent")
      this.$store.commit( 'saveUserEntries', this.localUserEntries )
      this.$bus.$emit('user-entry-created-gevent', this.localUserEntries)
      // 如果是下班打卡， 定时6秒退出系统
      if( newEntry.state == this.UserEntryStateEnum.clockout){
        let loadingInstance = Loading.service({ fullscreen: true, text: '系统退出中...' })
        setTimeout( ()=> {
          this.handleCommand('signout').then(()=>{
            loadingInstance.close();
          })
        }, 3000);
      }
    }
  }
}
</script>
