<style lang="scss">
@import '../style/mixin';
@import '../style/print';

.transfer-product-container {
    position: relative;
    .order-list {
        position: absolute;
        top: 80px;
        bottom: 0;
        left: 0;
        right: 0;
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
    .el-transfer{
      width: 80%;height: 100%;
      margin: 0 auto;
      .el-transfer-panel{
        width: 40%;
        height: 100%;
      }
    }
    .pagination {
        position: absolute;
        right: 16px;
        bottom: 16px;
    }
    .print{
      float: right;
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
        }
        .el-input {
            width: 150px;
            display: inline-block;
        }
    }

}



</style>

<template>

<el-dialog title="提示" :visible="computedVisible" fullscreen :before-close="handleDialogClose" @open="handleDialogOpen">
    <div id="printable" class="print-only">
      this is test
      <el-table :data="printableData"  style="width: 100%">
        <el-table-column prop="number" label="Number"  width="180">  </el-table-column>
        <el-table-column prop="name" label="Name"  width="180">  </el-table-column>
        <el-table-column prop="created_at" label="created_at">  </el-table-column>
      </el-table>

    </div>


    <div class="transfer-product-container fillcontain clear">
        <!-- filters start -->
        <div class="filters">
            <div class="filter">
                关键字:
                <el-input label="Keyword" placeholder="请输入订单号或用户名" v-model="filters.keyword" @change="handleKeywordChange"></el-input>
            </div>
            <div class="filter">
                状态:
                <el-select v-model="filters.groupState" placeholder="All">
                    <el-option v-for="item in orderStateOptions" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
            </div>
            <el-button type="primary" @click="handleSearch()">搜索</el-button>

            <el-button class="print" type="primary" @click="handlePrint()">Print</el-button>
        </div>
        <!-- filters end -->

        <div class="order-list">
            <el-transfer v-model="transferedItemIds" :data="lineItemGroupList" :props="{key:'id', label:'name'}" @change="handleTransferItems"></el-transfer>
        </div>

    </div>
</el-dialog>

</template>

<script>

import {
    findLineItemGroups, findOrderByGroupNumber, evolveLineItemGroups
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

import{ printMixin } from '@/components/mixin/print'

export default {
    data() {
            return {
                currentOrder: null,
                currentGroup: null,// a order may have several line_item_groups
                orderDetailList: [],
                lineItemGroupList: [],
                itemList: [],
                transferedItemIds: [],
                perPage: 100,
                storeId: null,
                filters: {
                    keyword: '',
                    startEndTime: null,
                    groupState: '',
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
                }],

            }
        },
        mixins: [userDataMixin, apiResultMixin, printMixin],
        props: ['dialogVisible', 'orderState','nextOrderState', 'orderCounts'],
        created() {
        },
        computed: {
            computedVisible: function() {
                return this.dialogVisible
            },
            printableData: function(){
                return this.lineItemGroupList.filter((item)=>{ return item.state === this.nextOrderState})
            }

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
                let groupNumbers = [ this.currentGroup.number ]

                this.changeGroupToNextState( groupNumbers,forward )
            },

            async changeGroupToNextState( ids = [], forward = true) {
                let queryParams = {
                    ids,
                    forward
                }
                const groupsReturn = await evolveLineItemGroups(queryParams)
                if (groupsReturn.count > 0) {
                  this.$emit('order-state-changed')
                }
                //return groupsReturn.count
            },

            handleDialogClose(done) {

                this.$emit('update:dialogVisible', false)
                done();

            },
            handleDialogOpen(){
              this.filters.keyword = ""
              this.lineItemGroupList.length = 0
              this.transferedItemIds.length = 0
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
            async handleTransferItems(){
              let changeToPrevious = []
              let chagneToNext = []
              console.log( "handleTransferItems", this.transferedItemIds )
              this.lineItemGroupList.forEach( (item)=>{
                if( this.transferedItemIds.includes( item.id )){
                  if( item.state !== this.nextOrderState){
                    chagneToNext.push( item )
                  }
                }else{
                  if( item.state !== this.orderState){
                    changeToPrevious.push( item )
                  }
                }
              })
              if( changeToPrevious.length>0){
                let ids = changeToPrevious.map((item)=>{ return item.id })
                this.changeGroupToNextState(ids, false ).then(()=>{
                  changeToPrevious.forEach( (item)=>{
                    item.state = this.orderState
                  })
                })
              }
              if( chagneToNext.length>0){
                let ids = chagneToNext.map((item)=>{return item.id} )
                this.changeGroupToNextState( ids, true ).then(()=>{
                  chagneToNext.forEach( (item)=>{
                    item.state = this.nextOrderState
                  })
                })
              }


            },
            async getLineItemGroups() {
                let queryParams = {
                    page: this.currentPage,
                    per_page: this.perPage,
                    q: {state_in: [this.orderState, this.nextOrderState]}
                }

                const itemsResult = await findLineItemGroups(queryParams)
                this.count = itemsResult.total_count
                this.lineItemGroupList.splice( 0, this.lineItemGroupList.length, ...this.buildItemGroupsFromApiResult(itemsResult))
                this.lineItemGroupList.forEach((item)=>{
                  if( item.state ===  this.nextOrderState ){
                    this.transferedItemIds.push( item.id )
                  }
                })

                console.log("itemsResult", itemsResult, "itemList",this.itemList)
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

            },
            handlePrint(){
              //console.log("printableData", this.printableData)
              console.log("getPrinters", this.getPrinters())
              
              //var printWin = window.open('','','left=0,top=0,width=1,height=1,toolbar=0,scrollbars=0,status  =0')
              //printWin.focus()
              //window.print()
            }

        }
}

</script>
