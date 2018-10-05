<style lang="css">
  .footer{
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 50px;
    text-align: center;
    background-color: #f4b22c;
    *{
      color: #3e3a39;
    }
    .copyright{
      line-height: 50px;
    }
  }
</style>

<template>
  <div  class="footer">
    <p class="copyright">汪永峰皮具养护订单系统底部版权信息</p>
  </div>
</template>
<style>
</style>
<script>
  export default {
    data(){
      return {

      }
    },
    computed: {
      isShow: function () {
        return true; //this.$store.state.footerVisible;
      }
    }

  }
</script>
