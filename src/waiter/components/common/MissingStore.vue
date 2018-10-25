 <template>
  <div class="missing_container" v-show="showMsg">
    <div class="msg">
    请联系管理员设置店铺信息！
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import {
  getStore
} from "@/config/mUtils"

    export default {
      data(){
            return{

            }
        },
        mounted(){
          //console.log( 'this.$route',this.$route)
        },
        computed: {
          showMsg(){
            return this.localStoreId ==0 && this.$route.name != 'setting'
          },
          localStoreId() {
            return _.toInteger(getStore('storeId'))
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
