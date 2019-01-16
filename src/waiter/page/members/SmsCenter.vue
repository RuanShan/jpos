<style lang="scss">
.sms-container {

    .main-content {
        padding: 18px;
    }
    .box {
      .filters {
        padding: 16px;
        .el-form-item {
          margin: 0;
        }
        .search-input{
          width: 24em;
        }
      }
        border: 1px solid #ebeef5;
        .member-profile {
          position: absolute;
          left: 0;
          right: 0;
          height: 160px;
          bottom: 16px;
            padding: 0 16px;
            .head {
                line-height: 36px;
            }
            .member-table {
                th {
                    border: 1px solid #ebeef5;
                }
                td {
                    width: 12.5%;
                    border: 1px solid #ebeef5;
                }
            }
        }
        .customers-wrap {
          padding: 0 16px;
          position: absolute;
          left: 0;
          right: 0;
          top: 0;
          bottom: 176px;

          .customer-records-wrap {
              position: absolute;
              top: 70px;
              left: 18px;
              right: 18px;
              bottom: 60px;
              background-color: #ffffff;
              overflow: auto;
              &.nocard-records-wrap{
                top:34px;
              }
              border: 1px solid #ebeef5;
              .customer{
                width: 25%;
                float: left;
                padding: 6px;
              }
          }
          .empty{
            min-height: 60px;
            text-align: center;
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
          }
          .pagination-wrap{
             position: absolute;
             bottom: 15px;right:4%;
             margin-top: 10px;
          }
          .check-all-wrap{
            position: absolute;
            bottom: 15px;left:4%;
            margin-top: 10px;
          }
        }
    }
}
</style>

<template>
<div class="sms-container " >
  <div class="cel-window">
    <!-- 会员添加窗口 -> START -->
    <el-dialog :visible="computedVisible" :close-on-press-escape="false" :show-close="false" :top="'0'" :modal="false" @open="openWindow()">
      <div slot="title" class="title-wrap">
        <div class="left back"> <i class="el-icon-back" @click="handleCloseDialog()"></i> </div>
        <div class="right "> <i class="el-icon-close" @click="handleCloseDialog()"></i> </div>
        <div>短信中心</div>
      </div>
      <!-- <el-button type="danger" @click="test()">主要按钮</el-button> -->
      <div class="box  fillcontain">

        <!-- 会员基本信息 END-->
        <div class="customers-wrap" style=" ">
          <div class="filters">
            <el-form :inline="true" class="demo-form-inline">
                <el-form ref="form" :model="formData" label-width="70px" :inline="true">
                  <el-form-item label="关键字">
                    <el-input class="search-input" placeholder="请输入会员编号/会员电话/会员姓名" prefix-icon="el-icon-search" size="mini" v-model="formData.keyword" clearable @clear="handleResetForm"></el-input>
                  </el-form-item>
                  <el-form-item label="">
                    <el-checkbox  size="mini" v-model="formData.cardRequired" > 拥有会员卡</el-checkbox>
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" @click="handleSearch" size="mini">搜索</el-button>
                  </el-form-item>
                  <input type="text" name="disableentrykeysubmit" style="display:none">
                </el-form>
            </el-form>
          </div>
          <div class="customer-records-wrap scrollable"  >
            <div class="empty" v-if="customerList.length==0"> </div>
            <el-checkbox-group v-model="checkedCustomerList" @change="handleCheckedCustomersChange" class="clear">
              <div class="customer" v-for="customer in customerList" :key="customer.id">
                <el-checkbox :label="customer.id" border>{{customer.userName}} {{customer.mobile}}  </el-checkbox>
              </div>
            </el-checkbox-group>
          </div>
          <!-- 分页器 START-->
          <div class="check-all-wrap">
            <el-checkbox :indeterminate="formData.isIndeterminate" v-model="formData.checkAll" @change="handleCheckAllChange">全选</el-checkbox>
          </div>
          <div class="pagination-wrap">
            <el-pagination @current-change="handlePageChange" @size-change="handlePageSizeChange"	:page-sizes=[100,500,1000,2000]	:current-page.sync="pageSize" :page-size="perPage" layout="total, sizes, prev, pager, next" :total="count">
            </el-pagination>
          </div>
        </div>

        <!-- 会员基本信息 START-->
        <div class="member-profile" style="background-color:#F2F6FC">
          <div class="head">
            <div class="filters">
              <el-form :inline="true" class="demo-form-inline">
                  <el-form ref="form" :model="formData" label-width="70px" :inline="true">
                    <el-form-item label="短信模板">

                      <el-select v-model="formData.templateCode" placeholder="请选择" size="mini">
                        <el-option
                          v-for="item in smsTemplates"
                          :key="item.code"
                          :label="item.cname"
                          :value="item.code">
                          <span style="float: left">{{ item.cname }}</span>
                          <span style="float: right; color: #8492a6; font-size: 13px">{{ item.desc }}</span>
                        </el-option>
                      </el-select>
                    </el-form-item>

                    <input type="text" name="disableentrykeysubmit" style="display:none">
                    <el-form-item class="right">
                      <el-button type="primary" @click="handleSendSms" size="mini">发送短信</el-button>
                    </el-form-item>

                  </el-form>
              </el-form>
            </div>
          </div>
        </div>

      </div>

    </el-dialog>
  </div>
