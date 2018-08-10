<style lang='scss'>
.member-tabble-container {
  width: 100%;
  display: flex;
  justify-content: space-between;
  .member-table-left {
    margin: 10px;
  }
  .member-table-center {
    width: 100%;
    margin: 10px;
    .member-table {
      width: 100%;
    }
  }
  .member-table-right {
    margin: 10px;
  }
}
.order-table-container {
  width: 100%;
  display: flex;
  justify-content: space-between;
  .order-table-left {
    margin: 10px;
  }
  .order-table-center {
    width: 100%;
    margin: 10px;
    .order-table {
      width: 100%;
    }
  }
  .order-table-right {
    margin: 10px;
  }
}
.item-detail-wrap{
  position: absolute;
  left: 0;
  right: 0;
  top: 50px;
  bottom: 50px;

  table{
    width: 100%;
  }
}
.succeed {
  // position: absolute;
  font-size: x-large;
  margin: 20px;
  // bottom: 25px;
  // left: 10px;
  // right: 10px;
}
 .upload-list {
    margin-top: 25px;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    .upload {
      .el-upload-list--picture-card {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        align-items: center;
      }
      .el-upload--picture-card {
        width: 200px;
        height: 200px;
        line-height: 200px;
      }
      .el-upload-list__item {
        width: 200px;
        height: 200px;
      }
      .el-upload-list__item-preview {
        width: 130px;
      }
      .el-upload-list__item-delete {
        width: 130px;
      }
      .el-icon-zoom-in {
        font-size: 80px;
      }
      .el-icon-delete {
        font-size: 80px;
      }
    }
    .dialog {
      .el-dialog__headerbtn {
        font-size: 120px;
        top: -33px;
        right: 0px;
      }
    }
  }
</style>


<template>

  <section class="orderDetail">
    <div>
      <mt-header title="订单详情">
        <div slot="left">
          <mt-button icon="back" @click="handleBack">返回</mt-button>
        </div>
      </mt-header>
    </div>
    <div class="item-detail-wrap">
      <div class="order-detail" v-if="orderDetail">
        <div class="customer">
          <div class="head"> 客户信息</div>
          <div>
            <table border="1" cellspacing="0">
              <tr>
                <th>客户电话 </th>
                <td> {{ orderCustomer.mobile }} </td>
                <th>客户姓名 </th>
                <td> {{ orderCustomer.userName }} </td>
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
                  <td style="width:8em">{{payment.displayState}}</td>
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
                  <td>{{ lineItem.displayState }}</td>
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

    <div class="footer">
      <mt-button @click="handleDone">完成</mt-button>
    </div>
  </section>

</template>

<script type="text/babel">
import {
  getOrder,
  updateLineItem,
  deleteGroupImage,
  getLineItemGroupImageUploadPath,
}
from '@/api/getData'

export default {
  name: "OrderItem",
  data() {
    return {
      orderCustomer: {
        prepaidCard: {
        }
      },
      orderDetail: {
        payments: [],
        lineItemGroups: []
      },
      list: [],

      fileList: [], //图片文件列表
      dialogImageUrl: '',
      dialogVisible: false,
    };
  },
  beforeRouteUpdate (to, from, next) {
      // called when the route that renders this component has changed,
      // but this component is reused in the new route.
      // For example, for a route with dynamic params `/foo/:id`, when we
      // navigate between `/foo/1` and `/foo/2`, the same `Foo` component instance
      // will be reused, and this hook will be called when that happens.
      // has access to `this` component instance.
      console.log( "beforeRouteUpdate", to)
      this.initData()
  },
  components: {},
  computed: {
    orderId(){
       return this.$route.params.id
    }
  },
  mounted(){
    this.initData()
  },
  methods: {

    initData(){

      getOrder( this.orderId).then((result)=>{
        const order = this.buildOrder(result)

        order.lineItemGroups.forEach((group)=>{
          group.imageUploadPath = getLineItemGroupImageUploadPath( group.id)

          group.uploadedImages = group.images.map((img)=>{
            return Object.assign( img, {name: img.attachmentFileName, url: img.bigUrl}  )
          })
        })
        this.orderDetail = order
        this.orderCustomer = order.customer
        console.log('orderDetail', this.orderDetail)

      })

    },
    handleBack() {
      console.log("handleBack-", this.$route)
      this.$router.go(-1)
    },
    handleClose() {
    },
    handleDone(){
      this.$router.push({ name: 'orders' })
    },
    handlePictureCardPreview(file) {
      this.dialogVisible = true;
      this.dialogImageUrl = file.url;
      // console.log(this.dialogImageUrl);
      // console.log(file);
    },
    handleRemove(file, fileList) {
      deleteGroupImage( file.groupId, file.id ).then(()=>{
        console.log(file, fileList);
      })
    },
    handleAvatarSuccess(response, file, fileList) {
      console.log("ON-SUCCEED CALL-BACK");
      console.log(response);
      console.log(file);
      console.log(fileList);

      this.res = response;
      this.file = file;
      this.fileList = fileList;
      this.imageUrl = URL.createObjectURL(file.raw);
    },
    handleXeditableChanged(newValue, xeditableName) {
      console.log("newValue=" + newValue + " xeditableName=" + xeditableName)
      //示例：groupnumber_1_xeditable
      let [column, id] = xeditableName.split('_')
      id = parseInt(id)
      let lineItem = this.orderDetail.lineItems.find((item)=>{ return item.id== id })
      let newAttribute = { [column]: newValue }
      let params = { order_number: lineItem.order.number, line_item: newAttribute }
      updateLineItem(lineItem.id, params).then((res)=>{
        if( res.id ){
          Object.assign( lineItem, newAttribute)
        }
      })
      console.log(" old=", lineItem, "new=", newAttribute)
      //this.orderItemList.splice(index, 1, newLineItem)
    },
  }
};
</script>
