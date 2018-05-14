<template>
  <div>
    <el-row>
      <el-col :span="24">
        <div class="grid-content bg-purple-light" style="margin-top: 20px;">
          <!-- <div class='input-box'>{{ money }}</div> -->
          <el-row :gutter="20">
            <el-col :span="12" :offset="6">
              <div>

                <div class="num">
                  <div>
                    <button data-num='1' @click.stop='_handleKeyPress'>1 </button>
                  </div>
                </div>
                <div class="num">
                  <div>
                    <button data-num='2' @click.stop='_handleKeyPress'>2 </button>
                  </div>
                </div>
                <div class="num">
                  <div>
                    <button data-num='3' @click.stop='_handleKeyPress'>3 </button>
                  </div>
                </div>
                <div class="num">
                  <div>
                    <button data-num='50' @click.stop='_handleKeyPress'>50 </button>
                  </div>
                </div>
                <div class="num">
                  <div>
                    <button data-num='C' @click.stop='pressKeyC()'>C </button>
                    <!-- <button data-num='D' @click.stop='_handleKeyPress'>backspace </button> -->
                  </div>
                </div>
                <div class="num" style="float: right; height: 10em;">
                  <div>
                    <button class="place-order" @click.stop="confirm()">现金找零 </button>
                  </div>
                </div>
                <div class="num">
                  <div>
                    <button data-num='4' @click.stop='_handleKeyPress'>4 </button>
                  </div>
                </div>
                <div class="num">
                  <div>
                    <button data-num='5' @click.stop='_handleKeyPress'>5 </button>
                  </div>
                </div>
                <div class="num">
                  <div>
                    <button data-num='6' @click.stop='_handleKeyPress'>6 </button>
                  </div>
                </div>
                <div class="num">
                  <div>
                    <button data-num='100' @click.stop='_handleKeyPress'>100 </button>
                  </div>
                </div>

                <div class="num">
                  <div>
                    <button data-num='7' @click.stop='_handleKeyPress'>7 </button>
                  </div>
                </div>
                <div class="num">
                  <div>
                    <button data-num='8' @click.stop='_handleKeyPress'>8 </button>
                  </div>
                </div>
                <div class="num">
                  <div>
                    <button data-num='9' @click.stop='_handleKeyPress'>9 </button>
                  </div>
                </div>
                <div class="num">
                  <div>
                    <button data-num='200' @click.stop='_handleKeyPress'>200 </button>
                  </div>
                </div>
                <div class="num">
                  <div>
                    <button data-num='00' @click.stop='_handleKeyPress'>00 </button>
                    <!-- <button data-num='C' @click.stop='pressKeyC()'>C </button> -->
                  </div>
                </div>
                <div class="num">
                  <div>
                    <button data-num='0' @click.stop='_handleKeyPress'>0 </button>
                  </div>
                </div>
                <div class="num">
                  <div>
                    <button data-num='.' @click.stop='_handleKeyPress'>. </button>
                  </div>
                </div>
                <div class="num">
                  <div>
                    <button data-num='300' @click.stop='_handleKeyPress'>300 </button>
                  </div>
                </div>
              </div>
            </el-col>
          </el-row>

        </div>
      </el-col>
    </el-row>
  </div>

</template>

