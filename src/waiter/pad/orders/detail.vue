<style lang='scss'>
.order-detail{
  .mint-header{
    background-color: #f4b22c;
  }
  .head{
    span{
      display: inline-block;
      padding: 6px;
      color: #fff;
      background-color: #6a3906;
      border-radius: 3px;
    }
    padding: 10px 0 10px 0;
  }
  .subtitle {
    display: inline-block;
    padding: 6px;
    color: #6a3906;
  }
  table{
    width: 100%;
    background-color: #fff;
    td,
    th {
        border: 1px solid #ebeef5;
        padding: 6px 10px;
        font-size: 14px;
        box-sizing: border-box;
        white-space: normal;
        line-height: 23px;
    }
  }
  .payments-wrap{
    padding: 0 0 10px 0;
    margin-bottom: 10px;
  }
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
    left: 10px;
    right: 10px;
    top: 50px;
    bottom: 50px;
    overflow-y: auto;
  }
  .line-item-groups
  {
    .line-item-group{
      padding: 10px 0 10px;
      border-bottom: 1px solid #6a3906;
    }
    .line-item-group:first-child{
      border-top: 1px solid #6a3906;
    }
    .line-item-group:last-child{
      border-bottom: none;
    }
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
  .box{
    margin-bottom: 10px;
  }
  .back-btn{
    margin-top: 5px;
  }
}
</style>

<template>
  <section class="order-detail">
    <div>
      <mt-header title="订单详情">
        <div slot="left">
          <mt-button icon="back" @click="handleBack">返回</mt-button>
        </div>
      </mt-header>
    </div>
    <div class="item-detail-wrap">
      <div class="order-detail" v-if="orderDetail">
        <div class="box">
          <div class="head"> <span> <i class="fa fa-user">  客户信息</i> </span> </div>
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

        <div class="box">
          <div class="head"> <span> <i class="fa fa-calendar">   订单信息 {{orderDetail.number}}</i> </span> </div>
          <div class="payments-wrap">
            <div class="subtitle"> 支付信息 </div>
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
          <div class="line-item-groups">
            <div v-for="group in orderDetail.lineItemGroups" class="line-item-group">
              <div class="subtitle"> 物品编号: {{group.number}}  状态: {{group.displayState}} </div>
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

              <div class="subtitle"> 物品图片  </div>
              <div class=" ">
                <div v-show="group.images.length==0">  </div>
                <el-upload
                  :file-list="group.uploadImages"
                  :action="group.imageUploadPath"
                  name="image[attachment]"
                  list-type="picture-card"
                  :with-credentials="true"
                  :multiple = "true"
                  :data="{id: group.id}"
                  :http-request="handleDirectUpload"
                  :before-remove="handleImageRemoveConfirm"
                  :before-upload="beforeUpload"
                  :on-preview="handlePictureCardPreview"
                  :on-remove="handleImageRemoved"
                  :on-success="handleImageAdded">
                  <i class="el-icon-plus"></i>
                </el-upload>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>

    <div class="footer">
      <mt-button class="back-btn" @click="handleDone">返回</mt-button>
    </div>


    <CelSwiper :carousel-images="carouselImages" :dialog-visible.sync="imageDialogVisible"> </CelSwiper>

  </section>

</template>

<script type="text/babel">
import { directUploadUrl } from '@/config/env'

import {
  getOrder,
  findOrderByGroupNumber,
  updateLineItem,
  deleteGroupImage,
  getLineItemGroupImageUploadPath,
  createGroupImageForDirectUpload
}
from '@/api/getData'
import CelSwiper from "@/components/dialog/CelSwiper.vue";
import { ActivestorageUploader } from '@/utils/ActivestorageUploader';

export default {
  name: "OrderItem",
  components:{  CelSwiper },
  data() {
    return {
      elUploadHeader:{},
      orderCustomer: {
        prepaidCard: {
        }
      },
      orderDetail: {
        payments: [],
        lineItemGroups: []
      },
      carouselImages: [],//图片文件列表
      lineItemGroupNumber: null,
      imageDialogVisible: false,
      uploadedFileUidGroupIdMap: {}
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
  computed: {
    orderId(){
       return this.$route.params.id
    }
  },
  mounted(){
    this.initData()
  },
  methods: {

    async initData(){
      let result = null
      if( this.$route.params.lineItemGroupNumber ){
        this.lineItemGroupNumber =  this.$route.params.lineItemGroupNumber
        result = await findOrderByGroupNumber( this.lineItemGroupNumber )
      }else{
        result = await getOrder( this.orderId )
      }
      console.log( "initData->", result)
      const order = this.buildOrder(result)
      order.lineItemGroups.forEach((group)=>{
        // should not change uploadImages manually, or upload multiple would be malefunction
        // require fields id, groupId, url, type, group
        group.uploadImages = group.images.map((image)=>{ return Object.assign({}, image) })
        group.imageUploadPath = getLineItemGroupImageUploadPath( group.id)
      })
      this.orderDetail = order
      this.orderCustomer = order.customer
      console.log('orderDetail', this.orderDetail)

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

    handleImageRemoved(file, fileList) {
      let image = this.getGroupImageOfUploadedFile( file )
      deleteGroupImage( image.groupId, image.id ).then(()=>{
        // 删除图片从group.images
        this.orderDetail.lineItemGroups.forEach((group)=>{
          if( group.id == image.groupId){
            group.images.splice(group.images.indexOf( image ),1)
          }
        })
        console.log(file, fileList);
      })
    },
    handleImageAdded(response, file, fileList){
      const image = this.buildGroupImage( response )
      this.orderDetail.lineItemGroups.forEach((group)=>{
        if( group.id == image.groupId){
          //设置 image.group，以便handlePictureCardPreview 查找group.images
          image.group = group
          group.images.push( image )
          // 更新filelist中相应image
          this.uploadedFileUidGroupIdMap[file.uid] = image
          //fileList.splice(fileList.indexOf( file ), 1, image)
        }
      })
      console.log(response, file, fileList)
    },
    beforeUpload( file ){
      console.log( "beforeUpload", file)
    },
    handleDirectUpload(option){
      console.log( "handleDirectUpload option=", option)
      let file = option.file
      let id = option.data.id
      //app.rails_direct_uploads_path
      let url = directUploadUrl + "?token="+ this.userInfo.apiKey
      let uploader = new ActivestorageUploader( file, url, option, (blob)=>{
        // after file uploaded to aliyun, create record of group_image
         createGroupImageForDirectUpload( id,  { image:{ attachment: blob.signed_id }} ).then((res)=>{
           option.onSuccess( res, option.file)
         })
      } )
      console.log( "uploader=", uploader)
      uploader.upload()
    },
    handlePictureCardPreview(file) {
      console.log("file:", file );
      let image = this.getGroupImageOfUploadedFile( file )
      let images = image.group.images
      this.carouselImages = images
      //this.dialogImageUrl = file.originalUrl;
      this.imageDialogVisible = true;
    },
    getGroupImageOfUploadedFile( file ){
      return file.type == "GroupImage" ? file : this.uploadedFileUidGroupIdMap[file.uid]
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
    handleImageRemoveConfirm(file, fileList){
      return this.$confirm('此操作将永久删除该图片, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
    },
  }
};
</script>
