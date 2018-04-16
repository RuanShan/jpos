<template>
<div class="sidebar">
  <aside class="db-menu-wrapper">
    <el-menu :default-active="activeMenu" class="db-menu-bar" router>
      <template v-for="(route, index) in $router.options.routes[$router.options.routes.length - 2].children" >
        <template v-if="route.children && route.name">
          <el-submenu :index="route.name">
            <template slot="title"><i :class="route.meta.iconClass"></i>{{route.name}}</template>
            <el-menu-item :index="cRoute.name" v-for="(cRoute, cIndex) in route.children" :route="cRoute" :key="cRoute.name">{{cRoute.name}}</el-menu-item>
          </el-submenu>
        </template>

        <template v-if="!route.children && route.name">
          <el-menu-item :index="route.name" :route="route"><i :class="route.meta.iconClass"></i>{{route.name}}</el-menu-item>
        </template>
      </template>
    </el-menu>
  </aside>


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

    // menu

}
</style>

<script>

export default {
    data () {
      return {
        defaultActive: 'manage'
      }
    },
    created() {
      this.activeMenu = this.$route.name
    },
    watch: {
      '$route'(to, from) {
        this.activeMenu = this.$route.name;
      }
    }
}

</script>
