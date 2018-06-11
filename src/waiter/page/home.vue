<template>
  <div class="wrapper">
    <headTop :store-name="storeName"></headTop>
    <leftNav></leftNav>
    <keep-alive>
        <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script>
import leftNav from "@/components/LeftNav/LeftNav.vue"
import headTop from "@/components/headTop.vue";
import { userDataMixin } from "@/components/mixin/commonDataMixin"
import { shopDetails } from "@/api/getData";

export default {
  name: 'page',
  data() {
    return {
      storeName: "", //店铺名称
    }
  },
  mixins: [userDataMixin],
  components: {
    leftNav,
    headTop
  },
  created() {
    this.getCurrentUser()
  },
  methods: {
    async getCurrentUser() {
      await this.getAdminData()
      if (this.userInfo.id) {
        this.initData();
        this.$bus.$emit('UserInitializedEvent')

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
