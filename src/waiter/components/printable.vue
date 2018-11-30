<style lang="scss" >
@import '../style/print.scss';
</style>

<template>
<div id="printable" class="print-only ">
  <div class="transfer-table-wrap">
    <h1> 汪永峰皮具养护中心物品交接单 </h1>
    <div class="clear store-info">
      <span class="left">{{storeInfo.name}} </span><span class="right">制表日期 {{displayDate()}}</span>
    </div>

    <table style="width:100%;">
      <tr>
        <th>序号 </th><th>物品编号 </th><th>订单创建时间 </th><th> 工作内容</th><th> 备注</th>
      </tr>
      <tr v-for="(data,i) in printableOrders">
        <td>{{i+1}}</td><td>{{data.number}}</td><td>{{data.displayCreatedAt}}</td><td>{{data.name}}</td>
        <td><span v-for="item in data.lineItems" v-if="item.memo"></span></td>
      </tr>
    </table>
    <div class="sign">
      <p> 店员签字 </p>
      <p> 司机签字 </p>
    </div>
  </div>
</div>
</template>

<script>

export default {
  data() { return {} },
  computed: {
    computedPrintableData(){
      return this.printableData || []
    }
  }
}
</script>
