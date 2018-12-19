<style lang="scss" >
@import '../style/print.scss';
.print-only{
  .transfer-table-wrap{
    .store-info{
      padding: 6px 0;
    }
    .sign{
      padding: 40px 0 0 0;
      p{
        float: right;
        font-size: larger;
        padding: 0 0 0 1.5em;
        span{
          display: inline-block;
          width: 8em;
          border-bottom: 1px solid gray;
        }
      }
    }
  }
}

</style>

<template>
<div id="printable" class="print-only ">
  <div class="transfer-table-wrap">
    <h1> 汪永峰皮具养护中心物品交接单 </h1>
    <div class="clear store-info">
      <span class="left">{{storeInfo.name}} {{printData.fromto}} </span><span class="right">制表日期 {{displayDateTime()}}</span>
    </div>

    <table style="width:100%;">
      <tr>
        <th style="width: 5em;">序号 </th><th style="width: 6em;">物品编号 </th><th style="width: 8em;">订单创建时间 </th><th> 工作内容[备注]</th>
      </tr>
      <tr v-for="(data,i) in computedPrintableOrders">
        <td>{{i+1}}</td><td>{{data.number}}</td><td>{{data.displayCreatedAt}}</td>
        <td>
          <div v-for="item in data.lineItems" >{{item.cname}}<span v-show="item.memo">[{{item.memo}}] </span></div>
        </td>
      </tr>
    </table>
    <div class="sign">
      <p  > 店员签字 <span class="bborder"> </span></p>  <p  > 司机签字 <span class="bborder"> </span></p>  <p  >工厂签字  <span class="bborder"> </span></p>

    </div>
  </div>
</div>
</template>

<script>

export default {
  data() { return {} },
  computed: {
    computedPrintableOrders(){
      return this.printData.orders || []
    },
    computedFromto(){
      return this.printData.fromto
    }
  }
}
</script>
