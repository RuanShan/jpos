<style lang="scss">
.statistics-container {
  .order-time-select {
    width: 230px;
  }
  .select-options {
    width: 120px;
  }
  .order-field-set {
    position: absolute;
    left: 10px;
    right: 10px;
    top: 5px;
  }
  .order-clear {
    position: absolute;
    top: -4px;
    right: 4px;
  }
  .order-ok {
    position: absolute;
    top: 29px;
    right: 4px;
  }
  .oreder-form-item {
    margin-bottom: 0;
  }
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
  .order-line-one-row {
    position: absolute;
    left: 10px;
    right: 10px;
    top: 10px;
    .main-left {
      // width: 70%;
      float: left;
      .time-select-left {
        // width: 50%;
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
    .form-item {
      margin-bottom: 0;
    }
  }
  .order-line-three-row {
    position: absolute;
    left: 10px;
    right: 10px;
    top: 110px;
    bottom: 50px;
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
  .stati-sdata-order {
    display: inline-block;
    position: absolute;
    bottom: 20px;
    border: solid 1px #939393;
    .recordnum {
      color: red;
      display: inline-block;
    }
  }
  .stati-sdata-ordermoney {
    display: inline-block;
    position: absolute;
    bottom: 20px;
    left: 200px;
    border: solid 1px #939393;
    .recordnum {
      color: red;
      display: inline-block;
    }
  }
}
</style>

<template>
  <div class="">
    <!-- <div class="order-line-one-row">
      <div class="main-left">
        <fieldset>
          <legend>时间选择</legend>
          <div class="time-select-left">
            <el-date-picker class="date-picker" v-model="eachStoreMemberDateSection" type="daterange" align="right" size="mini" unlink-panels range-separator="T" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions2" value-format="yyyy-MM-dd">
            </el-date-picker>
          </div>
          <div class="time-select-right">ffv
            
          </div>
        </fieldset>
      </div>
      <div class="main-left">
        <fieldset>
          <legend>门店选择</legend>
          <el-select v-model="stateValue" @change="changeForState" size="mini" style="width:100%;">
            <el-option v-for="item in stateOptions" :key="item.value" :value="item.value">
            </el-option>
          </el-select>
        </fieldset>
      </div>
    </div>
    <div class="line-two-row">
      <fieldset>
        <legend>功能选择</legend>
        <el-form>
          <el-form-item class="form-item" label="支付方式选择">
          <el-select v-model="payValue" @change="changeForState" size="mini">
            <el-option v-for="item in payOptions" :key="item.value" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        </el-form>
      </fieldset>
    </div> -->

    <el-form ref="form" :model="form" label-width="70px" :inline="true">
      <fieldset class="order-field-set">
        <legend>功能选择</legend>
        <el-form-item class="oreder-form-item" label="时间选择">
          <el-date-picker class="order-time-select" v-model="form.eachStoreMemberDateSection" type="daterange" align="right" size="mini" unlink-panels range-separator="T" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions2" value-format="yyyy-MM-dd">
          </el-date-picker>
        </el-form-item>

        <el-form-item label="门店选择">
          <el-select class="select-options" v-model="form.stateValue" @change="changeForState" size="mini">
            <el-option v-for="item in stateOptions" :key="item.value" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="支付方式">
          <el-select class="select-options" v-model="form.payValue" @change="changeForState" size="mini">
            <el-option v-for="item in payOptions" :key="item.value" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-button class="order-clear" type="info" size="mini">清空</el-button>
        <el-button class="order-ok" type="primary" size="mini">确定</el-button>
      </fieldset>
    </el-form>

    <!-- 订单统计表   START -->
    <div class="order-line-three-row">
      <el-table class="cel-scrollable-table" :data="tableData" border style="width: 100%">
        <el-table-column prop="name" label="会员卡号" width="90">
        </el-table-column>
        <el-table-column prop="name" label="会员姓名" width="90">
        </el-table-column>
        <el-table-column prop="name" label="卡类型" width="80">
        </el-table-column>
        <el-table-column prop="name" label="卡等级">
        </el-table-column>
        <el-table-column prop="name" label="消费日期">
        </el-table-column>
        <el-table-column prop="name" label="消费金额">
        </el-table-column>
        <el-table-column prop="name" label="支付方式" width="90">
        </el-table-column>
        <el-table-column prop="name" label="其他店卡" width="90">
        </el-table-column>
        <el-table-column prop="name" label="操作员" width="90">
        </el-table-column>
        <el-table-column prop="name" label="备注" width="90">
        </el-table-column>
      </el-table>
    </div>
    <!-- 订单统计表   END -->

    <!-- 统计数据  START -->
    <div class="stati-sdata-order">
      <h4 style="display: inline-block;">记录数:</h4>
      <h4 class="recordnum">{{recordNumber}}</h4>
    </div>
    <div class="stati-sdata-ordermoney">
      <h4 style="display: inline-block;">合计充值金额:</h4>
      <h4 class="recordnum">{{rechargeMoneySum}}</h4>
    </div>
    <!-- 统计数据  END -->

    <!-- 分页器 START-->
    <div class="" style="position: absolute;bottom:2px;right:4%;margin-top: 10px;">
      <el-pagination @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-size="12" layout="total, prev, pager, next, jumper" :total="totalPage">
      </el-pagination>
    </div>
    <!-- 分页器 END-->
  </div>
</template>

<script>
export default {
  data() {
    return {
      //*********** UI需要的变量 ***************/
      form: {
        eachStoreMemberDateSection: "", //选择的日期时间
        stateValue: "", //門店選項
        payValue: "", //支付方式选项
      },
      stateOptions: [{ //门店方式选项
        value: '全部',
      }],
      payOptions: [{ //支付方式选项
        value: '现金',
      }, {
        value: '微信',
      }, {
        value: '支付宝',
      }, {
        value: '银行卡',
      },
      {
        value: '未付',
      }
      ],
      totalPage: 0, //分页器显示的总页数
      perPage: 12, //主表每页显示12行
      currentPage: 1, //根据分页器的选择,提交SerVer数据,表示当前是第几页
      pickerOptions2: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          }
        }]
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
      ],
      //*********** 逻辑需要的变量 ***************/
      returnServerCustomerData: {}, //调用接口,返回的数据
      customerData: {}, //整理過的顧客數據
      recordNumber: "xxxx",  //统计数据之记录数
      rechargeMoneySum: "xxxx" //统计数据之充值金额合计
    };
  },
  mounted() {
    this.stateValue = this.stateOptions[0].value;
  },
  methods: {
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
