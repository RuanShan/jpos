<style>
.grid-content {
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
  <div class="add_member_container cel-window">
    <!-- 会员添加窗口 -> START -->
    <el-dialog :visible="computedVisible" :close-on-press-escape="false" :show-close="false" :top="top" :modal="false" @open="openWindow()">
      <div slot="title" class="title-wrap">
        <div class="left back">
          <i class="el-icon-back" @click="handleCloseDialog()"></i>
        </div>
        <div>会&nbsp;&nbsp;&nbsp;员&nbsp;&nbsp;&nbsp;消&nbsp;&nbsp;&nbsp;费&nbsp;&nbsp;&nbsp;记&nbsp;&nbsp;&nbsp;录</div>
      </div>
      <!-- <el-button type="primary" @click="test">主要按钮</el-button> -->
      <div>
        <el-row>
          <el-col :span="4">
            <div class="grid-content bg-purple">会员姓名</div>
          </el-col>
          <el-col :span="4">
            <div class="grid-content bg-purple-light"></div>
          </el-col>
          <el-col :span="4">
            <div class="grid-content bg-purple">会员电话</div>
          </el-col>
          <el-col :span="4">
            <div class="grid-content bg-purple-light"></div>
          </el-col>
          <el-col :span="4">
            <div class="grid-content bg-purple">会员生日</div>
          </el-col>
          <el-col :span="4">
            <div class="grid-content bg-purple-light"></div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="4">
            <div class="grid-content bg-purple">地址</div>
          </el-col>
          <el-col :span="8">
            <div class="grid-content bg-purple-light"></div>
          </el-col>
          <el-col :span="4">
            <div class="grid-content bg-purple">备注</div>
          </el-col>
          <el-col :span="8">
            <div class="grid-content bg-purple-light"></div>
          </el-col>
        </el-row>
      </div>

      <fieldset>
        <legend>时间选择</legend>
        日期区间选择
        <el-date-picker v-model="dateSection" type="daterange" align="right" unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions2" value-format="yyyy-MM-dd">
        </el-date-picker>
      </fieldset>

    </el-dialog>
  </div>
</template>


<script>
import { DialogMixin } from "@/components/mixin/DialogMixin";
import { findOrders } from "@/api/getData";


export default {
  props: ["dialogVisible", "returnServerCustomerData"],
  mixins: [DialogMixin],
  data() {
    return {
      top: "0" /* 去除直接传 0 产生的 需要参数为string的警告 */,
      memberInfo: "", //会员信息
      pickerOptions2: {
        shortcuts: [
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近半年",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 180);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一年",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 365);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      },
      dateSection: "", //选择的日期时间
      orderDataByUserId: {} //根据会议ID提交SerVer,返回的订单数据
    };
  },
  methods: {
    //根据会员ID得到该会员的所有订单
     async getOrderByUserId(data) {
      this.orderDataByUserId = await findOrders(data);
    },
    openWindow() {
      console.log("open le   !!!!!!!!!!!");
      let requestDataByUserId = {
        q: {
          number_cont: "5",
          user_id_eq: 8
        }
      };
      this.getOrderByUserId(requestDataByUserId).then(()=>{
        console.log("得到了会员得订单数据了!");
        
      });
    }
  }
};
</script>
