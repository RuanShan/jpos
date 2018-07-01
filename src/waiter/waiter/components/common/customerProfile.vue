<style lang="scss">
.customer-profile {
  table{
    width: 100%;
    td, th{
      border: 1px solid #ebeef5;
    }
    th{
      width: 80px;
    }
    td{
      min-width: 12.5%;
    }
  }
}
</style>
<template>
  <!-- 会员基本信息 START-->
  <div class="customer-profile " v-if="customerData">
    <table>
      <tr>
        <th > 会员姓名 </th>
        <td> {{customerData.userName}} </td>
        <th> 会员电话 </th>
        <td> {{customerData.mobile}} </td>
        <th> 会员性别 </th>
        <td> {{customerData.userName}} </td>
        <th> 会员生日 </th>
        <td> {{customerData.userName}} </td>
      </tr>
      <tr>
        <th> 地址 </th>
        <td colspan="3"> {{customerData.userName}} </td>
        <th> 备注 </th>
        <td colspan="3"> {{customerData.userName}} </td>
      </tr>
    </table>
  </div>
  <!-- 会员基本信息 END-->
</template>

<script>
export default {
  props: ["customerData"],
  data() {
    return {
    }
  }
}
</script>
