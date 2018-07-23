<style lang="css">

</style>

<template>
  <div id="tab-bar" class="footer">
    <mt-tabbar v-model="selected" v-show="isShow" fixed class="border-1px-top">
      <mt-tab-item id="main">
        <img :src="img1" slot="icon">首页
      </mt-tab-item>
      <mt-tab-item id="tool">
        <img :src="img3" slot="icon">应用中心
      </mt-tab-item>
      <mt-tab-item id="orders">
        <img :src="img3" slot="icon">订单
      </mt-tab-item>
      <mt-tab-item id="my">
        <img :src="img5" slot="icon">我的
      </mt-tab-item>
    </mt-tabbar>
  </div>
</template>
<style>
</style>
<script>
  export default {
    data(){
      return {
        selected: this.$store.state.selectedTab,
        img1: require("@assets/mobile/image/tool/home_selected.png"),
        img3: require("@assets/mobile/image/tool/tool.png"),
        img5: require("@assets/mobile/image/tool/user.png")
      }
    },
    computed: {
      isShow: function () {
        return true; //this.$store.state.footerVisible;
      }
    },
    watch: {
      'selected': {
        handler(){
          if (this.selected === "main") {
            this.$router.push('/main');
            this.img1 = require("@assets/mobile/image/tool/home_selected.png")
          } else {
            this.img1 = require("@assets/mobile/image/tool/home.png")
          }
          if (this.selected === "tool") {
            this.$router.push('tool');
            this.img3 = require('@assets/mobile/image/tool/tool_selected.png')
          } else {
            this.img3 = require('@assets/mobile/image/tool/tool.png')
          }
          if (this.selected === "orders") {
            this.$router.push('/orders');
            this.img3 = require('@assets/mobile/image/tool/tool_selected.png')
          } else {
            this.img3 = require('@assets/mobile/image/tool/tool.png')
          }

          if (this.selected === "my") {
            this.$router.push('/my');
            this.img5 = require("@assets/mobile/image/tool/user_selected.png")
          } else {
            this.img5 = require("@assets/mobile/image/tool/user.png")
          }
        }
      }
    }
  }
</script>
