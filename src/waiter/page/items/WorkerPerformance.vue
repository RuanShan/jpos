<style lang="scss">
.worker-performance-container {
    position: relative;
    .order-list {
        position: absolute;
        top: 90px;
        bottom: 70px;
        left: 10%;
        width: 80%;
        padding: 0;
        border: 1px #efefef solid;
        .el-table{
          height: 100%;
          .el-table__body-wrapper{
            position: absolute;
            top: 50px;
            bottom: 50px;
            left: 0;
            right: 0;
            overflow-y: auto;
          }
        }
    }
    table {
        width: 100%;
        td {
            vertical-align: top;
        }
    }
    .pagination {
        position: absolute;
        right: 16px;
        bottom: 16px;
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
            .product-select {
                width: 300px;
            }
        }
        .el-input {
            display: inline-block;
        }
    }
    .actions {
        position: absolute;
        bottom: 16px;
        left: 10%;
        right: 10%;
        text-align: right;
    }
}
</style>

<template>
<div class="worker-performance-container cel-window">
  <item-scanner-dialog :dialog-visible.sync="scannerDialogVisible" @lineItemGroupsSelected="handleLineItemGroupsSelected" :state-filter="lineItemGroupStateFilter"></item-scanner-dialog>

  <el-dialog  :visible="computedVisible" @open="handleDialogOpen" :show-close="false" :top="top" :modal="false">
    <div slot="title" class="title-wrap">
      <div class="left back"> <i class="el-icon-back" @click="handleCloseDialog()"></i> </div>
      <div> 扫码验收</div>
    </div>
    <div class="worker-performance-container fillcontain clear">
      <!-- filters start -->
      <div class="filters">

        <div class="filter">
          工人:
          <el-select v-model="currentWorkerId" placeholder="全部">
            <el-option v-for="item in workerList" :key="item.id" :label="item.username" :value="item.id">
            </el-option>
          </el-select>
          工作:
          <el-select v-model="currentProductIds" multiple placeholder="全部" class="product-select">
            <el-option v-for="item in productList" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
          <el-button @click="handleOpenScannerDialog">开始扫码</el-button>

        </div>

      </div>
      <!-- filters end -->

      <div class="order-list">

        <el-table ref="lineItemsTable" :data="lineItems" highlight-current-row @current-change="handleCurrentRowChange" @selection-change="handleSelectionChange" :row-key="row => row.number" style="width: 100%">
          <el-table-column type="selection" width="55"> </el-table-column>

          <el-table-column label="物品编号" prop="groupNumber">
          </el-table-column>
          <el-table-column label="工作内容" prop="cname">
          </el-table-column>
          <el-table-column label="物品状态" prop="group.displayState">
          </el-table-column>
          <el-table-column label="订单时间" prop="displayCreatedAt">
          </el-table-column>

          <el-table-column label="工人">
            <template slot-scope="scope">
                        <p v-if="scope.row.worker_id>0">
                          <span v-for="worker in workerList" v-if="worker.id==scope.row.worker_id">
                            {{ worker.username }}
                          </span>
                        </p>

                      </template>
          </el-table-column>

        </el-table>


      </div>
      <div class="actions" v-if="orderState=='pending'">
        <el-button @click="ChangeCurrentGroupState(true)" type="primary">Receive</el-button>
      </div>
      <div class="actions" v-if="orderState=='processing'">
        <el-button type="primary" @click="handleFulfillLineItems()">确认工作量</el-button>
        <el-button @click="handleCloseDialog()">关闭窗口</el-button>
      </div>
    </div>
  </el-dialog>
</div>

</template>

<script>
import {
  getSellingServices,
  findUsers,
  fulfillLineItems,
  findOrderByGroupNumber
}
from '@/api/getData'

import {
  apiResultMixin
}
from '@/components/apiResultMixin'
import {
  DialogMixin
} from '@/components/mixin/DialogMixin'

import ItemScannerDialog  from './ItemScannerDialog.vue'

import _ from 'lodash'

