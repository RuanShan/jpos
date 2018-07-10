<style lang="scss">
.setting-printer {
  .printer-section {
    margin: 0 0 18px;
  }

  .member-form-item {
    margin-bottom: 0;
  }
  .select-options {
  }
  .button-sett{
    position: absolute;
    bottom: 20px;
    right: 20px;
  }
}
</style>

<template>
  <div class="setting-printer">
    <el-form ref="form" :model="form" :inline="true">
      <fieldset class="printer-section">
        <legend>文档打印机</legend>
        <el-form-item class="member-form-item" label="选择打印机">
          <el-select class="select-options" v-model="form.docPrinter" @change="changeForStore" size="mini" clearable >
            <el-option v-for="item in printerOptions" :key="item.name" :value="item.name">
            </el-option>
          </el-select>
        </el-form-item>
      </fieldset>
      <fieldset class="printer-section">
        <legend>小票打印机</legend>
        <el-form-item class="member-form-item" label="选择打印机">
          <el-select class="select-options" v-model="form.receiptPrinter" @change="changeForReceipt" size="mini" clearable >
            <el-option v-for="item in printerOptions" :key="item.name" :value="item.name" >
               <span  >{{ item.name }}</span> <span v-if="item.isDefault" >(缺省)</span>
            </el-option>
          </el-select>
        </el-form-item>
      </fieldset>
      <fieldset class="printer-section">
        <legend>水洗唛打印机</legend>
        <el-form-item class="member-form-item" label="选择打印机">
          <el-select class="select-options" v-model="form.labelPrinter" @change="changeForFactory" size="mini" clearable >
            <el-option v-for="item in printerOptions" :key="item.name" :value="item.name">
            </el-option>
          </el-select>
        </el-form-item>
      </fieldset>
    </el-form>
    <div class="button-sett">
      <el-button  type="info"  @click="clearSelect">取消</el-button>
      <el-button  type="danger" @click="submit">保存</el-button>
    </div>
  </div>
</template>

<script>
import { PrintUtil } from '@/components/mixin/print'
import {
  updateStore
}
from '@/api/getData'

export default {
  data() {
    return {
      printers: [],
      //*********** 过滤条件 ***************/
      formData: {

      },

      //*********** UI需要的变量 ***************/
      form: {
        receiptPrinter: "", //小票打印机
        docPrinter: "", //门店打印机
        labelPrinter: "", //工厂打印机
      },
      //*********** 逻辑需要的变量 ***************/

    };
  },
  mounted() {
    this.initData()
  },
  computed: {
    printerOptions(){
      let options = this.printers.map(function(printer){
        // name, statusNumber， isDefault
        return { name: printer.name, isDefault: printer.isDefault,  isUsable: printer.isUsable }
      })
      return options
    }
  },
  methods: {
    initData(){
      console.log( "SettingPrinter->this.storeInfo=", this.storeInfo)
      this.printers = PrintUtil.getPrinters()

      this.form.docPrinter = this.storeInfo.docPrinter
      this.form.receiptPrinter = this.storeInfo.receiptPrinter
      this.form.labelPrinter = this.storeInfo.labelPrinter
    },
    //小票打印机
    changeForReceipt(){

    },
    //门店打印机
    changeForStore(){

    },
    //工厂打印机
    changeForFactory(){

    },
    clearSelect() {
      this.initData()
      this.$refs['form'].resetFields();
    },
    buildParams(){
      let params = { store: { doc_printer_name: this.form.docPrinter, receipt_printer_name: this.form.receiptPrinter, label_printer_name: this.form.labelPrinter } }
      return params
    },
    submit(){
      updateStore( this.storeId, this.buildParams()).then((res)=>{
        this.$message({
          type: 'success',
          message: "恭喜你，配置提交成功"
        });

      })
    }
  }
};
</script>
