<style lang="scss">
.statistics-container {
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
    <div class="line-one-row">
      <div class="">
        <!-- 門店選擇 START-->
        <fieldset>
          <legend>功能选择</legend>
          <el-form :inline="true" :model="formData" class="demo-form-inline">
            <el-form-item label="时间区间">
              <el-date-picker class="date-picker" v-model="selectedDates" type="daterange" align="right" size="mini" unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions2" value-format="yyyy-MM-dd">
              </el-date-picker>
            </el-form-item>

            <store-select  v-bind:value.sync="formData.storeId" />           
            <el-form-item>
              <el-button type="primary" class="order-ok" size="mini" @click="onSubmit">确定</el-button>
            </el-form-item>
          </el-form>

        </fieldset>
        <!-- 門店選擇 END-->
      </div>
    </div>
    <!-- 图表   START -->
    <div class="tubiao-ont-row">
      <div class="fillcontain">

        <section class="data_section">
          <header class="section_title"></header>
          <el-row :gutter="20" style="margin-bottom: 10px;">
            <el-col :span="4" :offset="4">
              <div class="data_list today_head">
                <span class="data_num head">当日数据：</span>
              </div>
            </el-col>
            <el-col :span="4">
              <div class="data_list">
                <span class="data_num">{{statis.userCount}}</span> 新增客户</div>
            </el-col>
            <el-col :span="4">
              <div class="data_list">
                <span class="data_num">{{statis.orderCount}}</span> 新增订单</div>
            </el-col>
            <el-col :span="4">
              <div class="data_list">
                <span class="data_num">{{statis.cardCount}}</span> 新增会员卡</div>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="4" :offset="4">
              <div class="data_list all_head">
                <span class="data_num head">总数据：</span>
              </div>
            </el-col>
            <el-col :span="4">
              <div class="data_list">
                <span class="data_num">{{statis.allUserCount}}</span> 注册客户</div>
            </el-col>
            <el-col :span="4">
              <div class="data_list">
                <span class="data_num">{{statis.allOrderCount}}</span> 订单</div>
            </el-col>
            <el-col :span="4">
              <div class="data_list">
                <span class="data_num">{{statis.allCardCount}}</span> 会员卡</div>
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
        orderCount: null,
        cardCount: null,
        allUserCount: null,
        allOrderCount: null,
        allCardCount: null
      },
      sevenDate: [
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
      let params = { q: { day_eq: this.computedStartAt } }
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
      console.log("this.formData.selectedDates = ", this.formData.selectedDates)
      Promise.all([selectedDayCount(this.computedDayParam), totalCount(this.computedDaysParams)])
        .then(res => {
          this.statis.userCount = res[0].new_customers_count  //新增客户
          this.statis.orderCount = res[0].new_orders_count    //新增订单
          this.statis.cardCount = res[0].new_cards_count      //新增会员卡
          this.statis.allUserCount = res[1].new_customers_count
          this.statis.allOrderCount = res[1].new_orders_count
          this.statis.allCardCount = res[1].new_cards_count
        }).catch(err => {
          console.log(err)
        })
      this.getSevenData()
    },
    getSevenData() {

      selectedDaysCount(this.computedDaysParams).then(res => {
        const resArr = [
          [],
          [],
          []
        ]
        this.compuatedDays.forEach((day, i) => {
          let sale_day = res.sale_days.find((item) => { return item.day == day })

          if (sale_day) {
            resArr[0].push(sale_day.new_customers_count)
            resArr[1].push(sale_day.new_orders_count)
            resArr[2].push(sale_day.new_cards_count)
          } else {
            resArr[0].push(0)
            resArr[1].push(0)
            resArr[2].push(0)
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
