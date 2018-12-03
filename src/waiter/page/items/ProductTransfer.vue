<style lang="scss">
@import '../../style/print';

.transfer-product-container {
    position: relative;
    .order-list {
        position: absolute;
        top: 60px;
        bottom: 0;
        left: 0;
        right: 0;
        padding: 16px;
        .actions {
            position: absolute;
            bottom: 16px;
            left: 16px;
            right: 16px;
            text-align: right;
        }
    }
    .el-transfer {
        width: 80%;
        height: 100%;
        margin: 0 auto;
        .el-transfer-panel {
            width: 40%;
            height: 100%;
            .el-transfer-panel__body{
              position: absolute;
              left: 0;
              right: 0;
              top: 40px;
              bottom: 0;
              height: auto;
              overflow-y: auto;
              .el-transfer-panel__list{
                height: auto;
              }
              .el-transfer-panel__item{
                .el-checkbox__input{
                  top: 18px;
                }
                height: 60px;
                line-height: 60px;
                .item{
                  display: flex;
                }
                .title{
                  padding: 5px;
                  line-height: 24px;
                  text-overflow: ellipsis;
                }
                .image-wrap {
                  width: 60px;
                  height: 60px;
                  text-align: center;
                  line-height: 60px;
                  display: inline-block;
                  img{
                    max-width: 50px;
                    max-height: 50px;
                    vertical-align: middle;
                  }
                }
              }
            }
        }
    }
    .pagination {
        position: absolute;
        right: 16px;
        bottom: 16px;
    }
    .print {
        float: right;
        margin: 10px;
    }

    .formData {
        border: 1px #efefef solid;
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

.transfer-table-wrap{
  .general {
    th{
      width: 8em;
    }
    td,th{
      text-align: center;
      border: 1px solid #333;
    }
  }
}
</style>

<template>
  <div class="cel-window">
    <el-dialog :visible="computedVisible" @open="handleDialogOpen"  :show-close="false"  :top="top" :modal="false">

      <div slot="title" class="title-wrap">
        <div class="left back"> <i class="el-icon-back" @click="handleCloseDialog()"></i> </div>
        <div> 订单处理</div>
      </div>

      <div class="transfer-product-container fillcontain clear">
        <!-- formData start -->
        <div class="formData">
          <div class="filter">
            关键字:
            <el-input label="Keyword" placeholder="请输入物品编号" v-model="formData.keyword" clearable @clear="handleSearch" size="mini"></el-input>
          </div>
          <!-- <div class="filter">
            状态:
            <el-select v-model="formData.groupState" placeholder="All">
              <el-option v-for="item in orderStateOptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </div> -->
          <el-button type="primary" @click="handleSearch" size="mini">搜索</el-button>

          <el-button class="print" type="primary" @click="handlePrint" size="mini">打印</el-button>
        </div>
        <!-- formData end -->

        <div class="order-list">
          <el-transfer v-model="transferedItemIds" :data="lineItemGroupList" :props="{key:'id', label:'name'}" :titles="[orderStateText, nextOrderStateText]" @change="handleTransferItems">
            <div slot-scope="{ option }" class="item">
              <div class="image-wrap">
                <img :src="option.defulatImageUrl" alt="">
              </div>
              <div class="title">
                <p class="">{{ option.number }} </p>
                <p class="">{{ option.name }}</p>
               </div>
            </div>
          </el-transfer>
        </div>

      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  findLineItemGroups,
  findOrderByGroupNumber,
  evolveLineItemGroups
}
from '@/api/getData'

import {
  DialogMixin
} from '@/components/mixin/DialogMixin'

export default {
  data() {
    return {
      top: '0', /* 去除直接传 0 产生的 需要参数为string的警告 */
      currentOrder: null,
      currentGroup: null, // a order may have several line_item_groups
      orderDetailList: [],
      lineItemGroupList: [],
      itemList: [],
      transferedItemIds: [],
      perPage: 500,
      formData: {
        keyword: '',
        startEndTime: null,
        groupState: '',
        storeId: 0
      },
      multipleSelection: [],
    }
  },
  mixins: [DialogMixin],
  props: ['selectedStoreId', 'dialogVisible', 'dialogTitle', 'orderState', 'nextOrderState', 'orderCounts'],
  created() {},
  computed: {

    printableData: function() {
      return this.lineItemGroupList.filter((item) => {
        return item.state === this.nextOrderState
      })
    },
    orderStateText: function(){
      // '准备发工厂', 在 工厂接收 界面 显示 "工厂待接收"
      if( this.orderState ==="ready_for_factory" ){
        return "工厂待接收"
      }else{
        return this.getOrderStateText( this.orderState)
      }
    },
    nextOrderStateText: function(){
      return this.getOrderStateText( this.nextOrderState)
    },

  },
  methods: {
    initData() {
      this.getLineItemGroups()
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

      this.changeGroupToNextState(groupNumbers, forward)
    },

    async changeGroupToNextState(ids = [], forward = true) {
      let params = {
        ids,
        forward
      }
      const groupsReturn = await evolveLineItemGroups(params)
      if (groupsReturn.count > 0) {
        this.$emit('order-state-changed')
      }
      //return groupsReturn.count
    },

    handleDialogOpen() {
      this.formData.keyword = ""
      this.lineItemGroupList.length = 0
      this.transferedItemIds.length = 0
      this.formData.storeId = this.selectedStoreId
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
    async handleTransferItems() {
      let changeToPrevious = []
      let chagneToNext = []
      console.log("handleTransferItems", this.transferedItemIds)
      this.lineItemGroupList.forEach((item) => {
        if (this.transferedItemIds.includes(item.id)) {
          if (item.state !== this.nextOrderState) {
            chagneToNext.push(item)
          }
        } else {
          if (item.state !== this.orderState) {
            changeToPrevious.push(item)
          }
        }
      })
      if (changeToPrevious.length > 0) {
        let ids = changeToPrevious.map((item) => {
          return item.id
        })
        this.changeGroupToNextState(ids, false).then(() => {
          changeToPrevious.forEach((item) => {
            item.state = this.orderState
          })
        })
      }
      if (chagneToNext.length > 0) {
        let ids = chagneToNext.map((item) => {
          return item.id
        })
        this.changeGroupToNextState(ids, true).then(() => {
          chagneToNext.forEach((item) => {
            item.state = this.nextOrderState
          })
        })
      }

    },
    async getLineItemGroups() {
      let params = {
        page: this.currentPage,
        per_page: this.perPage,
        q: {
          order_state_eq: this.OrderStateEnum.cart,
          state_in: [this.orderState, this.nextOrderState]
        }
      }
      if(this.formData.storeId>0){
        //如果不是工厂，添加当前店铺作为查询条件
        params.q.store_id_eq = this.storeId
      }
      if ( this.formData.keyword && this.formData.keyword.length > 0) {
        // item.number || item.users.username
        params.q.number_cont = this.formData.keyword
      }

      const itemsResult = await findLineItemGroups(params)
      this.count = itemsResult.total_count
      this.lineItemGroupList.splice(0, this.lineItemGroupList.length, ...this.buildLineItemGroups(itemsResult))
      this.lineItemGroupList.forEach((item) => {
        if (item.state === this.nextOrderState) {
          this.transferedItemIds.push(item.id)
        }
      })

      this.$store.commit('savePrintableOrders', this.printableData)

      console.log("itemsResult", itemsResult, "itemList", this.itemList)
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
        console.log("this.currentOrder", this.currentOrder, "this.currentGroup ", this.currentGroup, "number=", number)
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

    },
    handlePrint() {
      this.$store.commit('savePrintableOrders', this.printableData)
      console.log("printableOrders", this.printableOrders,  this.printableData)
      //console.log("printableData", this.printableData)
      //等待打印内容渲染完成后打印
      this.$nextTick(function () {
        window.print()
      })
    },
    handleSearch(){
      this.currentPage = 1
      this.initData()
    }
  }
}
</script>
