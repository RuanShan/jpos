<style lang="scss">
  .group-table-wrap{
    .images{
      img{ width: 100%; }
    }
  }
</style>

<template>
<div class="group-table-wrap" v-if="lineItemGroups">

  <el-table :data="lineItemGroups" border style="width:100%;" height="100">
    <el-table-column prop="displayCreatedAt" label="订单日期" align="center" width="100" >
      <template slot-scope="scope">
        <div>{{scope.row.createdAt.format("YYYY-MM-DD")}}</div>
          <div>{{scope.row.createdAt.format("H:mm")}}</div>
      </template>
    </el-table-column>
    <el-table-column label="物品条码" width="110" align="center">
      <template slot-scope="scope">
        <div class="image-wrap">
          <img :src="scope.row.imageUrl" alt="">
        </div>
        <div class="group-number">{{scope.row.number}} </div>
      </template>
    </el-table-column>
    <el-table-column prop="order.number" label="订单号" width="120" align="center"></el-table-column>
    <el-table-column prop="name" label="物品-服务项目[备注]">
      <template slot-scope="scope">
        <div v-for="item in scope.row.lineItems">{{item.cname}}<span v-show="item.memo">[{{item.memo}}] </span></div>
      </template>
    </el-table-column>
    <el-table-column prop="order.displayPaymentState" label="支付状态" width="80" ></el-table-column>
    <el-table-column prop="price" label="金额" width="60">金额</el-table-column>

  </el-table>

</div>
</template>

<script>


export default {
  data() {
    return {
    }
  },
  props: ['lineItemGroups'],
  computed:{

  },
  methods:{



  }

}
</script>
