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
          <div class="member-tabble-container">
            <div class="member-table-left"></div>
            <div class="member-table-center">
              <table class="member-table" border="1" cellspacing="0">
                <tr>
                  <th>客户电话 </th>
                  <!-- <td> {{ orderCustomer.mobile }} </td> -->
                  <td> {{ memberInfo.mobile }} </td>
                  <th>客户姓名 </th>
                  <!-- <td> {{ orderCustomer.name }} </td> -->
                  <td> {{ memberInfo.name }} </td>
                  <th>客户类型 </th>
                  <!-- <td> {{ orderCustomer.displayType }} </td> -->
                  <td> {{ memberInfo.memberType }} </td>
                </tr>
                <tr>
                  <th>会员卡号 </th>
                  <!-- <td> {{ orderCustomer.prepaidCard.code }} </td> -->
                  <td> {{ memberInfo.number }} </td>
                  <th>会员卡类型 </th>
                  <!-- <td> {{ orderCustomer.prepaidCard.name }} </td> -->
                  <td> {{ memberInfo.cardType }} </td>
                  <th>会员卡余额 </th>
                  <!-- <td> {{ orderCustomer.prepaidCard.amountRemaining }} </td> -->
                  <td> {{ memberInfo.remaining }} </td>
                </tr>
              </table>
            </div>
            <div class="member-table-right"></div>

          </div>
        </div>

        <div>
          <div class="head"> 订单信息 {{orderDetail.number}} </div>
          <div>
            <div class=""> 支付信息 </div>
            <div class="order-table-container">
              <div class="order-table-left"></div>
              <div class="order-table-center">
                <table class="order-table" border="1" cellspacing="0">
                  <tr>
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
              <div class="order-table-right"></div>
            </div>
          </div>
        <!-- 完成按钮 -->
          <div class="succeed">
            <mt-button type="primary" size="large" @click="succeed">完成</mt-button>
          </div>
        <!-- 照片墙 -->
          <div class="upload-list">
            <el-upload class="upload" action="https://www.easy-mock.com/mock/5b409280aedea31f953c7898/test/upload" 
                      list-type="picture-card" 
                      :file-list="fileList" 
                      :show-file-list="true" 
                      :on-preview="handlePictureCardPreview" 
                      :multiple="true" 
                      :on-remove="handleRemove" 
                      :on-success="handleAvatarSuccess">
              <i class="el-icon-plus"></i>
            </el-upload>
            <el-dialog class="dialog" :visible.sync="dialogVisible">
              <img width="100%" :src="dialogImageUrl" alt="">
            </el-dialog>
          </div>



          <div v-for="group in orderDetail.lineItemGroups" class="line-item-group">
            <div class="head"> 物品编号: {{group.number}} 状态: {{group.displayState}} </div>
            <table border="1" cellspacing="0" style="width: 100%">
              <tr>
                <th style="width:8em">序号</th>
                <th>服务项目</th>
                <th>项目备注
                  <i class="el-icon-edit"></i>
                </th>
                <th style="width:8em">状态</th>
              </tr>
              <template v-for="(lineItem,index ) in group.lineItems">
                <tr>
                  <td>{{ index+1 }}</td>
                  <td>{{ lineItem.cname }}</td>
                  <td>
                    <vue-xeditable :name="'memo_'+lineItem.id+'_xeditable'" v-model="lineItem.memo" type="text" @value-did-change="handleXeditableChanged" empty="无"></vue-xeditable>
                  </td>
                  <td>{{ lineItem.state }}</td>
                </tr>
              </template>
            </table>

            <div class="head"> 物品图片

            </div>
            <div class="clear">
              <div v-show="group.images.length==0"> </div>

              <!-- <el-upload :file-list="group.uploadedImages" :action="group.imageUploadPath" name="image[attachment]" list-type="picture-card" :with-credentials="true" :on-preview="handlePictureCardPreview" :on-remove="handleRemove">
                <i class="el-icon-plus"></i>
              </el-upload> -->

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
        prepaidCard: {

        }
      },
      orderDetail: {
        payments: [],
        lineItemGroups: []
      },
      list: [],
      backIcon: 'static/mobile/img/icon/right.png',

      /***********调试界面使用的数据*************/
      memberInfo: {
        mobile: "13456789787",
        name: "张三",
        memberType: "会员",
        number: "123456",
        cardType: "1000折3",
        remaining: "8787"
      },
      fileList: [], //图片文件列表
      dialogImageUrl: '',
      dialogVisible: false,
    };
  },

  components: {},
  computed: {
  },
  methods: {
    handleBack() {
      console.log("handleBack-", this.$route)
      this.$router.go(-1)
    },
    handleClose() {
    },
    succeed() {
    },
    handlePictureCardPreview(file) {
      this.dialogVisible = true;
      this.dialogImageUrl = file.url;
      // console.log(this.dialogImageUrl);
      // console.log(file);
    },
    handleRemove(file, fileList) {
      // console.log(file);
      // console.log(fileList);
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
  }
};
</script>

