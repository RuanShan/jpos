<style lang='scss'>

.orderItem {
  min-height: 120px;
  .base-row{
      align-items: center;
      display: flex;
      justify-content: space-between; //. border-bottom: .5px solid #e5e5e5;
      .right-date{
        width: 220px;
      }
  }
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
    
    }
  }
}
</style>
<template>
  <section class="orderItem">
    <div class="base-row">
      <div class="">订单编号: R000000001 </div>
      <div class="right-date">订单时间: 2018年07月01日 13:25 </div>
    </div>
    <div class="base-row">
      <div class="">客户信息: 13311110000(卡号:1001001) </div>
      <div class="right-date">订单金额: 600元 </div>
    </div>
    <div class="row" style="min-height:60px">

      <div class="shop_header">
        <img :src="value.img" alt="">
        <div class="shop_text">
          <h2 class="fn-15 fw-2">
            <span>这是工作项目列表 {{value.title}}</span>
            <img :src="backIcon" alt="">
          </h2>
          <span class="fn-c-memo-light">2017.11.23</span>
        </div>
      </div>
      <div class="order_state fn-13 fn-c-memo fw-2">
        <div> 物品编号：10089277330011</div>
        <div> 服务项目: 2个</div>
        <div> 物品图片：5张</div>
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
