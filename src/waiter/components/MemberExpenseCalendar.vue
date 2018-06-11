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
      <!-- <el-button type="danger" @click="test()">主要按钮</el-button> -->

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

            <!-- 会员消费表格 START   -->
            <!-- <el-table id="expensecalendartable" :data="expenseTableData" border style="width: 100%;margin-top: 10px" 
                    @expand-change="expandChange"  :expand-row-keys="expendRow" :row-key="row => row.id" > -->
            <el-table id="expensecalendartable" :data="expenseTableData" border style="width: 100%;margin-top: 10px" @expand-change="expandChange" :expand-row-keys="expendRow" :row-key="row => row.id">
              <!-- <el-table id="expensecalendartable" :data="expenseTableData" border style="width: 100%;margin-top: 10px" @cell-mouse-enter="mouseEnter" :row-key="row => row.id"> -->
              <el-table-column type="expand">
                <template slot-scope="props">
                    <el-table :data="props.row.getOrderDataById.groupLineItems" :span-method="objectSpanMethod" 
                              border style="width: 60%;">
                      <el-table-column prop="groupNumber"  label="物品名称" width="180">
                      </el-table-column>
                        <el-table-column prop="name" label="商品名称">
                      </el-table-column>
                      <el-table-column prop="saleUnitPrice" label="单价">
                      </el-table-column>
                      <el-table-column prop="quantity" label="数量">
                      </el-table-column>
                      <el-table-column prop="discountPercent" label="折扣">
                      </el-table-column>
                      <el-table-column prop="price" label="金额">
                      </el-table-column>
                      <el-table-column prop="memo" label="备注">
                      </el-table-column>
                    </el-table>
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

            <!-- 分页器 START-->
            <div class="" style="float: right;margin-top: 10px;">
              <el-pagination @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-size="12" layout="total, prev, pager, next, jumper" :total="totalPage">
              </el-pagination>
            </div>
            <!-- 分页器 END-->

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
import { getOrder } from "@/api/getData";


export default {
  props: ["dialogVisible", "customerData"],
  mixins: [DialogMixin, apiResultMixin],
  data() {
    return {
      top: "0" /* 去除直接传 0 产生的 需要参数为string的警告 */,
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
      orderDatasByUserId: {}, //根据会议ID提交SerVer,返回的订单数据
      orderDataByNumber: {},  //根据订单号number提交SerVer,返回对应的订单数据
      expenseTableData: [], //主表格数据
      expendRow: [],  //UI需要
      totalPage: 0,  //分页器显示的总页数
      perPage: 12, //主表每页显示12行
      currentPage: 1,//根据分页器的选择,提交SerVer数据,表示当前是第几页
      getOrderDataById: {},  //某行展开后提交SerVer后得到的数据,这样做是为了把已经从SerVer得到的数据保存起来,下次不用再次提交SerVer,减少SerVer交互
    };
  },
  methods: {
   //根据会员ID得到该会员的所有订单
    async getOrdersByUserId(data) {
      this.orderDatasByUserId = await findOrders(data);
    },
    //根据订单number得到该订单数据
    async getOrderByNumber(number) {
      this.orderDataByNumber = await getOrder(number);
    },
    //打开窗口时事件处理函数-----根据分页器,显示第一页数据
    openWindow() {
      let requestDataByUserId = { //查询条件
        "page": this.currentPage, //分页器选择的当前页数
        "per_page": 12, //每页显示12行数据
        "q": {
          "user_id_eq": this.customerData.id  //根据顾客的id
        }
      };
      this.getOrdersByUserId(requestDataByUserId).then(() => {
        this.totalPage = this.orderDatasByUserId.total_count;  //得到当前共计多少页
        this.expenseTableData = this.buildOrders(this.orderDatasByUserId); //数据整理
        console.log("得到了会员得订单数据了!");
        for (let [index, elem] of this.expenseTableData.entries()) {
          //  console.log(elem.number);
          this.getOrderByNumber(elem.number).then(() => {
            this.getOrderDataById = this.buildOrderFromApiResult(this.orderDataByNumber);
            this.expenseTableData[index].getOrderDataById = this.getOrderDataById;
            this.getOrderDataById = {};
            this.orderDataByNumber = {};
          });
        }
      });
    },
    //表格展开后的事件处理函数
    expandChange(row, expandedRows) {
      // if (this.findIsOpenFlag(row.number) === false) {  //意思是没有找到,前一个状态时没有展开,刚刚被展开,故需要和SevVer交互
      //   this.isOpenFlag[row.number] = true; //展开了,打开了
      //   this.getOrderFromSverVer(row.number); //根据number号得到SerVer数据
      //   this.isGetOrederFlag[row.number] = true; //只要是展开过,就保存
      // } else {  //关闭了展开
      //   delete this.isOpenFlag[row.number];
      // }
    },
    //去标志对象中去找,找到返回true,没有找到返回false
    findIsOpenFlag(id) {
      if (this.isOpenFlag.hasOwnProperty(id)) {
        return true;
      } else {
        return false;
      }
    },
    //从服务器获取该number信息
    // getOrderFromSverVer(number) {
    //   console.log("getOrderFromSverVer ----------- " + number);
    //   if (this.isGetOrederFlag.hasOwnProperty(number) === false) {  //说明没有提交过SerVer,下一步需要提交SerVer,getOrder 
    //     this.getOrderByNumber(number).then(() => {
    //       this.getOrderDataById = this.buildOrderFromApiResult(this.orderDataByNumber);
    //       let num = this.expenseTableData.findIndex(function (value, index, arr) {
    //         return (value.number == number);
    //       });
    //       this.expenseTableData[num].getOrderDataById = this.getOrderDataById;
    //     });
    //   } else {  //说明已经和SerVer交互过了,可以在本地数据找了
    //     //暂时没有可做的
    //   }
    // },
    //分页器的改变选择时事件处理函数
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.currentPage = val;
      console.log(this.currentPage);
      let requestDataByUserId = { //查询条件
        "page": this.currentPage, //分页器选择的当前页数
        "per_page": 12, //每页显示12行数据
        "q": {
          "user_id_eq": this.customerData.id  //根据顾客的id
        }
      };
      this.getOrdersByUserId(requestDataByUserId).then(() => {
        this.expenseTableData = this.buildOrders(this.orderDatasByUserId);
        console.log("得到了会员得订单数据了!");
      });
    },
    //鼠标进入表格时事件处理函数 
    // mouseEnter(row, column, cell, event) {
    //   if (this.findIsOpenFlag(row.number) === false) {  //意思是没有找到,前一个状态时没有展开,刚刚被展开,故需要和SevVer交互
    //     this.isOpenFlag[row.number] = true; //展开了,打开了
    //     this.getOrderByNumber(row.number).then(() => {
    //       this.getOrderDataById = this.buildOrderFromApiResult(this.orderDataByNumber);
    //       let num = this.expenseTableData.findIndex(function (value, index, arr) {
    //         return (value.number == row.number);
    //       });
    //       this.expenseTableData[num].getOrderDataById = this.getOrderDataById;
    //     });
    //   }
    // },
     objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        let group = row.group
        let i  = group.lineItems.findIndex( (item)=>{
           return row.id == item.id 
        } )
        // console.log("group",group,i)
        if ( i === 0) {
          return {
            rowspan:  group.lineItems.length,
            colspan: 1
          };
        } else {
          return {
            rowspan: 0,
            colspan: 0
          };
        }
      }
    }
  }
};
</script>
