<style lang="scss">
@import "~@/style/mixin";
.members-container {
  background-color: #f9f9f9;
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
    .search-input{
      width: 24em;
    }
  }
  .member-list-wrap{
    position: absolute;
    top: 0px;
    left: 0px;
    right: 0px;
    bottom: 0px;

    .member-list{
      position: absolute;
      top: 70px;
      left: 18px;
      right: 18px;
      bottom: 60px;
      background-color: #ffffff;
      .el-tag{
        &.enabled{
          color: #67C23A;
        }
        &.replaced{
          color: #E6A23C;
        }
        &.disabled{
          color: #909399;
        }
      }
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
<div class="">
  <headTop></headTop>
  <leftNav></leftNav>
  <div class="members-container page-content">
    <member-center-new :dialog-visible.sync="memberCenterNewWindowVisible" :customer-data.sync="customerData" @customer-changed-event="handleCustomerChanged"></member-center-new>
    <sms-center  :dialog-visible.sync="smsCenterWindowVisible" ></sms-center>
    <div class="members">
      <div class="member-list-wrap">
        <div class="filters">
          <el-form :inline="true" class="demo-form-inline">
              <el-form ref="form" :model="formData" label-width="70px" :inline="true">
                <store-select  v-bind:value.sync="formData.storeId" disable-all="true" v-if="authorizeMultiStore()"/>

                <el-form-item label="关键字">
                  <el-input class="search-input" placeholder="请输入手机号/姓名/会员卡号" prefix-icon="el-icon-search" size="mini" v-model="formData.keyword" clearable @clear="handleResetForm"></el-input>
                </el-form-item>

                <el-form-item label="会员" prop="hasCard" >
                  <el-select v-model="formData.hasCard" placeholder="" size="mini" clearable placeholder="不限" @clear="handleClear">
                    <el-option v-for="item in cardOptions" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>

                <el-form-item>
                  <el-button type="primary" @click="handleSearch" size="mini">搜索</el-button>
                </el-form-item>
                <input type="text" name="disableentrykeysubmit" style="display:none">
                <el-form-item class="right">
                  <el-button type="primary" @click="handleSmsCenter" size="mini">短信群发</el-button>
                </el-form-item>

              </el-form>
          </el-form>
        </div>
        <!-- 表格     END -->
        <div class="member-list grid-content">
              <el-table class="cel-scrollable-table" :data="customerList" style="width:100%;" border>
                <el-table-column prop="number" label="会员编号" width="128" align="center">
                </el-table-column>
                <el-table-column prop="storeName" label="注册门店">
                </el-table-column>
                <el-table-column prop="userName" label="会员姓名">
                  <template slot-scope="scope">
                    {{scope.row.userName}}  <span v-show="scope.row.cards.length==0"> [{{scope.row.customerType}}] </span>
                  </template>
                </el-table-column>
                <el-table-column prop="mobile" label="电话" width="125">
                </el-table-column>
                <el-table-column prop="displayGender" label="性别" width="70" align="center">
                </el-table-column>
                <el-table-column  label="卡号" >
                  <template slot-scope="scope">
                    <el-tag  v-for="(item, index) in scope.row.cards" :key="item.id" :class="item.state">
                      <i class="el-icon-circle-check-outline" v-show="item.state=='enabled'"></i>
                      <i class="el-icon-circle-close-outline" v-show="item.state=='disabled'"></i>
                      <i class="el-icon-refresh" v-show="item.state=='replaced'"></i>
                      {{item.code}}
                    </el-tag>
                  </template>
                </el-table-column>
                <el-table-column prop="displayCreatedDate" label="注册日期" width="120" align="center">
                </el-table-column>
                <el-table-column label="操作" width="160" align="center">
                  <template slot-scope="scope">
                      <el-button size="mini" type="success" @click="handleEdit(scope.$index, scope.row)">详情</el-button>
                      <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)" v-show="userAuthorize('deleteCustomer')">删除</el-button>
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
</div>
</template>

<script>
import _ from "lodash"

import leftNav from "@/components/layout/LeftNav.vue"
import headTop from "@/components/layout/headTop.vue";

import StoreSelect from '@/components/common/StoreSelect.vue'
import MemberCenterNew from "./MemberCenterNew.vue";
import SmsCenter from "./SmsCenter.vue";
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
    leftNav,
    headTop,
    StoreSelect,
    "member-center-new": MemberCenterNew,
    "sms-center": SmsCenter
  },
  data() {
    return {
      cardOptions: [{label:'是',value: 1},{label:'否',value: 0}],
      memberCenterNewWindowVisible: false,
      smsCenterWindowVisible: false,
      customerList: [],
      perPage: 12,
      count: 0, // 当前页有多少行
      totalCount: 0, // 表一共有多少行
      currentPage: 1, //根据分页器的选择,提交SerVer数据,表示当前是第几页
      totalPage: 0, //分页器显示的总页数
      inputValue: "", //输入框输入的值
      formData: {
        keyword: '',
        cardRequired: false,
        hasCard: null,
        storeId: null
      },
      customerData: {
        cards: [] // 修正memberCenterNew内部引用 customerData.cards.length 的错误
      }
    };
  },
  created: function(){
    this.formData.storeId = this.storeId
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
          q:{
            store_id_eq: this.formData.storeId,
            s:[ 'created_at desc']
          }
      }
      // storeId 永远为当前选择的，由store-select 更新
      // 是否必须会员卡
      if( this.formData.hasCard != null ){
        if( this.formData.hasCard == 1 ){
          params.q.cards_status_eq = 1
        }
        if( this.formData.hasCard == 0 ){
          params.q.cards_status_null = true
        }
      }
      // 会员 电话号码或卡号 关键字
      if( this.formData.keyword.length>0){
        params.q.mobile_or_username_or_cards_code_cont = this.formData.keyword
      }
      return params
    },
    //分页器的改变选择时事件处理函数
    handlePageChange(val) {
      this.currentPage = val
      this.initData()
    },
    // 没有使用
    searchCustomersAsync: _.debounce((keyword, vm) => {
      findCustomers({
        q: {
          store_id_eq: vm.storeId,
          mobile_or_username_or_cards_code_cont: keyword
        }
      }).then((result) => {
        vm.customerList = vm.buildCustomers(result)
        vm.count = result.total_count
      })
    }, 450),
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
      this.currentPage = 1
      this.initData()
    },
    handleResetForm(){
      this.currentPage = 1
      this.initData()
    },
    handleSmsCenter(){
      this.smsCenterWindowVisible = true;  //打開Sms中心窗口
    },
    handleClear() {
      this.formData.hasCard = null
    },
  }
};
</script>
