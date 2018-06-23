<style lang="scss">
.statis-member-case {
  .member-field-set {
    position: absolute;
    left: 10px;
    right: 10px;
    top: 5px;
  }
  .member-form-item {
    margin-bottom: 0;
  }
  .select-options {
    width: 120px;
  }
  .member-time-select {
    width: 230px;
  }
  .member-clear {
    position: absolute;
    top: -4px;
    right: 4px;
  }
  .order-ok {
    position: absolute;
    top: 29px;
    right: 4px;
  }
  .member-line-three-row {
    position: absolute;
    left: 10px;
    right: 10px;
    top: 108px;
    bottom: 60px;
  }
  .statisdatarecordnum {
    display: inline-block;
    position: absolute;
    bottom: 20px;
    border: solid 1px #939393;
    .recordnum {
      color: red;
      display: inline-block;
    }
  }
  .statisdatarechargemoney {
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
  <div class="statis-member-case">
    <el-form ref="form" :model="form" label-width="70px" :inline="true">
      <fieldset class="member-field-set">
        <legend>功能选择</legend>
        <el-form-item class="member-form-item" label="时间选择">
          <el-date-picker class="member-time-select" v-model="form.memberCaseDateSection" type="daterange" align="right" size="mini" unlink-panels range-separator="T" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions2" value-format="yyyy-MM-dd">
          </el-date-picker>
        </el-form-item>

        <el-form-item label="门店选择">
          <el-select class="select-options" v-model="form.stateValue" @change="changeForState" size="mini">
            <el-option v-for="item in stateOptions" :key="item.value" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <el-button class="member-clear" type="info" size="mini">清空</el-button>
        <el-button class="order-ok" type="primary" size="mini">确定</el-button>
      </fieldset>
    </el-form>

    <!-- 会员统计表   START -->
    <div class="member-line-three-row ">
      <el-table class="cel-scrollable-table" :data="tableData" border style="width: 100%">
        <el-table-column prop="name" label="会员卡号" width="90">
        </el-table-column>
        <el-table-column prop="name" label="加入时间" width="90">
        </el-table-column>
        <el-table-column prop="name" label="会员姓名" width="90">
        </el-table-column>
        <el-table-column prop="name" label="性别" width="90">
        </el-table-column>
        <el-table-column prop="name" label="会员卡类型">
        </el-table-column>
        <el-table-column prop="name" label="会员卡等级">
        </el-table-column>
        <el-table-column prop="name" label="卡内余额">
        </el-table-column>
        <el-table-column prop="name" label="累计消费" width="90">
        </el-table-column>
        <el-table-column prop="name" label="电话">
        </el-table-column>
      </el-table>
    </div>

    <!-- 统计数据  START -->
    <div class="statisdatarecordnum">
      <h4 style="display: inline-block;">记录数:</h4>
      <h4 class="recordnum">{{recordNumber}}</h4>
    </div>
    <div class="statisdatarechargemoney">
      <h4 style="display: inline-block;">合计充值金额:</h4>
      <h4 class="recordnum">{{rechargeMoneySum}}</h4>
    </div>
    <!-- 统计数据  END -->

    <!-- 会员统计表   END -->
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
        memberCaseDateSection: "", //选择的日期时间
        stateValue: "", //門店選項
      },
      stateOptions: [{ //门店方式选项
        value: '全部',
      }],
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
