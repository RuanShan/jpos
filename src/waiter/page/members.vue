<style lang="scss">
.members-container {
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
  .member-list-wrap{
    position: absolute;
    top: 100px;
    left: 18px;
    right: 18px;
    bottom: 100px;
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
  .pagination-wrap{
     position: absolute;
     bottom: 15px;right:4%;
     margin-top: 10px;
  }
}
</style>


<template>
<div class="members-container page-content">
  <member-center-new :dialog-visible.sync="memberCenterNewWindowVisible" :customer-data="customerData"></member-center-new>
  <div class="members">
    <div class="title-wrap">

      <div>会&nbsp;&nbsp;&nbsp;员</div>
    </div>
    <el-form :inline="true" class="demo-form-inline">

      <div class="filters">
        <div class="filter">
          <el-form-item label="关键字">
            <el-input placeholder="请输入会员编号/会员电话/会员姓名" prefix-icon="el-icon-search" size="mini" v-model="inputValue"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSearch()" size="mini">搜索</el-button>
          </el-form-item>
        </div>
      </div>
    </el-form>

    <!-- 表格     END -->
        <div class="member-list-wrap grid-content bg-purple-light">
          <el-table class="cel-scrollable-table" :data="customerList" style="width:100%;" border>
            <el-table-column prop="id" label="ID" width="80">
            </el-table-column>
            <el-table-column prop="username" label="会员姓名" width="140">
            </el-table-column>
            <el-table-column prop="mobile" label="电话" width="140">
            </el-table-column>
            <el-table-column prop="sex" label="性别" width="80">
            </el-table-column>
            <el-table-column  label="卡号">
              <template slot-scope="scope">
                <el-tag  v-for="(card, index) in scope.row.cards">{{card.code}}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="memo" label="备注">
            </el-table-column>
            <el-table-column label="操作" width="160">
              <template slot-scope="scope">
                  <el-button size="mini" type="success" @click="handleEdit(scope.$index, scope.row)">详情</el-button>
                  <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                </template>
            </el-table-column>
          </el-table>
        </div>

    <!-- 表格     END -->
    <!-- 分页器 START-->
    <div class="pagination-wrap">
      <el-pagination @current-change="handlePageChange" :current-page.sync="currentPage" :page-size="perPage" layout="total, prev, pager, next, jumper" :total="count">
      </el-pagination>
    </div>
    <!-- 分页器 END-->
  </div>
</div>
</template>

<script>
import MemberCenterNew from "@/components/MemberCenterNew.vue";
import {
  findCustomers
} from "@/api/getData";
// import { DialogMixin } from "@/components/mixin/DialogMixin";
import {
  apiResultMixin
} from '@/components/apiResultMixin';


export default {
  mixins: [apiResultMixin],
  components: {
    "member-center-new": MemberCenterNew
  },
  data() {
    return {
      memberCenterNewWindowVisible: false,
      customerList: [],
      perPage: 12,
      count: 0, // 当前页有多少行
      totalCount: 0, // 表一共有多少行
      currentPage: 1, //根据分页器的选择,提交SerVer数据,表示当前是第几页
      totalPage: 0, //分页器显示的总页数
      inputValue: "", //输入框输入的值
      customerData: {}
    };
  },
  created: function(){
    this.initData();
    //新订单创建以后，需要更新当前选择客户的会员卡余额数据
    this.$bus.$on('customer-created-gevent', () => {
      this.initData();
    })
  },
  methods: {
    async initData(){
      let queryParams = {
          page: this.currentPage,
          per_page: this.perPage,
          "q[store_id_eq]": this.storeId
      }
      const result =  await findCustomers(queryParams)
      this.customerList = this.buildCustomers( result )
      this.count = result.total_count
    },

    //分页器的改变选择时事件处理函数
    handlePageChange(val) {
      console.log(`当前页: ${val}`);
      this.currentPage = val;
      console.log(this.currentPage);
      let requestDataByUserId = { //查询条件
        "page": this.currentPage, //分页器选择的当前页数
        "per_page": this.perPage //每页显示12行数据

      };
      this.getOrdersByUserId(requestDataByUserId).then(() => {
        this.expenseTableData = this.buildOrders(this.orderDatasByUserId);
        console.log("得到了会员得订单数据了!");
      });
    },
    //添加会员卡点击事件处理函数-----
    addCard() {

    },
    //编辑按钮处理事件
    handleEdit(index, row) {
      console.log(index, row);
      console.log("会员中心记录");
      this.customerData = row
      this.memberCenterNewWindowVisible = true;  //打開會員中心窗口

    },
    //删除按钮处理事件
    handleDelete(index, row) {
      console.log(index, row);
    }
  }
};
</script>
