<template>
  <div>
    <el-row>
      <div class="grid-content bg-purple-light">
        <el-dialog title="充值中心" :visible.sync="dialogVisible" :close-on-press-escape="false" :fullscreen="true" center @close="closeWindow()" style="font-size: 36px;color: #115df5; !important">
          <el-row>
            <el-col :span="12">
              <div>
                <number-keyboard v-on:rechargeSum="rechargeSum"></number-keyboard>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="memberCardGrade">
                <el-select v-model="cardGradeResult" placeholder="请选择" @change="selectCardGrede()">
                  <el-option v-for="item in memberCardGrade" :key="item.key" :value="item.value">
                  </el-option>
                </el-select>
                <!-- <el-button type="primary" @click="test">主要按钮</el-button> -->

              </div>
            </el-col>
          </el-row>
          <el-row style="margin-top:50px;">
            <el-col :span="20">
              <el-radio-group v-model="payMode" fill="rgb(249, 11, 145)" @change="selectPayMode()">
                <el-radio-button label="现金"></el-radio-button>
                <el-radio-button label="微信"></el-radio-button>
                <el-radio-button label="支付宝"></el-radio-button>
                <el-radio-button label="银行卡"></el-radio-button>
              </el-radio-group>
            </el-col>
            <el-col :span="4">
              <div class="grid-content bg-purple-light">
                <el-button type="danger" @click="save()" style="width:100%;height:80px">
                  <h2>保存</h2>
                </el-button>
              </div>
            </el-col>
          </el-row>
        </el-dialog>
        <!-- 会员中心窗口 -> END -->
      </div>
    </el-row>
    <!-- 会员中心窗口 -> START -->
  </div>
</template>


<script>
import NumbersKeyborad from "@/components/NumbersKeyborad.vue";
import { recharge } from "@/api/getData";

export default {
  props: ["memberCenterData"], //来自会员中心的会员数据
  components: {
    "number-keyboard": NumbersKeyborad
  },
  data() {
    return {
      dialogVisible: true, //窗口显示标志位
      memberRechargeData: {}, //充值中心的会员数据
      rechargeMoney: "", //充值金额
      temp: 0, //临时变量,保存原有会员余额和来自数字键盘数据之和
      memberCardGrade: [
        {
          key: "选项1",
          value: "普通会员"
        },
        {
          key: "选项2",
          value: "银卡会员"
        },
        {
          key: "选项3",
          value: "黄卡会员"
        },
        {
          key: "选项4",
          value: "白金会员"
        }
      ],
      cardGradeResult: "", //选中的是什么会员卡的结果
      payMode: "", //支付方式的选择值
      serverReturnData: {} //提交充值数据后,服务器返回的数据
    };
  },
  mounted() {
    this.memberRechargeData = this.memberCenterData; //会员中心的数据赋值给充值中心
    console.log(
      "会员的原有余额 :" + this.memberRechargeData.memberCardRemaining
    );
    this.$emit("myLog", "888");
  },
  methods: {
    //接收到数字键盘输入的数字
    rechargeSum(money) {
      this.rechargeMoney = money;
      this.temp = Number(money);
      this.temp += Number(this.memberRechargeData.memberCardRemaining);
      // console.log("temp = " + this.temp);
      // console.log("会员的原有余额 :" + this.memberRechargeData.memberCardRemaining);
      // console.log("装换字符串 : " + (this.temp).toString() );
      // console.log("  ");
    },
    //提交服务器执行的异步操作
    async customerRecharge() {
      this.serverReturnData = await recharge(this.memberRechargeData);
    },
    //保存按钮事件处理
    save() {
      //如果选项不全,弹提示窗
      if (
        this.payMode == "" ||
        this.cardGradeResult == "" ||
        this.rechargeMoney == ""
      ) {
        this.$alert("请选择支付方式和会员卡种类和充值金额!!!", "错误提示", {
          confirmButtonText: "确定"
        });
        return false;
      } else {
        //主要是提交服务器
        this.memberRechargeData.memberCardRemaining = this.temp.toString(); //来自数字键盘组件的充值数据加上会员原有的余额数据,再付给会员余额
        //提交服务器后,等待SerVer响应后处理
        this.customerRecharge().then(() => {
          //判断返回的数据,Id不为空且不等于undefined时,提交Id数据给父组件
          if (
            this.serverReturnData.Id != "" &&
            typeof this.serverReturnData.Id != "undefined"
          ) {
            this.dialogVisible = false; //关闭当前窗口
            this.$emit("saveRechargeButton", this.memberRechargeData.Id);

            console.log("充值返回的会员ID... = " + this.serverReturnData.Id);
          } else {
            //弹出提示
            this.$alert("提交服务器失败,请联系管理员!!!", "错误提示", {
              confirmButtonText: "确定"
            });
            return false;
          }
        });
      }
    },
    //选中会员卡等级后处理方法
    selectCardGrede() {
      // console.log(this.cardGradeResult);
      this.memberRechargeData.memberCardGrade = this.cardGradeResult;
    },
    //选中支付方式时处理函数
    selectPayMode() {
      console.log(this.payMode);
    },
    //点击关闭按钮时事件处理方法
    closeWindow() {
      console.log("我关闭了!!!");
      this.$parent.memberRechargeWindow = false; //调用父组件的数据
      // this.$emit("saveRechargeButton", this.memberRechargeData.Id);
    }
  }
};
</script>

<style scoped>
.center {
  text-align: center;
}

.el-form.MCenter-el-form {
  padding: 0 10%;
}

.memberCardGrade {
  text-align: center;
  margin: 50px 50px;
}

el-table__row {
  background-color: oldlace !important;
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
</style>
