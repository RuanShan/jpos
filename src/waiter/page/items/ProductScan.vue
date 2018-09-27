<style lang="scss">

.scan-product-container {
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
        width: 70%;
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
        width: 80%;
        margin: 0 auto;
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

    <div class="scan-product-container fillcontain clear">
        <!-- filters start -->
        <div class="filters">
            <div class="filter">
                关键字:
                <el-input label="Keyword" placeholder="请输入物品编号" v-model="filters.keyword" @change="handleKeywordChange"></el-input>
            </div>
            <div class="filter">
                状态:
                <el-select v-model="filters.lineItemGroupState" placeholder="All">
                    <el-option v-for="item in orderStateOptions" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
            </div>
            <el-button type="primary" @click="handleSearch()">搜索</el-button>
        </div>
        <!-- filters end -->

        <div class="order-list">

            <el-table ref="lineItemGroupTable" :data="lineItemGroupList" highlight-current-row @current-change="handleCurrentRowChange" @selection-change="handleSelectionChange" :row-key="row => row.number" style="width: 100%">
               <el-table-column  type="selection"  width="55"> </el-table-column>

                <el-table-column label="物品编号" prop="number">
                </el-table-column>
                <el-table-column label="订单状态" prop="state">
                </el-table-column>

            </el-table>

            <div class="actions" v-if="orderState=='pending'">
                <el-button @click="ChangeCurrentGroupState(true)" type="primary">Receive</el-button>
            </div>

            <div class="actions" v-if="orderState=='processing'">
              <el-button  @click="handleCloseDialog()">关闭窗口</el-button>

              <el-button type="primary" @click="ChangeGroupStates()">验收</el-button>
            </div>
            <div class="actions" v-if="orderState=='processed'">
              <el-button @click="ChangeGroupStates(false)">取消验收</el-button>
            </div>


        </div>

        </div>
    </div>
</el-dialog>

</template>

<script>

import {
    findOrderByGroupNumber, evolveLineItemGroups
}
from '@/api/getData'

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
                orderDetailList: [],
                lineItemGroupList: [],
                filters: {
                    keyword: '',
                    startEndTime: null,
                    lineItemGroupState: '',
                },
                multipleSelection: [],
            }
        },
        mixins: [ apiResultMixin],
        props: ['dialogVisible', 'orderState', 'orderCounts'],
        created() {
            console.log('scanProduct created')
        },
        computed: {
            computedVisible: function() {
                return this.dialogVisible
            }
        },
        methods: {
            async initData() {
            },
            ChangeGroupStates(forward = true) {
                let groupNumbers = this.multipleSelection.map((order) => order.number)
                if (groupNumbers.length == 0) {
                    this.$message({
                        message: '警告哦，Please select a order at least',
                        type: 'warning'
                    });
                    return;
                }

                this.MoveGroupToNextState( groupNumbers,forward )
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

            async MoveGroupToNextState( groupNumbers = [], forward = true) {
                let queryParams = {
                    numbers: groupNumbers,
                    forward
                }
                console.log('ChangeGroupStates', queryParams)
                const groupsReturn = await evolveLineItemGroups(queryParams)
                if (groupsReturn.count > 0) {
                  this.handleDiscardSelection(  )
                  this.$emit('order-state-changed')
                }
            },

            handleDialogClose(done) {
                this.$emit('update:dialogVisible', false)
                done();
            },
            handleCloseDialog(){
                //用户点击 关闭窗口按钮，
                this.$emit('update:dialogVisible', false)
            },
            handleDialogOpen(){
              this.filters.keyword = ""
              this.filters.lineItemGroupState = this.orderState
              this.lineItemGroupList.length = 0
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
              _.remove( this.lineItemGroupList, (group)=>{
                return this.multipleSelection.includes(group)
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
                const orderDetail = this.buildOrder(orderResult)
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
