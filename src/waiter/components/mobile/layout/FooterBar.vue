<style lang="css">
  .footer{
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 50px;
    color: white;
    background-color: #285ff5;
    text-align: center;
  }
</style>

<template>
  <div  class="footer">
    JPOS 底部版权信息
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
