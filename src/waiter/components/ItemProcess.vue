<style lang="scss">
@import '../style/mixin';
.process-item-container {
    position: relative;
    .item-list-wrap {
        position: absolute;
        top: 80px;
        bottom: 0;
        left: 0;
        width: 40%;
        border: 1px #efefef solid;
        .item-list{
          position: absolute;
          top: 0;
          bottom: 48px;
          width: 100%;
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
        position: absolute;
        width: 60%;
        top: 80px;
        bottom: 0;
        right: 0;
        padding: 16px;
        border: 1px #efefef solid;
        .group-container {
            border-bottom: 1px solid #ebeef5;
        }
        table tr {
            vertical-align: top;
        }
        .actions {
            position: absolute;
            bottom: 16px;
            left: 16px;
            right: 16px;
            text-align: right;
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
    <el-dialog :visible="computedVisible" @open="handleDialogOpen"  :show-close="false" :top="top" :modal="false">
      <div slot="title" class="title-wrap">
        <div class="left back"> <i class="el-icon-back" @click="handleCloseDialog()"></i> </div>
        <div> 订单处理</div>
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
          <div class="line-item-groups-container" v-if="currentItem">
            <table class="bitemed" style="width: 100%">
              <tr>
                <td> 客户姓名 </td>
                <td> <span>{{ currentItem.userName }}</span></td>
              </tr>
              <tr>
                <td> 店铺名称 </td>
                <td> <span>{{ currentItem.storeName }}</span></td>
              </tr>
            </table>
            <table style="width: 100%">
              <tr>
                <td> 物品编号 </td>
                <td> {{currentItem.number}} </td>
                <td> 状态 </td>
                <td> {{currentItem.state}} </td>
              </tr>
              <tr>
                <td> 服务项目 </td>
                <td>
                  <div v-for="lineItem in currentItem.lineItems">
                    <span>{{ lineItem.name }}</span>
                    <span>{{ lineItem.price }}</span>
                    <span>{{ lineItem.state }}</span>
                  </div>
                </td>
              </tr>
              <tr>
                <td>物品图片</td>
                <td> line item group images </td>
              </tr>
            </table>

            <div class="actions">
              <el-button @click="ChangeCurrentItemState(false)">删除</el-button>
              <el-button @click="ChangeCurrentItemState(false)">编辑</el-button>
              <el-button @click="ChangeCurrentItemState(false)">上一步</el-button>
              <el-button @click="ChangeCurrentItemState(true)" type="primary">下一步</el-button>
            </div>
          </div>

        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  findLineItemGroups,
  evolveLineItemGroups
}
from '@/api/getData'
import {
  userDataMixin,
  orderDataMixin
}
from '@/components/mixin/commonDataMixin'
import {
  apiResultMixin
}
from '@/components/apiResultMixin'
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

    }
  },
  mixins: [DialogMixin, userDataMixin, orderDataMixin, apiResultMixin],
  props: ['dialogVisible', 'orderState', 'itemCounts'],
  created() {
  },
  computed: {
  },
  methods: {
    async initData() {
      this.getLineItemGroups()
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
      let queryParams = {
        numbers: itemNumbers,
        forward
      }
      console.log('ChangeItemStates', queryParams)
      const posItemsReturn = await evolveLineItemGroups(queryParams)
      if (posItemsReturn.count > 0) {
        let itemCount = this.itemList.length - posItemsReturn.count
        if (itemCount <= 0) {
          if (this.currentPage > 0) {
            this.currentPage -= 1 // go previous page
          }
        }
        this.getLineItemGroups()
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
      this.getLineItemGroups()
    },
    async getLineItemGroups() {
      let queryParams = {
        page: this.currentPage,
        per_page: this.perPage,
        q:{
          store_id_eq: this.storeId,
          state_eq: this.orderState
        }
      }

      if (this.filters.keyword.length > 0) {
        // item.number || item.users.username
        queryParams["q[number_cont]"] = this.filters.keyword
      }


      console.log("queryParams", queryParams, this.userInfo)
      const itemsResult = await findLineItemGroups(queryParams)
      this.count = itemsResult.total_count
      this.itemList.splice(0, this.itemList.length, ...this.buildLineItemGroups(itemsResult))

    },
    handleCurrentRowChange(row) {
      if (row) {
        this.currentItem = row
        console.log('handleCurrentRowChange', row, this.currentItem)

      } else {
        this.currentItem = null
      }
    }
  }
}
</script>
