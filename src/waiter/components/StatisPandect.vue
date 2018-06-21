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
          background: #E5E9F2;
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
          background: #FF9800;
      }
      .all_head {
          background: #20A0FF;
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
          <legend>查询条件</legend>
          <el-form :inline="true" :model="formData" class="demo-form-inline">
            <el-form-item label="时间区间">
              <el-date-picker class="date-picker" v-model="pandectDateSelect" type="daterange" align="right" size="mini" unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions2" value-format="yyyy-MM-dd">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="店铺">
              <el-select v-model="selectedStoreId" @change="changeForState" size="mini">
                <el-option v-for="item in storeOptions" :key="item.id" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary"  size="mini"  @click="onSubmit">查询</el-button>
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
            <header class="section_title">数据统计</header>
            <el-row :gutter="20" style="margin-bottom: 10px;">
              <el-col :span="4">
                <div class="data_list today_head"><span class="data_num head">当日数据：</span></div>
              </el-col>
              <el-col :span="4">
                <div class="data_list"><span class="data_num">{{statis.userCount}}</span> 新增客户</div>
              </el-col>
              <el-col :span="4">
                <div class="data_list"><span class="data_num">{{statis.orderCount}}</span> 新增订单</div>
              </el-col>
              <el-col :span="4">
                <div class="data_list"><span class="data_num">{{statis.cardCount}}</span> 新增会员卡</div>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="4">
                <div class="data_list all_head"><span class="data_num head">总数据：</span></div>
              </el-col>
              <el-col :span="4">
                <div class="data_list"><span class="data_num">{{statis.allUserCount}}</span> 注册客户</div>
              </el-col>
              <el-col :span="4">
                <div class="data_list"><span class="data_num">{{statis.allOrderCount}}</span> 订单</div>
              </el-col>
              <el-col :span="4">
                <div class="data_list"><span class="data_num">{{statis.allCardCount}}</span> 会员卡</div>
              </el-col>
            </el-row>
          </section>
          <div class="tendency-wrap">
            <tendency :sevenDate='sevenDate' :sevenDay='sevenDay'></tendency>
          </div>

      </div>
      <!-- 图表   END -->
    </div>
  </div>
</template>

<script>
import tendency from '@/components/statis/tendency.vue'
import dtime from 'time-formater'
import {
  selectedDaysCount,
  todayCount,
  totalCount
} from '@/api/getData'

export default {
  components: {
    "tendency": tendency
  },
  data() {
    return {
      //*********** UI需要的变量 ***************/
      formData:{
        fromTo: null, // [ "2018-06-04", "2018-06-14" ]
        storeId: null
      },
      storeOptions: [{ //门店方式选项
        value: '全部',
      }],
      pandectDateSelect: "", //总览时间选择值
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
      statis:{
        userCount: null,
        orderCount: null,
        cardCount: null,
        allUserCount: null,
        allOrderCount: null,
        allCardCount: null
      },
      userCount: null,
      orderCount: null,
      cardCount: null,
      allUserCount: null,
      allOrderCount: null,
      allCardCount: null,
      sevenDay: [],
      sevenDate: [
        [],
        [],
        []
      ],
      //*********** 逻辑需要的变量 ***************/
      returnServerCustomerData: {}, //调用接口,返回的数据
      customerData: {}, //整理過的顧客數據
    };
  },
  mounted() {
    let stores = this.stores.map((item)=>{ return {id: item.id, name: item.name }})
    this.storeOptions = [ {id: null, name: "全部"}].concat(stores )

    this.initData()
    for (let i = 6; i > -1; i--) {
      const date = dtime(new Date().getTime() - 86400000 * i).format('YYYY-MM-DD')
      this.sevenDay.push(date)
    }
    this.getSevenData()
  },
  methods: {

    async initData() {
      //const today = dtime().format('YYYY-MM-DD')
      Promise.all([todayCount(), totalCount()])
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
    },
    async getSevenData() {

      selectedDaysCount({
        days: this.sevenDay
      }).then(res => {
        const resArr = [
          [],
          [],
          []
        ]
        res.sale_days.forEach((item, index) => {
          resArr[0].push(item.new_customers_count)
          resArr[1].push(item.new_orders_count)
          resArr[2].push(item.new_cards_count)

        })
        this.sevenDate = resArr
      }).catch(err => {
        console.log(err)
      })
    },
    //門店選擇改變時的事件處理函數-----
    changeForState() {

    },
    onSubmit(){

    }
  }
};
</script>
