<style scoped>
.grid-content {
  min-height: 30px;
}

.bg-purple {
  background: #d3dce6;
}

.bg-purple-light {
  background: #e5e9f2;
}
</style>


<template>

  <div class="member-rechange-container cel-window">
    <member-expense-calendar :dialog-visible.sync="memberExpCalWindowVisible" :customer-data="customerData"></member-expense-calendar>
    <member-center-new :dialog-visible.sync="memberCenterNewWindowVisible" :customer-data="customerData"></member-center-new>
    <member-recharge-record :dialog-visible.sync="memberRechargeRecordWindowVisible" :customer-data="customerData"></member-recharge-record>
    <!-- <el-button type="danger" @click="openExpenseCalendarButton">会员消费窗口</el-button>
      <el-button type="danger" @click="openCenterNewButton">会员中心窗口</el-button>
      <el-button type="danger" @click="openRechargeRecordButton">会员充值记录窗口</el-button> -->
    <el-dialog :visible="theDialogVisible" :close-on-press-escape="false" :show-close="false" :top="top" :modal="false" @open="openWindow()">
      <div slot="title" class="title-wrap">
        <div class="left">
          <!-- <i class="el-icon-back" @click="handleCloseDialog()"></i> -->
        </div>
        <div>会&nbsp;&nbsp;&nbsp;员</div>
      </div>

      <!-- 第一行     START -->
      <el-row style="margin-top:20px">
        <el-col :span="1">
          <div class="grid-content"></div>
        </el-col>
        <el-col :span="5">
          <div class="grid-content"> 会员编号/会员电话/会员姓名</div>
        </el-col>
        <el-col :span="7">
          <div class="grid-content">
            <el-input placeholder="请输入内容" prefix-icon="el-icon-search" size="mini" v-model="inputValue">
            </el-input>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="grid-content"></div>
        </el-col>
        <el-col :span="4">
          <div class="grid-content" style="float: right;">
            <el-button type="danger" size="mini" @click="addCard">添&nbsp;&nbsp;加&nbsp;&nbsp;会&nbsp;&nbsp;员&nbsp;&nbsp;卡</el-button>
          </div>
        </el-col>
        <el-col :span="1">
          <div class="grid-content"></div>
        </el-col>
      </el-row>
      <!-- 第一行     END -->
      <!-- 表格     END -->
      <el-row style="margin-top:20px">
        <el-col :span="1">
          <div class="grid-content"></div>
        </el-col>
        <el-col :span="22">
          <div class="grid-content">
            <el-table id="recharge-recored-table" :data="tableData" style="width: 100%:" height="292" border>
              <el-table-column prop="code" label="卡号">
              </el-table-column>
              <el-table-column prop="username" label="会员姓名">
              </el-table-column>
              <el-table-column prop="mobile" label="电话">
              </el-table-column>
              <el-table-column prop="sex" label="性别">
              </el-table-column>
              <el-table-column prop="cards" label="持有卡数">
              </el-table-column>
              <el-table-column prop="memo" label="备注">
              </el-table-column>
              <el-table-column label="操作" width="150">
                <template slot-scope="scope">
                  <el-button size="mini" type="success" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                  <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-col>
        <el-col :span="1">
          <div class="grid-content"></div>
        </el-col>
      </el-row>
      <!-- 表格     END -->
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
import MemberExpenseCalendar from "@/components/MemberExpenseCalendar.vue";
import MemberRechargeRecord from "@/components/MemberRechargeRecord.vue";
import MemberCenterNew from "@/components/MemberCenterNew.vue";
import { getCustomer } from "@/api/getData";
// import { DialogMixin } from "@/components/mixin/DialogMixin";
import { apiResultMixin } from '@/components/apiResultMixin';


export default {
  mixins: [apiResultMixin],
  components: {
    "member-expense-calendar": MemberExpenseCalendar,
    "member-center-new": MemberCenterNew,
    "member-recharge-record": MemberRechargeRecord
  },
  data() {
    return {
      top: "50" /* 去除直接传 0 产生的 需要参数为string的警告 */,
      memberExpCalWindowVisible: false,
      memberCenterNewWindowVisible: false,
      memberRechargeRecordWindowVisible: false,
      returnServerCustomerData: {}, //调用接口,返回的数据
      customerData: {}, //整理過的顧客數據
      currentPage: 1, //根据分页器的选择,提交SerVer数据,表示当前是第几页
      totalPage: 0, //分页器显示的总页数
      theDialogVisible: true, //窗口显示标志位
      inputValue: "",//输入框输入的值
      tableData: [
        {
          code: "056",
          mobile: "13812340005",
          username: '刘德华',
          card_type: "储值卡",
          sex: "男",
          card_grade: "8000-5折",
          payDate: "18-05-18",
          payWay: "现金",
          payMoney: "2036",
          payState: "青云街店",
          stopDate: "22-09-05",
          operator: "张三",
          memo: "大家好",
          cards: "3"
        }
      ], //表格数据
    };
  },
  methods: {
    //获取SerVer用户数据,异步获取
    async getSverVerCustomer(Id) {
      this.returnServerCustomerData = await getCustomer(Id);
    },
    openExpenseCalendarButton() {
      // console.log("会员消费记录");
      let id = 8;
      this.getSverVerCustomer(id).then(() => {
        this.customerData = this.buildCustomerInfo(this.returnServerCustomerData);
        this.returnServerCustomerData = {};
        this.memberExpCalWindowVisible = true;  //打開會員消費記錄窗口
      });
    },
    openCenterNewButton() {
      console.log("会员中心记录");
      let id = 8;
      this.getSverVerCustomer(id).then(() => {
        this.customerData = this.buildCustomerInfo(this.returnServerCustomerData);
        this.returnServerCustomerData = {};
        this.memberCenterNewWindowVisible = true;  //打開會員中心窗口
      });
    },
    openRechargeRecordButton() {
      let id = 8;
      this.getSverVerCustomer(id).then(() => {
        this.customerData = this.buildCustomerInfo(this.returnServerCustomerData);
        this.returnServerCustomerData = {};
        this.memberRechargeRecordWindowVisible = true;
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
    //添加会员卡点击事件处理函数-----
    addCard() {

    },
    //编辑按钮处理事件
    handleEdit(index, row) {
      console.log(index, row);
      console.log("会员中心记录");
      let id = 8;
      this.getSverVerCustomer(id).then(() => {
        this.customerData = this.buildCustomerInfo(this.returnServerCustomerData);
        this.returnServerCustomerData = {};
        this.memberCenterNewWindowVisible = true;  //打開會員中心窗口
      });
    },
    //删除按钮处理事件
    handleDelete(index, row) {
      console.log(index, row);
    }
  }
};
</script>
