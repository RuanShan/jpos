<style lang="scss">
.statis-odd-card-paid-orders {

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
  <div class="statis-odd-card-paid-orders">
    <el-form ref="form" :model="formData"  :inline="true">
      <fieldset class="order-field-set filters">
        <legend>查询条件</legend>
        <store-select  v-bind:value.sync="formData.storeId"  v-if="authorizeMultiStore()"/>
        <el-form-item class="oreder-form-item" label="消费日期">
          <el-date-picker class="order-time-select" v-model="formData.selectedDates" type="daterange"
          :default-time="['00:00:00','23:59:59']"
          align="right" size="mini" unlink-panels range-separator="~" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions2"
          format="yyyy-MM-dd">
          </el-date-picker>
        </el-form-item>

        <el-form-item label="其他店铺">
          <el-select class="select-options" v-model="formData.oddStoreId"  size="mini" clearable placeholder="不限" @clear="handleClear">
            <el-option v-for="item in storeOptions" :key="item.id" :value="item.id" :label="item.name">
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

        <el-table-column label="订单ID" prop="number" width="120">
        </el-table-column>
        <el-table-column label="消费店铺" prop="storeName">
        </el-table-column>
        <el-table-column label="客户电话"  >
          <template slot-scope="scope">
            <span>{{ scope.row.customer.mobile}} </span>
            <span v-if="scope.row.customer.storeId!=scope.row.storeId">
              ({{scope.row.customer.storeName}})
            </span>
          </template>
        </el-table-column>
        <el-table-column label="消费日期" prop="displayCreatedAt" width="120">
        </el-table-column>
        <el-table-column label="消费金额" prop="total" width="100">
        </el-table-column>
        <el-table-column label="订单状态" prop="displayState" width="100">
        </el-table-column>
        <el-table-column label="支付信息">
          <template slot-scope="scope">
            <el-tag v-for="item in scope.row.payments" :key="item.id" size="mini">
              {{ item.description }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="会员卡所属店铺" prop="oddStoreName" >
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
      <el-pagination @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-size="perPage" layout="total, prev, pager, next" :total="totalPage">
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
import StoreSelect from '@/components/common/StoreSelect.vue'

export default {
  components: {
    StoreSelect
  },
  data() {
    return {
      //*********** 过滤条件 ***************/
      formData: {
        selectedDates: [], // [ "2018-06-04", "2018-06-14" ]
        storeId: null,  // 必须为空，否则缺省情况 显示 0
        oddStoreId: null, //支付方式选项
        oddCardPaid: false
      },
      paymentMethodList: [],
      totalPage: 0, //分页器显示的总页数
      perPage: 18, //主表每页显示12行
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
    let start = moment().subtract(6, "days").startOf('day')
    let end = moment().endOf('day')
    this.formData.selectedDates = [start.toDate(), end.toDate()]
    this.formData.storeId = this.storeId
    this.initData()
  },
  computed: {
    storeOptions: function(){

      let ps = this.$store.getters.onlyStores.filter((item)=>{
        return item.id != this.storeId
      }).map((item)=>{
        return {id: item.id, name: item.name}
      })
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
      let paymentMethodId = this.$store.getters.prepaidCardPaymentMethodId
      let params = { //查询条件
        page: this.currentPage, //分页器选择的当前页数
        per_page: this.perPage, //每页显示12行数据
        q: {
          created_at_gteq: this.computedStartAt,
          created_at_lteq: this.computedEndAt,
          order_type_eq: 0,
          payments_payment_method_id_eq: paymentMethodId

        }
      }
      if( parseInt(this.formData.storeId) > 0){
        params.q.store_id_eq = this.formData.storeId
      }

      if( this.formData.oddStoreId ){
        if ( this.formData.oddStoreId > 0 ){
          //选择了一个店铺
          params.q.odd_store_id_eq = this.formData.oddStoreId
        }
      }else{
        params.q.odd_store_id_not_eq = 0
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
        let store = this.stores.find( item =>{ return item.id == order.oddStoreId})
        if( store ){
          order.oddStoreName = store.name
        }

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
      console.log( " Selected oddStoreId = ", this.formData.oddStoreId)
      this.formData.oddStoreId = null
    }
  }
};
</script>
