<style lang="scss">
@import "../style/mixin";
.process-item-container {
  position: relative;
  .item-list-wrap {
    position: absolute;
    top: 80px;
    bottom: 0;
    left: 0;
    width: 40%;
    border: 1px #efefef solid;
    .item-list {
      position: absolute;
      top: 8px;
      left: 8px;
      right: 8px;
      bottom: 48px;
      overflow-y: auto;
    }
    .pagination {
      position: absolute;
      right: 16px;
      bottom: 16px;
      left: 0;
    }
  }
  .item-detail {
    table {
      width: 100%;
    }

    position: absolute;
    width: 60%;
    top: 80px;
    bottom: 0;
    right: 0;
    padding: 16px;
    border: 1px #efefef solid;
    .order-detail-container {
      position: absolute;
      top: 8px;
      bottom: 50px;
      left: 8px;
      right: 8px;
      overflow-y: auto;
    }
    .head {
      font-size: 15px;
      padding: 6px;
      border-bottom: 1px #efefef solid;
    }
    .line-item-group {
      border: 1px solid #ebeef5;
    }
    table tr {
      vertical-align: top;
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
  .filters {
    margin: 0 0 20px;
    border: 1px #efefef solid;
    padding: 10px;
    background: #f9f9f9;
    .filter {
      display: inline-block;
      width: auto;
      padding: 10px;
      border-radius: 5px;
      .el-select {
        display: inline-block;
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
        <div class="left back">
          <i class="el-icon-back" @click="handleCloseDialog()"></i>
        </div>
        <div> 订单处理</div>s
      </div>

      <div class=" fillcontain clear">
        <!-- filters start -->
        <div class="filters">
          <div class="filter">
            关键字:
            <el-input label="Keyword" placeholder="请输入物品编号" v-model="filters.keyword"></el-input>
          </div>
          <el-button type="primary" @click="handleSearch()">搜索</el-button>
        </div>
        <!-- filters end -->
        <div class="item-list-wrap">
          <div class="item-list">
            <el-table :data="itemList" highlight-current-row @current-change="handleCurrentRowChange" :row-key="row => row.index" style="width: 100%">
              <el-table-column label="物品编号" prop="number">
              </el-table-column>
              <el-table-column label="订单Id" prop="orderId">
              </el-table-column>
              <el-table-column label="总价格" prop="price">
              </el-table-column>
              <el-table-column label="物品状态" prop="displayState">
              </el-table-column>
              <el-table-column label="订单时间" prop="displayCreatedAt">
              </el-table-column>
            </el-table>
          </div>
          <div class="pagination" style="text-align: left;margin-top: 10px;">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentPageChange" :current-page.sync="currentPage" :page-size="perPage" layout="total,  pager" :total="count">
            </el-pagination>
          </div>
        </div>
        <div class="item-detail">
          <div class="order-detail-container" v-if="orderDetail">
            <div class="customer">
              <div class="head"> 客户信息</div>
              <div>
                <table border="1" cellspacing="0">
                  <tr>
                    <th>客户电话 </th>
                    <td> {{ orderCustomer.mobile }} </td>
                    <th>客户姓名 </th>
                    <td> {{ orderCustomer.name }} </td>
                    <th>客户类型 </th>
                    <td> {{ orderCustomer.displayType }} </td>
                  </tr>
                  <tr>
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

            <div>
              <div class="head"> 订单信息 {{orderDetail.number}} </div>
              <div v-for="group in orderDetail.lineItemGroups" class="line-item-group">
                <div class="head"> 物品 {{group.number}} {{group.state}} </div>
                <table border="1" cellspacing="0" style="width: 100%">
                  <tr>
                    <th>序号</th>
                    <th>服务项目</th>
                    <th>项目备注</th>
                    <th>状态</th>
                  </tr>
                  <template v-for="(lineItem,index ) in group.lineItems">
                    <tr>
                      <td>{{ index+1 }}</td>
                      <td>{{ lineItem.cname }}</td>
                      <td>{{ lineItem.memo }}</td>
                      <td>{{ lineItem.state }}</td>
                    </tr>
                  </template>
                </table>

                <div class="head"> 物品图片

                </div>
                <div class="clear">
                  <div v-show="group.images.length==0">  </div>

                  <el-upload
                    :file-list="group.uploadedImages"
                    :action="group.imageUploadPath"
                    name="image[attachment]"
                    list-type="picture-card"
                    :with-credentials="true"
                    :on-preview="handlePictureCardPreview"
                    :on-remove="handleRemove">
                    <i class="el-icon-plus"></i>
                  </el-upload>

                </div>
              </div>
            </div>

          </div>
          <div class="actions">
            <el-button @click="cancelOrder()">取消订单</el-button>
            <el-button @click="ChangeCurrentItemState(false)">编辑</el-button>
            <el-button @click="ChangeCurrentItemState(false)">上一步</el-button>
            <el-button @click="ChangeCurrentItemState(true)" type="primary">下一步</el-button>
          </div>
        </div>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="imageDialogVisible">
      <el-carousel :initial-index="0"	 arrow="always" :autoplay="false">
        <el-carousel-item v-for="item in 4" :key="item">
          <h3>{{ item }}</h3>
        </el-carousel-item>
      </el-carousel>
    </el-dialog>
  </div>
</template>

<script>
import {
  getOrder,
  findLineItemGroups,
  evolveLineItemGroups,
  cancelOrder,
  deleteGroupImage,
  getLineItemGroupImageUploadPath
}
from '@/api/getData'

import {
  CelUIMixin
} from '@/components/mixin/CelUIMixin';

import {
  DialogMixin
} from '@/components/mixin/DialogMixin'


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
      filters: {
        keyword: '',
        startEndTime: null,
        groupState: '',
        storeId: 0
      },
      multipleSelection: [],
      imageUploadPath: null,
      imageDialogVisible: false
    }
  },
  mixins: [DialogMixin, CelUIMixin],
  props: ['dialogVisible', 'orderState', 'itemCounts'],
  components:{  },
  created() {  },
  computed: {  },
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
          store_id_eq: this.storeId,
          state_eq: this.orderState
        }
      }
      if (this.filters.keyword.length > 0) {
        // item.number || item.users.username
        params["q[number_cont]"] = this.filters.keyword
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
      this.itemDetailList = []
      this.filters.groupState = this.orderState
      this.initData()
      console.log('handleDialogOpen yeah')
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
    },

    handleCurrentPageChange(val) {
      this.currentPage = val
      this.offset = (val - 1) * this.limit
      this.initData()
    },
    async handleCurrentRowChange(row) {
      if (row) {
        this.currentItem = row
        console.log('handleCurrentRowChange', row, this.currentItem)
        if (row.orderDetail == null) {
          const orderResult = await getOrder(row.orderId)

          row.orderDetail = this.buildOrder(orderResult)
          console.log('orderDetail', row.orderDetail)
        }
        this.orderDetail = row.orderDetail
        this.orderCustomer = this.orderDetail.customer
        this.orderDetail.lineItemGroups.forEach((group)=>{
          group.imageUploadPath = getLineItemGroupImageUploadPath( group.id)

          group.uploadedImages = group.images.map((img)=>{
            return Object.assign( img, {name: img.attachmentFileName, url: img.bigUrl}  )
          })
        })


      } else {
        this.currentItem = null
        this.orderDetail = null
      }
    },
    cancelOrder(){
      let id = this.orderDetail.id

      this.cancelOrderConfirm( ( )=>{
        cancelOrder( id ).then((res)=>{
          if( res.id ){
            this.$emit('order-state-changed')

            if( this.itemList.length == 1 && this.currentPage > 1 ){
              this.handlePageChange( this.currentPage -1 )
            }else{
              this.initData()
            }
            this.$message({
              type: 'success',
              message: "恭喜你，订单取消成功"
            })
          }
        })
      })
    },
    imageuploaded(res) {
      if (res.errcode == 0) {
        this.src = 'http://img1.vued.vanthink.cn/vued751d13a9cb5376b89cb6719e86f591f3.png';
      }
    },
    handleRemove(file, fileList) {
      deleteGroupImage( file.groupId, file.id ).then(()=>{
        console.log(file, fileList);
      })
    },
    handlePictureCardPreview(file) {
      //this.dialogImageUrl = file.originalUrl;
      //this.imageDialogVisible = true;
    }
  }
}
</script>