</div>
</template>


<script>
import {
  DialogMixin
} from "@/components/mixin/DialogMixin";

import {
  CelUIMixin
} from "@/components/mixin/CelUIMixin";

import {
  findCustomers, sendSms
} from "@/api/getData";


export default {
  props: ["dialogVisible", "customerData"],
  mixins: [DialogMixin, CelUIMixin],
  components: {

  },
  data() {
    return {
      customerList: [],
      checkedCustomerList: [],
      formData: {
        keyword: '',
        storeId: null,
        templateCode: null,
        checkAll: false,
        isIndeterminate: false,
        cardRequired: false
      },
      smsTemplates: [],
      perPage: 100,
      pageSize: 1,
      count: 0
    };
  },
  created(){
    // handle user repay
    this.$bus.$on('customer-changed-gevent', (newCustomer) => {
      console.log('on customer-changed-gevent')
      this.initData()
    })
  },
  computed: {
  },
  methods: {
    openWindow() {
      this.formData.storeId = this.storeId
      this.pageSize = 1
      console.log( "this.storeInfo.siteSmsTemplate= ", this.storeInfo.siteSmsTemplate)
      this.smsTemplates = this.storeInfo.siteSmsTemplate
    },

    async initData() {
      let params = this.buildParams()
      const result =  await findCustomers(params)
      this.customerList = this.buildCustomers( result )
      this.count = result.total_count

    },
    buildParams(){
      let params = {
          page: this.pageSize,
          per_page: this.perPage,
          q:{  }
      }
      // storeId 永远为系统设置store
      if( this.formData.storeId ){
        params.q.store_id_eq = this.formData.storeId
      }

      // 会员 电话号码或卡号 关键字
      if( this.formData.keyword.length>0){
        params.q.mobile_or_username_or_cards_code_cont = this.formData.keyword
      }
      // 是否必须会员卡
      if( this.formData.cardRequired){
        params.q.cards_status_eq = 1
      }

      return params
    },

    //接收到会员卡卡卡编辑窗口子组件发射来的事件处理函数-----
    handleSearch(){
      this.pageSize = 1
      this.initData()
    },
    handleResetForm(){
      this.pageSize = 1
      this.initData()
    },
    //分页器的改变选择时事件处理函数
    handlePageChange(val) {
      this.pageSize = val
      this.initData()
    },
    handlePageSizeChange( val ){
      this.pageSize = val
      this.handleSearch()
    },
    handleSendSms(){
      if( this.checkedCustomerList.length ==0){
        this.$message.error('请选择发送短信的客户！')
        return
      }
      if( this.formData.templateCode  ==null){
        this.$message.error('请选择发送短信的模板！')
        return
      }
      this.actionConfirm("确定发送短信吗?", ()=>{
        let template_code = this.formData.templateCode
        sendSms( { ids: this.checkedCustomerList, template_code} ).then((response) => {
          console.log('收到的response = ', response)
          if (response.ret) {
            this.$message.success('短信发送成功！')
          }else{
            this.$message.success('短信发送失败，请联系系统管理员！')
          }
        })
        console.log( "handleSendSms = ", this.checkedCustomerList)

      })
    },
    handleCheckAllChange(val) {
      this.checkedCustomerList = val ? this.customerList.map((item)=>item.id) : [];
      this.formData.isIndeterminate = false;
    },
    handleCheckedCustomersChange( value){
      let checkedCount = value.length;
      console.log( "handleCheckedCustomersChange= ", value)
      this.formData.checkAll = checkedCount === this.customerList.length;
      this.formData.isIndeterminate = checkedCount > 0 && checkedCount < this.customerList.length;
    }

  }

};
</script>
