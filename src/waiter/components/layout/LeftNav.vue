<style lang="scss" >
.left-nav {
  position: absolute;
  // float: left;
  width: 50px;
  height: 100%;
  background-color: #6a3906;
  top: 50px;
  left: 0;
  bottom: 0;
  .nav {
    padding: 0;
    margin: 0;
    li.el-menu-item {
      line-height: 1em;
      padding: 0;
      border-bottom: 1px solid #d3dce6;
      text-align: center;
      list-style: none;
      cursor: pointer;
      background-color: #6a3906;
      &:hover, a.router-link-active {
        color: #fff;
        background-color: #f4b22c;
      }
      .router-link-exact-active{
        background-color: #eff2f7;
        i.fa,.text-sm {
          color: #000;
        }
      }
      a{
        padding: 12px 0 0;
        display: block;
        height: 56px;
      }
      i.fa {
        color: #fff;
      }
      .text-sm {
        color: #fff;
        font-size: 12px;
        letter-spacing: 2px;
      }
    }

  }
}

</style>

<template>
   <div class="left-nav">
     <MissingStore ></MissingStore>

      <ul class="nav">
        <li class="el-menu-item" v-if="userAuthorize('pos')">
          <router-link to="/pos" >
            <i class="fa fa-cny"></i>
            <div class="text-sm"> 收银  </div>
          </router-link>
        </li>
        <li class="el-menu-item" v-if="userAuthorize('sitems')">
          <router-link to="/sitems" >
            <i class="fa fa-tags"></i>
            <div class="text-sm"> 店订单 </div>
          </router-link>
        </li>
        <li class="el-menu-item" v-if="userAuthorize('fitems')">
          <router-link to="/fitems" >
            <i class="fa fa-tags"></i>
            <div class="text-sm"> 厂订单 </div>
          </router-link>
        </li>
        <li class="el-menu-item" v-if="userAuthorize('members')">
          <router-link to="/members" >
            <i class="fa fa-vcard"></i>
            <div class="text-sm">会员</div>
          </router-link>
        </li>
        <li class="el-menu-item" v-if="userAuthorize('statistics')">
          <router-link to="/statistics" >
            <i class="fa fa-bar-chart-o"></i>
            <div class="text-sm">统计</div>
          </router-link>
        </li>
        <li class="el-menu-item" v-if="userAuthorize('setting')">
          <router-link to="/setting" >
            <i class="fa fa-gears"></i>
            <div class="text-sm">设置</div>
          </router-link>
        </li>

      </ul>
    </div>
</template>

<script>
import MissingStore from "@/components/common/MissingStore.vue"

export default {
  components:{
    MissingStore
  },
  name: 'leftNav'
};
</script>
