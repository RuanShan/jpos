<style lang="scss">
.statistics-container {
  .filters {
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
  .line-one-row {
    position: absolute;
    left: 10px;
    right: 10px;
    top: 10px;
    .order-ok {

    }
  }
  .line-two-row {
    position: absolute;
    left: 10px;
    right: 10px;
    top: 80px;
  }
  .line-three-row {
    position: absolute;
    left: 10px;
    right: 10px;
    top: 150px;
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

  .data_section {
    padding: 20px;
    margin-bottom: 40px;
    .section_title {
      text-align: center;
      font-size: 30px;
      margin-bottom: 10px;
    }
    .data_list {
      text-align: center;
      font-size: 14px;
      color: #666;
      border-radius: 6px;
      background: #e5e9f2;
      .data_num {
        color: #333;
        font-size: 26px;
      }
      .head {
        border-radius: 6px;
        font-size: 22px;
        padding: 4px 0;
        color: #fff;
        display: inline-block;
      }
    }
    .today_head {
      background: #ff9800;
    }
    .all_head {
      background: #20a0ff;
    }
  }
  .tendency-wrap {
    position: absolute;
    top: 160px;
    bottom: 0;
    left: 0;
    right: 0;
  }
}
</style>

<template>
  <div class="">
    <!-- 門店選擇 START-->
    <fieldset class="filters">
      <legend>查询条件</legend>
      <el-form :inline="true" :model="formData" class="demo-form-inline">
        <el-form-item label="时间区间">
          <el-date-picker class="date-picker" v-model="selectedDates" type="daterange" align="right" size="mini" unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions2" value-format="yyyy-MM-dd">
          </el-date-picker>
        </el-form-item>
        <store-select  v-bind:value.sync="formData.storeId"  v-if="authorizeMultiStore()"/>
        <el-form-item>
          <el-button type="primary" class="order-ok" size="mini" @click="onSubmit">确定</el-button>
        </el-form-item>
      </el-form>

    </fieldset>
    <!-- 門店選擇 END-->
    <!-- 图表   START -->
    <div class="tubiao-ont-row">
      <div class="fillcontain">

        <section class="data_section">
          <header class="section_title"></header>
          <el-row :gutter="20" style="margin-bottom: 10px;">
            <el-col :span="3" :offset="3">
              <div class="data_list today_head">
                <span class="data_num head">当日数据：</span>
              </div>
            </el-col>
            <el-col :span="3">
              <div class="data_list">
                <span class="data_num">{{statis.serviceOrderCount}}</span>  订单数量</div>
            </el-col>
            <el-col :span="3">
              <div class="data_list">
                <span class="data_num">{{statis.serviceTotal}}</span> 订单金额 </div>
            </el-col>
            <el-col :span="3">
              <div class="data_list">
                <span class="data_num">{{statis.userCount}}</span> 新增客户</div>
            </el-col>
            <el-col :span="3">
              <div class="data_list">
                <span class="data_num">{{statis.cardCount}}</span> 新增会员卡</div>
            </el-col>
            <el-col :span="3">
              <div class="data_list">
                <span class="data_num">{{statis.depositTotal}}</span> 会员充值金额</div>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="3" :offset="3">
              <div class="data_list all_head">
                <span class="data_num head">总数据：</span>
              </div>
            </el-col>
            <el-col :span="3">
              <div class="data_list">
                <span class="data_num">{{statis.allServiceOrderCount}}</span> 订单数量</div>
            </el-col>
            <el-col :span="3">
              <div class="data_list">
                <span class="data_num">{{statis.allServiceTotal}}</span> 订单金额</div>
            </el-col>
            <el-col :span="3">
              <div class="data_list">
                <span class="data_num">{{statis.allUserCount}}</span> 注册客户</div>
            </el-col>
            <el-col :span="3">
              <div class="data_list">
                <span class="data_num">{{statis.allCardCount}}</span> 会员卡</div>
            </el-col>
            <el-col :span="3">
              <div class="data_list">
                <span class="data_num">{{statis.allDepositTotal}}</span> 会员充值金额</div>
            </el-col>
          </el-row>
        </section>
        <div class="tendency-wrap">
          <tendency :sevenDate.sync='sevenDate' :sevenDay.sync='compuatedDays'></tendency>
        </div>

      </div>
      <!-- 图表   END -->
    </div>
  </div>
</template>

<script>
import tendency from '@/components/statis/tendency.vue'
import StoreSelect from '@/components/common/StoreSelect.vue'
import moment from 'moment'

import {
  selectedDaysCount,
  selectedDayCount,
  totalCount
} from '@/api/getData'

export default {
  components: {
    tendency,
    StoreSelect
  },
  data() {
    return {
      //*********** 过滤条件 ***************/
      formData: {
        selectedDates: [], // [ "2018-06-04", "2018-06-14" ]
        storeId: null
      },
      storeOptions: [{ //门店方式选项
        value: '全部',
      }],
      selectedDates: "", //总览时间选择值
      selectedStoreId: "", //門店選項
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
      statis: {
        userCount: null,
        serviceOrderCount: null,
        cardCount: null,
        serviceTotal: null,
        depositTotal: null,
        allUserCount: null,
        allServiceOrderCount: null,
        allCardCount: null,
        allServiceTotal: null,
        allDepositTotal: null
      },
      sevenDate: [
        [],
        [],
        [],
        [],
        []
      ],
    };
  },
  created() {
    let stores = this.stores.map((item) => { return { id: item.id, name: item.name } })
    this.storeOptions = [{ id: null, name: "全部" }].concat(stores)
    let start = moment().subtract(6, "days")
    let end = moment()
    this.selectedDates = [start.toDate(), end.toDate()]
    this.initData()
  },
  computed: {
    computedStartAt: function () {
      return this.formData.selectedDates[0]
    },
    computedEndAt: function () {
      return this.formData.selectedDates[1]
    },
    computedDayParam: function () {
      let params = { q: { day_eq: this.computedEndAt } }
      return params
    },
    computedDaysParams() {
      let params = {
        q: {          day_gteq: this.computedStartAt,
          day_lteq: this.computedEndAt
        }
      }
      return params
    },
    compuatedDays() {
      let days = []
      let start = moment(this.computedStartAt)
      let end = moment(this.computedEndAt)
      while (start <= end) {
        const day = start.format('YYYY-MM-DD')
        days.push(day)
        start = start.add(1, "days")
      }
      return days
    }
  },
  methods: {
    initData() {
      this.formData.selectedDates = this.selectedDates
      console.log("StatisPandect.formData.selectedDates = ", this.formData.selectedDates)
      //统计最后一天(今天)，和 开始到最后一天的数据
      Promise.all([selectedDayCount(this.computedDayParam), totalCount(this.computedDaysParams)])
        .then(res => {
          console.log("StatisPandect.res = ", res)
          this.statis.userCount = res[0].new_customers_count  //新增客户
          this.statis.serviceOrderCount = res[0].service_order_count    //新增服务订单
          this.statis.cardCount = res[0].new_cards_count      //新增会员卡
          this.statis.serviceTotal = res[0].service_total      //新增服务订单金额
          this.statis.depositTotal = res[0].deposit_total      //新增充值订单金额
          this.statis.allUserCount = res[1].new_customers_count
          this.statis.allServiceOrderCount = res[1].service_order_count
          this.statis.allCardCount = res[1].new_cards_count
          this.statis.allServiceTotal = res[1].service_total
          this.statis.allDepositTotal = res[1].deposit_total
        }).catch(err => {
          console.log(err)
        })
      this.getSevenData()
    },
    getSevenData() {

      selectedDaysCount(this.computedDaysParams).then(res => {
        const resArr = [
          [], [], [], [], []
        ]
        this.compuatedDays.forEach((day, i) => {
          let sale_day = res.sale_days.find((item) => { return item.day == day })

          if (sale_day) {
            resArr[0].push(sale_day.new_customers_count)
            resArr[1].push(sale_day.service_order_count)
            resArr[2].push(sale_day.new_cards_count)
            resArr[3].push(sale_day.service_total)
            resArr[4].push(sale_day.deposit_total)
          } else {
            resArr[0].push(0)
            resArr[1].push(0)
            resArr[2].push(0)
            resArr[3].push(0)
            resArr[4].push(0)
          }
        })
        this.sevenDate = resArr
      }).catch(err => {
        console.log(err)
      })
    },

    //門店選擇改變時的事件處理函數-----
    changeForState() {

    },
    onSubmit() {
      this.formData.selectedDates = this.selectedDates
      this.initData()
    }
  }
};
</script>
