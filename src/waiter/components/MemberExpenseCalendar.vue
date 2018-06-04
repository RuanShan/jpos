<style scoped>
.grid-content {
  min-height: 30px;
}

#basic .grid-content {
  min-height: 30px;
  border: 1px solid #b6dafe;
}
.bg-purple {
  background: #d3dce6;
}
.bg-purple-light {
  background: #e5e9f2;
}
</style>

<template>
  <div class="add_member_container cel-window">
    <!-- 会员添加窗口 -> START -->
    <el-dialog :visible="computedVisible" :close-on-press-escape="false" :show-close="false" :top="top" :modal="false" @open="openWindow()">
      <div slot="title" class="title-wrap">
        <div class="left back">
          <i class="el-icon-back" @click="handleCloseDialog()"></i>
        </div>
        <div>会&nbsp;&nbsp;&nbsp;员&nbsp;&nbsp;&nbsp;消&nbsp;&nbsp;&nbsp;费&nbsp;&nbsp;&nbsp;记&nbsp;&nbsp;&nbsp;录</div>
      </div>
      <!-- <el-button type="primary" @click="test">主要按钮</el-button> -->

      <el-row>
        <el-col :span="1">
          <div class="grid-content ">
          </div>
        </el-col>

        <el-col :span="22">

          <div class="grid-content ">
            <!-- 会员基本信息 START-->
            <div id="basic" style="margin-top: 10px;">
              <el-row>
                <el-col :span="4">
                  <div class="grid-content bg-purple">会员姓名</div>
                </el-col>
                <el-col :span="4">
                  <div class="grid-content bg-purple-light">{{customerData.userName}}</div>
                </el-col>
                <el-col :span="4">
                  <div class="grid-content bg-purple">会员电话</div>
                </el-col>
                <el-col :span="4">
                  <div class="grid-content bg-purple-light">{{customerData.mobile}}</div>
                </el-col>
                <el-col :span="4">
                  <div class="grid-content bg-purple">会员生日</div>
                </el-col>
                <el-col :span="4">
                  <div class="grid-content bg-purple-light">{{customerData.displayBirth}}</div>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="4">
                  <div class="grid-content bg-purple">地址</div>
                </el-col>
                <el-col :span="8">
                  <div class="grid-content bg-purple-light">{{customerData.address}}</div>
                </el-col>
                <el-col :span="4">
                  <div class="grid-content bg-purple">备注</div>
                </el-col>
                <el-col :span="8">
                  <div class="grid-content bg-purple-light">{{customerData.memo}}</div>
                </el-col>
              </el-row>
            </div>
            <!-- 会员基本信息 END-->
            <!-- 时间选择 START-->
            <fieldset>
              <legend>时间选择</legend>
              日期区间选择
              <el-date-picker v-model="dateSection" type="daterange" align="right" unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions2" value-format="yyyy-MM-dd">
              </el-date-picker>
            </fieldset>
            <!-- 时间选择 END-->
            <!-- 会员消费表格 START-->
            <el-table id="expensecalendartable" :data="expenseTableData" border style="width: 100%;margin-top: 10px" @expand-change="expandChange" :expand-row-keys="expendRow" :row-key="row => row.id">
              <el-table-column type="expand">
                <template slot-scope="props">
                  <el-form label-position="left" inline class="demo-table-expand">
                    <el-form-item label="商品名称">
                      <span>{{ props.row.name }}</span>
                    </el-form-item>
                    <el-form-item label="所属店铺">
                      <span>{{ props.row.shop }}</span>
                    </el-form-item>
                    <el-form-item label="商品 ID">
                      <span>{{ props.row.id }}</span>
                    </el-form-item>
                    <el-form-item label="店铺 ID">
                      <span>{{ props.row.shopId }}</span>
                    </el-form-item>
                    <el-form-item label="商品分类">
                      <span>{{ props.row.category }}</span>
                    </el-form-item>
                    <el-form-item label="店铺地址">
                      <span>{{ props.row.address }}</span>
                    </el-form-item>
                    <el-form-item label="商品描述">
                      <span>{{ props.row.desc }}</span>
                    </el-form-item>
                  </el-form>
                </template>
              </el-table-column>
              <el-table-column label="订单编号" prop="number">
              </el-table-column>
              <el-table-column label="消费日期" prop="displayCreatedAt">
              </el-table-column>
              <el-table-column label="店铺名称" prop="storeName">
              </el-table-column>
              <el-table-column label="应收金额" prop="totalAmount">
              </el-table-column>
              <el-table-column label="实收金额" prop="totalAmount">
              </el-table-column>
              <el-table-column label="操作员" prop="userName">
              </el-table-column>
              <el-table-column label="备注" prop="groupState">
              </el-table-column>
            </el-table>
            <!-- 会员消费表格 END-->
          </div>
        </el-col>
        <el-col :span="1">
          <div class="grid-content "></div>
        </el-col>
      </el-row>

    </el-dialog>
  </div>
</template>


<script>
import { DialogMixin } from "@/components/mixin/DialogMixin";
import { apiResultMixin } from '@/components/apiResultMixin';
import { findOrders } from "@/api/getData";


export default {
  props: ["dialogVisible", "customerData"],
  mixins: [DialogMixin, apiResultMixin],
  data() {
    return {
      top: "0" /* 去除直接传 0 产生的 需要参数为string的警告 */,
      memberInfo: "", //会员信息
      customeBirthday: "",
      pickerOptions2: {
        shortcuts: [
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近半年",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 180);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一年",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 365);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      },
      dateSection: "", //选择的日期时间
      orderDataByUserId: {}, //根据会议ID提交SerVer,返回的订单数据
      expenseTableData: [], //主表格数据
      expendRow: [],  //UI需要
      rowData: {},    //展开的当前行数据
      expendRowsArry: []  //已经展开的多行数据
    };
  },
  // computed: {
  //   computedVisible: function () {
  //     return this.dialogVisible
  //   }
  // },
  methods: {
    //根据会员ID得到该会员的所有订单
    async getOrderByUserId(data) {
      this.orderDataByUserId = await findOrders(data);
    },
    openWindow() {
      let requestDataByUserId = {
        q: {
          number_cont: "5",
          user_id_eq: this.customerData.id
        }
      };
      this.getOrderByUserId(requestDataByUserId).then(() => {
        this.expenseTableData = this.buildOrders(this.orderDataByUserId);
        console.log("得到了会员得订单数据了!");

      });
    },
    //表格展开后的事件处理函数
    expandChange(row, expandedRows) {

    }
  }
};
</script>
