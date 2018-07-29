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

<style >
  @reset-global mobile;
  
  html, body {
    background-color: #fafafa;
    -webkit-overflow-scrolling: touch;
    user-select: none;
  }
  a {
    color: inherit;
  }
  .page-back {
    display: inline-block;
    position: absolute 12px * * 10px;
    width: 40px;
    height: 40px;
    text-align: center;
    i {
      font-size: 24px;
      line-height: 40px;
    }
  }
</style>
