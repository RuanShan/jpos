<style lang="scss">
.statis-staff-clock-in {
    .el-tag{
      margin: 0 2px;
    }
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
    .pagiantion-wrap{
      position: absolute;
      bottom:20px;
      right:20px;
    }
}
</style>

<template>
<div class="statis-staff-clock-in">
  <el-form ref="form" :model="form"   :inline="true">
    <fieldset class="member-field-set filters">
      <legend>查询条件</legend>
      <store-select  v-bind:value.sync="formData.storeId"   v-if="authorizeMultiStore()"/>
      <el-form-item class="member-form-item" label="时间选择">
        <el-date-picker class="member-time-select" v-model="formData.selectedDates" type="daterange" align="right" size="mini" unlink-panels range-separator="~" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions2" value-format="yyyy-MM-dd">
        </el-date-picker>
      </el-form-item>

      <el-form-item>
        <el-button class="order-ok" type="primary" size="mini" @click="handleSearch">确定</el-button>
      </el-form-item>
    </fieldset>
  </el-form>

  <!-- 会员统计表   START -->
  <div class="member-line-three-row ">
    <el-table class="cel-scrollable-table" :data="tableData"  border>
      <el-table-column prop="id" label="编号" width="100">
      </el-table-column>
      <el-table-column prop="name" label="姓名" width="100">
      </el-table-column>
      <el-table-column prop="userEntries.length" label="打卡次数"  width="100" >
      </el-table-column>
      <el-table-column   label="打卡记录详细"  >
        <template slot-scope="scope">
          <el-tag size="medium" v-for="entry in scope.row.userEntries" :key="entry.id">{{ entry.displayCreatedAt }} - {{ entry.storeName }} - {{ entry.displayState }}</el-tag>
         </template>
      </el-table-column>

    </el-table>

  </div>

  <!-- 统计数据  START -->
  <!-- 统计数据  END -->

  <!-- 会员统计表   END -->
  <!-- 分页器 START-->
  <div class="pagiantion-wrap" >
    <el-pagination @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-size="perPage" layout="total, prev, pager, next" :total="total">
    </el-pagination>
  </div>
  <!-- 分页器 END-->
</div>
</template>

<script>
import moment from 'moment'
import { findUserAndEntries } from '@/api/getData'
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
        storeId: null,
        payValue: "", //支付方式选项
      },

      //*********** UI需要的变量 ***************/
      form: {
        memberCaseDateSection: "", //选择的日期时间
        stateValue: "", //門店選項
      },
      stateOptions: [{ //门店方式选项
        value: '全部',
      }],
      total: 0, //总记录数
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
    };
  },
  mounted() {
    this.stateValue = this.stateOptions[0].value;
    let start = moment().subtract(6, "days").startOf('day')
    let end = moment().endOf('day')
    this.formData.selectedDates = [start.toDate(), end.toDate()]
    this.formData.storeId = this.storeId
    this.initData()
    this.$bus.$on('user-entry-created-gevent', () => {
      console.log( 'handle user-entry-created-gevent')
      this.initData()
    })
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
    initData() {
      let params = this.buildParams()
      findUserAndEntries(params).then((result)=>{
        this.total = result.total_count
        this.tableData = this.buildUsers(result)
        //添加
        console.log("result=", result, "this.tableData = ", this.tableData)
      })
    },
    buildParams() {
      let params = { //查询条件
        page: this.currentPage, //分页器选择的当前页数
        per_page: this.perPage, //每页显示12行数据
        eq: { }
      }
      if( parseInt(this.formData.storeId) > 0){
        params.eq.store_id_eq = this.formData.storeId
      }
      if( this.computedStartAt && this.computedEndAt){
        params.eq.day_gteq = this.computedStartAt
        params.eq.day_lteq = this.computedEndAt
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
    onSubmit() {
      this.initData()
    },
    onReset(){
      this.$refs['form'].resetFields()
      this.onSubmit()
    },
    handleSearch(){
      this.currentPage = 1;
      this.initData()
    }
  }
};
</script>
