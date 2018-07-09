
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
          float: right;
          display: flex;
          align-items: center;
        }
        .header-checkin-con{
          float: right;
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

<template>
  <div class="header_container">
    <UserCheckin :dialog-visible.sync="userCheckinDialogVisible" @user-entry-created="handleUserEntryCreated" ></UserCheckin>

    <div class="title left">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">{{storeInfo.name}}</el-breadcrumb-item>
        <el-breadcrumb-item> {{$store.state.title}}</el-breadcrumb-item>

      </el-breadcrumb>

    </div>
    <div class="header-right ">
      <div class="header-user-con">
        <el-dropdown @command="handleCheckinCommand" >
          <span class="el-dropdown-link">
            打卡<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item v-for="user in computedUserAndEntries">
              <p>{{user.name}} </p>
              <p v-for="entry in user.entries">{{entry.displayCreatedAtTime}} - {{entry.displayState}} </p>
            </el-dropdown-item>

            <el-dropdown-item divided command="new">添加</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>

        <div> <img :src="userAvatarUrl" class="avator"></div>
        <el-dropdown @command="handleCommand" class='right'>
          <span class="el-dropdown-link">
            {{userInfo.name}}<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="home">我的</el-dropdown-item>
            <el-dropdown-item command="singout">退出</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <div class="header-checkin-con">
      </div>
    </div>
  </div>
</template>

<script>
import _ from "lodash"

import {signout, searchUserEntries} from '@/api/getData'
import {baseImgPath} from '@/config/env'

import UserCheckin from "@/components/dialog/UserCheckin.vue"

export default {
  components:{
    UserCheckin
  },
  data () {
    return {
      userCheckinDialogVisible: false,
      baseImgPath,
      userEntries: []
    }
  },
  computed: {
    userAvatarUrl:function(){
      return baseImgPath + '/img/' + this.userInfo.avatar
    },
    computedUserAndEntries(){
      const users = this.userEntries.map( (entry)=>{ return { id: entry.userId, name: entry.username} })
      const uniqUsers = _.uniqWith( users, _.isEqual)
      uniqUsers.forEach((user)=>{
        const entries = this.userEntries.filter((entry)=>{ return entry.userId == user.id})
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
    async initDate(){
      let params = {q: { store_id_eq: this.storeId, day_eq: this.getQueryParamToday() }}
      const result = await searchUserEntries( params )
      console.log( "headTop storeId =", this.storeId, result )

      this.userEntries = this.buildUserEntries( result.user_entries )
    },

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
    },
    handleCheckinCommand(command){
        if( command=='new'){
          this.openCheckinDialog()
        }
    },
    openCheckinDialog(){
      this.userCheckinDialogVisible = true
    },
    handleUserEntryCreated( newEntry){
      this.userEntries.push( newEntry)
    }
  }
}
</script>
