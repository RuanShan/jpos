<style lang="scss">
.statistics-container {
  fieldset{
    border: 1px solid #ebeef5;
    margin: 0;
    legend{
      color:#909399;
    }
  }
  .title-wrap {
    display: none;
    line-height: 42px;
    background-color: #cecece;
    padding: 6px;
    text-align: center;
  }
  .filters {
    position: absolute;
     left: 10px;
     right: 10px;
     top: 15px;
    .el-form-item {
      margin: 0;
    }
  }
  .tab-list-wrap {
    position: absolute;
    top: 18px;
    left: 18px;
    right: 18px;
    bottom: 18px;
    .tabs-height {
      height: 100%;
      .el-tabs__content {
        position: absolute;
        top: 40px;
        left: 10px;
        bottom: 0;
        right: 10px;
      }
    }
  }

  .pagination-wrap {
    position: absolute;
    bottom: 15px;
    right: 4%;
    margin-top: 10px;
  }
  .line-one-row {
    position: absolute;
    left: 10px;
    right: 10px;
    top: 10px;
    .main-left {
      width: 70%;
      float: left;
      .time-select-left {
        width: 50%;
        float: left;
      }
      .time-select-right {
        width: 50%;
        float: right;
        .date-picker {
          width: 100%;
        }
      }
    }
    .main-right {
      width: 30%;
      float: right;
    }
  }
  .line-two-row {
    position: absolute;
    left: 10px;
    right: 10px;
    top: 80px;
  }
  .line-three-row {
    position: absolute;
    left: 10px;
    right: 10px;
    top: 150px;
  }
  .tubiao-ont-row {
    position: absolute;
    left: 10px;
    right: 10px;
    top: 90px;
    bottom: 10px;
    .tubiao {
    }
  }
}
</style>

<template>
  <div>
    <headTop></headTop>
    <leftNav></leftNav>

    <div class="statistics-container page-content">
      <!-- <member-expense-calendar :dialog-visible.sync="memberExpCalWindowVisible" :customer-data="customerData"></member-expense-calendar> -->
      <div>
        <div class="title-wrap">
          <div>统&nbsp;&nbsp;&nbsp;计</div>
        </div>
      </div>
      <div class="tab-list-wrap grid-content bg-purple-light">
        <el-tabs class="tabs-height" type="border-card" v-model="tabsNumber" @tab-click="tabHandleClick">

          <el-tab-pane label="总览">
            <statis-pandect></statis-pandect>
          </el-tab-pane>
          <el-tab-pane label="会员充值统计">
            <statis-each-state-member v-if="cardTabVisible" ></statis-each-state-member>
          </el-tab-pane>
          <el-tab-pane label="订单统计">
            <statis-each-state-order  v-if="orderTabVisible" ></statis-each-state-order>
          </el-tab-pane>
          <el-tab-pane label="费用统计">
            <StatisExpense  v-if="expenseTabVisible" ></StatisExpense>
          </el-tab-pane>
          <el-tab-pane label="工厂统计">
            <StatisWorker  v-if="workerTabVisible" ></StatisWorker>
          </el-tab-pane>
          <el-tab-pane label="会员情况统计">
            <statis-member-case  v-if="memberTabVisible"  > </statis-member-case>
          </el-tab-pane>
          <el-tab-pane label="库存统计">
            <StatisStockItems  ></StatisStockItems>
          </el-tab-pane>
          <el-tab-pane label="员工打卡统计">
            <statis-staff-clock-in  ></statis-staff-clock-in>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script>
import leftNav from "@/components/layout/LeftNav.vue"
import headTop from "@/components/layout/headTop.vue";

import DaySale from '@/components/statis/DaySale.vue'
import StatisPandect from './StatisPandect.vue';
import StatisEachStateMember from './StatisEachStateMember.vue';
import StatisEachStateOrder from './StatisEachStateOrder.vue';
import StatisMemberCase from './StatisMemberCase.vue';
import StatisStaffClockIn from './StatisStaffClockIn.vue';
import StatisExpense from './StatisExpense.vue';
import StatisWorker from './StatisWorker.vue';
import StatisStockItems from './StatisStockItems.vue';

export default {
  components: {
    leftNav,
    headTop,
    "day-sale": DaySale,
    "statis-pandect": StatisPandect,
    "statis-each-state-member": StatisEachStateMember,
    "statis-each-state-order": StatisEachStateOrder,
    "statis-member-case": StatisMemberCase,
    "statis-staff-clock-in": StatisStaffClockIn,
    StatisExpense,
    StatisWorker,
    StatisStockItems
  },
  data() {
    return {
      //*********** UI需要的变量 ***************/
      statisPandectVisible: false, //统计总览组件显示标志位
      memberTabVisible: false, //各个门店会员统计组件显示标志位
      orderTabVisible: false,  //各个门店订单统计组件显示标志位
      cardTabVisible: true, //窗口显示标志位
      expenseTabVisible: false,
      workerTabVisible: false,
      tabsNumber: '0', //字符串，从0开始，标签页的顺序值
      // stateValue: "", //門店選項
      // payValue: "", //支付方式选项
      totalPage: 0, //分页器显示的总页数
      perPage: 12, //主表每页显示12行
      currentPage: 1, //根据分页器的选择,提交SerVer数据,表示当前是第几页
    }
  },
  mounted() {
    // this.stateValue = this.stateOptions[0].value;
    this.statisPandectVisible = true;
  },
  methods: {
    //点击标签的事件处理函数-----
    tabHandleClick(tab, event) {
      switch (this.tabsNumber) {
        case "1":
          this.cardTabVisible = true;
          break;
        case "2":
          this.orderTabVisible = true;
          break;
        case "3":
          this.expenseTabVisible = true;
          break;
        case "4":
          this.workerTabVisible = true;
          break;
        case "5":
          this.memberTabVisible = true;
          break;
        default:
          console.log("default");
      }
    },
    //門店選擇改變時的事件處理函數-----
    changeForState() {

    },
    //分页器的改变选择时事件处理函数
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.currentPage = val;
      console.log(this.currentPage);
    },
  }
};
</script>
