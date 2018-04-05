<template>
    <div class="checkout_container">
      <div class="check-button" @click="dialogVisible = true">      this is checkout button    </div>
      <el-dialog  :visible.sync="dialogVisible" :before-close="handleClose" :show-close=false	:fullscreen=true>
        <div slot="title" class="dialog-title">提示, this is all right
        </div>

        <div>这是一段信息</div>
        <el-row :gutter="20">
          <el-col :span="12" :offset="6" >
            <div class="grid-content bg-purple"> content 1 </div>
            <div>
              <div class="form-item"> <label for > Total</label>
                <el-input  placeholder="请输入内容"></el-input>
                 <el-button>Cash</el-button>
              </div>
            </div>
          </el-col>
          <el-col :span="12" :offset="6" ><div class="grid-content bg-purple"> content 2 </div></el-col>
        </el-row>

        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
        </div>
      </el-dialog>
    </div>
</template>

<script>
import {baseImgPath} from '@/config/env'
import {mapState} from 'vuex'

export default {
  data () {
    return {
      checkoutData: { total: 0},
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
      alert('checkout btn click')
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
.check-button{
  line-height: 50px;
  height: 50px;
  text-align: center;
  font-size: 21px;
  color: #fff;
  background-color: #67c23a;
  border-color: #67c23a;

}
.form-item{
  display:inline-table;
  width: 100%;
  label, input, button, .el-input{
    position:relative;
    display: table-cell;
  }
}
.el-dialog__body .el-input {

}
</style>
