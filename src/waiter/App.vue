<template>
  <div id="app" class="clearfix">
    <div class="logo">LOGO</div>
    <div class="main">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
export default {
  name: 'app',
  components: {
  }
};
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
.logo{
  position: absolute;
  top:0;
  left: 0;
  width: 50px;
  height: 50px;
  padding: 5px;
  line-height: 50px;
}
.main {
  margin-left: 50px;
  background-color: #eff2f7;
  min-height: 100%;
}

.clearfix:before,
.clearfix:after {
  content: "";
  display: table;
}

.clearfix:after {
  clear: both;
}
</style>
