<template>
    <div class="checkout-container">
      <div class="check-button" @click="dialogVisible = true">      this is checkout button    </div>
      <el-dialog  :visible.sync="dialogVisible" :show-close=false	:fullscreen=true>
        <div slot="title" class="dialog-title">提示, this is all right
        </div>
        <div class='main-part'>
          <el-row :gutter="20">
            <el-col :span="12" :offset="6" >
              <div class="checkout-form">
              <table >
                <tr> <td>总额 </td>
                     <td><el-input v-model="totalPrice" placeholder="订单总价" class="money"></el-input>  </td>
                     <td></td>
                </tr>
                <tr> <td>支付 </td>
                  <td>
                    <el-input v-for="item in paymentList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id" placeholder="请输入内容" class="input-with-select money">
                      <el-select v-model="selectPaymentMethod" slot="prepend" placeholder="请选择">
                        <el-option
                          v-for="item in paymentMethodList"
                          :key="item.id"
                          :label="item.name"
                          :value="item.id">
                        </el-option>
                      </el-select>
                    </el-input>
                  </td>
                  <td> <el-button>添加</el-button> </td>
                </tr>
                <tr> <td>找零 </td>
                     <td><el-input v-model="orderChange" placeholder="找零数额" class="money"></el-input>  </td>
                     <td><el-button>现金</el-button> </td>
                </tr>
              </table>

                <div class="">  <el-button>组合支付</el-button> </div>
              </div>
            </el-col>
          </el-row>
        </div>
        <div class="keynum-part">
          <el-row :gutter="20">
            <el-col :span="12" :offset="6" >
            <div class="num"><div><button>1 </button></div> </div>
            <div class="num"><div><button>2 </button></div> </div>
            <div class="num"><div><button>3 </button></div> </div>
            <div class="num"><div><button>50 </button></div> </div>
            <div class="num"><div><button>backspace </button></div> </div>
            <div class="num" style="float: right; height: 10em;"><div><button class="place-order">确认 </button></div> </div>
            <div class="num"><div><button>4 </button></div> </div>
            <div class="num"><div><button>5 </button></div> </div>
            <div class="num"><div><button>6 </button></div> </div>
            <div class="num"><div><button>100 </button></div> </div>

            <div class="num"><div><button>7 </button></div> </div>
            <div class="num"><div><button>8 </button></div> </div>
            <div class="num"><div><button>9 </button></div> </div>
            <div class="num"><div><button>200 </button></div> </div>
            <div class="num"><div><button>0 </button></div> </div>
            <div class="num"><div><button>00 </button></div> </div>
            <div class="num"><div><button>. </button></div> </div>
            <div class="num"><div><button>300 </button></div> </div>

            </el-col>
          </el-row>

          <div>这是一段信息</div>

        </div>

        <div slot="footer" class="dialog-footer">
          <el-button @click="handleClose">取 消</el-button>
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
    return {//微信,支付宝
      paymentMethodList:[{ id: 1, type:'cash', name:'现金'},{ id: 2, type:'prepaidCard', name:'打折卡'},{ id: 3, type:'onceCard', name:'年卡'}],
      paymentList:[{type: 'cash', amount: 0}],
      checkoutData: { total: 0},
      dialogVisible: false,
      baseImgPath,
      selectPaymentMethod: 1
    }
  },
  props: ['storeName', 'orderList'],
  computed: {
    ...mapState([
      'adminInfo','latitude','longitude','cartList'
    ]),
    // 订单总价
    totalPrice: function(){
      let total = 0
      for(let i in this.orderList) {
        total += this.orderList[i].price
      }
      return total
    },
    // 支付总额
    totalPaymentAmount(){
      let total = 0
      for(let i in this.paymentList) {
        total += this.paymentList[i].amount
      }
      return total
    },
    // 找零
    orderChange(){
      return this.totalPaymentAmount - this.totalPrice
    }
  },
  methods:{
    addPayment( paymentMethodType){
      let payment = { type:  paymentMethodType, amount: 0 }
      if( paymentMethodType == 'cash'){
        payment.amount = this.orderChange
      }
      this.paymentList.push( payment )
    },
    handleClose(done) {
      this.paymentList=[]
      this.dialogVisible = false
    }
  },
  watch: {
    orderList: function (val) {
      this.paymentList=[]
      this.addPayment( 'cash')
    }
  }
}
</script>
<style lang="scss" >
.checkout-form{
  table{
    width: 100%;
  }
}
.check-button{
  line-height: 50px;
  height: 50px;
  text-align: center;
  font-size: 21px;
  color: #fff;
  background-color: #67c23a;
  border-color: #67c23a;

}

.el-dialog__header{
  position:absolute;
  top:0;
  left: 0;
  right: 0;
  height: 80px;
  padding: 0;
}
.el-dialog__body {
  position:absolute;
  padding: 0;
  top:80px;
  bottom: 80px;
  left: 0;
  right: 0;
  .main-part{
    position:absolute;
    top:0;
    left: 0;
    right: 0;    height: 60%;
    overflow-x:hidden;
    .input-with-select .el-input--suffix{
      width: 100px;
    }
    .money > .el-input__inner{
      text-align: right;
    }
  }
  .num{
    width:20%;
    float: left;
    div{
      padding:5px;
    }
    button{
      width: 100%;
      line-height: 1;
      white-space: nowrap;
      cursor: pointer;
      background: #fff;
      border: 1px solid #dcdfe6;
      border-color: #dcdfe6;
      color: #606266;
      text-align: center;
      box-sizing: border-box;
      outline: none;
      margin: 0;
      transition: .1s;
      font-weight: 500;
      padding: 12px 0;
      font-size: 14px;
      border-radius: 4px;
      &.place-order{
        line-height: 8;
      }
    }

  }
  .keynum-part{
    position:absolute;
    bottom:0;
    left: 0;
    right: 0;    height: 40%;
    overflow-x:hidden;

  }
}
.el-dialog__footer{
  position:absolute;
  padding: 0;
  bottom:0;
  height: 80px;
  left: 0;
  right: 0;
}

</style>
