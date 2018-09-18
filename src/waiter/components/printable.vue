<style lang="scss" >
@import '../style/print.scss';
</style>

<template>
<div id="printable" class="print-only ">
  <div class="transfer-table-wrap">
    <h1> 物品交接单 </h1>
    <div class="clear">
      <span class="left">物品数量 {{printableOrders.length}}</span><span class="right">制表日期 {{displayDate()}}</span>
    </div>
    <table style="width:100%;" class="general">
      <tr>
        <th rowspan="2">店名 </th><td rowspan="2">{{storeInfo.name}} </td><th>店员签字</th><td style="width:8em"> </td>
      </tr>
      <tr>
         <th>司机签字</th><td> </td>
      </tr>
    </table>
    <br>
    <table style="width:100%;">
      <tr>
        <th>序号 </th><th>物品编号 </th><th>订单创建时间 </th><th> 工作内容</th><th> 备注</th>
      </tr>

      <tr v-for="(data,i) in printableOrders">
        <td>{{i+1}}</td><td>{{data.number}}</td><td>{{data.displayCreatedAt}}</td><td>{{data.name}}</td>
        <td><span v-for="item in data.lineItems" v-if="item.memo"></span></td>
      </tr>
    </table>
  </div>
</div>
</template>
