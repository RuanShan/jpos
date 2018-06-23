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
          <el-select class="select-options" v-model="form.stateValue" @change="changeForState" size="mini">
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
        stateValue: "", //門店選項
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
    //門店選擇改變時的事件處理函數-----
    changeForState() {

    },
    clearSelect() {
      this.form.stateValue = "";
    }
  }
};
</script>
