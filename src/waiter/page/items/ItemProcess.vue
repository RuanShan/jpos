<style lang="scss">
.process-item-container {
  position: relative;
  .fillcontain{
    background: #f9f9f9;
  }
  .item-list-wrap {
    position: absolute;
    top: 70px;
    bottom: 10px;
    left: 0;
    width: 45%;
    .item-list {
      position: absolute;
      top: 0;
      left: 10px;
      right: 0;
      bottom: 48px;
      .image-wrap {
        width: 60px;
        height: 60px;
        text-align: center;
        line-height: 60px;
        display: inline-block;
        img{
          max-width: 60px;
          max-height: 60px;
          vertical-align: middle;
        }
      }
      .group-number{
        word-break: keep-all;
        white-space: nowrap;
      }
      th,td{ text-align: center; }
    }
    .pagination {
      position: absolute;
      right: 16px;
      bottom: 16px;
      .el-pager li{
        background-color: transparent;
      }
    }
  }
  .item-detail {
    table {
      width: 100%;
      td,th{
        padding: 6px 10px;
        border: 1px solid #ebeef5;
      }
      tr {
        vertical-align: top;
      }
    }

    position: absolute;
    width: 55%;
    top: 70px;
    bottom: 0;
    right: 0;
    .order-detail-container {
      position: absolute;
      top: 0;
      bottom: 60px;
      left: 8px;
      right: 8px;
      overflow-y: auto;
      background-color: #fff;
    }
    .head{
      span{
        display: inline-block;
        padding: 6px;
        color: #fff;
        background-color: #6a3906;
        border-radius: 3px;
      }
      i{
        color: #fff;
      }
      padding: 10px 0 10px 0;
    }
    .subtitle {
        padding: 6px;
        color: #6a3906;
    }
    .line-item-group {
      .vue-xeditable-empty{
        font-style: normal;
      }
    }
    .item-image {
      float: left;
      width: 25%;
      padding: 8px;
      img {
        width: 100%;
        border-bottom: 1px #efefef solid;
      }
    }
    .actions {
      position: absolute;
      bottom: 16px;
      left: 16px;
      right: 16px;
      text-align: right;
    }
    .customer {
      td, th{
        width: 16.6666%
      }
    }
    .vue-xeditable input{ width: 95%;}
  }
  table.bordered {
    width: 100%;
    td {
      vertical-align: top;
      border-bottom: 1px solid #ebeef5;
    }
    tr:hover {
      background-color: #f5f7fa;
    }
  }
  .formData {
    border: 1px #efefef solid;
    /*padding: 10px;*/
    background: #f9f9f9;
    .filter {
      display: inline-block;
      width: auto;
      padding: 10px;
      border-radius: 5px;
      .el-select {
        display: inline-block;
      }
      .search-input{
        min-width: 240px;
      }
    }
    .el-input {
      width: 150px;
      display: inline-block;
    }
  }
}
</style>

