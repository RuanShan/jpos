<style lang="scss">
.statis-each-orders {

  .oreder-form-item {
    margin-bottom: 0;
  }
.order-time-select {
    width: 230px;
  }
 .select-options {
    width: 120px;
  }


 .order-line-three-row {
    position: absolute;
    left: 10px;
    right: 10px;
    top: 100px;
    bottom: 55px;
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
  <div class="statis-each-orders">
    <el-form ref="form" :model="formData"  :inline="true">
      <fieldset class="order-field-set filters">
        <legend>查询条件</legend>
        <el-form-item class="oreder-form-item" label="消费日期">
          <el-date-picker class="order-time-select" v-model="formData.selectedDates" type="daterange" align="right" size="mini" unlink-panels range-separator="~" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions2" value-format="yyyy-MM-dd">
          </el-date-picker>
        </el-form-item>

        <el-form-item label="支付方式">
          <el-select class="select-options" v-model="formData.paymentMethodId"  size="mini" clearable placeholder="不限" @clear="handleClear">
            <el-option v-for="item in paymentMethodOptions" :key="item.id" :value="item.id" :label="item.name">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button class="order-ok" type="primary" size="mini" @click="handleSearch">确定</el-button>
        </el-form-item>
      </fieldset>
    </el-form>
    <!-- 订单统计表   START -->

    <div class="order-line-three-row">
      <el-table class="cel-scrollable-table" border  :data="tableData" style="width: 100%">

        <el-table-column label="订单 ID" prop="number">
        </el-table-column>
        <el-table-column label="店铺" prop="storeName">
        </el-table-column>
        <el-table-column label="客户电话" prop="customer.mobile">
        </el-table-column>
        <el-table-column label="消费日期" prop="displayCreatedAt">
        </el-table-column>
        <el-table-column label="消费金额" prop="total">
        </el-table-column>
        <el-table-column label="订单状态" prop="displayState">
        </el-table-column>
        <el-table-column label="支付信息">
          <template slot-scope="scope">
            <el-tag v-for="item in scope.row.payments" :key="item.id" size="mini">
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

    <div class="stati-sdata-ordermoney">
      <h4 style="display: inline-block;">合计订单金额:</h4>
      <h4 class="recordnum">¥{{totalSum}}</h4>
    </div>
    <!-- 统计数据  END -->

    <!-- 分页器 START-->
    <div class="pagiantion-wrap" >
      <el-pagination @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-size="12" layout="total, prev, pager, next" :total="totalPage">
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
        storeId: null,
        paymentMethodId: null, //支付方式选项
      },
      paymentMethodList: [],
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
      tableData: [
      ],
      //*********** 逻辑需要的变量 ***************/
      returnServerCustomerData: {}, //调用接口,返回的数据
      customerData: {}, //整理過的顧客數據
      totalCount: 0, //统计数据之记录数
      totalSum: 0 //统计数据之充值金额合计
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
    paymentMethodOptions: function(){

      let ps =  this.paymentMethodList.map((payment)=>{
        return {id: payment.id, name: payment.name}
      })
      ps.push( {id: 0, name: '未付'})
      return ps
    },
    computedStartAt: function () {
      return this.formData.selectedDates[0]
    },
    computedEndAt: function () {
      return this.formData.selectedDates[1]
    }
  },
  methods: {
    async initData() {
      //this.formData.selectedDates =this.selectedDates
      let params = this.buildParams()
      getOrderCount(params).then((res) => {
        this.totalCount = res.total_count
        this.totalSum = parseInt(res.total_sum)
      })
      this.getPaymentMethods().then(()=>{
        this.paymentMethodList = this.paymentMethods.filter((payment)=>{
          return payment.active
        })
      })
      let result = await findOrders(params)
      this.totalPage = result.total_count
      this.tableData = this.buildOrders(result)
      this.addPaymentDescription()
      console.log("result=", result, "this.tableData = ", this.tableData)
    },
    buildParams() {
      let params = { //查询条件
        page: this.currentPage, //分页器选择的当前页数
        per_page: this.perPage, //每页显示12行数据
        q: {
          created_at_gteq: this.computedStartAt,
          created_at_lteq: this.computedEndAt,
          order_type_eq: 0,
          store_id_eq: this.storeId
        }
      }

      if( this.formData.paymentMethodId != null){
        if ( this.formData.paymentMethodId > 0 ){
          //选择了一个支付方式
          params.q.payments_payment_method_id_eq =  this.formData.paymentMethodId
        }else{
          //所有未交款的
          params.q.payment_state_eq = 'pending'
        }
      }
      return params
    },
    //門店選擇改變時的事件處理函數-----
    handleSearch() {
      this.currentPage = 1
      this.initData()
    },
    addPaymentDescription() {
      this.tableData.forEach((order) => {
        order.payments.forEach((payment) => {
          //7000五折卡(#0001)支付 ¥500
          //微信 支付 ¥100
          let method = this.paymentMethods.find(item => { return item.id == payment.paymentMethodId })
          if (payment.paymentMethodId == this.prepaidPaymentMethodId) {
            let card = order.customer.cards.find(card => {
              return card.id == payment.sourceId
            })
            payment.description = card.name + '(' + card.code + ')' + ' 支付 ¥' + payment.amount
          } else {
            payment.description = method.name + ' 支付 ¥' + payment.amount
          }
        })
      })
    },
    //分页器的改变选择时事件处理函数
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      this.currentPage = val
      console.log(this.currentPage)
      this.initData()

    },
    handleClear(){
      console.log( " Selected paymentMethodId = ", this.formData.paymentMethodId)
      this.formData.paymentMethodId = null
    }
  }
};
</script>
