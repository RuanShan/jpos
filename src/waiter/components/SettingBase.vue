<style lang="scss">
.setting-base {
  .member-field-set {
    position: absolute;
    left: 10px;
    right: 10px;
    top: 5px;
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
  <div class="setting-base">
    <el-form ref="form" :model="form" :inline="true">
      <fieldset class="member-field-set">
        <legend>店铺设置</legend>
        <el-form-item class="member-form-item" label="选择当前店铺名称">
          <el-select class="select-options" v-model="form.storeId" @change="changeForState" size="mini">
            <el-option v-for="item in computedStoreOptions" :key="item.id" :value="item.id" :label="item.name">
            </el-option>
          </el-select>
        </el-form-item>
      </fieldset>
    </el-form>
    <div class="button-sett">
      <el-button  type="info"  @click="handleCancel">取消</el-button>
      <el-button  type="danger"  @click="handleSave" >保存</el-button>
    </div>
  </div>
</template>

<script>
import {setStore, getStore } from "@/config/mUtils"

export default {
  data() {
    return {
      //*********** 过滤条件 ***************/
      formData: {

      },

      //*********** UI需要的变量 ***************/
      form: {
        storeId: null, //門店選項
      },
      stateOptions: [{ //门店方式选项
        value: '全部',
      }],

      //*********** 逻辑需要的变量 ***************/

    };
  },
  mounted() {
    this.form.storeId = parseInt( getStore('storeId') )
  },
  computed: {
    computedStoreOptions(){
      return this.stores
    }
  },
  methods: {
    //門店選擇改變時的事件處理函數-----
    changeForState() {

    },
    handleCancel() {
      this.form.stateValue = "";
    },
    handleSave(){
      let storeId = this.form.storeId

      console.log( "localStorage.storeId, this.form.storeId", getStore('storeId'), storeId )

      let selectedStore = this.stores.find((item)=>{
        return item.id == storeId
      })
      if( selectedStore ){
        setStore('storeId', storeId)
        this.$store.commit('saveStore', selectedStore)

        this.$message({
          type: 'success',
          message: "恭喜你，配置提交成功"
        });
      }



    }
  }
};
</script>
