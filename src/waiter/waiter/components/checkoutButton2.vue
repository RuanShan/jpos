<template>
  <div class="checkout-container">
    <div class="check-button" @click="openTheWindow()"> 收款 ：&nbsp;￥&nbsp;{{totalMoney}} </div>
    <el-dialog :visible.sync="dialogVisible" :show-close="false" :fullscreen="true">
      <div slot="title" class="dialog-title-wrap">
        <div class="left back"> <i class="el-icon-back" @click="closeWindow()"></i> </div>
        <div> 结算</div>
      </div>
      <!-- <div class='main-part'> -->
      <!-- <el-row :gutter="20">
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
                  <el-input v-for="item in paymentList" :key="item.id" :label="item.name" :value="item.id" placeholder="请输入内容" v-model="inputSum" class="input-with-select money">
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
                  <el-button>现金</el-button>
                </td>
              </tr>
            </table>

            <div class="">
              <el-button>组合支付</el-button>
            </div>
          </div>
        </el-col>
      </el-row> -->
      <!-- </div> -->

      <el-row>
        <el-col :span="12" :offset="6">
          <div class="grid-content bg-purple">
            <el-row>
              <el-col :span="4">
                <div class="grid-content bg-purple" style="margin: 0 auto;">
                  <span style="display: flex;justify-content: center;align-items: center;">总额</span>
                </div>
              </el-col>
              <el-col :span="16">
                <div class="grid-content bg-purple-light">
                  <el-input v-model="totalMoney" placeholder="订单总价" class="money" :disabled="true"></el-input>
                </div>
              </el-col>
              <el-col :span="4">
                <div class="">
                </div>
              </el-col>
            </el-row>
          </div>
          <div class="grid-content bg-purple">
            <el-row>
              <el-col :span="4">
                <div class="grid-content bg-purple">
                  <span style="display: flex;justify-content: center;align-items: center;">支付</span>
                </div>
              </el-col>
              <el-col :span="6">
                <div class="grid-content bg-purple-light">
                  <div class="switchButtons">
                    <el-switch v-model="inputsSwitch.XianJin" active-text="现金" @change="switchChange('XianJin')"></el-switch>
                  </div>
                  <div class="switchButtons">
                    <el-switch v-model="inputsSwitch.NianKa" active-text="会员年卡" @change="switchChange('NianKa')"></el-switch>
                  </div>
                  <div class="switchButtons">
                    <el-switch v-model="inputsSwitch.CiShuka" active-text="会员次卡" @change="switchChange('CiShuka')"></el-switch>
                  </div>
                  <div class="switchButtons">
                    <el-switch v-model="inputsSwitch.WeiXin" active-text="微信" @change="switchChange('WeiXin')"></el-switch>
                  </div>
                  <div class="switchButtons">
                    <el-switch v-model="inputsSwitch.ZhiFuBao" active-text="支付宝" @change="switchChange('ZhiFuBao')"></el-switch>
                  </div>
                  <div class="switchButtons">
                    <el-switch v-model="inputsSwitch.YinHangKa" active-text="银行卡" @change="switchChange('YinHangKa')"></el-switch>
                  </div>

                </div>
              </el-col>
              <el-col :span="10">
                <el-input placeholder="请选中后,输入金额" v-model="moneyInputs.XianJin" :disabled="inputsVisible.XianJin" ref="inputXianJin" @focus="inputsGetFocus('XianJin')"></el-input>
                <el-input placeholder="请选中后,输入金额" v-model="moneyInputs.NianKa" :disabled="inputsVisible.NianKa" ref="inputNianKa" @focus="inputsGetFocus('NianKa')"></el-input>
                <el-input placeholder="请选中后,输入金额" v-model="moneyInputs.CiShuka" :disabled="inputsVisible. CiShuka" @focus="inputsGetFocus('CiShuka')"></el-input>
                <el-input placeholder="请选中后,输入金额" v-model="moneyInputs.WeiXin" :disabled="inputsVisible.WeiXin" @focus="inputsGetFocus('WeiXin')"></el-input>
                <el-input placeholder="请选中后,输入金额" v-model="moneyInputs.ZhiFuBao" :disabled="inputsVisible.ZhiFuBao" @focus="inputsGetFocus('ZhiFuBao')"></el-input>
                <el-input placeholder="请选中后,输入金额" v-model="moneyInputs.YinHangKa" :disabled="inputsVisible.YinHangKa" @focus="inputsGetFocus('YinHangKa')"></el-input>
              </el-col>
              <el-col :span="4">

              </el-col>
            </el-row>
          </div>
          <div class="grid-content bg-purple">
            <el-row>
              <el-col :span="4">
                <div class="grid-content bg-purple" style="margin: 0 auto;">
                  <span style="display: flex;justify-content: center;align-items: center;">收到的现金</span>
                </div>
              </el-col>
              <el-col :span="8">
                <div class="grid-content bg-purple-light">
                  <el-input v-model="XianJinInputNum" placeholder="输入收到的现金数" class="money" @focus="XianJinGetFocus()"></el-input>
                </div>
              </el-col>
              <el-col :span="8">
                <div class="grid-content bg-purple-light">
                  <el-input v-model="giveChange" placeholder="应该找的零钱" class="money" :disabled="true"></el-input>
                </div>
              </el-col>
              <el-col :span="4">
              </el-col>
            </el-row>
          </div>
        </el-col>
      </el-row>

      <checkout-keyboard ref="keyboard" @checkoutInputSum="checkoutInputSum($event)" @giveChangeOnFun="giveChangeOnFun($event)" @pressKeyC="pressKeyC($event)"></checkout-keyboard>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="confirmButton()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import CheckOutKeyborad from "@/components/CheckOutKeyborad.vue";
