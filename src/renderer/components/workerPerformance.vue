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
        .group-container{
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
        margin: 0 0 20px 0;
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
            .product-select{
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

<el-dialog title="提示" :visible="computedVisible" fullscreen :before-close="handleDialogClose" @open="handleDialogOpen">

    <div class="worker-performance-container fillcontain clear">
        <!-- filters start -->
        <div class="filters">

            <div class="filter">
              Worker:
              <el-select v-model="currentWorkerId" placeholder="All">
                  <el-option v-for="item in workerList" :key="item.id" :label="item.username" :value="item.id">
                  </el-option>
              </el-select>
              Product:
              <el-select v-model="currentProductIds" multiple placeholder="All" class="product-select">
                  <el-option v-for="item in productList" :key="item.id" :label="item.name" :value="item.id">
                  </el-option>
              </el-select>

            </div>
            <div class="filter" style="float:right;">
                关键字:
                <el-input label="Keyword" placeholder="请输入订单号或用户名" v-model="filters.keyword" @change="handleKeywordChange"></el-input>
            </div>
        </div>
        <!-- filters end -->

        <div class="order-list">

            <el-table ref="lineItemGroupTable" :data="lineItemList" highlight-current-row @current-change="handleCurrentRowChange" @selection-change="handleSelectionChange" :row-key="row => row.number" style="width: 100%">
               <el-table-column  type="selection"  width="55"> </el-table-column>

               <el-table-column label="GroupNumber" prop="groupNumber">
               </el-table-column>
               <el-table-column label="Name" prop="name">
               </el-table-column>
                <el-table-column label="订单状态" prop="group.state">
                </el-table-column>
                <el-table-column label="Worker" >
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
              <el-button type="danger" @click="handleDiscardSelection()">remove</el-button>
              <el-button @click="handleFulfillLineItems(false)">Cancel</el-button>

              <el-button type="primary" @click="handleFulfillLineItems()">OK</el-button>
            </div>
        </div>

    </div>
</el-dialog>

</template>

<script>

import {
    getProducts, findUsers, findLineItemGroups, fulfillLineItems, findOrderByGroupNumber
}
from '@/api/getData'
import {
    userDataMixin
}
from '@/components/userDataMixin'
import {
    apiResultMixin
}
from '@/components/apiResultMixin'

import _ from 'lodash'

export default {
    data() {
            return {
                currentOrder: null,
                currentGroup: null,// a order may have several line_item_groups
                currentWorkerId: null,
                currentProductIds: [],
                lineItemList: [],
                lineItemGroupList: [],
                workerList: [],
                productList: [],
                storeId: null,
                filters: {
                    keyword: '',
                    startEndTime: null,
                    lineItemGroupState: '',
                },
                multipleSelection: [],
                orderStateOptions: [{
                    value: 'pending',
                    label: '新订单'
                }, {
                    value: 'ready_for_factory',
                    label: '准备发工厂'
                }, {
                    value: 'processing',
                    label: 'processing'
                }, {
                    value: 'ready_for_store',
                    label: 'ready_for_store'
                }, {
                    value: 'ready',
                    label: '待交付'
                }]

            }
        },
        mixins: [userDataMixin, apiResultMixin],
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
              let queryParams = { q: { spree_roles_name_eq:"worker" } }
              findUsers(queryParams).then((res)=>{
                this.workerList = res.users
                if( this.workerList.length>0){
                  this.currentWorkerId = this.workerList[0].id
                }
              })
              getProducts().then((res)=>{
                this.productList = res.products
              })

              let groupQueryParams = { q: { state_eq:"processing" } }
              findLineItemGroups(groupQueryParams).then((res)=>{

                this.count = res.total_count
                this.lineItemGroupList.splice( 0, 0, ...this.buildItemGroupsFromApiResult(res))
                console.log("computedLineItems", this.computedLineItems)
                this.lineItemList = _.flatten( this.lineItemGroupList.map((item)=>{ return item.lineItems } ) )
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

                this.fulfillLineItems( lineItemIds )
            },
            ChangeCurrentGroupState(forward = true) {
                if (this.currentGroup == null) {
                    this.$message({
                        message: '警告哦，Please select a order at least',
                        type: 'warning'
                    });
                    return;
                }
                let groupNumbers = [ this.currentGroup.number ]

                this.MoveGroupToNextState( groupNumbers,forward )
            },

            async fulfillLineItems( lineItemIds = []) {
                let queryParams = {
                    ids: lineItemIds,
                    worker_id: this.currentWorkerId
                }
                console.log('handleFulfillLineItems', queryParams)
                const response = await fulfillLineItems(queryParams)
                if (response.count > 0) {
                  this.handleDiscardSelection(  )
                  this.$emit('order-state-changed')
                }
            },

            handleDialogClose(done) {

                this.$emit('update:dialogVisible', false)
                done();

            },
            handleDialogOpen(){

              this.lineItemGroupList.length = 0
              this.initData()
              console.log('handleDialogOpen yeah')
            },
            handleKeywordChange(value){
              const pattern = /[\d]{14}/
              if(pattern.test(value)){
                this.findOrderByGroupNumber( value )
              }
            },
            handleSelectionChange(val) {
                this.multipleSelection = val
                console.log("handleSelectionChange=", this.multipleSelection)
            },
            handleDiscardSelection(  ){
              console.log("1handleDiscardSelection=", this.multipleSelection)
              _.remove( this.lineItemList, (item)=>{
                return this.multipleSelection.includes(item)
              })
              this.$refs.lineItemGroupTable.clearSelection();
              this.$refs.lineItemGroupTable.setCurrentRow();
              console.log("2handleDiscardSelection=", this.multipleSelection)
            },
            async handleCurrentRowChange(row) {
                if( row ){
                  this.currentGroup = row;
                  this.currentOrder = this.currentGroup.order

                  console.log('handleCurrentRowChange', this.currentOrder, this.currentGroup)
                }else{
                  this.currentGroup = null
                  this.currentOrder = null
                }
            },
            async findOrderByGroupNumber(number) {
              // find in orderDetailList
              this.currentOrder = this.orderDetailList.find((order)=>{
                let found = order.lineItemGroups.find((group) => {
                  return group.number == number
                })
                return found != null
              })

              if( this.currentOrder ){
                this.currentGroup = this.currentOrder.lineItemGroups.find( (group)=>{
                  return group.number == number
                })
                // not find in this.lineItemGroupList, add it
                if( !this.lineItemGroupList.includes(this.currentGroup)){
                  this.lineItemGroupList.push(this.currentGroup)
                }
console.log( "this.currentOrder", this.currentOrder, "this.currentGroup ", this.currentGroup,  "number=",number)
              }else{
                // find by network
                const orderResult = await findOrderByGroupNumber(number)
                const orderDetail = this.buildOrderFromApiResult(orderResult)
                this.currentOrder = orderDetail
                this.currentGroup = this.currentOrder.lineItemGroups.find(function( group, index){
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
