<style lang="scss">
.statis-staff-clock-in {
    .member-field-set {
        position: absolute;
        left: 10px;
        right: 10px;
        top: 5px;
    }
    .member-form-item {
        margin-bottom: 0;
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
        top: 108px;
        bottom: 60px;
    }
    .statisdatarecordnum {
        display: inline-block;
        position: absolute;
        bottom: 20px;
        border: solid 1px #939393;
        .recordnum {
            color: red;
            display: inline-block;
        }
    }
    .statisdatarechargemoney {
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
<div class="statis-staff-clock-in">
  <el-form ref="form" :model="form" label-width="70px" :inline="true">
    <fieldset class="member-field-set">
      <legend>功能选择</legend>
      <el-form-item class="member-form-item" label="时间选择">
        <el-date-picker class="member-time-select" v-model="formData.selectedDates" type="daterange" align="right" size="mini" unlink-panels range-separator="~" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions2" value-format="yyyy-MM-dd">
        </el-date-picker>
      </el-form-item>

      <el-form-item label="门店选择">
        <el-select class="select-options" v-model="form.stateValue" @change="changeForState" size="mini">
          <el-option v-for="item in stateOptions" :key="item.value" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button class="order-ok" type="primary" size="mini">确定</el-button>
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
  <div class="" style="position: absolute;bottom:2px;right:4%;margin-top: 10px;">
    <el-pagination @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-size="12" layout="total, prev, pager, next, jumper" :total="total">
    </el-pagination>
  </div>
  <!-- 分页器 END-->
</div>
</template>

<script>
import moment from 'moment'
import { findUserAndEntries } from '@/api/getData'

export default {
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
          }, {
            date: '2016-05-01',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1519 弄'
          }, {
            date: '2016-05-03',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1516 弄'
          }],
      //*********** 逻辑需要的变量 ***************/
    };
  },
  mounted() {
    this.stateValue = this.stateOptions[0].value;
    let start = moment().subtract(6, "days")
    let end = moment()
    this.formData.selectedDates = [start.toDate(), end.toDate()]
    this.formData.storeId = this.stateOptions[0].value
    this.initData()
  },
  computed: {
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
        eq: {
          day_gteq: this.formData.selectedDates[0],
          day_lteq: this.formData.selectedDates[1]
        }
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
    }
  }
};
</script>
