<style lang="scss">
.statis-each-member {

  .member-time-select {
    width: 230px;
  }
  .select-options {
    width: 120px;
  }

  .order-ok {

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
    line-height: 28px;
    font-size: 14px;
    .recordnum {
      color: red;
      display: inline-block;
    }
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
  <div class="statis-each-member">
    <el-form ref="form" :model="formData"  :inline="true">
      <fieldset class="member-field-set filters">
        <legend>查询条件</legend>
        <store-select  v-bind:value.sync="formData.storeId"   v-if="authorizeMultiStore()"/>

        <el-form-item class="member-form-item" label="充值日期">
          <el-date-picker class="member-time-select" v-model="formData.selectedDates" type="daterange"
          :default-time="['00:00:00','23:59:59']"
          align="right" size="mini" unlink-panels range-separator="~"
          start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions2"
          format="yyyy-MM-dd">
          </el-date-picker>
        </el-form-item>

        <el-form-item label="会员卡类型" prop="variantId" >
          <el-select v-model="formData.variantId" placeholder="" size="mini" clearable placeholder="不限" @clear="handleClear">
            <el-option v-for="item in cardTypeList" :key="item.masterId" :label="item.name" :value="item.masterId">
            </el-option>
          </el-select>
        </el-form-item>

      <el-form-item>
        <el-button class="order-ok" type="primary" size="mini" @click="handleSearch">查询</el-button>
      </el-form-item>

      </fieldset>
    </el-form>

    <!-- 会员统计表   START -->
    <div class="member-line-three-row ">
      <el-table class="cel-scrollable-table" :data="tableData" border style="width: 100%">
        <el-table-column prop="cardTransaction.card.code" label="会员卡号" width="120">

        </el-table-column>
        <el-table-column prop="cardTransaction.customer.userName" label="会员姓名" width="130">
        </el-table-column>
        <el-table-column prop="cardTransaction.card.displayStyle" label="卡类型" width="90">
        </el-table-column>
        <el-table-column prop="cardTransaction.card.name" label="会员卡等级">

        </el-table-column>
        <el-table-column prop="cardTransaction.displayCreatedAt" label="充值日期">
        </el-table-column>
        <el-table-column   label="充值/付款" width="120">
          <template slot-scope="scope">
              <span>{{ scope.row.cardTransaction.amount}} </span>/
              <span >{{scope.row.paymentTotal}} </span>
            </template>

        </el-table-column>
        <el-table-column prop="creatorName" label="操作员" width="110">
        </el-table-column>
        <el-table-column prop="displayOrderType" label="类型" width="90">
        </el-table-column>
        <el-table-column label="充值状态" prop="displayState">
          <template slot-scope="scope">
              {{scope.row.displayState}} <span v-show="scope.row.memo">({{scope.row.memo}})</span>
            </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 统计数据  START -->
    <div class="statisdatarechargemoney">
      <h4 style="display: inline-block;">合计付款金额:</h4>
      <h4 class="recordnum">¥{{paymentTotalSum}}</h4>
    </div>
    <!-- 统计数据  END -->

    <!-- 会员统计表   END -->
    <!-- 分页器 START-->
    <div class="pagiantion-wrap">
      <el-pagination @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-size="perPage" layout="total, prev, pager, next" :total="totalPage">
      </el-pagination>
    </div>
    <!-- 分页器 END-->
  </div>
</template>

<script>
// 会员充值统计
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
        variantId: null,
        storeId: 0
      },
      cardTypeList: [],

      selectedDates: "", //选择的日期时间

      stateOptions: [{ //门店方式选项
        value: '全部',
      }],
      totalPage: 0, //分页器显示的总页数
      perPage: 18, //主表每页显示12行
      currentPage: 1, //根据分页器的选择,提交SerVer数据,表示当前是第几页
      pickerOptions2: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = moment().endOf('day')
            const endDate = end.toDate()
            const startDate =end.subtract( 6, 'days').startOf('day').toDate()
            picker.$emit('pick', [startDate, endDate])
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = moment().endOf('day')
            const endDate = end.toDate()
            const startDate =end.subtract( 1, 'months').startOf('day').toDate()
            picker.$emit('pick', [startDate, endDate])
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = moment().endOf('day')
            const endDate = end.toDate()
            const startDate =end.subtract( 3, 'months').startOf('day').toDate()
            picker.$emit('pick', [startDate, endDate])
          }
        }]
      },
      tableData: [],
      //*********** 逻辑需要的变量 ***************/
      returnServerCustomerData: {}, //调用接口,返回的数据
      customerData: {}, //整理過的顧客數據
      totalCount: 0,  //统计数据之记录数
      totalSum: 0, //统计数据之充值金额合计
      paymentTotalSum: 0
    };
  },
  created() {
    let stores = this.stores.map((item) => { return { id: item.id, name: item.name } })
    this.storeOptions = [{ id: null, name: "全部" }].concat(stores)
    let start = moment().subtract(6, "days").startOf('day')
    let end = moment().endOf('day')
    this.formData.selectedDates = [start.toDate(), end.toDate()]
    this.formData.storeId = this.storeId
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
      this.cardTypeList = await this.getCardTypes()

      let params = this.buildParams()

      getOrderCount(params).then((res) => {
        this.totalCount = res.total_count
        this.totalSum = parseInt(res.total_sum)
        this.paymentTotalSum = parseInt(res.payment_total_sum)
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
          created_at_gteq: this.computedStartAt,
          created_at_lteq: this.computedEndAt,
          order_type_in: [1,2],
          s:[ 'created_at desc']
        }
      }
      if( parseInt(this.formData.storeId) > 0){
        params.q.store_id_eq = this.formData.storeId
      }
      if (this.formData.variantId != null) {
          //选择了一个支付方式
          params.q.line_items_variant_id_eq = this.formData.variantId
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
    handleSearch() {
      this.currentPage = 1
      this.initData()
    },
    handleClear() {
      console.log(' Selected paymentMethodId = ', this.formData.variantId)
      this.formData.variantId = null
    },
  }
};
</script>
