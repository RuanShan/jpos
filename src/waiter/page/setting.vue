<style lang="scss">
.setting-container {
  .title-wrap {
    padding: 6px;
    text-align: center;
  }

  .tab-list-wrap {
    position: absolute;
    top: 18px;
    left: 18px;
    right: 18px;
    bottom: 18px;
    .tabs-height {
      height: 100%;
      .el-tabs__content {
        position: absolute;
        top: 40px;
        left: 10px;
        bottom: 0;
        right: 10px;
      }
    }
  }
}
</style>

<template>
  <div class="">
    <headTop></headTop>
    <leftNav></leftNav>

    <div class="setting-container page-content">
      <div>

      </div>
      <div class="tab-list-wrap">
        <el-tabs class="tabs-height" type="border-card" v-model="tabsNumber" @tab-click="tabHandleClick">

          <el-tab-pane label="基本设置">
            <setting-base></setting-base>
          </el-tab-pane>

          <el-tab-pane label="打印设置">
            <setting-printer></setting-printer>
          </el-tab-pane>

          <el-tab-pane label="微信设置">
          </el-tab-pane>

          <el-tab-pane label="短信设置">
          </el-tab-pane>

        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script>
import leftNav from "@/components/layout/LeftNav.vue"
import headTop from "@/components/layout/headTop.vue";
import SettingBase from '../components/SettingBase.vue';
import SettingPrinter from '../components/SettingPrinter.vue';

export default {
   components: {
     leftNav,
     headTop,
    "setting-base": SettingBase,
    "setting-printer": SettingPrinter,

   },
  data() {
    return {
      tabsNumber: 0, //每次点击别的tab是tabsNumber动态变化

    };
  },
  methods: {
    //点击标签的事件处理函数-----
    tabHandleClick(tab, event) {
      console.log(this.tabsNumber);
    }
  }
}
</script>
