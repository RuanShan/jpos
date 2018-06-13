<template>
  <div id="app" class="clearfix">
    <div class="wrapper">
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

#expensecalendartable td {
  padding: 0;
}

#expensecalendartable th {
  padding: 0;
}
#recharge-recored-table td {
  padding: 0;
}

#recharge-recored-table th {
  padding: 0;
}

#recharge .el-dialog__title {
  font-size: 20px;
  color: #ef0a6b;
  font-weight: bold;
}
</style>
