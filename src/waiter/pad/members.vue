<style lang="scss">
@import "../style/mixin";
.members-container {
  .members .title-wrap {
    text-align: center;
    line-height: 56px;
    background-color: #cecece;
    // margin: 0 18px;
    border-bottom: 1px solid #d3dce6;
  }
  .filters {
    padding: 16px;
    .el-form-item {
      margin: 0;
    }
  }
  .member-list-wrap{
    position: absolute;
    top: 50px;
    left: 0px;
    right: 0px;
    bottom: 0px;
    background-color: #ffffff;

    .member-list{
      position: absolute;
      top: 80px;
      left: 18px;
      right: 18px;
      bottom: 80px;
    }
    .pagination-wrap{
       position: absolute;
       bottom: 15px;right:4%;
       margin-top: 10px;
    }
  }
}
</style>


<template>
<div class="members-container page-content">
  <member-center-new :dialog-visible.sync="memberCenterNewWindowVisible" :customer-data.sync="customerData" @customer-changed-event="handleCustomerChanged"></member-center-new>
  <div class="members">
    <div class="title-wrap">
      <div>会员</div>
    </div>
    <div class="member-list-wrap">
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
      <div class="member-list grid-content">
            <el-table class="cel-scrollable-table" :data="customerList" style="width:100%;" border>
              <el-table-column prop="id" label="ID" width="50">
              </el-table-column>
              <el-table-column prop="storeName" label="所属门店">
              </el-table-column>
              <el-table-column prop="username" label="会员姓名">
              </el-table-column>
              <el-table-column prop="mobile" label="电话" width="125">
              </el-table-column>
              <el-table-column prop="displayGender" label="性别" width="70">
              </el-table-column>
              <el-table-column  label="卡号" >
                <template slot-scope="scope">
                  <el-tag  v-for="(item, index) in scope.row.cards" :key="item.id">{{item.code}}
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
        <el-pagination @current-change="handlePageChange" :current-page.sync="currentPage" :page-size="perPage" layout="total, prev, pager, next" :total="count">
        </el-pagination>
      </div>
      <!-- 分页器 END-->
    </div>

  </div>
</div>
</template>

<script>
import MemberCenterNew from "@/components/MemberCenterNew.vue";
import {
  findCustomers, deleteCustomer
} from "@/api/getData";
// import { DialogMixin } from "@/components/mixin/DialogMixin";
import {
  CelUIMixin
} from '@/components/mixin/CelUIMixin';


export default {
  mixins: [CelUIMixin],
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
      let params = this.buildParams()
      const result =  await findCustomers(params)
      this.customerList = this.buildCustomers( result )
      this.count = result.total_count
    },
    buildParams(){
      let params = {
          page: this.currentPage,
          per_page: this.perPage,
          "q[store_id_eq]": this.storeId
      }
      return params
    },
    //分页器的改变选择时事件处理函数
    handlePageChange(val) {
      this.currentPage = val
      this.initData()
    },
    //添加会员卡点击事件处理函数-----
    addCard() {

    },
    //编辑按钮处理事件
    handleEdit(index, row) {
      console.log(index, row);
      this.customerData = row
      this.memberCenterNewWindowVisible = true;  //打開會員中心窗口
    },
    handleCustomerChanged( newCustomer ){
      let i = this.customerList.findIndex((item)=>{
        return item.id == newCustomer.id
      })
      this.customerList.splice(i,1, newCustomer)
    },
    //删除按钮处理事件
    handleDelete(index, row) {
      // 删除当前条数据，更新数据列表，
      // 如果是最后一条，返回上一页，
      // 如果当前是第一页，更新当前页即可
      let cid = row.id
      this.deleteConfirm( ( )=>{
        deleteCustomer( cid ).then((res)=>{
          if( res.ret== 'success'){
            if( this.customerList.length == 1 && this.currentPage > 1 ){
              this.handlePageChange( this.currentPage -1 )
            }else{
              this.initData()
            }
            this.$message({
              type: 'success',
              message: "恭喜你，客户删除成功"
            })
          }
        })
      })

      console.log(index, row);
    },
    //搜索按钮点击事件
    handleSearch(){

    }
  }
};
</script>
