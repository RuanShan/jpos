<template>
  <div id="app" class="clearfix">
    <div class="main wrapper">
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
#app, .wrapper, body, html{
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.main {
/*  margin-left: 50px;
  background-color: #eff2f7;
  min-height: 100%;
*/
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
