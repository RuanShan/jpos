<style lang="scss">
.statistics-container {
  .title-wrap {
    padding: 6px;
    text-align: center;
  }
  .filters {
    padding: 16px;
    .el-form-item {
      margin: 0;
    }
  }
  .tab-list-wrap {
    position: absolute;
    top: 55px;
    left: 18px;
    right: 18px;
    bottom: 100px;
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
  .grid-content {
    min-height: 30px;
  }

  .bg-purple {
    background: #d3dce6;
  }

  .bg-purple-light {
    background: #e5e9f2;
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
          <statis-pandect ></statis-pandect>
        </el-tab-pane>

        <el-tab-pane label="会员充值统计">
          <statis-each-state-member></statis-each-state-member>
        </el-tab-pane>

        <el-tab-pane label="订单统计">
          <statis-each-state-order></statis-each-state-order>
        </el-tab-pane>

        <el-tab-pane label="工厂统计">
        </el-tab-pane>

        <el-tab-pane label="会员情况统计">
          <statis-member-case> </statis-member-case>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import DaySale from '@/components/statis/DaySale.vue'
import StatisPandect from '../components/StatisPandect.vue';
import StatisEachStateMember from '../components/StatisEachStateMember.vue';
import StatisEachStateOrder from '../components/StatisEachStateOrder.vue';
import StatisMemberCase from '../components/StatisMemberCase.vue';

export default {
  components: {
    "day-sale": DaySale,
    "statis-pandect": StatisPandect,
    "statis-each-state-member": StatisEachStateMember,
    "statis-each-state-order": StatisEachStateOrder,
    "statis-member-case": StatisMemberCase,
  },
  data() {
    return {
      //*********** UI需要的变量 ***************/
      statisPandectVisible: false, //统计总览组件显示标志位
      statisEachStateMemberVisible: false, //各个门店会员统计组件显示标志位
      statisEachStateOrderVisible: false,  //各个门店订单统计组件显示标志位
      theDialogVisible: true, //窗口显示标志位
      tabsNumber: 0, //每次点击别的tab是tabsNumber动态变化
      // stateValue: "", //門店選項
      // payValue: "", //支付方式选项
      eachStoreMemberDateSection: "", //选择的日期时间
      totalPage: 0, //分页器显示的总页数
      perPage: 12, //主表每页显示12行
      currentPage: 1, //根据分页器的选择,提交SerVer数据,表示当前是第几页

      //*********** 逻辑需要的变量 ***************/
      returnServerCustomerData: {}, //调用接口,返回的数据
      customerData: {}, //整理過的顧客數據


      // stateOptions: [{ //门店方式选项
      //   value: '全部',
      // }],
      // payOptions: [{ //支付方式选项
      //   value: '现金',
      // }, {
      //   value: '微信',
      // }, {
      //   value: '支付宝',
      // }, {
      //   value: '银行卡',
      // },
      // {
      //   value: '未付',
      // }
      // ],
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
      tableData: [{
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-04',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1517 弄'
      },
      {
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1519 弄'
      },
      {
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1519 弄'
      },
      {
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1519 弄'
      },
      {
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1519 弄'
      },
      {
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1519 弄'
      },
      {
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1519 弄'
      },
      {
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1519 弄'
      },
      {
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1519 弄'
      },
      {
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1519 弄'
      },
      {
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1516 弄'
      }
      ]
    };
  },
  mounted() {
    // this.stateValue = this.stateOptions[0].value;
    this.statisPandectVisible = true;
  },
  methods: {
    //点击标签的事件处理函数-----
    tabHandleClick(tab, event) {
      console.log(this.tabsNumber);
      // switch (this.tabsNumber) {
      //   case "0":
      //     this.statisPandectVisible = true;
      //     console.log("============0   了,请注意!!!!");
      //     break;
      //   case "1":
      //     this.statisEachStateMemberVisible = true;
      //     console.log("============1   了,请注意!!!!");
      //     break;
      //   case "2":
      //     this.statisEachStateOrderVisible = true;
      //     console.log("============2   了,请注意!!!!");
      //     break;
      //   case "3":
      //     this.statisEachStateOrderVisible = true;
      //     console.log("============3   了,请注意!!!!");
      //     break;
      //   default:
      //     this.statisPandectVisible = false;
      //     this.statisEachStateMemberVisible = false;
      //     this.statisEachStateOrderVisible = false;
      //     console.log("default");

      // }
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
