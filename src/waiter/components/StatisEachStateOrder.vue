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

    .pagination-wrap {
        position: absolute;
        bottom: 15px;
        right: 4%;
        margin-top: 10px;
    }


    .order-line-three-row {
        position: absolute;
        left: 10px;
        right: 10px;
        top: 110px;
        bottom: 50px;
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

  <el-form ref="form" :model="formData" label-width="70px" :inline="true">
    <fieldset class="order-field-set">
      <legend>功能选择</legend>
      <el-form-item class="oreder-form-item" label="时间选择">
        <el-date-picker class="order-time-select" v-model="formData.selectedDates" type="daterange" align="right" size="mini" unlink-panels range-separator="T" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions2" value-format="yyyy-MM-dd">
        </el-date-picker>
      </el-form-item>

      <el-form-item label="门店选择">
        <el-select class="select-options" v-model="formData.storeId" @change="changeForState" size="mini">
          <el-option v-for="item in formData.stateOptions" :key="item.value" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="支付方式">
        <el-select class="select-options" v-model="formData.payValue" @change="changeForState" size="mini">
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
    <el-table class="cel-scrollable-table" :data="tableData"  border style="width: 100%">

        <el-table-column label="订单 ID" prop="number">
        </el-table-column>
        <el-table-column label="店铺"  prop="storeName">
        </el-table-column>
        <el-table-column label="客户电话"  prop="customer.mobile">
        </el-table-column>
        <el-table-column label="消费日期" prop="displayCreatedAt">
        </el-table-column>
        <el-table-column label="消费金额" prop="total">
        </el-table-column>
        <el-table-column label="订单状态" prop="groupState">
        </el-table-column>
        <el-table-column label="支付信息" >
          <template slot-scope="scope">
            <el-tag v-for="item in scope.row.payments"  :key="item.id" size="mini">
              {{ item.description }}
            </el-tag>
          </template>

        </el-table-column>
        <el-table-column label="操作员" prop="creatorName" width="90">
        </el-table-column>

    </el-table>
  </div>
  <!-- 订单统计表   END -->

  <!-- 统计数据  START -->
  <div class="stati-sdata-order">
    <h4 style="display: inline-block;">记录数:</h4>
    <h4 class="recordnum">{{totalCount}}</h4>
  </div>
  <div class="stati-sdata-ordermoney">
    <h4 style="display: inline-block;">合计充值金额:</h4>
    <h4 class="recordnum">{{totalSum}}</h4>
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
import moment from 'moment'
import {
  findOrders, getOrderCount
} from '@/api/getData'

export default {
  data() {
    return {
      //*********** 过滤条件 ***************/
      formData:{
        selectedDates: [], // [ "2018-06-04", "2018-06-14" ]
        storeId: null,
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
      totalCount: 0, //统计数据之记录数
      totalSum: 0 //统计数据之充值金额合计
    };
  },
  mounted() {
    let start = moment().subtract(6,"days")
    let end = moment()
    this.formData.selectedDates = [ start.toDate(), end.toDate() ]
    this.formData.storeId = this.stateOptions[0].value
    this.initData()
  },
  computed:{
    computedStartAt: function(){
      return this.formData.selectedDates[0]
    },
    computedEndAt: function(){
      return this.formData.selectedDates[1]
    }
  },
  methods: {
    async initData() {
      //this.formData.selectedDates =this.selectedDates
      let params = this.buildParams()
      getOrderCount( params ).then((res)=>{
        this.totalCount = res.total_count
        this.totalSum = res.total_sum
      })
      await this.getPaymentMethods()
      let result = await findOrders( params )
      this.totalPage = result.total_count
      this.tableData = this.buildOrders( result )
      this.addPaymentDescription()
      console.log( "result=", result, "this.tableData = ", this.tableData )
    },
    buildParams(){
        let params = { //查询条件
          page: this.currentPage, //分页器选择的当前页数
          per_page: this.perPage, //每页显示12行数据
          q: {
            created_at_gteq: this.computedStartAt,
            created_at_lteq: this.computedEndAt,
            order_type_eq: 0
          }
        }
        return params
    },
    //門店選擇改變時的事件處理函數-----
    changeForState() {

    },
    addPaymentDescription(){
      this.tableData.forEach((order)=>{
        order.payments.forEach((payment)=>{
          //7000五折卡(#0001)支付 ¥500
          //微信 支付 ¥100
          let method = this.paymentMethods.find( item=>{ return item.id == payment.paymentMethodId})
          if( payment.paymentMethodId == this.prepaidPaymentMethodId){
            let card = order.customer.cards.find( card=>{
              return card.id == payment.sourceId
            })
            payment.description = card.name + '('+card.code+')' +' 支付 ¥' + payment.amount
          }else{
            payment.description = method.name +' 支付 ¥' + payment.amount
          }
        })
      })
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
