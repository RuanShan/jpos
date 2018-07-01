<style lang="scss" >
@import '../style/element_ui_custom';

.checkout-form {
    margin: 50px 0;
    table {
        width: 100%;
    }
    .input-with-select .el-select {
        min-width: 100px;
    }
}

.checkout-container {

    .el-col {
        border-radius: 4px;
    }
    .bg-purple-dark {
        background: #99a9bf;
    }
    .bg-purple {
        background: #d3dce6;
    }
    .bg-purple-light {
        background: #e5e9f2;
    }
    .grid-content {
        border-radius: 4px;
        min-height: 36px;
    }
    .row-bg {
        padding: 10px 0;
        background-color: #f9fafc;
    }
    .checkboxGroup {
        width: 100%;
    }
    .switchButtons {
        height: 40px;
        line-height: 40px;
    }
}
</style>
<template>
<div class="checkout-container">
  <div class="check-button" @click="openTheWindow()"> 收款 ：&nbsp;￥&nbsp;{{totalMoney}} </div>
  <el-dialog :visible.sync="dialogVisible" :show-close="false" :fullscreen="true" class="el-custom">
    <div slot="title" class="dialog-title-wrap">
      <div class="left back"> <i class="el-icon-back" @click="closeWindow()"></i> </div>
      <div> 结算</div>
    </div>
    <!-- <div class='main-part'> -->
    <el-row :gutter="20">
      <el-col :span="12" :offset="6">
        <div class="checkout-form">
          <table>
            <tr>
              <td>总额 </td>
              <td>
                <el-input v-model="totalMoney" placeholder="订单总价" class="money"></el-input>
              </td>
              <td></td>
            </tr>
            <tr>
              <td>支付 </td>
              <td>

                <el-input placeholder="请输入内容" v-model="inputSum" class="input-with-select money">
                  <el-select v-model="selectPaymentMethod" slot="prepend" placeholder="请选择">
                    <el-option v-for="item in paymentMethodList" :key="item.id" :label="item.name" :value="item.id">
                    </el-option>
                  </el-select>
                </el-input>
              </td>
              <td>
                <el-button>添加</el-button>
              </td>
            </tr>
            <tr>
              <td>找零 </td>
              <td>
                <el-input v-model="giveChange" placeholder="找零数额" class="money"></el-input>
              </td>
              <td>
              </td>
            </tr>
          </table>

          <div class="">
          </div>
        </div>
      </el-col>
    </el-row>

    <checkout-keyboard ref="keyboard" @checkoutInputSum="checkoutInputSum($event)" @giveChangeOnFun="giveChangeOnFun($event)" @pressKeyC="pressKeyC($event)"></checkout-keyboard>

    <div slot="footer" class="dialog-footer">
    </div>
  </el-dialog>
</div>
</template>

<script>
import CheckOutKeyborad from "@/components/CheckOutKeyborad.vue";
import { checkout } from "@/api/getData";

import {
  baseImgPath
} from "@/config/env";
import {
  mapState
} from "vuex";

