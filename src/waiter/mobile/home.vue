<style lang="scss">
  /* banner */
  @import '~@assets/mobile/css/mixin.scss';
</style>

<template>
  <div class="home-container">

    <head-top ></head-top>
    <footer-bar ></footer-bar>

    this is home page
  </div>
</template>

<script>
import FooterBar from '@/components/mobile/layout/FooterBar';
import HeadTop from '@/components/mobile/layout/HeadTop';

import { shopDetails } from "@/api/getData";

export default {
  name: 'page',
  data() {
    return {
      storeName: "", //店铺名称
    }
  },
  components: {
    'head-top': HeadTop,
    'footer-bar': FooterBar
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
<style lang="scss">
  @import '~@assets/mobile/css/normalize.css';

  .footer{
    max-width: 750px;
  }
</style>
