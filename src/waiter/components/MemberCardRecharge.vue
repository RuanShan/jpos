<style scoped>
.grid-content {
  min-height: 30px;
}

#basic .grid-content {
  min-height: 30px;
  border: 1px solid #b6dafe;
}
.bg-purple {
  background: #d3dce6;
}
.bg-purple-light {
  background: #e5e9f2;
}
</style>

<template>
  <div class="">
    <el-dialog title="会     员     卡     充     值" :visible.sync="displayOnOff" width="50%" center :close-on-click-modal="false" @close="closeTheWindows">
      <hr style="margin: -5px 15px;">
      <el-row>
        <el-col :span="1">
          <div class="grid-content "></div>
        </el-col>
        <el-col :span="22">
          <div class="grid-content ">
            <fieldset style="margin-top:10px">
              <legend>会员信息</legend>
              <table class="currenttable" cellspacing="0" width="100%" style="border: 1px solid #b7b7b7;border-width: 0 0 0 0;">
                <tr>
                  <td style="width: 20%;">会员卡号</td>
                  <td style="width: 30%">{{cardData.code}}</td>
                  <td style="width: 20%;color:#ff3cff;">卡内余额</td>
                  <td style="width: 30%;color:#ff00ff;font-weight:bold;">{{cardData.amountRemaining}}</td>
                </tr>
                <tr>
                  <td>会员卡类型</td>
                  <td>{{cardData.displayStyle}}</td>
                  <td>会员卡级别</td>
                  <td>{{cardData.name}}</td>
                </tr>
                <tr>
                  <td style="border-width: 0 0 0 0;">会员姓名</td>
                  <td style="border-width: 0 0 0 0;">{{customerData.name}}</td>
                  <td style="border-width: 0 0 0 0;">会员电话</td>
                  <td style="border-width: 0 0 0 0;">{{customerData.mobile}}</td>
                </tr>
              </table>
            </fieldset>
            <!-- 付款方式     START -->
            <el-row style="margin-top:10px;">
              <el-col :span="6">
                <div class="grid-content " style="padding:8px 0;">
                  付款方式:
                </div>
              </el-col>
              <el-col :span="18">
                <div class="grid-content ">
                  <el-radio-group v-model="radio" size="" fill="#ff00ff" @change="changeRechargeWay">
                    <el-radio-button label="现金"></el-radio-button>
                    <el-radio-button label="微信"></el-radio-button>
                    <el-radio-button label="支付宝"></el-radio-button>
                    <el-radio-button label="银行卡"></el-radio-button>
                  </el-radio-group>
                </div>
              </el-col>
            </el-row>
            <!-- 付款方式     END -->
            <!-- 充值金额     START -->
            <el-row style="margin-top:5px;">
              <el-col :span="6">
                <div class="grid-content " style=" padding:8px 0;">
                  充值金额:
                </div>
              </el-col>
              <el-col :span="7">
                <div class="grid-content ">
                  <el-input v-model="inputMoney" placeholder="请输入内容"></el-input>
                </div>
              </el-col>
              <el-col :span="1">
                <div class="grid-content " style="padding:8px 0;">
                  元
                </div>
              </el-col>
              <el-col :span="2">
                <div class="grid-content ">
                </div>
              </el-col>
              <el-col :span="5">
                <div class="grid-content " style="padding:8px 0;">
                  充值后余额:
                </div>
              </el-col>
              <el-col :span="2">
                <div class="grid-content " style="padding:8px 0;color:#ff00ff;font-weight:bold;">
                  {{newCurrentValue}}
                </div>
              </el-col>
            </el-row>
            <!-- 充值金额     END -->
            <!-- 备注     START -->
            <el-row style="margin-top:5px;">
              <el-col :span="6">
                <div class="grid-content " style="padding:8px 0;">
                  备注:
                </div>
              </el-col>
              <el-col :span="18">
                <div class="grid-content ">
                  <el-input v-model="inputMemo" placeholder="请输入内容"></el-input>
                </div>
              </el-col>
            </el-row>
            <!-- 备注     END -->

            <el-row style="margin-top:20px;">
              <!-- 打印     START -->
              <el-col :span="6">
                <div class="grid-content">
                  <el-checkbox v-model="checkedPrint" @change="changePrint">打印</el-checkbox>
                </div>
              </el-col>
              <!-- 打印     END -->
              <el-col :span="4">
                <div class="grid-content"></div>
              </el-col>
              <el-col :span="6">
                <div class="grid-content">
                  <el-button type="info" style="width:100%" @click="quitTheWindow">退出</el-button>
                </div>
              </el-col>
              <el-col :span="2">
                <div class="grid-content"></div>
              </el-col>
              <el-col :span="6">
                <div class="grid-content">
                  <el-button type="danger" @click="checkout" style="width:100%">确定</el-button>
                </div>
              </el-col>
            </el-row>
          </div>
        </el-col>
        <el-col :span="1">
          <div class="grid-content "></div>
        </el-col>
      </el-row>

    </el-dialog>
  </div>
</template>


<script>
import { checkout } from "@/api/getData";

export default {
  props: ["memberCardRechargeWindowVisible", "cardData", "customerData"],
  // mixins: [apiResultMixin],
  data() {
    return {
      top: "0", /* 去除直接传 0 产生的 需要参数为string的警告 */
      displayOnOff: "", //显示标志位
      radio: '现金', //支付方式单选按钮默认选择,会根据用户选择动态变化
      inputMoney: null,  //输入充值金额
      newCurrentValue: "",//输入后得余额
      inputMemo: "",//备注输入框
      checkedPrint: true,//是否打印标志位
    };
  },
  computed:{
    customerData: function(){
      return this.cardData.customer
    }
  },
  watch:{
    inputMoney: function (newValue) {
      this.newCurrentValue = parseInt(this.cardData.amountRemaining) + parseInt(this.inputMoney);
      if (this.inputMoney == "") {
        this.newCurrentValue = "";
      }
    }
  },
  methods: {
    //打开窗口时事件处理函数-----
    openWindow() {
      this.displayOnOff = this.memberCardRechargeWindowVisible;
    },
    //关闭窗口时事件处理函数-----
    closeTheWindows() {
      this.displayOnOff = false;
      this.$emit("onOff", false); //传给父组件自己被关闭的消息
      // console.log("子组件点击了关闭按钮!!!");
    },
    //改变打印选择状态时触发函数-----
    changePrint(){
      console.log(this.checkedPrint);
    },
    //改变支付方式触发函数-----
    changeRechargeWay(){
      console.log(this.radio);
    },
    //单价退出按钮时触发的函数-----
    quitTheWindow(){
      this.displayOnOff = false;
      this.$emit("onOff", false); //传给父组件自己被关闭的消息
    },
    async checkout(){
      const orderParams = {
        user_id: this.customerData.id,
        line_items: [
          { variant_id: this.cardData.variantId, quantity: 1,  card_id: this.cardData.id, price: this.inputMoney, cname: "会员卡充值" }
        ]
      }
      let result = await checkout( { order: orderParams })
      console.log( "memberchard recharge checkout result=", result )
      if( result.id ){
        this.$message({
          type: "success",
          message: "充值成功！"
        });

      }
    }
  }
};
</script>
