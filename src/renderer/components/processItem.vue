<style lang="scss">

@import '../style/mixin';
@import '../style/element_ui_custom';

.item-process-container {
    position: relative;
    .item-list {
        position: absolute;
        top: 80px;
        bottom: 0;
        left: 0;
        width: 30%;
        padding: 16px;
        border: 1px #efefef solid;
    }
    .item-detail {
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
        table tr{
          vertical-align:top;
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
        tr:hover{
          background-color: #f5f7fa;
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
        }
        .el-input {
            width: 150px;
            display: inline-block;
        }
    }

}



</style>

<template>

<el-dialog :visible="computedVisible" fullscreen :before-close="handleDialogClose" @open="handleDialogOpen" :show-close="false" class="el-custom">
  <div slot="title" class="dialog-title-wrap">
    <div class="left back"> <i class="el-icon-back" @click="CloseDialog()"></i> </div>
    <div>  {{computedDialogTitle}} </div>
  </div>

    <div class="item-process-container fillcontain clear">
        <!-- filters start -->
        <div class="filters">
            <div class="filter">
                关键字:
                <el-input label="Keyword" placeholder="请输入物品编号" v-model="filters.keyword"></el-input>
            </div>
            <div class="filter">
                状态:
                <el-select v-model="filters.groupState" placeholder="All">
                    <el-option v-for="item in orderStateOptions" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
            </div>
            <el-button type="primary" @click="handleSearch()">搜索</el-button>
        </div>
        <!-- filters end -->

        <div class="item-list">
            <el-table :data="itemList" highlight-current-row @current-change="handleCurrentRowChange" :row-key="row => row.index" style="width: 100%">
              <el-table-column label="物品编号" prop="number">
              </el-table-column>
              <el-table-column label="订单Id" prop="orderId">
              </el-table-column>
                <el-table-column label="总价格" prop="cost">
                </el-table-column>
                <el-table-column label="订单状态" prop="state">
                </el-table-column>
            </el-table>
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
                    <el-button @click="ChangeCurrentItemState(false)">上一步</el-button>
                    <el-button @click="ChangeCurrentItemState(true)" type="primary">下一步</el-button>
                </div>
            </div>

        </div>
    </div>
</el-dialog>

</template>

<script>

import {
    getLineItemGroupList,  evolveLineItemGroups
}
from '@/api/getData'
import {
    userDataMixin, orderDataMixin
}
from '@/components/mixin/commonDataMixin'
import {
    apiResultMixin
}
from '@/components/apiResultMixin'


export default {
    data() {
            return {
                itemList: [],
                currentItem: null,
                itemDetailList: [],
                perPage: 2,
                count: 0,
                currentPage: 1,
                storeId: null,
                filters: {
                    keyword: '',
                    startEndTime: null,
                    groupState: '',
                    storeId: 0
                },
                multipleSelection: [],

            }
        },
        mixins: [userDataMixin, orderDataMixin, apiResultMixin],
        props: ['dialogVisible', 'orderState', 'itemCounts'],
        created() {
            console.log('processItem created')

        },
        computed: {
            computedVisible: function() {
                return this.dialogVisible
            },
            computedDialogTitle: function(){
              if( this.orderState == "pending"){
                return "新订单物品"
              }else if( this.orderState == "processing"){
                return "正在处理订单"
              }else if( this.orderState == "ready"){
                return "等待交付订单"
              }else{
                return "物品列表"
              }
            }
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

                this.MoveItemToNextState( itemNumbers,forward )
            },
            ChangeCurrentItemState(forward = true) {
                if (this.currentItem == null) {
                    this.$message({
                        message: '警告哦，Please select a item at least',
                        type: 'warning'
                    });
                    return;
                }
                let itemNumbers = [ this.currentItem.number ]
                this.MoveItemToNextState( itemNumbers,forward )
            },

            async MoveItemToNextState( itemNumbers = [], forward = true) {
                let queryParams = {
                    numbers: itemNumbers,
                    forward
                }
                console.log('ChangeItemStates', queryParams)
                const posItemsReturn = await evolveLineItemGroups(queryParams)
                if (posItemsReturn.count > 0) {
                  let itemCount = this.itemList.length - posItemsReturn.count
                  if( itemCount <= 0 ){
                    if( this.currentPage > 0){
                      this.currentPage -= 1// go previous page
                    }
                  }
                    this.getLineItemGroups()
                    this.$emit('order-state-changed')
                }
            },

            handleSelectionChange(val) {
                this.multipleSelection = val
            },
            handleDialogClose(done) {
                this.$emit('update:dialogVisible', false)
                done();
            },
            handleDialogOpen(){
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
                }

                if (this.filters.keyword.length > 0) {
                    // item.number || item.users.username
                    queryParams["q[number_cont]"] = this.filters.keyword
                }

                if (this.filters.groupState.length > 0 ) {
                    queryParams["q[state_eq]"] = this.filters.groupState
                }

                console.log("queryParams", queryParams)
                const itemsResult = await getLineItemGroupList(queryParams)
                this.count = itemsResult.total_count
                this.itemList.splice( 0, this.itemList.length, ...this.buildItemGroupsFromApiResult(itemsResult))

            },
            handleCurrentRowChange(row) {
                if( row ){
                  this.currentItem = row
                  console.log('handleCurrentRowChange', row, this.currentItem)

                }else{
                  this.currentItem = null
                }
            },
            CloseDialog() {
                this.$emit('update:dialogVisible', false)
            },

        }
}

</script>
