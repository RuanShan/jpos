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
    padding: 10px;
    display: flex;
    justify-content: space-between; //
    .shop_header {
      flex: 2;
      display: flex;
      align-items: center;
      .group-items {
        width: calc(100% - 103px);
        padding: 0 10px;
        span {
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
        p {
          width: 100%;
          white-space: nowrap;
          text-overflow: ellipsis; // overflow: hidden;
          position: relative;
          display: flex;
          align-items: center;

          img {
            height: 15px;
            width: 15px; // top: -5px;
            // right: -15px;
            // position: absolute;
            margin: 5px;
          }
        }
      }
      .image-wrap {
        width: 50px;
        height: 50px;
        text-align: center;
        line-height: 50px;
        img{
          max-width: 50px;
          max-height: 50px;
          vertical-align: middle;
        }
      }
    }
    .order_state {

    }
  }
  .boxh{
     border-bottom: 1px solid #e5e5e5;
     padding: 10px;
  }
  .boxf{
    border-top: 1px solid #e5e5e5;
    padding: 10px;
    text-align: right;
  }
}
</style>
<template>
  <section class="orderItem">
    <div class="boxh">
      <div class="base-row">
        <div class="">订单编号: {{order.number}} </div>
        <div class="right-date">订单时间: {{order.displayCreatedAt}}</div>
      </div>
      <div class="base-row">
        <div class="">客户信息: {{order.customer.mobile}}(卡号:{{order.customer.displayCardCode }}) </div>
        <div class="right-date">订单金额: {{order.total}}元 </div>
      </div>
    </div>
    <div v-for="group in order.lineItemGroups" class="row" style="min-height:60px">

      <div class="shop_header">
        <div class="image-wrap">
          <img :src="group.defulatImageUrl" alt="">
        </div>
        <div class="group-items">
          <p v-for="item in group.lineItems" class="fn-15 fw-2">
            <span > {{item.cname}}</span>
          </p>
        </div>
      </div>
      <div class="order_state fn-13 fn-c-memo fw-2">
        <div> 物品编号: {{group.number}}</div>
        <div> 服务项目: {{group.lineItems.length}}个</div>
        <div> 物品图片: {{group.images.length}}张</div>
      </div>
    </div>

    <div class="boxf" style="justify-content: flex-end;">
      <router-link :to="{ name: 'orderDetail', params: {id: order.id} }">
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
    };
  },
  props: {
    order: Object
  },
  components: {
  },
  compute:{
    customer(){
      return this.order.customer
    }
  },
  methods: {

    handleShowDetail(){
      this.detailVisible = true
    }
  }
};
</script>