export default {
  props: ["storeName", "orderList", "totalMoney", "customerData"],
  components: {
    "checkout-keyboard": CheckOutKeyborad
  },

  data() {
    return {
      //微信,支付宝
      //支付方式
      paymentMethodList: [{
          id: 1,
          type: "cash",
          name: "现金"
        },
        {
          id: 2,
          type: "prepaidCard",
          name: "微信"
        },
        {
          id: 3,
          type: "onceCard",
          name: "支付宝"
        }
      ],
      paymentList: [{
        type: "cash",
        amount: 0
      }],
      // checkoutData: { total: 0},
      dialogVisible: false,
      baseImgPath,
      selectPaymentMethod: 1,
      paymentValues: {},
      inputSum: "", //收到现金数
      giveChange: "", //找零钱
      payments: [], //支付被方式选择数字,返回已经被选择的lable,如""现金","微信"等

      fromParentOrderList: {}, //父组件传来的orderList{}
      XianJinInputNum: "", //现金输入数字
      XianJinInputFlag: false //现金输入框是否输入标志位
    };
  },
  computed: {
    ...mapState(["userInfo", "cartList"]),
    // 订单总价
    totalPrice: function() {
      let total = 0;
      for (let i in this.orderList) {
        total += this.orderList[i].price;
      }
      return total;
    },
    //结账请求参数
    checkoutParams: function(){
      let order =  { user_id: this.customerData.id }
      order.line_items = this.orderList.map((item)=>{ return { quantity: 1, variant_id: item.variant_id, group_number: item.group_number}})
      return order
    },
    // 支付总额
    totalPaymentAmount() {
      let total = 0;
      for (let i in this.paymentList) {
        total += this.paymentList[i].amount;
      }
      return total;
    },
    // 找零
    orderChange() {
      return this.inputSum - this.totalMoney;
    }
  },
  methods: {
    addPayment(paymentMethodType) {
      let payment = {
        type: paymentMethodType,
        amount: 0
      };
      if (paymentMethodType == "cash") {
        payment.amount = this.orderChange;
      }
      this.paymentList.push(payment);
    },
    closeWindow() {
      this.paymentList = [];
      this.dialogVisible = false;
      this.SUM = 0;
    },
    //CheckOutKeybord 子组件发射的函数,得到顾客给的钱数
    checkoutInputSum(money) {
      if( money > 0){
        this.inputSum = money;
        let temp = this.inputSum - this.totalMoney; //
        this.giveChange = temp.toFixed(2);
      }
    },
    //CheckOutKeybord 子组件发射的函数,计算出来找零钱的金额
    giveChangeOnFun() {
      console.log(" giveChangeOnFun ")
      this.confirmButton()
    },
    //按键C处理函数
    pressKeyC() {
      this.giveChange = "";
    },
    //打开窗口处理函数
    openTheWindow() {
      if (this.totalMoney == "") {
        // 这个条件应该是根据后台返回的数据判断
        this.$message({
          message: "还没有商品哦，请添加后在结账",
          type: "warning"
        });
        return;
      } else {
        this.dialogVisible = true;
      }
    },
    //输入框得到焦点时处理函数-----复位flaginputs,打开相应的flag
    inputsGetFocus(parameter) {
      this.clearFlageInputs(); //清除flagInputs
      // console.log(parameter);
      this.flagInput[parameter] = true;
      this.moneyInputs[parameter] = "";
      this.inputSum = "";
      this.$refs.keyboard.money = "";
    },
    //clear flagInput
    clearFlageInputs() {
      for (let key in this.flagInput) {
        this.flagInput[key] = false;
      }
    },

    //收到现金输入框得到焦点处理函数-----
    XianJinGetFocus() {
      this.clearFlageInputs();
      this.inputSum = "";
      this.$refs.keyboard.money = "";
      this.XianJinInputFlag = true;
    },
    //确认按钮单击事件处理函数-----
    confirmButton() {
      //求和
      // let SUM = 0;
      // for (let key in this.moneyInputs) {
      //   SUM += Number(this.moneyInputs[key]);
      // }
      // SUM = parseFloat(SUM);
        // this.$alert("商品总额与各个支付方式总数不符,请重新输入", "总数不对", {
        //   confirmButtonText: "确定",
        //   callback: action => {
        //     this.$message({
        //       type: "info",
        //       message: `action: ${action}`
        //     });
        //   }
        // });
        //总数相等,提交SerVer
        checkout( { order: this.checkoutParams } ).then(()=>{
          this.dialogVisible = false;
          this.$bus.$emit('created-order')
          console.log('emit created-order')

          this.$notify({
            title: "订单提交SerVer",
            message: "这是虚拟的,假设的,实验用的,非真实的.请注意!!!!!"
          });
        })

    },
    messageBox(string1, string2) {
      this.$alert(string1, string2, {
        confirmButtonText: "确定",
        callback: action => {
          this.$message({
            type: "info",
            message: `action: ${action}`
          });
        }
      });
    }
  },

  watch: {
    orderList: function(val) {
      this.paymentList = [];
      this.addPayment("cash");
    },
    //检查inputSum数字变化
  }
};
</script>
<style lang="scss" >
.checkout-form {
    margin: 50px 0;
    table {
        width: 100%;
    }
}
.check-button {
    line-height: 50px;
    height: 50px;
    text-align: center;
    font-size: 21px;
    color: #fff;
    background-color: #67c23a;
    border-color: #67c23a;
}

.checkout-container {
    .el-dialog__header {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 80px;
        padding: 0;
        background-color: #1d8ce0;
        color: #fff;
        .dialog-title-wrap {
            line-height: 80px;
            font-size: 36px;
            text-align: center;
            color: #ffffff;
            .back {
                color: #ffffff;
                font-size: 40px;
                padding: 0 40px;
                cursor: pointer;
            }
        }
    }
    .el-dialog__body {
        position: absolute;
        padding: 0;
        top: 80px;
        bottom: 80px;
        left: 0;
        right: 0;
        .main-part {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 60%;
            overflow-x: hidden;
            .input-with-select .el-input--suffix {
                width: 100px;
            }
            .money > .el-input__inner {
                text-align: right;
            }
        }
        .num {
            width: 20%;
            float: left;
            div {
                padding: 5px;
            }
            button {
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
                transition: 0.1s;
                font-weight: 500;
                padding: 12px 0;
                font-size: 14px;
                border-radius: 4px;
                &.place-order {
                    line-height: 8;
                }
            }
        }
        .keynum-part {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            height: 40%;
            overflow-x: hidden;
        }
    }
    .el-dialog__footer {
        position: absolute;
        padding: 0;
        bottom: 0;
        height: 80px;
        left: 0;
        right: 0;
    }
    .el-col {
        border-radius: 4px;
    }
    .bg-purple-dark {
        background: #99a9bf;
    }
    .bg-purple {
        background: #d3dce6;
    }
    .bg-purple-light {
        background: #e5e9f2;
    }
    .grid-content {
        border-radius: 4px;
        min-height: 36px;
    }
    .row-bg {
        padding: 10px 0;
        background-color: #f9fafc;
    }
    .checkboxGroup {
        width: 100%;
    }
    .switchButtons {
        height: 40px;
        line-height: 40px;
    }
}
</style>
