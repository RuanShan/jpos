<template>
 <div>
   <el-row >
      <div class="grid-content bg-purple-light">
        <el-dialog  title="充值中心"  :visible.sync="dialogVisible" :close-on-press-escape="false" 
            :fullscreen="true" center style="font-size: 36px;color: #115df5; !important">
            <el-row >
              <el-col :span="12">
                <div>
                  <number-keyboard v-on:rechargeSum="rechargeSum"></number-keyboard>
                </div>
              </el-col>
              <el-col :span="12"><div></div></el-col>
            </el-row>

              <el-row style="margin-top:50px;">
                <el-col :span="4">
                  <div class="grid-content bg-purple-light">
                    <el-button type="info"  style="width:100%">取消</el-button>
                  </div>
                </el-col>
                <el-col :span="4"><div class="grid-content bg-purple-light"></div></el-col>
                <el-col :span="4"><div class="grid-content bg-purple"></div></el-col>
                <el-col :span="4"><div class="grid-content bg-purple-light"></div></el-col>
                <el-col :span="4"><div class="grid-content bg-purple"></div></el-col>
                <el-col :span="4">
                  <div class="grid-content bg-purple-light">
                    <el-button type="danger" @click="save()" style="width:100%;height:80px"><h2>保存</h2></el-button>
                  </div>
                </el-col>
              </el-row>
        </el-dialog> <!-- 会员中心窗口 -> END -->
      </div>
  </el-row>
  <!-- 会员中心窗口 -> START -->

  <!-- <member-edit></member-edit> -->

 </div>
</template>



<script>
import NumbersKeyborad from "@/components/NumbersKeyborad.vue";

export default {
  props: ["memberCenterData"], //来自会员中心的会员数据
  components: {
    "number-keyboard": NumbersKeyborad
  },
  data() {
    return {
      dialogVisible: true, //窗口显示标志位
      memberRechargeData: {}, //充值中心的会员数据
      rechargemoney: "", //充值金额
      temp: 0 //临时变量,保存原有会员余额和来自数字键盘数据之和
    };
  },
  mounted() {
    this.memberRechargeData = this.memberCenterData; //会员中心的数据赋值给充值中心
    console.log(
      "会员的原有余额 :" + this.memberRechargeData.memberCardRemaining
    );
  },
  methods: {
    //接收到数字键盘输入的数字
    rechargeSum(money) {
      this.temp = Number(money);
      this.temp += Number(this.memberRechargeData.memberCardRemaining);
      // console.log("temp = " + this.temp);
      // console.log("会员的原有余额 :" + this.memberRechargeData.memberCardRemaining);
      // console.log("装换字符串 : " + (this.temp).toString() );
      // console.log("  ");
    },
    //保存按钮事件处理
    save() {
      this.dialogVisible = false;
      this.memberRechargeData.memberCardRemaining = this.temp.toString(); //来自数字键盘组件的充值数据加上会员原有的余额数据,再付给会员余额
      this.$emit("saveRechargeButton", this.memberRechargeData); //出给父组件接口
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
/* el-table.warning-row {
    background-color: oldlace  !important;
  }
el-table-column .warning-row {
    background-color: oldlace  !important;
  } */
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
