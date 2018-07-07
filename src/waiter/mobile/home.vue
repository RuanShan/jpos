<style lang="scss" scoped>
  /* banner */
  @import '~@assets/mobile/css/mixin.scss';
</style>

<template>
  <div class="wrapper">
    <keep-alive>
        <router-view></router-view>
    </keep-alive>
    <footer-bar class="footer"></footer-bar>

  </div>
</template>

<script>
import FooterBar from '@/components/mobile/footer/FooterBar';

import leftNav from "@/components/layout/LeftNav.vue"
import headTop from "@/components/layout/headTop.vue";
import { shopDetails } from "@/api/getData";

export default {
  name: 'page',
  data() {
    return {
      storeName: "", //店铺名称
    }
  },
  components: {
    leftNav,
    headTop,
    'footer-bar': FooterBar
  },
  created() {
    this.getCurrentUser()
  },
  methods: {
    getCurrentUser() {
console.log( "home.created.getCurrentUser")
      if (this.userInfo.id) {
        this.$bus.$emit('UserInitializedEvent')
        this.$router.push("/waiter");
      } else {
        this.$router.push("/login");
      }
    },
    async initData() {
      //获取商铺信息
      this.shopDetailData = await shopDetails(
        this.storeId
      )
      this.storeName = this.shopDetailData.name;

    }
  }

}
</script>
<style lang="scss">
  @import '~@assets/mobile/css/normalize.css';

  .footer{
    max-width: 750px;
  }
</style>
