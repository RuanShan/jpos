<style lang="scss">
@import '../style/mixin';
.worker-performance-container {
    position: relative;
    .order-list {
        position: absolute;
        top: 80px;
        bottom: 0;
        left: 10%;
        width: 80%;
        padding: 16px;
        border: 1px #efefef solid;
        .actions {
            position: absolute;
            bottom: 16px;
            left: 16px;
            right: 16px;
            text-align: right;
        }
    }
    .order-detail {
        position: absolute;
        width: 0;
        top: 80px;
        bottom: 0;
        right: 0;
        padding: 16px;
        border: 1px #efefef solid;
        .group-container {
            border-bottom: 1px solid #ebeef5;
        }
        .actions {
            position: absolute;
            bottom: 16px;
            left: 16px;
            right: 16px;
            text-align: right;
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

}
</style>

<template>
<div class="worker-performance-container cel-window">
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
          <el-select v-model="currentWorkerId" placeholder="All">
            <el-option v-for="item in workerList" :key="item.id" :label="item.username" :value="item.id">
            </el-option>
          </el-select>
          工作:
          <el-select v-model="currentProductIds" multiple placeholder="All" class="product-select">
            <el-option v-for="item in productList" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>

        </div>
        <div class="filter" style="float:right;">
          关键字:
          <el-input label="Keyword" placeholder="请输入物品编号" v-model="filters.keyword" @change="handleKeywordChange"></el-input>
        </div>
      </div>
      <!-- filters end -->

      <div class="order-list">

        <el-table ref="lineItemGroupTable" :data="lineItemList" highlight-current-row @current-change="handleCurrentRowChange" @selection-change="handleSelectionChange" :row-key="row => row.number" style="width: 100%">
          <el-table-column type="selection" width="55"> </el-table-column>

          <el-table-column label="物品编号" prop="groupNumber">
          </el-table-column>
          <el-table-column label="工作内容" prop="name">
          </el-table-column>
          <el-table-column label="订单状态" prop="group.state">
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

        <div class="actions" v-if="orderState=='pending'">
          <el-button @click="ChangeCurrentGroupState(true)" type="primary">Receive</el-button>
        </div>

        <div class="actions" v-if="orderState=='processing'">

          <el-button @click="handleCloseDialog()">关闭窗口</el-button>

          <el-button type="primary" @click="handleFulfillLineItems()">确认工作量</el-button>
        </div>
      </div>

    </div>
  </el-dialog>
</div>
</template>

<script>
import {
  getProducts,
  findUsers,
  findLineItemGroups,
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

import _ from 'lodash'

export default {
  data() {
    return {
      top: '0',
      /* 去除直接传 0 产生的 需要参数为string的警告 */
      currentOrder: null,
      currentGroup: null, // a order may have several line_item_groups
      currentWorkerId: null,
      currentProductIds: [],
      lineItemList: [],
      lineItemGroupList: [],
      workerList: [],
      productList: [],
      filters: {
        keyword: '',
        startEndTime: null,
        lineItemGroupState: '',
      },
      multipleSelection: [],
    }
  },
  mixins: [DialogMixin, apiResultMixin],
  props: ['dialogVisible', 'orderState', 'orderCounts'],
  created() {

  },
  computed: {
    computedVisible: function() {
      return this.dialogVisible
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
      getProducts().then((res) => {
        this.productList = res.products
      })

      let groupQueryParams = {
        q: {
          state_eq: "processing"
        }
      }
      findLineItemGroups(groupQueryParams).then((res) => {

        this.count = res.total_count
        this.lineItemGroupList.splice(0, 0, ...this.buildLineItemGroups(res))
        console.log("computedLineItems", this.computedLineItems)
        this.lineItemList = _.flatten(this.lineItemGroupList.map((item) => {
          return item.lineItems
        }))
      })

    },
    handleFulfillLineItems(forward = true) {
      let lineItemIds = this.multipleSelection.map((lineItem) => lineItem.id)
      if (lineItemIds.length == 0) {
        this.$message({
          message: '警告哦，Please select a order at least',
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
        this.handleDiscardSelection()
        this.$emit('order-state-changed')
      }
    },

    handleCloseDialog() {
      //用户点击 关闭窗口按钮，
      this.$emit('update:dialogVisible', false)
    },
    handleDialogOpen() {

      this.lineItemGroupList = []
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
      _.remove(this.lineItemList, (item) => {
        return this.multipleSelection.includes(item)
      })
      this.$refs.lineItemGroupTable.clearSelection();
      this.$refs.lineItemGroupTable.setCurrentRow();
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
        // not find in this.lineItemGroupList, add it
        if (!this.lineItemGroupList.includes(this.currentGroup)) {
          this.lineItemGroupList.push(this.currentGroup)
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
          this.lineItemGroupList.push(this.currentGroup)
        })
      }

    }

  }
}
</script>
