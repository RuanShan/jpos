<style lang="scss">
.statis-worker {
    .select-options {
        width: 120px;
    }
    .expense-time-select {
        width: 230px;
    }

    .order-ok {

    }
    .expense-line-three-row {
        position: absolute;
        left: 10px;
        right: 10px;
        top: 100px;
        bottom: 55px;
    }

    .statisdatarechargemoney {
        display: inline-block;
        position: absolute;
        bottom: 20px;
        left: 20px;
        line-height: 28px;
        font-size: 14px;
        .recordnum {
            color: red;
            display: inline-block;
        }
    }
    .pagiantion-wrap{
      position: absolute;
      bottom:20px;
      right:20px;
    }
}
</style>

<template>
<div class="statis-worker">
  <el-form ref="form" :model="formData"  :inline="true">
    <fieldset class="expense-field-set filters">
      <legend>查询条件</legend>
      <el-form-item class="expense-form-item" label="创建日期">
        <el-date-picker class="expense-time-select" v-model="formData.selectedDates" type="daterange" align="right" size="mini" unlink-panels range-separator="~" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions2" value-format="yyyy-MM-dd">
        </el-date-picker>
      </el-form-item>

      <el-form-item>
        <el-button class="order-ok" type="primary" size="mini" @click="handleSearch">确定</el-button>
      </el-form-item>
    </fieldset>
  </el-form>

  <!-- 会员统计表   START -->
  <div class="expense-line-three-row ">
    <el-table class="cel-scrollable-table" :data="tableData"  border>
      <el-table-column prop="id" label="ID" width="80">
      </el-table-column>
      <el-table-column prop="storeName" label="所属门店" width="150">
      </el-table-column>
      <el-table-column prop="displayCreatedAt" label="订单日期" width="140">
      </el-table-column>
      <el-table-column prop="cname" label="工作内容" >
      </el-table-column>
      <el-table-column prop="memo" label="备注">
      </el-table-column>
      <el-table-column prop="displayState" label="工作状态" width="120">
      </el-table-column>
      <el-table-column prop="workerName" label="工人" width="120">
      </el-table-column>
      <el-table-column prop="displayWorkAt" label="验收时间" width="120">
      </el-table-column>
    </el-table>

  </div>

  <!-- 统计数据  START -->

  <!-- 统计数据  END -->

  <!-- 会员统计表   END -->
  <!-- 分页器 START-->
  <div class="pagiantion-wrap" style="">
    <el-pagination @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-size="12" layout="total, prev, pager, next" :total="totalPage">
    </el-pagination>
  </div>
  <!-- 分页器 END-->
</div>
</template>

<script>
import moment from 'moment'
import {
  findLineItems
} from '@/api/getData'

export default {
  data() {
    return {
      //*********** 过滤条件 ***************/
      formData: {
        selectedDates: [], // [ "2018-06-04", "2018-06-14" ]
        storeId: null,
      },
      //*********** UI需要的变量 ***************/

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
      tableData: [  ],
      //*********** 逻辑需要的变量 ***************/
      returnServerCustomerData: {}, //调用接口,返回的数据
      customerData: {}, //整理過的顧客數據
      recordNumber: "0", //统计数据之记录数
      rechargeMoneySum: "0" //统计数据之充值金额合计
    };
  },
  mounted() {
    let start = moment().subtract(6, "days")
    let end = moment()
    this.formData.selectedDates = [start.toDate(), end.toDate()]
    this.formData.storeId = this.storeId
    this.initData()
  },
  computed: {
    computedStartAt: function() {
      return this.formData.selectedDates ? this.formData.selectedDates[0] : null
    },
    computedEndAt: function() {
      return this.formData.selectedDates ? this.formData.selectedDates[1] : null
    }
  },
  methods: {
    async initData() {
      let params = this.buildParams()
      let result = await findLineItems(params)

      this.totalPage = result.total_count
      this.tableData = this.buildLineItems(result)
      console.log("result=", result, "this.tableData = ", this.tableData)
    },
    buildParams() {
      let params = { //查询条件
        page: this.currentPage, //分页器选择的当前页数
        per_page: this.perPage, //每页显示12行数据
        q: {
          line_item_group_state_in: ['processing', 'processed', 'ready_for_store']
        }
      }
      if(!this.isLocationFactory()){
        //如果不是工厂，添加当前店铺作为查询条件
        params.q.store_id_eq = this.formData.storeId
      }

      if ( this.computedStartAt && this.computedEndAt){
        params.q.created_at_gteq= this.computedStartAt
        params.q.created_at_lteq= this.computedEndAt
      }
      return params
    },
    //門店選擇改變時的事件處理函數-----
    changeForState() {

    },
    //分页器的改变选择时事件处理函数
    handleCurrentChange(val) {
      this.currentPage = val;
      this.initData()
    },
    handleSearch(){
      this.currentPage = 1;
      this.initData()
    }
  }
};
</script>
