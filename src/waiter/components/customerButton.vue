<template>
    <div class="customer_container">
      <div class="customer-button" @click="dialogVisible = true">      this is customer button    </div>
      <el-dialog title="提示" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
        <span>这是一段信息</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
        </span>
      </el-dialog>
    </div>

</template>

<script>
import {baseImgPath} from '@/config/env'
import {mapState} from 'vuex'

export default {
  data () {
    return {
      dialogVisible: false,
      baseImgPath
    }
  },
  props: ['storeName'],
  computed: {
    ...mapState([
      'adminInfo','latitude','longitude','cartList'
    ]),
  },
  methods:{
    startCheckout: function(){
      alert('customer btn click')
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done();
        })
        .catch(_ => {});
    }
  }
}
</script>
<style lang="scss" >
.customer-button{
  height: 80px;
  text-align: center;
  font-size: 21px;
  color: #fff;
  background-color: #909399;
  border-color: #909399;

}

</style>
