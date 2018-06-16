<style scoped>
.customer-wrap{
  padding: 18px 0;
}
.grid-content {
  padding: 18px;
}
.scrollable-table{
  position: absolute;
  top: 200px;
  bottom: 100px;
  left: 18px;
  right: 18px;
  background-color: purple;
}
.search{
  padding: 0 0 18px 0;
}
.search .part{
  float: left;
  width: 50%;
}
.fieldsethtight {
  height: 50px;
}
</style>

<template>
<div class="member-rechange-container cel-window">
  <!-- 会员添加窗口 -> START -->
  <el-dialog :visible="computedVisible" :close-on-press-escape="false" :show-close="false" :top="top" :modal="false" @open="openWindow()">
    <div slot="title" class="title-wrap">
      <div class="left back">
        <i class="el-icon-back" @click="handleCloseDialog()"></i>
      </div>
      <div>会&nbsp;&nbsp;&nbsp;员&nbsp;&nbsp;&nbsp;充&nbsp;&nbsp;&nbsp;值&nbsp;&nbsp;&nbsp;记&nbsp;&nbsp;&nbsp;录</div>
    </div>
    <div class="grid-content ">
      <!-- <el-button type="danger" @click="test()">主要按钮</el-button> -->
      <div class="customer-wrap">
        <customer-profile :customer-data="customerData"> </customer-profile>
      </div>

      <div class="search clear">
        <div class="part">
           <!-- 时间选择 START-->
           <fieldset class="fieldsethtight">
             <legend>时间选择</legend>
             日期区间
             <el-date-picker v-model="dateSection" type="daterange" align="right" size="mini" unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions2" value-format="yyyy-MM-dd">
             </el-date-picker>
           </fieldset>
           <!-- 时间选择 END-->
         </div>

         <div class="part">
           <!-- 卡选择 START-->
           <fieldset class="fieldsethtight">
             <legend>卡选择</legend>
               <!-- 支付方式 START-->
                   <el-select v-model="payValue" placeholder="支付方式选择" @change="changeForPay" size="mini">
                     <el-option v-for="item in payOptions" :key="item.value" :value="item.value">
                     </el-option>
                   </el-select>
               <!-- 支付方式 END-->
               <!-- 卡号选择 START-->
                   <el-select v-model="cardCode" placeholder="会员卡号选择" @change="changeForCard" size="mini">
                     <el-option v-for="item in cardsOptions" :key="item.value" :value="item.value">
                     </el-option>
                   </el-select>
           </fieldset>
           <!-- 卡选择 END-->
         </div>
       </div>

      <!-- 充值记录表格 START   -->
      <div class="scrollable-table">
        <el-table class="cel-scrollable-table" :data="tableData"  border>
        <el-table-column prop="card.code" label="卡号" width="150">
        </el-table-column>
        <el-table-column prop="userName" label="会员姓名" width="100">
        </el-table-column>
        <el-table-column prop="card.displayStyle" label="会员类型" width="100">
        </el-table-column>
        <el-table-column prop="card.name" label="会员等级" width="100">
        </el-table-column>
        <el-table-column prop="displayCreatedAt" label="缴费日期" width="100">
        </el-table-column>
        <el-table-column prop="total" label="充值金额" width="100">
        </el-table-column>
        <el-table-column prop="storeName" label="充值店铺" width="100">
        </el-table-column>
        <el-table-column prop="card.displayExpireAt" label="到期时间" width="100">
        </el-table-column>
        <el-table-column prop="creatorName" label="操作员" width="80">
        </el-table-column>
        <el-table-column prop="memo" label="备注">
        </el-table-column>
        </el-table>
      </div>
      <!-- 充值记录表格 END-->
    </div>
    <!-- 分页器 START-->
    <div class="" style="position: absolute;bottom: 15px;right:4%;margin-top: 10px;">
      <el-pagination @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-size="12" layout="total, prev, pager, next, jumper" :total="totalPage">
      </el-pagination>
    </div>
    <!-- 分页器 END-->
  </el-dialog>
</div>
</template>


<script>
import {
  DialogMixin
} from "@/components/mixin/DialogMixin";
import {
  apiResultMixin
} from '@/components/apiResultMixin';

import {
  findOrders
} from "@/api/getData"

import customerProfile from "@/components/common/customerProfile.vue"

export default {
  props: ["dialogVisible", "customerData"],
  mixins: [DialogMixin, apiResultMixin],
  components: {
    "customer-profile": customerProfile
  },
  data() {
    return {
      top: "0" /* 去除直接传 0 产生的 需要参数为string的警告 */ ,
      tableData: [],
      pickerOptions2: {
        shortcuts: [{
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
      payOptions: [{ //支付方式选项
        value: '现金',
      }, {
        value: '微信',
      }, {
        value: '支付宝',
      }, {
        value: '银行卡',
      }],
      payValue: '', //支付方式选择结果
      cardsOptions: [], //卡号选项
      cardCode: "", //当前顾客卡号选择结果
      dateSection: "", //选择的日期时间
      orderDatasByUserId: {}, //根据会议ID提交SerVer,返回的订单数据
      orderDataByNumber: {}, //根据订单号number提交SerVer,返回对应的订单数据
      expenseTableData: [], //主表格数据
      expendRow: [], //UI需要
      totalPage: 0, //分页器显示的总页数
      perPage: 12, //主表每页显示12行
      currentPage: 1, //根据分页器的选择,提交SerVer数据,表示当前是第几页
      getOrderDataById: {}, //某行展开后提交SerVer后得到的数据,这样做是为了把已经从SerVer得到的数据保存起来,下次不用再次提交SerVer,减少SerVer交互
    };
  },
  methods: {
    //打开窗口时事件处理函数-----根据分页器,显示第一页数据
    openWindow() {
      this.customerData.cards
      for (let value of this.customerData.cards) {
        let codes = new Object();
        codes.value = value.code;
        console.log("value.code = ", value.code);
        console.log("codes.value = ", codes.value);
        this.cardsOptions.push(codes);
      }
      let queryParams = { //查询条件
        page: this.currentPage, //分页器选择的当前页数
        per_page: 12, //每页显示12行数据
        q: {
          order_type: 1,
          user_id_eq: this.customerData.id //根据顾客的id
        }
      };
      findOrders(queryParams).then((result) => {
        const orders = this.buildOrders(result)
        this.totalCount = result.total_count; //得到当前共计多少页
        //充值订单，设置每个订单对应的会员卡
        orders.forEach((order)=>{
          order.lineItems.forEach((item)=>{
            let card = this.customerData.cards.find((card)=>{
              return card.id == item.cardId
            })
            item.card = card
            order.card = card //对于充值订单，只有一个子订单，所有card是唯一
          })
        })
        this.tableData = orders

        console.log("得到了充值订单数据了!");
      });

    },
    //分页器的改变选择时事件处理函数
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.currentPage = val;
      console.log(this.currentPage);
      let requestDataByUserId = { //查询条件
        "page": this.currentPage, //分页器选择的当前页数
        "per_page": 12, //每页显示12行数据
        "q": {
          "user_id_eq": this.customerData.id //根据顾客的id
        }
      };
      this.getOrdersByUserId(requestDataByUserId).then(() => {
        this.expenseTableData = this.buildOrders(this.orderDatasByUserId);
        console.log("得到了会员得订单数据了!");
      });
    },
    //支付方式选择器事件函数-----
    changeForPay() {
      console.log(this.payValue);
    },
    //卡号选择器事件函数-----
    changeForCard() {
      console.log(this.cardCode);
    },
    expandChange(row, expandedRows) {}
  }
};
</script>
