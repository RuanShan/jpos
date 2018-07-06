<template>
  <div class="wrapper">
    <headTop></headTop>
    <leftNav></leftNav>
    <keep-alive>
        <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script>
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
      if (this.userInfo.id) {
        this.$bus.$emit('UserInitializedEvent')
        this.$router.push("/pos");
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
