<style lang="scss">
.statistics-container {
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
  .tab-list-wrap {
    position: absolute;
    top: 55px;
    left: 18px;
    right: 18px;
    bottom: 100px;
    .tabs-height {
      height: 100%;
      .el-tabs__content {
        position: absolute;
        top: 40px;
        left: 10px;
        bottom: 0;
        right: 10px;
      }
    }
  }
  .grid-content {
    min-height: 30px;
  }

  .bg-purple {
    background: #d3dce6;
  }

  .bg-purple-light {
    background: #e5e9f2;
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
    .main-left {
      width: 70%;
      float: left;
      .time-select-left {
        width: 50%;
        float: left;
      }
      .time-select-right {
        width: 50%;
        float: right;
        .date-picker {
          width: 100%;
        }
      }
    }
    .main-right {
      width: 30%;
      float: right;
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
}
</style>

<template>
  <div class="">
    <div class="line-one-row">
      <div class="main-left">
        <!-- 时间选择 START-->
        <fieldset>
          <legend>时间选择</legend>
          <el-date-picker class="date-picker" v-model="pandectDateSelect" type="daterange" align="right" size="mini" unlink-panels range-separator="T" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions2" value-format="yyyy-MM-dd">
          </el-date-picker>
        </fieldset>
        <!-- 时间选择 END-->
      </div>
      <div class="main-right">
        <!-- 門店選擇 START-->
        <fieldset>
          <legend>门店选择</legend>
          <el-select v-model="stateValue" @change="changeForState" size="mini" style="width:100%;">
            <el-option v-for="item in stateOptions" :key="item.value" :value="item.value">
            </el-option>
          </el-select>
        </fieldset>
        <!-- 門店選擇 END-->
      </div>
    </div>
    <!-- 图表   START -->
    <div class="tubiao-ont-row">
      <div class="fillcontain">
        <keep-alive>
          <day-sale> </day-sale>
        </keep-alive>
      </div>
      <!-- 图表   END -->
    </div>
  </div>
</template>

<script>
import DaySale from '@/components/statis/DaySale.vue'

export default {
  components: {
    "day-sale": DaySale,
  },
  data() {
    return {
      //*********** UI需要的变量 ***************/
      stateOptions: [{ //门店方式选项
        value: '全部',
      }],
      pandectDateSelect: "", //总览时间选择值
      stateValue: "", //門店選項
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

      //*********** 逻辑需要的变量 ***************/
      returnServerCustomerData: {}, //调用接口,返回的数据
      customerData: {}, //整理過的顧客數據
    };
  },
  mounted() {
    this.stateValue = this.stateOptions[0].value;
  },
  methods: {
    //門店選擇改變時的事件處理函數-----
    changeForState() {

    },
  }
};
</script>