<template>
  <div class="process-item-container cel-window">
    <el-dialog :visible="computedVisible" @open="handleDialogOpen" :show-close="false" :top="top" :modal="false">
      <div slot="title" class="title-wrap">
        <div class="left">
          <i class="el-icon-back" @click="handleCloseDialog()"></i>
        </div>
        <div class="right "> <i class="el-icon-close" @click="handleCloseDialog()"></i> </div>
        <div> 订单处理</div>s
      </div>

      <div class=" fillcontain clear">
        <!-- formData start -->
        <div class="formData">
          <div class="filter">
            关键字:
            <el-input label="Keyword" placeholder="请输入物品编号" v-model="formData.keyword" class="search-input" clearable @clear="handleClear" size="mini" minlength="2"></el-input>
          </div>
          <el-button type="primary" @click="handleSearch" size="mini">搜索</el-button>
        </div>
        <!-- formData end -->
        <div class="item-list-wrap">
          <div class="item-list" >
            <el-table class="cel-scrollable-table"   max-height="100%" border :data="itemList" highlight-current-row @current-change="handleCurrentRowChange" :row-key="row => row.index" style="width: 100%">
              <el-table-column  label="物品"  width="120">
                <template slot-scope="scope">
                  <div class="image-wrap">
                    <img :src="scope.row.imageUrl" alt="">
                  </div>
                  <div class="group-number">{{scope.row.number}} </div>
                </template>
              </el-table-column>

              <el-table-column label="订单ID" prop="orderId">
              </el-table-column>
              <el-table-column label="金额" prop="price"  width="70">
              </el-table-column>
              <el-table-column label="物品状态" prop="displayState">
              </el-table-column>
              <el-table-column label="订单时间" prop="displayCreatedAt">
              </el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button size="mini" @click="handlePrintGroupLabel(scope.$index, scope.row)">打印条码</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div class="pagination" style="">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentPageChange" :current-page.sync="currentPage" :page-size="perPage" layout="total, prev, pager, next" :total="count">
            </el-pagination>
          </div>
        </div>
        <div class="item-detail">
          <div class="order-detail-container scrollable">
            <div class="order-detail " v-if="orderDetail">
              <div class="customer box">
                <div class="head">  <span> <i class="fa fa-user">  客户信息</i> </span> </div>
                <div>
                  <table border="1" cellspacing="0">
                    <tr>
                      <th>客户电话 </th>
                      <td> {{ orderCustomer.mobile }} </td>
                      <th>客户姓名 </th>
                      <td> {{ orderCustomer.userName }} </td>
                      <th>客户类型 </th>
                      <td> {{ orderCustomer.displayType }} </td>
                    </tr>
                    <tr  v-show="orderCustomer.prepaidCard.id">
                      <th>会员卡号 </th>
                      <td> {{ orderCustomer.prepaidCard.code }} </td>
                      <th>会员卡类型 </th>
                      <td> {{ orderCustomer.prepaidCard.name }} </td>
                      <th>会员卡余额 </th>
                      <td> {{ orderCustomer.prepaidCard.amountRemaining }} </td>
                    </tr>
                  </table>

                </div>
              </div>
              <div class="box">
                <div class="head"> <span> <i class="fa fa-calendar">   订单信息 {{orderDetail.number}}</i> </span> </div>

                <div class="box" v-show="caller=='store'">
                  <div class="subtitle"> 支付信息  状态: {{orderDetail.displayPaymentState}}  </div>
                  <div >
                    <table border="1" cellspacing="0" style="width: 100%">
                      <tr >
                        <th>支付方式</th>
                        <th>支付金额</th>
                        <th style="width:8em">状态</th>
                        <th style="width:8em">支付时间</th>
                      </tr>
                      <tr v-for="(payment,index ) in orderDetail.payments">
                        <td>{{payment.cname}}</td>
                        <td>{{payment.amount}}</td>
                        <td style="width:8em">{{payment.displayState}}</td>
                        <td style="width:8em">{{payment.displayCreatedAt}}</td>
                      </tr>
                    </table>
                  </div>
                </div>

                <div v-for="group in orderDetail.lineItemGroups" class="box line-item-group">
                  <div class="subtitle"> 物品编号: {{group.number}}   状态: {{group.displayState}}  </div>
                  <div class="box-body">
                    <table border="1"   cellspacing="0" style="width: 100%">
                    <tr>
                      <th style="width:3em">序号</th>
                      <th>服务项目</th>
                      <th>项目备注<i class="el-icon-edit"></i></th>
                      <th style="width:6em">状态</th>
                    </tr>
                    <template v-for="(lineItem,index ) in group.lineItems">
                      <tr>
                        <td>{{ index+1 }}</td>
                        <td>{{ lineItem.cname }}</td>
                        <td>
                          <vue-xeditable  :name="'memo_'+lineItem.id+'_xeditable'" v-model="lineItem.memo" type="text" @value-did-change="handleXeditableChanged" empty="无"></vue-xeditable>
                        </td>
                        <td>{{ lineItem.displayState }}</td>
                      </tr>
                    </template>
                  </table>
                  </div>
                  <div class="subtitle"> 物品图片 </div>
                  <div class="box-body clear">
                    <div v-show="group.images.length==0">  </div>

                    <el-upload
                      :disabled="isCallerFactory"
                      :file-list="group.uploadImages"
                      :action="group.imageUploadPath"
                      name="image[attachment]"
                      list-type="picture-card"
                      :with-credentials="true"
                      :multiple = "true"
                      :before-remove="handleImageRemoveConfirm"
                      :on-preview="handlePictureCardPreview"
                      :on-remove="handleImageRemoved"
                      :on-success="handleImageAdded">
                      <i class="el-icon-plus"></i>
                    </el-upload>

                  </div>
                </div>
              </div>
            </div>
            <div class="el-table__empty-block" v-if="!orderDetail"> <p class=" el-table__empty-text "> 暂无数据 </p></div>
          </div>
          <div class="actions" v-show="orderDetail">
            <el-button size="mini" @click="cancelOrder" class="hide">取消订单</el-button>
            <el-button size="mini" @click="handlePrintLabel" type="primary">打印所有条码</el-button>
            <!-- <el-button @click="ChangeCurrentItemState(false)">上一步</el-button>
            <el-button @click="ChangeCurrentItemState(true)" type="primary">下一步</el-button> -->
          </div>
        </div>
      </div>
    </el-dialog>
    <CelSwiper :carousel-images="carouselImages" :dialog-visible.sync="imageDialogVisible"> </CelSwiper>

  </div>