export default {
  props: ['dialogVisible', 'orderState', 'orderCounts'],
  mixins: [DialogMixin, apiResultMixin],
  components: { 'item-scanner-dialog': ItemScannerDialog},
  data() {
    return {
      top: '0',
      /* 去除直接传 0 产生的 需要参数为string的警告 */
      currentOrder: null,
      currentGroup: null, // a order may have several line_item_groups
      currentWorkerId: null,
      currentProductIds: [],
      lineItems: [],
      lineItemGroups: [],
      workerList: [],
      productList: [],
      filters: {
        keyword: '',
        startEndTime: null,
        lineItemGroupState: '',
      },
      multipleSelection: [],
      scannerDialogVisible: false,
      lineItemGroupStateFilter: []
    }
  },
  created() {

  },
  computed: {
    computedVisible: function() {
      return this.dialogVisible
    },
    computedCurrentWorkName(){
      let worker = this.workerList.find((w)=>{ return w.id == this.currentWorkerId })
      console.log( " computedCurrentWorkName=", worker)
      return worker ? worker.username : ''
    }
  },
  methods: {
    initData() {
      this.currentWorkerId = null
      let queryParams = {
        q: {
          spree_roles_name_eq: "worker"
        }
      }
      findUsers(queryParams).then((res) => {
        this.workerList = res.users
        if (this.workerList.length > 0) {
          this.currentWorkerId = this.workerList[0].id
        }
      })
      getSellingServices().then((res) => {
        this.productList = res.products
      })

      //let groupQueryParams = {
      //  q: {
      //    state_eq: "processing"
      //  }
      //}
      this.lineItemGroups = []
      this.lineItems = []
    },
    handleFulfillLineItems(forward = true) {
      let lineItemIds = this.multipleSelection.map((lineItem) => lineItem.id)
      if (lineItemIds.length == 0) {
        this.$message({
          message: '请选择需要确认工作量的工作，请检查复选框状态！',
          type: 'warning'
        });
        return;
      }

      this.fulfillLineItems(lineItemIds)
    },
    ChangeCurrentGroupState(forward = true) {
      if (this.currentGroup == null) {
        this.$message({
          message: '警告哦，Please select a order at least',
          type: 'warning'
        });
        return;
      }
      let groupNumbers = [this.currentGroup.number]

      this.MoveGroupToNextState(groupNumbers, forward)
    },

    async fulfillLineItems(lineItemIds = []) {
      let queryParams = {
        ids: lineItemIds,
        worker_id: this.currentWorkerId
      }
      console.log('handleFulfillLineItems', queryParams)
      const response = await fulfillLineItems(queryParams)
      if (response.count > 0) {
        this.lineItems.forEach((item,index)=>{
          let newLineItem = Object.assign( item, { worker_id: this.currentWorkerId })
          this.$set(this.lineItems, index, newLineItem )
        })
        //this.handleDiscardSelection()

        this.$emit('order-state-changed')

        this.$message({
          message: `${this.computedCurrentWorkName}的${response.count}项工作内容已经验收成功！`,
          type: 'success'
        });
      }
    },

    handleCloseDialog() {
      //用户点击 关闭窗口按钮，
      this.$emit('update:dialogVisible', false)
    },
    handleDialogOpen() {

      this.lineItemGroups = []
      this.initData()
      console.log('handleDialogOpen yeah')
    },
    handleKeywordChange(value) {
      const pattern = /[\d]{14}/
      if (pattern.test(value)) {
        this.findOrderByGroupNumber(value)
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
      console.log("handleSelectionChange=", this.multipleSelection)
    },
    handleDiscardSelection() {
      console.log("1handleDiscardSelection=", this.multipleSelection)
      _.remove(this.lineItems, (item) => {
        return this.multipleSelection.includes(item)
      })
      this.$refs.lineItemsTable.clearSelection();
      this.$refs.lineItemsTable.setCurrentRow();
      console.log("2handleDiscardSelection=", this.multipleSelection)
    },
    async handleCurrentRowChange(row) {
      if (row) {
        this.currentGroup = row;
        this.currentOrder = this.currentGroup.order

        console.log('handleCurrentRowChange', this.currentOrder, this.currentGroup)
      } else {
        this.currentGroup = null
        this.currentOrder = null
      }
    },
    async findOrderByGroupNumber(number) {
      // find in orderDetailList
      this.currentOrder = this.orderDetailList.find((order) => {
        let found = order.lineItemGroups.find((group) => {
          return group.number == number
        })
        return found != null
      })

      if (this.currentOrder) {
        this.currentGroup = this.currentOrder.lineItemGroups.find((group) => {
          return group.number == number
        })
        // not find in this.lineItemGroups, add it
        if (!this.lineItemGroups.includes(this.currentGroup)) {
          this.lineItemGroups.push(this.currentGroup)
        }

      } else {
        // find by network
        const orderResult = await findOrderByGroupNumber(number)
        const orderDetail = this.buildOrder(orderResult)
        this.currentOrder = orderDetail
        this.currentGroup = this.currentOrder.lineItemGroups.find(function(group, index) {
          return group.number == number
        })
        //this.orderDetail.find
        this.$nextTick(() => {
          this.orderDetailList.push(this.currentOrder)
          this.lineItemGroups.push(this.currentGroup)
        })
      }
    },
    handleOpenScannerDialog(){
      this.scannerDialogVisible = true
    },
    handleLineItemGroupsSelected( lineItemGroups ){
      this.lineItemGroups = lineItemGroups
      this.lineItems = _.flatten(this.lineItemGroups.map((group) => {
          return group.lineItems
      }))
    }
  }
}
</script>
