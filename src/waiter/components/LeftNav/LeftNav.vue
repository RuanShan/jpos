<template>
  <div class="left-nav">
    <ul class="nav">
      <li class="el-menu-item">

        <router-link to="/waiter/" ><div class="text-sm"> 收银  </div></router-link>
      </li>
      <li class="el-menu-item">
        <i class="fa fa-bars"></i>
        <div class="text-sm"><router-link to="/waiter/orders" > 订单 </router-link></div>
      </li>
      <li class="el-menu-item">
        <i class="fa fa-bars"></i>
        <div class="text-sm">店铺</div>
      </li>
      <li class="el-menu-item">
        <i class="fa fa-coffee"></i>
        <div class="text-sm">商品</div>
      </li>
      <li class="el-menu-item">
        <i class="fa fa-vcard"></i>
        <div class="text-sm">会员</div>
      </li>
      <li class="el-menu-item">
        <i class="fa fa-bar-chart"></i>
        <div class="text-sm">统计</div>
      </li>
      <li class="el-menu-item">
        <i class="fa fa-gears"></i>
        <div class="text-sm">设置</div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'leftNav'
};
</script>

<style lang="scss" scoped>
.left-nav {
  position: absolute;
  left: 0;
  // float: left;
  width: 50px;
  height: 100%;
  color: #fff;
  background-color: #1d8ce0;
  top: 50px;
}

.nav {
  padding: 0;
  margin: 0;
  li {
    padding: 6px 0;
    border-bottom: 1px solid #20a0ff;
    text-align: center;
    list-style: none;
    cursor: pointer;
    &:hover {
      color: #000;
    }
  }
  .text-sm {
    font-size: 12px;
    letter-spacing: 2px;
  }
}
</style>
