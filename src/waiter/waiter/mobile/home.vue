<template>
  <div class="wrapper">
    <headTop></headTop>
    <leftNav></leftNav>
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
    headTop
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
