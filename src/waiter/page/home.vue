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
import { userDataMixin } from "@/components/userDataMixin"
import { shopDetails } from "@/api/getData";

export default {
  name: 'page',
  data() {
    return {
      storeId: null, //商店id值
      storeName: "", //店铺名称
    }
  },
  mixins: [userDataMixin],
  components: {
    leftNav,
    headTop
  },
  created() {
    this.getAdminData().then(res => {
      console.log("created")
      if (this.userInfo.id) {
        this.storeId = this.userInfo.storeId;
        this.initData();
      } else {
        this.$router.push("/");
      }
    })
  },
  methods: {
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
