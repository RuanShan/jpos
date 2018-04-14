<template>
<div class="sidebar">
  <el-menu :default-active="defaultActive" style="min-height: 100%;" theme="dark" router>
    <el-menu-item index="manage"><i class="el-icon-menu"></i>首页</el-menu-item>
    <el-submenu index="2">
      <template slot="title"><i class="el-icon-document"></i>数据管理</template>
      <el-menu-item index="userList">用户列表</el-menu-item>
      <el-menu-item index="shopList">商家列表</el-menu-item>
      <el-menu-item index="menuList">菜单列表</el-menu-item>
      <el-menu-item index="foodList">食品列表</el-menu-item>
      <el-menu-item index="adminList">管理员列表</el-menu-item>
    </el-submenu>
    <el-submenu index="3">
      <template slot="title"><i class="el-icon-plus"></i>Order</template>
      <el-menu-item index="orderList">订单列表</el-menu-item>
      <el-menu-item index="orderProcess">订单Process</el-menu-item>
    </el-submenu>

    <el-submenu index="4">
      <template slot="title"><i class="el-icon-plus"></i>添加数据</template>
      <el-menu-item index="addShop">添加商铺</el-menu-item>
      <el-menu-item index="addGoods">添加商品</el-menu-item>
    </el-submenu>
    <el-submenu index="5">
      <template slot="title"><i class="el-icon-star-on"></i>图表</template>
      <el-menu-item index="visitor">用户分布</el-menu-item>
      <!-- <el-menu-item index="newMember">用户数据</el-menu-item> -->
    </el-submenu>
    <el-submenu index="6">
      <template slot="title"><i class="el-icon-edit"></i>编辑</template>
      <!-- <el-menu-item index="uploadImg">上传图片</el-menu-item> -->
      <el-menu-item index="vueEdit">文本编辑</el-menu-item>
    </el-submenu>
    <el-submenu index="7">
      <template slot="title"><i class="el-icon-setting"></i>设置</template>
      <el-menu-item index="adminSet">管理员设置</el-menu-item>
      <!-- <el-menu-item index="sendMessage">发送通知</el-menu-item> -->
    </el-submenu>
    <el-submenu index="8">
      <template slot="title"><i class="el-icon-warning"></i>说明</template>
      <el-menu-item index="explain">说明</el-menu-item>
    </el-submenu>
  </el-menu>
</div>
</template>

<style lang="scss" scope>
.sidebar {
    display: block;
    position: absolute;
    width: 250px;
    left: 0;
    top: 70px;
    bottom: 0;
    background: #2e363f;
}
</style>

<script>

export default {
    data () {
      return {
        defaultActive: 'manage'
      }
    }
}

</script>
