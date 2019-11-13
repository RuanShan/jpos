<style lang="scss">
.statis-member-case {

    .select-options {
        width: 120px;
    }
    .member-time-select {
        width: 230px;
    }

    .order-ok {

    }
    .member-line-three-row {
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
<div class="statis-member-case">
  <el-form ref="form" :model="formData"  :inline="true">
    <fieldset class="member-field-set filters">
      <legend>查询条件</legend>
      <store-select  v-bind:value.sync="formData.storeId"   v-if="authorizeMultiStore()"/>
      <el-form-item class="member-form-item" label="注册日期">
        <el-date-picker class="member-time-select" v-model="formData.selectedDates" type="daterange" align="right"
        :default-time="['00:00:00','23:59:59']"
        size="mini" unlink-panels range-separator="~" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions2"
        format="yyyy-MM-dd">
        </el-date-picker>
      </el-form-item>

      <el-form-item label="会员" prop="hasCard" >
        <el-select v-model="formData.hasCard" placeholder="" size="mini" clearable placeholder="不限" @clear="handleClear">
          <el-option v-for="item in cardOptions" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button class="order-ok" type="primary" size="mini" @click="handleSearch">确定</el-button>
      </el-form-item>
    </fieldset>
  </el-form>

  <!-- 会员统计表   START -->
  <div class="member-line-three-row ">
    <el-table class="cel-scrollable-table" :data="tableData"  border>
      <el-table-column prop="id" label="ID" width="80">
      </el-table-column>
      <el-table-column prop="storeName" label="所属门店" width="140">
      </el-table-column>
      <el-table-column prop="userName" label="会员姓名" width="140">
      </el-table-column>
      <el-table-column prop="mobile" label="电话" width="140">
      </el-table-column>
      <el-table-column prop="displayGender" label="性别" width="80">
      </el-table-column>
      <el-table-column  label="卡号">
        <template slot-scope="scope">
          <el-tag  v-for="(item, index) in scope.row.cards" :key="item.id">
            {{item.code}} ￥{{item.amount}}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="displayCreatedAt" label="注册日期" width="140"></el-table-column>
      <el-table-column prop="memo" label="备注">
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
  findCustomers
} from '@/api/getData'
import StoreSelect from '@/components/common/StoreSelect.vue'

export default {
  components: {
    StoreSelect
  },
  data() {
    return {
      //*********** 过滤条件 ***************/
      cardOptions: [{label:'是',value: 1},{label:'否',value: 0}],
      formData: {
        selectedDates: [], // [ "2018-06-04", "2018-06-14" ]
        hasCard: null,
        storeId: null,
      },
      //*********** UI需要的变量 ***************/

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
      tableData: [  ],
      //*********** 逻辑需要的变量 ***************/
      returnServerCustomerData: {}, //调用接口,返回的数据
      customerData: {}, //整理過的顧客數據
      recordNumber: "0", //统计数据之记录数
      rechargeMoneySum: "0" //统计数据之充值金额合计
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
      let result = await findCustomers(params)

      this.totalPage = result.total_count
      this.tableData = this.buildCustomers(result)
      console.log("result=", result, "this.tableData = ", this.tableData)
    },
    buildParams() {
      let params = { //查询条件
        page: this.currentPage, //分页器选择的当前页数
        per_page: this.perPage, //每页显示12行数据
        q: { }
      }
      if( parseInt(this.formData.storeId) > 0){
        params.q.store_id_eq = this.formData.storeId
      }
      if ( this.computedStartAt && this.computedEndAt){
        params.q.created_at_gteq= this.computedStartAt
        params.q.created_at_lteq= this.computedEndAt
      }
      // 是否必须会员卡
      if( this.formData.hasCard != null ){
        if( this.formData.hasCard == 1 ){
          params.q.cards_status_eq = 1
        }
        if( this.formData.hasCard == 0 ){
          params.q.cards_status_null = true
        }
      }
      return params
    },

    //分页器的改变选择时事件处理函数
    handleCurrentChange(val) {
      this.currentPage = val;
      this.initData()
    },
    handleSearch(){
      this.currentPage = 1;
      this.initData()
    },
    handleClear() {
      this.formData.hasCard = null
    },
  }
};
</script>
