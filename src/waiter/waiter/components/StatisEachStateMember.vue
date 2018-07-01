<style lang="scss">
.statis-each-member {
  .member-field-set {
    position: absolute;
    left: 10px;
    right: 10px;
    top: 5px;
  }
  .member-form-item {
    margin-bottom: 0;
  }
  .member-time-select {
    width: 230px;
  }
  .select-options {
    width: 120px;
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
  <div class="statis-each-member">
    <el-form ref="form" :model="formData" label-width="70px" :inline="true">
      <fieldset class="member-field-set">
        <legend>功能选择</legend>
        <el-form-item class="member-form-item" label="时间选择">
          <el-date-picker class="member-time-select" v-model="formData.selectedDates" type="daterange" align="right" size="mini" unlink-panels range-separator="~" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions2" value-format="yyyy-MM-dd">
          </el-date-picker>
        </el-form-item>

        <el-form-item label="门店选择">
          <el-select class="select-options" v-model="formData.storeId" @change="changeForState" size="mini">
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
        <el-table-column prop="cardTransaction.card.code" label="会员卡号" width="120">

        </el-table-column>
        <el-table-column prop="cardTransaction.customer.username" label="会员姓名" width="90">
        </el-table-column>
        <el-table-column prop="cardTransaction.card.displayStyle" label="卡类型" width="90">
        </el-table-column>
        <el-table-column prop="cardTransaction.card.name" label="会员卡等级">

        </el-table-column>
        <el-table-column prop="cardTransaction.displayCreatedAt" label="缴费日期">
        </el-table-column>
        <el-table-column prop="cardTransaction.amount" label="充值金额" width="90">
        </el-table-column>
        <el-table-column prop="creatorName" label="操作员" width="90">
        </el-table-column>
        <el-table-column prop="cardTransaction.displayIsFirst" label="是否新增" width="90">
        </el-table-column>
        <el-table-column prop="cardTransaction.card.memo" label="备注" width="90">
        </el-table-column>
      </el-table>
    </div>

    <!-- 统计数据  START -->
    <div class="statisdatarecordnum">
      <h4 style="display: inline-block;">记录数:</h4>
      <h4 class="recordnum">{{totalCount}}</h4>
    </div>
    <div class="statisdatarechargemoney">
      <h4 style="display: inline-block;">合计充值金额:</h4>
      <h4 class="recordnum">{{totalSum}}</h4>
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
import moment from 'moment'
import {
  findOrders, getOrderCount
} from '@/api/getData'

export default {
  data() {
    return {
      //*********** 过滤条件 ***************/
      formData: {
        selectedDates: [], // [ "2018-06-04", "2018-06-14" ]
        storeId: null
      },
      selectedDates: "", //选择的日期时间

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
      tableData: [],
      //*********** 逻辑需要的变量 ***************/
      returnServerCustomerData: {}, //调用接口,返回的数据
      customerData: {}, //整理過的顧客數據
      totalCount: 0,  //统计数据之记录数
      totalSum: 0 //统计数据之充值金额合计

    };
  },
  created() {
    let stores = this.stores.map((item) => { return { id: item.id, name: item.name } })
    this.storeOptions = [{ id: null, name: "全部" }].concat(stores)
    let start = moment().subtract(6, "days")
    let end = moment()
    this.selectedDates = [start.toDate(), end.toDate()]
    this.initData()
    this.$bus.$on('deposit-order-created-gevent', () => {
      this.initData()
    })

  },
  computed: {
    computedStartAt: function () {
      return this.formData.selectedDates[0]
    },
    computedEndAt: function () {
      return this.formData.selectedDates[1]
    }
  },
  methods: {
    async initData() {
      this.formData.selectedDates = this.selectedDates
      let params = this.buildParams()
      getOrderCount(params).then((res) => {
        this.totalCount = res.total_count
        this.totalSum = res.total_sum
      })
      let result = await findOrders(params)

      this.totalPage = result.total_count
      this.tableData = this.buildOrders(result)
      console.log("result=", result, "this.tableData = ", this.tableData)
    },
    buildParams() {
      let params = { //查询条件
        page: this.currentPage, //分页器选择的当前页数
        per_page: this.perPage, //每页显示12行数据
        q: {
          order_type_eq: 1
        }
      }
      return params
    },
    //門店選擇改變時的事件處理函數-----
    changeForState() {

    },
    //分页器的改变选择时事件处理函数
    handleCurrentChange(val) {
      this.currentPage = val
      this.initData()
    },
  }
};
</script>
