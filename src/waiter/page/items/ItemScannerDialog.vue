<style lang="scss">
.dialog-content-wrap{
  .el-table__body-wrapper{
    &::-webkit-scrollbar{
      width: 5px;
      height: 5px;
    }
  }
}
</style>

<template>
    <el-dialog  class="cel-dialog"  :visible="computedVisible" @open="handleDialogOpen" append-to-body :show-close="false">
      <div slot="title" class="dialog-title-wrap">
        <div class="right back"> <i class="el-icon-close" @click="handleCloseDialog()"></i> </div>
        <div> 扫码</div>
      </div>

      <div  @click.capture="handleBlur" >
        <el-form :model="form"  label-width="80px">
          <el-form-item label="物品编码">
            <div class="el-input">
              <input type="text" v-model="form.number" auto-complete="off"
                @keyup.enter="handleScannerInput" @blur.native="handleBlur"
                ref="scannerInput" class="el-input__inner" data-index="0"></input>
            </div>
          </el-form-item>
          <input type="text" name="disableentrykeysubmit" style="display:nono">
        </el-form>
      </div>
      <div class="dialog-content-wrap"  @click.capture="handleBlur" >
        <el-table :data="computedLineItems" height="250" border style="width: 100%">
          <el-table-column type="index" width="60" label="序号">
          </el-table-column>
          <el-table-column prop="groupNumber" label="物品编码" width="120">
          </el-table-column>
          <el-table-column prop="cname" label="服务项目[备注]" >
            <template slot-scope="scope">
              <div>{{scope.row.cname}}<span v-show="scope.row.memo">[{{scope.row.memo}}] </span></div>
            </template>
          </el-table-column>
          <el-table-column  label="操作" width="80">
            <template slot-scope="scope">
              <el-button type="danger" icon="el-icon-delete" circle @click="delOrderItem(scope.row)" size="mini"></el-button>
            </template>
          </el-table-column>

        </el-table>
      </div>
      <div slot="footer" class="dialog-footer">
        <div class="left" v-show="computedLineItems.length>0"> 服务项目数量: {{computedLineItems.length}}</div>
        <el-button type="primary" @click="sumit">确 定</el-button>
        <el-button @click="handleCloseDialog">取 消</el-button>
      </div>
    </el-dialog>
</template>


<script>
import _ from "lodash"

import {
  getLineItemGroupByNumber
} from '@/api/getData'

import {
  DialogMixin
} from '@/components/mixin/DialogMixin'
import {
  apiResultMixin
}
from '@/components/apiResultMixin'

export default {
  data() {
    return {
      dialogFormVisible: false,
      focusCtrl: 0, // 自动聚焦控制,变动时,执行自动聚焦指令
      currentIndex: 0, // 当前聚焦元素的索引
      actionType: 'first', // 自动聚焦的行为类型
      form: {
        number: null
      },
      scanedNumbers: [], // 所有扫码枪已读取的物品号码
      lineItemGroups: []
    }
  },
  mixins: [DialogMixin, apiResultMixin],
  props: ['dialogVisible'],
  computed: {
    computedLineItems() {
      return _.flatten(this.lineItemGroups.map((group) => {
        return group.lineItems
      }))
    }
  },
  methods: {
    handleDialogOpen() {
      this.scanedNumbers = []
      this.lineItemGroups = []
      //this.$refs.scannerInput.focus()
      this.handleBlur()
    },
    handleScannerInput() {
      console.log("---handleScannerInput---")
      const number = this.form.number
      if( number){
        this.form.number = null
        this.findGroupByNumber(number)
        this.scanedNumbers.push(number)
      }
      console.log("number=", number, "this.scanedNumbers=", this.scanedNumbers)
    },
    handleBlur() {
      this.$nextTick( () => {
        this.$refs.scannerInput.focus()
      })
    },
    //通过条码查找客户物品
    async findGroupByNumber(number) {
      // find in orderDetailList
      const result = await getLineItemGroupByNumber(number)
      const lineItemGroup = this.buildLineItemGroup(result)
      // 如果重复录入，把以前的替换掉
      let index = this.lineItemGroups.findIndex((group)=>{
        return group.id == lineItemGroup.id
      })
      if( index >=0){
        this.lineItemGroups.splice(index,1, lineItemGroup)
      }else{
        this.lineItemGroups.push(lineItemGroup)
      }
    },
    delOrderItem(selectedItem) {
      // 删除当前商品
      console.log( "selectedItem=", selectedItem)
      let group = this.lineItemGroups.find(o => {
        return ( (o.id == selectedItem.groupId));
      })
      let index = group.lineItems.indexOf( selectedItem )
      group.lineItems.splice(index,1)
    },
    sumit() {

      this.$emit('update:dialogVisible', false)
      this.$emit('lineItemGroupsSelected', this.lineItemGroups)
    }

  }
}
</script>
