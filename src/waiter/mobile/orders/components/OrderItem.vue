<template>
  <section class="orderItem">
    <div class="row" style="min-height:60px">
      <div class="shop_header">
        <img :src="value.img" alt="">
        <div class="shop_text">
          <h2 class="fn-15 fw-2">
            <span> {{value.title}}</span>
            <img :src="backIcon" alt="">
          </h2>
          <span class="fn-c-memo-light">2017.11.23</span>
        </div>
      </div>
      <div class="order_state fn-13 fn-c-memo fw-2">
        订单已完成
      </div>
    </div>
    <div class="row">
      <div class="shop_header">
        <div class="shop_text">
          <span style="padding-left:60px" class="fn-c-memo"> {{value.content}}</span>
        </div>
      </div>
      <div class="order_state fn-13">
        ￥19.00
      </div>
    </div>
    <div class="row fw-2" style="justify-content: flex-end;">
      <router-link :to="{ name: 'orderDetail', params: {number: 1} }">
      <mt-button class="fw-4" style="margin-right:10px;height:30px" plain size="small" type="primary" >订单详细</mt-button>
      </router-link>
    </div>

  </section>


</template>

<script type="text/babel">
export default {
  name: "OrderItem",
  data() {
    return {
      list: [],
      detailVisible: false,
      backIcon: 'static/mobile/img/icon/right.png',
    };
  },
  props: {
    value: Object
  },
  components: {
  },
  methods: {
    hide() {
      this.$store.commit('SHOW_FOOTER', !this.$store.state.common.hasFooter)
    },
    handleShowDetail(){
      this.detailVisible = true
    }
  }
};
</script>

<style lang='scss'>

.orderItem {
  min-height: 120px;
  .row {
    align-items: center;
    min-height: 50px;
    display: flex;
    justify-content: space-between; // border-bottom: .5px solid #e5e5e5;
    box-shadow: 0 0 1px rgba(0, 0, 0, .11);
    .shop_header {
      flex: 2;
      display: flex;
      align-items: center;
      .shop_text {
        width: calc(100% - 103px);
        span {
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
        h2 {
          width: 100%;
          white-space: nowrap;
          text-overflow: ellipsis; // overflow: hidden;
          position: relative;
          display: flex;
          align-items: center;
          // &::after {
          //   background-image: url('../../../../static/img/icon/right.png');
          //   content: "";
          //   display: block;
          //   height: 15px;
          //   width: 15px;
          //   position: absolute;
          //   right: -24px;
          //   top: 4px;
          //   background-size: 15px 15px;
          // }
          img {
            height: 15px;
            width: 15px; // top: -5px;
            // right: -15px;
            // position: absolute;
            margin: 5px;
          }
        }
      }
      img {
        height: 40px;
        margin: 10px;
      }
    }
    .order_state {
      flex: .6; // flex: 0 0 100px;
      display: flex;
      align-items: center;
    }
  }
}
</style>
