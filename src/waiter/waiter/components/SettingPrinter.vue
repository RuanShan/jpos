<style lang="scss">
.setting-printer {
  .xiaopiao-field-set {
    position: absolute;
    left: 10px;
    right: 10px;
    top: 5px;
  }
  .dianpu-field-set{
     position: absolute;
    left: 10px;
    right: 10px;
    top: 100px;
  }
  .gongchang-field-set{
     position: absolute;
    left: 10px;
    right: 10px;
    top: 200px;
  }
  .member-form-item {
    margin-bottom: 0;
  }
  .select-options {
    width: 120px;
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
      <fieldset class="xiaopiao-field-set">
        <legend>小票打印机</legend>
        <el-form-item class="member-form-item" label="选择小票打印机">
          <el-select class="select-options" v-model="form.receiptPrinter" @change="changeForReceipt" size="mini">
            <el-option v-for="item in stateOptions" :key="item.value" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </fieldset>
      <fieldset class="dianpu-field-set">
        <legend>店铺打印机</legend>
        <el-form-item class="member-form-item" label="选择店铺打印机">
          <el-select class="select-options" v-model="form.storePrinter" @change="changeForStore" size="mini">
            <el-option v-for="item in stateOptions" :key="item.value" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </fieldset>
      <fieldset class="gongchang-field-set">
        <legend>工厂打印机</legend>
        <el-form-item class="member-form-item" label="选择工厂打印机">
          <el-select class="select-options" v-model="form.factoryPrinter" @change="changeForFactory" size="mini">
            <el-option v-for="item in stateOptions" :key="item.value" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </fieldset>
    </el-form>
    <div class="button-sett">
      <el-button  type="info"  @click="clearSelect">取消</el-button>
      <el-button  type="danger" >保存</el-button>
    </div>
  </div>
</template>

<script>


export default {
  data() {
    return {
      //*********** 过滤条件 ***************/
      formData: {

      },

      //*********** UI需要的变量 ***************/
      form: {
        receiptPrinter: "", //小票打印机
        storePrinter: "", //门店打印机
        factoryPrinter: "", //工厂打印机
      },
      stateOptions: [{ //门店方式选项
        value: '全部',
      }],

      //*********** 逻辑需要的变量 ***************/

    };
  },
  mounted() {
  },
  computed: {
  },
  methods: {
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
      this.form.stateValue = "";
    }
  }
};
</script>
