<template>
  <div id="app" class="clearfix">
    <printable></printable>
    <div class="wrapper">
      <router-view></router-view>
    </div>

  </div>


</template>

<script>
import printable from "@/components/printable.vue"

export default {
  name: 'app',
  components: {
    printable
  }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
#app,
.wrapper,
body,
html {
  width: 100%;
  height: 100%;
  margin: 0;
  overflow: hidden;
}

.main {
  margin-left: 50px;
  background-color: #eff2f7;
  min-height: 100%;
}
.container {
  padding: 6px;
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
