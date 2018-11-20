<style lang="scss">
.setting-base {

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
    <el-form ref="form" :model="form" >

      <fieldset  >
        <legend>工作场所设置</legend>
        <el-form-item class="member-form-item" label="选择当前工作场所"  label-width="180px">
          <el-select class="select-options" v-model="form.storeId" @change="changeForState" size="mini">
            <el-option v-for="item in computedStoreOptions" :key="item.id" :value="item.id" :label="item.name">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="member-form-item" label="会员支付必须密码" label-width="180px">
          <el-switch class="select-options" v-model="form.checkoutPasswordRequired"   size="mini">
          </el-switch>
        </el-form-item>
      </fieldset>

    </el-form>
    <div class="button-sett">
      <el-button  type="danger"  @click="handleSave" size="mini" >保存</el-button>
      <el-button  type=""  @click="handleCancel" size="mini">取消</el-button>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import {setStore, getStore } from "@/config/mUtils"
import {
  updateStore
}
from '@/api/getData'

export default {
  data() {
    return {
      //*********** 过滤条件 ***************/

      //*********** UI需要的变量 ***************/
      form: {
        storeId: null, //門店選項
        checkoutPasswordRequired: false
      },
      stateOptions: [{ //门店方式选项
        value: '全部',
      }],

      //*********** 逻辑需要的变量 ***************/

    };
  },
  mounted() {
    let storeId = _.toInteger( getStore('storeId') )
    if(storeId > 0){
      this.form.storeId = storeId
      this.form.checkoutPasswordRequired = this.storeInfo.checkoutPasswordRequired
    }
  },
  computed: {
    computedStoreOptions(){
      let options = []
      if( this.stores ){
        options = this.stores.map((store)=>{
          return {id: store.id, name: store.name}
        })
      }
      return options
    }
  },
  methods: {
    //門店選擇改變時的事件處理函數-----
    changeForState() {

    },
    handleCancel() {
      this.form.stateValue = "";
    },
    buildParams(){
      let params = { store: {
        checkout_password_required: this.form.checkoutPasswordRequired
       } }
      return params
    },
    handleSave(){
      let storeId = this.form.storeId

      console.log( "localStorage.storeId, this.form.storeId", getStore('storeId'), storeId )

      let selectedStore = this.stores.find((item)=>{
        return item.id == storeId
      })
      if( selectedStore ){
        updateStore( storeId, this.buildParams()).then((res)=>{
          if( res.id ){
            setStore('storeId', storeId)
            let store = this.buildStore( res )
            this.$store.commit('saveStore', store)

            this.$message({
              type: 'success',
              message: "恭喜你，配置提交成功"
            })

          }
        })
      }

    }
  }
};
</script>
