<template>

    <section class="orderDetail">
      <div>
        <mt-header title="long long long long title">
          <div slot="left">
            <mt-button icon="back" @click="handleBack">返回</mt-button>
          </div>
        </mt-header>
      </div>
      <div class="item-detail">
        <div class="order-detail-container" v-if="orderDetail">
          <div class="customer">
            <div class="head"> 客户信息</div>
            <div>
              <table border="1" cellspacing="0">
                <tr>
                  <th>客户电话 </th>
                  <td> {{ orderCustomer.mobile }} </td>
                  <th>客户姓名 </th>
                  <td> {{ orderCustomer.name }} </td>
                  <th>客户类型 </th>
                  <td> {{ orderCustomer.displayType }} </td>
                </tr>
                <tr>
                  <th>会员卡号 </th>
                  <td> {{ orderCustomer.prepaidCard.code }} </td>
                  <th>会员卡类型 </th>
                  <td> {{ orderCustomer.prepaidCard.name }} </td>
                  <th>会员卡余额 </th>
                  <td> {{ orderCustomer.prepaidCard.amountRemaining }} </td>
                </tr>
              </table>
            </div>
          </div>

          <div>
            <div class="head"> 订单信息 {{orderDetail.number}} </div>
            <div>
              <div class=""> 支付信息 </div>
              <div>
                <table border="1" cellspacing="0" style="width: 100%">
                  <tr >
                    <th>支付方式</th>
                    <th>支付金额</th>
                    <th style="width:8em">状态</th>
                    <th style="width:8em">支付时间</th>
                  </tr>
                  <tr v-for="(payment,index ) in orderDetail.payments">
                    <td>{{payment.cname}}</td>
                    <td>{{payment.amount}}</td>
                    <td style="width:8em">{{payment.state}}</td>
                    <td style="width:8em">{{payment.displayCreatedAt}}</td>
                  </tr>
                </table>
              </div>
            </div>

            <div v-for="group in orderDetail.lineItemGroups" class="line-item-group">
              <div class="head"> 物品编号: {{group.number}}  状态: {{group.displayState}} </div>
              <table border="1" cellspacing="0" style="width: 100%">
                <tr>
                  <th style="width:8em">序号</th>
                  <th>服务项目</th>
                  <th>项目备注<i class="el-icon-edit"></i></th>
                  <th style="width:8em">状态</th>
                </tr>
                <template v-for="(lineItem,index ) in group.lineItems">
                  <tr>
                    <td>{{ index+1 }}</td>
                    <td>{{ lineItem.cname }}</td>
                    <td>
                      <vue-xeditable  :name="'memo_'+lineItem.id+'_xeditable'" v-model="lineItem.memo" type="text" @value-did-change="handleXeditableChanged" empty="无"></vue-xeditable>
                    </td>
                    <td>{{ lineItem.state }}</td>
                  </tr>
                </template>
              </table>

              <div class="head"> 物品图片

              </div>
              <div class="clear">
                <div v-show="group.images.length==0">  </div>

                <el-upload
                  :file-list="group.uploadedImages"
                  :action="group.imageUploadPath"
                  name="image[attachment]"
                  list-type="picture-card"
                  :with-credentials="true"
                  :on-preview="handlePictureCardPreview"
                  :on-remove="handleRemove">
                  <i class="el-icon-plus"></i>
                </el-upload>

              </div>
            </div>
          </div>

        </div>

      </div>
    </section>

</template>

<script type="text/babel">
export default {
  name: "OrderItem",
  data() {
    return {
      orderCustomer: {
        prepaidCard:{
          
        }
      },
      orderDetail:{
        payments: [],
        lineItemGroups:[]
      },
      list: [],
      backIcon: 'static/mobile/img/icon/right.png',
    };
  },

  components: {},
  computed:{
  },
  methods: {
    handleBack() {
      console.log( "handleBack-",this.$route)
      this.$router.go(-1)
    },
    handleClose(){
    }
  }
};
</script>

</script>
