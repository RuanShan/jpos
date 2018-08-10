<style lang="css">

.header.is-fixed {
    top: 0;
    right: 0;
    left: 0;
    position: fixed;
    z-index: 1;
}
.header {
    align-items: center;
    background-color: #26a2ff;
    box-sizing: border-box;
    color: #fff;
    font-size: 14px;
    height: 40px;
    line-height: 1;
    padding: 0 10px;
    position: relative;
    text-align: center;
    white-space: nowrap;
}
.header  span{
  line-height: 40px;
  color: #fff;
}
</style>

<template>
  <header class="header is-fixed"   >
    <div class="left">
      <img alt="LOGO">
      <span> 大连永峰皮具养护-新开路店</span>
    </div>
    <div class="right">
      <el-dropdown @command="handleCommand" >
        <span class="el-dropdown-link">
          {{userInfo.name}}<i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="singout">退出</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </header>
</template>
