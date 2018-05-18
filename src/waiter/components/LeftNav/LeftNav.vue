<template>
   <div class="left-nav">
      <div class="logo">LOGO</div>
      <ul class="nav">
        <li class="el-menu-item">
          <router-link to="/waiter/" >
            <div class="text-sm"> 收银  </div>
          </router-link>
        </li>
        <li class="el-menu-item">
          <router-link to="/waiter/orders" >
            <i class="fa fa-bars"></i>
            <div class="text-sm"> 订单 </div>
          </router-link>
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
  top: 0;

  .router-link-exact-active{
    background-color: #eff2f7;
  }
  .logo{
    position: absolute;
    top:0;
    left: 0;
    width: 50px;
    height: 50px;
    line-height: 50px;
    background-color: #fff;

  }
}

.nav {
  padding: 0;
  margin: 50px 0 0 0;
  li {
    padding: 0;
    border-bottom: 1px solid #20a0ff;
    text-align: center;
    list-style: none;
    cursor: pointer;
    &:hover {
      color: #000;
    }
    a{
      display: block;
    }
  }
  .text-sm {
    font-size: 12px;
    letter-spacing: 2px;
  }
}
</style>
