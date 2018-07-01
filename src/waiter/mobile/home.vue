<style lang="scss" scoped>
  /* banner */
  @import '~@assets/mobile/css/mixin.scss';
</style>

<template>
  <div class="wrapper">
    <keep-alive>
        <router-view></router-view>
    </keep-alive>
    <FooterView/>

  </div>
</template>

<script>
import FooterView from '@/components/mobile/footer/footerView';

import leftNav from "@/components/LeftNav/LeftNav.vue"
import headTop from "@/components/headTop.vue";
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
    FooterView
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
  @import '~@assets/mobile/css/theme.scss';
  @import '~@assets/mobile/css/normalize.css';
</style>
