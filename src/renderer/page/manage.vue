<template>
  <div class="manage-page fillcontain">
      <head-top></head-top>
      <left-side></left-side>

      <div class="content">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/manage' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item v-for="(item, index) in $route.meta" :key="index">{{item}}</el-breadcrumb-item>
        </el-breadcrumb>
        <keep-alive>
            <router-view></router-view>
        </keep-alive>
      </div>
    </div>
</template>

<script>
import headTop from '@/components/headTop'
import leftSide from '@/components/leftSide'

export default {
  components:{
    headTop,
    leftSide
  },
  computed: {
    defaultActive: function () {
          return this.$route.path.replace('/', '')
    }
  }
}
</script>


<style lang="scss" scoped>
  @import '../style/mixin';
  .manage-page{

  }
  .content {
    background: none repeat scroll 0 0 #f0f0f0;
    position: absolute;
    left: 250px;
    right: 0;
    top: 70px;
    bottom: 0;
    width: auto;
    padding: 40px;
    box-sizing: border-box;
    overflow-y: scroll;
  }
</style>