</template>

<script>
import {
  getOrder,
  findLineItemGroups,
  evolveLineItemGroups,
  deleteGroupImage,
  getLineItemGroupImageUploadPath,
  updateLineItem
}
from '@/api/getData'

import {
  CelUIMixin
} from '@/components/mixin/CelUIMixin';

import {
  DialogMixin
} from '@/components/mixin/DialogMixin'

import {
  PrintUtil
} from '@/utils/ipcService'

import CelSwiper from "@/components/dialog/CelSwiper.vue";

export default {
  data() {
    return {
      top: '0',
      /* 去除直接传 0 产生的 需要参数为string的警告 */
      itemList: [],
      currentItem: null,
      orderDetail: null,
      orderCustomer: {},
      itemDetailList: [],
      perPage: 12,
      count: 0,
      currentPage: 1,
      formData: {
        keyword: '',
        groupState: '',
        storeId: 0
      },
      multipleSelection: [],
      imageUploadPath: null,
      imageDialogVisible: false,
      carouselImages: [],
      uploadedFileUidGroupIdMap: {}
    }
  },
  mixins: [DialogMixin, CelUIMixin],
  props: ['selectedStoreId','dialogVisible', 'orderState', 'caller'],
  components:{  CelSwiper },
  created() {  },
  before_update() {
    console.log( "itemProcess->before_update")
  },
  computed:{
    isCallerFactory(){
      return this.caller == 'factory'
    }
  },
  methods: {
    async initData() {
      let params = this.buildParams()
      const itemsResult = await findLineItemGroups(params)
      this.count = itemsResult.total_count
      this.itemList = this.buildLineItemGroups(itemsResult)
    },
    buildParams(){
      let params = {
        page: this.currentPage,
        per_page: this.perPage,
        q:{
          order_state_eq: this.OrderStateEnum.cart,
          state_eq: this.orderState
        }
      }
      if( this.formData.storeId > 0 ){
        params.q.store_id_eq = this.formData.storeId
      }
      if ( this.formData.keyword && this.formData.keyword.length > 0) {
        // item.number || item.users.username
        params.q.number_cont = this.formData.keyword
      }
      return params
    },
    ChangeItemStates(forward = true) {
      let itemNumbers = this.multipleSelection.map((item) => item.number)
      if (itemNumbers.length == 0) {
        this.$message({
          message: '警告哦，Please select a item at least',
          type: 'warning'
        });
        return;
      }

      this.MoveItemToNextState(itemNumbers, forward)
    },
    ChangeCurrentItemState(forward = true) {
      if (this.currentItem == null) {
        this.$message({
          message: '警告哦，Please select a item at least',
          type: 'warning'
        });
        return;
      }
      let itemNumbers = [this.currentItem.number]
      this.MoveItemToNextState(itemNumbers, forward)
    },

    async MoveItemToNextState(itemNumbers = [], forward = true) {
      let params = {
        numbers: itemNumbers,
        forward
      }
      console.log('ChangeItemStates', params)
      const posItemsReturn = await evolveLineItemGroups(params)
      if (posItemsReturn.count > 0) {
        let itemCount = this.itemList.length - posItemsReturn.count
        if (itemCount <= 0) {
          if (this.currentPage > 0) {
            this.currentPage -= 1 // go previous page
          }
        }
        this.initData()
        this.$emit('order-state-changed')
      }
    },

    handleSelectionChange(val) {
      this.multipleSelection = val
    },

    handleDialogOpen() {
      console.log('handleDialogOpen yeah')
      console.log( "this.$refs.itemlist.clientHeight->",  this.$refs.itemlist )
      this.itemDetailList = []
      this.formData.groupState = this.orderState
      this.formData.storeId = this.selectedStoreId
      this.initData()

    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
    },

    handleCurrentPageChange(val) {
      this.currentPage = val
      //this.offset = (val - 1) * this.limit
      this.initData()
    },
    async handleCurrentRowChange(row) {
      if (row) {
        this.currentItem = row
        console.log('handleCurrentRowChange', row, this.currentItem)
        //if (row.orderDetail == null) {
          const orderResult = await getOrder(row.orderId)
          row.orderDetail = this.buildOrder(orderResult)
        //}
        this.orderDetail = row.orderDetail
        this.orderCustomer = this.orderDetail.customer
        this.orderDetail.lineItemGroups.forEach((group)=>{
          group.uploadImages = group.images.map((image)=>{ return Object.assign({}, image) })
          group.imageUploadPath = getLineItemGroupImageUploadPath( group.id)

        })
        console.log('orderDetail', row.orderDetail)

      } else {
        this.currentItem = null
        this.orderDetail = null
      }
    },
    cancelOrder(){
    },
    handleImageRemoved(file, fileList) {
      let image = this.getGroupImageOfUploadedFile( file )
      deleteGroupImage( image.groupId, image.id ).then(()=>{
        // 删除图片从group.images
        this.orderDetail.lineItemGroups.forEach((group)=>{
          if( group.id == image.groupId){
            group.images.splice(group.images.indexOf( image ),1)
          }
        })
        console.log(file, fileList);
      })
    },
    handleImageAdded(response, file, fileList){
      const image = this.buildGroupImage( response )
      this.orderDetail.lineItemGroups.forEach((group)=>{
        if( group.id == image.groupId){
          //设置 image.group，以便handlePictureCardPreview 查找group.images
          image.group = group
          group.images.push( image )
          // 更新filelist中相应image
          this.uploadedFileUidGroupIdMap[file.uid] = image
          //fileList.splice(fileList.indexOf( file ), 1, image)
        }
      })
      console.log(response, file, fileList)
    },

    handlePictureCardPreview(file) {
      console.log("file:", file );
      let image = this.getGroupImageOfUploadedFile( file )
      let images = image.group.images
      this.carouselImages = images
      //this.dialogImageUrl = file.originalUrl;
      this.imageDialogVisible = true;
    },
    handleImageRemoveConfirm(file, fileList){
      return this.$confirm('此操作将永久删除该图片, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
    },
    getGroupImageOfUploadedFile( file ){
      return file.type == "GroupImage" ? file : this.uploadedFileUidGroupIdMap[file.uid]
    },
    handleXeditableChanged(newValue, xeditableName) {
      console.log("newValue=" + newValue + " xeditableName=" + xeditableName)
      //示例：groupnumber_1_xeditable
      let [column, id] = xeditableName.split('_')
      id = parseInt(id)
      let lineItem = this.orderDetail.lineItems.find((item)=>{ return item.id== id })
      let newAttribute = { [column]: newValue }
      let params = { order_number: lineItem.order.number, line_item: newAttribute }
      updateLineItem(lineItem.id, params).then((res)=>{
        if( res.id ){
          // 更新orderDetail中的值
          console.log(" old1=", lineItem, "new=", newAttribute)

          Object.assign( lineItem, newAttribute)
          // 更新groupList中lineItem的值
          this.itemList.forEach((group)=>{
            if(group.id== lineItem.groupId){
              group.lineItems.forEach((item)=>{
                if( item.id == lineItem.id){
                  console.log(" old2=", item, "new=", newAttribute)
                  Object.assign( item, newAttribute )
                }
              })
            }
          })
        }
      })
      //this.orderItemList.splice(index, 1, newLineItem)
    },
    handleSearch(){
      this.currentPage = 1
      this.initData()
    },
    handleClear(){
      this.currentPage = 1
      this.initData()
    },
    handlePrintLabel(){
      let printParams = { order: this.orderDetail, labelPrinter: this.storeInfo.labelPrinter, labelPrintCount: this.storeInfo.labelPrintCount }
      PrintUtil.printLabel( printParams )
    },
    handlePrintGroupLabel( i, lineItemGroup){
      // 打印当前group的条码
      let order = Object.assign( {}, lineItemGroup.order )
      order.lineItemGroups = [ lineItemGroup ]
console.log( "handlePrintGroupLabel=", lineItemGroup.lineItems)
      let printParams = { order, labelPrinter: this.storeInfo.labelPrinter, labelPrintCount: this.storeInfo.labelPrintCount }
      PrintUtil.printLabel( printParams )
    }
  }
}
</script>