<script>
export default {
  data() {
    return {
      money: ""
    };
  },
  //监控money数据变化,每变化一次执行
  watch: {
    money: function(checkoutInputSum, money) {
      this.$emit("checkoutInputSum", this.money); //出给父组件接口
      // console.log(this.money);
    }
  },
  methods: {
    //处理按键
    _handleKeyPress(e) {
      let num = e.target.dataset.num;
      // console.log(num);

      //不同按键处理逻辑
      // -1 代表无效按键，直接返回
      if (num == -1) return false;

      switch (String(num)) {
        //小数点
        case ".":
          this._handleDecimalPoint();
          break;
        //删除键
        case "D":
          this._handleDeleteKey();
          break;
        //清空键
        case "C":
          this._handleClearKey();
          break;
        //确认键
        case "S":
          this._handleConfirmKey();
          break;
        default:
          this._handleNumberKey(num);
          break;
      }
    },
    //处理小数点函数
    _handleDecimalPoint() {
      //如果包含小数点，直接返回
      if (this.money.indexOf(".") > -1) return false;
      //如果小数点是第一位，补0
      if (!this.money.length) this.money = "0.";
      else
        //如果不是，添加一个小数点
        this.money = this.money + ".";
    },
    //处理删除键
    _handleDeleteKey() {
      let S = this.money;
      //如果没有输入，直接返回
      if (!S.length) return false;
      //否则删除最后一个
      this.money = S.substring(0, S.length - 1);
    },
    //处理清空键
    _handleClearKey() {
      this.money = "";
      this.$emit("pressKeyC");
    },
    //处理数字
    _handleNumberKey(num) {
      let S = this.money;

      //如果有小数点且小数点位数不小于2
      if (S.indexOf(".") > -1 && S.substring(S.indexOf(".") + 1).length < 2)
        this.money = S + num;

      //没有小数点
      if (!(S.indexOf(".") > -1)) {
        //如果第一位是0，只能输入小数点
        if (num == 0 && S.length == 0) this.money = "0.";
        else {
          if (S.length && Number(S.charAt(0)) === 0) return;
          this.money = S + num;
        }
      }
      // console.log(this.money);
    },
    //提交
    _handleConfirmKey() {
      let S = this.money;
      //未输入
      if (!S.length) {
        alert("您目前未输入!");
        return false;
      }

      //将 8. 这种转换成 8.00
      if (S.indexOf(".") > -1 && S.indexOf(".") == S.length - 1)
        S = Number(S.substring(0, S.length - 1)).toFixed(2);
      //保留两位
      S = Number(S).toFixed(2);
      this.$emit("confirmEvent", S);
    },
    //确认按钮事件函数,提交父组件
    confirm() {
      console.log(this.money);
      
      if (this.money !== "") {
        console.log("确认 按下了,请注意!!!");
        this.$emit("giveChangeOnFun");
      }
      else{
        this.$alert("请输入金额", "错误提示", {
            confirmButtonText: "确定"
          });
          return false;
      }
    },
    pressKeyC(){
      this.money = "";
      this.$emit("pressKeyC");
    }
  }
};
</script>

<style scoped>
.key-container {
  width: 100%;
  display: flex;
  display: -webkit-flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
}
.input-box {
  font-size: 35px;
  font-weight: bold;
  height: 40px;
  border-bottom: 1px solid #aaa;
  padding: 10px 15px;
  text-align: right;
  width: 90%;
}

.keyboard {
  bottom: 0;
  left: 0;
  height: 240px;
  width: 60%;
  border-top: 1px solid #aaa;
  border-left: 1px solid #aaa;
  border-right: 1px solid #aaa;
  border-bottom: 1px solid #aaa;
  margin-top: 20px;
}

.keyboard .key-row {
  display: flex;
  display: -webkit-flex;
  position: relative;
  height: 60px;
  line-height: 60px;
}

.keyboard .key-row::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  height: 1px;
  border-top: 1px solid #d5d5d6;
  color: #d5d5d6;
  -webkit-transform-origin: 0 0;
  transform-origin: 0 0;
  -webkit-transform: scaleY(0.5);
  transform: scaleY(0.5);
}

.keyboard .key-cell {
  flex: 1;
  -webkit-box-flex: 1;
  text-align: center;
  position: relative;
}

.keyboard .key-cell::after {
  content: "";
  position: absolute;
  overflow: hidden;
  top: 0;
  right: 0;
  bottom: 0;
  height: 200%;
  border-right: 1px solid #d5d5d6;
  color: #d5d5d6;
  -webkit-transform-origin: 0 0;
  transform-origin: 0 0;
  -webkit-transform: scaleY(0.5);
  transform: scaleY(0.5);
}

.keyboard .key-cell:nth-last-child(1)::after {
  border-right: 0;
}

.keyboard .disabled {
  background: rgba(0, 0, 0, 0.2);
}

.keyboard .key-confirm {
  position: absolute;
  text-align: center;
  height: 118px;
  width: 25%;
  line-height: 118px;
  background: #fff;
  z-index: 5;
  right: 0;
  bottom: 1px;
}
</style>