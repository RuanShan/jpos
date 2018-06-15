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
        left: 15px;
        bottom: 0;
        right: 15px;
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
  .zonglang-one-row {
    position: absolute;
    left: 10px;
    right: 10px;
    top: 10px;
    .main-left {
      width: 60%;
      float: left;
    }
    .main-right {
      width: 40%;
      float: right;
    }
  }
  .tubiao-ont-row {
    position: absolute;
    left: 10px;
    right: 10px;
    top: 50px;
    .tubiao {
      height: 200px;
      background: red;
      // float: left;
    }
  }
}
</style>

<template>
  <div class="statistics-container page-content">
    <div>
      <div class="title-wrap">
        <div>统&nbsp;&nbsp;&nbsp;计</div>
      </div>
    </div>
    <div class="tab-list-wrap grid-content bg-purple-light">
      <el-tabs class="tabs-height" type="border-card" v-model="tabsNumber" @tab-click="tabHandleClick">
        <el-tab-pane label="总览">
          <!-- <el-row type="flex" class="row-bg" justify="center">
            <el-col :span="14">
              <div class="grid-content bg-purple">asdfasdfasdf</div>
            </el-col>
            <el-col :span="7">
              <div class="grid-content bg-purple-light">asdfasdfasdf</div>
            </el-col>
          </el-row> -->

          <div class="zonglang-one-row">
            <div class="main-left">
              <!-- 时间选择 START-->
              <fieldset>
                <legend>时间选择</legend>
                <el-button type="primary" size="mini">7天</el-button>
                <el-button type="primary" size="mini">当月</el-button>
                <el-button type="primary" size="mini">当季度</el-button>
                <el-button type="primary" size="mini">当半年度</el-button>
                <el-button type="primary" size="mini">当年度</el-button>
              </fieldset>
              <!-- 时间选择 END-->
            </div>
            <div class="main-right">
              <!-- 門店選擇 START-->
              <fieldset>
                <legend>门店选择</legend>
                <el-select v-model="stateValue" @change="changeForState" size="mini" style="width:100%;">
                  <el-option v-for="item in stateOptions" :key="item.value" :value="item.value">
                  </el-option>
                </el-select>
              </fieldset>
              <!-- 时间选择 END-->
            </div>
          </div>

          <div class="tubiao-ont-row">
            <div class="tubiao">圖</div>
          </div>

        </el-tab-pane>
        <el-tab-pane label="各个门店会员统计">各个门店会员统计</el-tab-pane>
        <el-tab-pane label="各个门店订单统计">各个门店订单统计</el-tab-pane>
        <el-tab-pane label="工厂统计">工厂统计</el-tab-pane>
        <el-tab-pane label="会员情况统计">会员情况统计</el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import MemberExpenseCalendar from "@/components/MemberExpenseCalendar.vue";
import MemberRechargeRecord from "@/components/MemberRechargeRecord.vue";
import MemberCenterNew from "@/components/MemberCenterNew.vue";
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
      returnServerCustomerData: {}, //调用接口,返回的数据
      customerData: {}, //整理過的顧客數據
      theDialogVisible: true, //窗口显示标志位
      tabsNumber: 0,  //每次点击别的tab是tabsNumber动态变化
      stateValue: "",  //門店選項
      stateOptions: [{ //支付方式选项
        value: '全部',
      }],

    };
  },
  mounted() {
    this.stateValue = this.stateOptions[0].value;
  },
  methods: {

    //点击标签的事件处理函数-----
    tabHandleClick(tab, event) {
      console.log(this.tabsNumber);
    },
    //門店選擇改變時的事件處理函數-----
    changeForState() {

    }
  }
};
</script>
