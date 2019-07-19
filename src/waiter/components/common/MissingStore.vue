 <template>
  <div class="missing_container" v-show="showMsg">
    <div class="msg">
    请联系管理员设置店铺信息！
    </div>
  </div>
</template>

<script>
    export default {
      data(){
          return{
            showMsg: false
          }
        },
        mounted(){
          if( this.storeId  == 0 && this.$route.name != 'setting'){
            this.showMsg = true
          }
          //console.log( 'this.$route',this.$route)
        },
        methods:{
        },
        watch:{
          storeId: function( newStoreId, oldStoreId ){
            if( newStoreId > 0 ){
              if( this.$route.name != 'setting' ){
                this.showMsg = false
              }
            }
          }
        }
    }
</script>

<style lang="scss" >
  @import '../../style/mixin';

  .missing_container{
    position: fixed;
    background-color: #fff;
    top: 50px;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 10;
  }
 .missing_container .msg{
   @include center();
   background-color: #E6A23C;
    color: #fff;
    display: inline-block;
    padding: 15px;
 }
</style>