import { baseImgPath } from "@/config/env";
import { mapState } from "vuex";

export default {
  props: ["storeName", "orderList", "totalMoney","customerData"],
  components: {
    "checkout-keyboard": CheckOutKeyborad
  },

  data() {
    return {
      //微信,支付宝
      //支付方式
      paymentMethodList: [
        { id: 1, type: "cash", name: "现金" },
        { id: 2, type: "prepaidCard", name: "打折卡" },
        { id: 3, type: "onceCard", name: "年卡" }
      ],
      paymentList: [{ type: "cash", amount: 0 }],
      // checkoutData: { total: 0},
      dialogVisible: false,
      baseImgPath,
      selectPaymentMethod: 1,
      inputSum: "", //收到现金数
      giveChange: "", //找零钱
      payments: [], //支付被方式选择数字,返回已经被选择的lable,如""现金","微信"等
      inputsVisible: {
        //对应的输入框是否可以输入的对象
        XianJin: true, //真就是不允许
        NianKa: true,
        CiShuka: true,
        WeiXin: true,
        ZhiFuBao: true,
        YinHangKa: true
      },
      moneyInputs: {
        //各个输入框输入的金额
        XianJin: "",
        NianKa: "",
        CiShuka: "",
        WeiXin: "",
        ZhiFuBao: "",
        YinHangKa: ""
      },
      flagInput: {
        //得到数字软键盘输入数字的flag
        XianJin: false,
        NianKa: false,
        CiShuka: false,
        WeiXin: false,
        ZhiFuBao: false,
        YinHangKa: false
      },
      inputsSwitch: {
        //输入框开关
        XianJin: false,
        NianKa: false,
        CiShuka: false,
        WeiXin: false,
        ZhiFuBao: false,
        YinHangKa: false
      },
      fromParentOrderList: {}, //父组件传来的orderList{}
      XianJinInputNum: "", //现金输入数字
      XianJinInputFlag: false //现金输入框是否输入标志位
    };
  },
  computed: {
    ...mapState(["userInfo", "latitude", "longitude", "cartList"]),
    // 订单总价
    totalPrice: function() {
      let total = 0;
      for (let i in this.orderList) {
        total += this.orderList[i].price;
      }
      return total;
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
      let payment = { type: paymentMethodType, amount: 0 };
      if (paymentMethodType == "cash") {
        payment.amount = this.orderChange;
      }
      this.paymentList.push(payment);
    },
    closeWindow( ) {
      this.paymentList = [];
      this.dialogVisible = false;
      this.SUM = 0;
    },
    //CheckOutKeybord 子组件发射的函数,得到顾客给的钱数
    checkoutInputSum(money) {
      this.inputSum = money;
    },
    //CheckOutKeybord 子组件发射的函数,计算出来找零钱的金额
    giveChangeOnFun() {
      let temp;
      // console.log("确认 按下了,传过来得了*****@@@@");
      temp = this.inputSum - this.totalMoney; //
      this.giveChange = temp.toFixed(2);
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
    //开关组改变事件函数-----
    switchChange(parameter) {
      //判断哪一个开关,打开了
      if (this.inputsSwitch[parameter] == true) {
        this.clearFlageInputs(); //清除flagInputs
        this.inputsVisible[parameter] = false;
        this.flagInput[parameter] = true;
        this.inputSum = "";
        this.$refs.keyboard.money = "";
        if (this.flagInput.XianJin == true) {
          this.moneyInputs.XianJin = this.totalMoney;
        }
      }
      //判断哪一个开关,关闭了
      if (this.inputsSwitch[parameter] == false) {
        //关状态时-----1.关闭现金收入允许;2.把旗收回
        this.inputsVisible[parameter] = true;
        this.flagInput[parameter] = false;
        this.moneyInputs[parameter] = "";
        this.inputSum = "";
        this.$refs.keyboard.money = "";
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
      let SUM = 0;
      for (let key in this.moneyInputs) {
        SUM += Number(this.moneyInputs[key]);
      }
      SUM = parseFloat(SUM);
      if (SUM != parseFloat(this.totalMoney)) {
        this.$alert("商品总额与各个支付方式总数不符,请重新输入", "总数不对", {
          confirmButtonText: "确定",
          callback: action => {
            this.$message({
              type: "info",
              message: `action: ${action}`
            });
          }
        });
      } else {
        //总数相等,提交SerVer
        if (
          this.inputsSwitch.XianJin == true &&
          this.moneyInputs.XianJin == ""
        ) {
          this.messageBox("请核对输入是否正确", "输入缺项");
        }
        if (this.inputsSwitch.NianKa == true && this.moneyInputs.NianKa == "") {
          this.messageBox("请核对输入是否正确", "输入缺项");
        }
        if (
          this.inputsSwitch.CiShuka == true &&
          this.moneyInputs.CiShuka == ""
        ) {
          this.messageBox("请核对输入是否正确", "输入缺项");
        }
        if (this.inputsSwitch.WeiXin == true && this.moneyInputs.WeiXin == "") {
          this.messageBox("请核对输入是否正确", "输入缺项");
        }
        if (
          this.inputsSwitch.ZhiFuBao == true &&
          this.moneyInputs.ZhiFuBao == ""
        ) {
          this.messageBox("请核对输入是否正确", "输入缺项");
        }
        if (
          this.inputsSwitch.YinHangKa == true &&
          this.moneyInputs.YinHangKa == ""
        ) {
          this.messageBox("请核对输入是否正确", "输入缺项");
        }
        this.dialogVisible = false;

        const h = this.$createElement;
        this.$notify({
          title: "订单提交SerVer",
          message: h(
            "i",
            { style: "color: teal" },
            "这是虚拟的,假设的,实验用的,非真实的.请注意!!!!!"
          )
        });
      }
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
    inputSum: function() {
      if (this.flagInput.XianJin) {
        this.moneyInputs.XianJin = this.inputSum;
      }
      if (this.flagInput.NianKa) {
        this.moneyInputs.NianKa = this.inputSum;
      }
      if (this.flagInput.CiShuka) {
        this.moneyInputs.CiShuka = this.inputSum;
      }
      if (this.flagInput.WeiXin) {
        this.moneyInputs.WeiXin = this.inputSum;
      }
      if (this.flagInput.ZhiFuBao) {
        this.moneyInputs.ZhiFuBao = this.inputSum;
      }
      if (this.flagInput.YinHangKa) {
        this.moneyInputs.YinHangKa = this.inputSum;
      }
      if (this.XianJinInputFlag) {
        this.XianJinInputNum = this.inputSum;
      }
    }
  }
};
</script>
<style lang="scss" >
.checkout-form {
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
    .dialog-title-wrap{
      line-height: 80px;
      font-size: 36px;
      text-align: center;
      color: #ffffff;
      .back{
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
