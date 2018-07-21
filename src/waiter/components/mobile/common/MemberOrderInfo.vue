<style lang="scss">
.member-table-content {
  margin-top: 25px;
  width: 100%;
  height: 100%;
  .member-info-table {
    width: 100%;
    height: 108px;
  }
  .member-order-table {
    margin-top: 25px;
    width: 100%;
    // height: 108px;
  }
  .table-head {
    background-color: #e3feff;
    height: 60px;
  }
  .table-body {
    height: 60px;
  }
  .add-images-button {
    margin-top: 25px;
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
  .succeed {
    // position: absolute;
    font-size: x-large;
    margin-top: 25px;
    // bottom: 25px;
    // left: 10px;
    // right: 10px;
  }
}
</style>

<template>
  <div class="member-table-content">
    <table class="member-info-table" border="1" cellspacing="0">
      <tr>
        <td>会员电话</td>
        <td>{{memberInfo.mobile}}</td>
        <td>会员姓名</td>
        <td>{{memberInfo.name}}</td>
      </tr>
      <tr>
        <td width="20%">卡号</td>
        <td>{{memberInfo.cardNum}}</td>
        <td width="20%">余额</td>
        <td>{{memberInfo.remain}}</td>
      </tr>
    </table>
    <table class="member-order-table" border="1" cellspacing="0">
      <tr class="table-head">
        <td>序号</td>
        <td>服务项目</td>
        <td>备注&nbsp;&nbsp;(&nbsp;&nbsp;订单号&nbsp;&nbsp;=&nbsp;&nbsp;{{codeNum}}&nbsp;&nbsp;)</td>
      </tr>
      <tr class="table-body" v-for="(item, index) in orderInfo.items" :key="index">
        <td width="10%">{{index+1}}</td>
        <td width="30%">{{item.items}}</td>
        <td width="40%">{{item.remark}}</td>
      </tr>
    </table>
    <div class="succeed">
      <mt-button type="primary" size="large" @click="succeed">完成</mt-button>
    </div>
    <!-- <mt-button class="add-images-button" type="primary" size="large" @click="addImages">添加图片</mt-button> -->
    <div class="upload-list">
      <el-upload class="upload" action="https://www.easy-mock.com/mock/5b409280aedea31f953c7898/test/upload" list-type="picture-card" :file-list="fileList" :show-file-list="true" :on-preview="handlePictureCardPreview" :multiple="true" :on-remove="handleRemove" :on-success="handleAvatarSuccess">
        <i class="el-icon-plus"></i>
      </el-upload>
      <el-dialog class="dialog" :visible.sync="dialogVisible">
        <img width="100%" :src="dialogImageUrl" alt="">
      </el-dialog>
    </div>
  </div>
</template>

<script>
export default {
  props: ['returnServerData', 'codeNum'],  // 父组件传来的值

  data() {
    return {
      /*********************UI相关***********************/
      dialogVisible: false,
      imageUrl: '',

      /********************数据处理相关*******************/
      memberInfo: {
        mobile: "",
        name: "",
        cardNum: "",
        remain: ""
      },
      orderInfo: {},
      dialogImageUrl: '',
      fileList: [], //图片文件列表
      succeedFlag: "",
      res: {},
      file: {}
    }
  },
  mounted() {
    console.log(this.returnServerData);
    this.memberInfo = this.returnServerData.data.member;
    this.orderInfo = this.returnServerData.data.order;
  },
  methods: {
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
    handleRemove(file, fileList) {
      // console.log(file);
      // console.log(fileList);
    },
    handlePictureCardPreview(file) {
      this.dialogVisible = true;
      this.dialogImageUrl = file.url;
      // console.log(this.dialogImageUrl);
      // console.log(file);
    },
    succeed() {
      this.succeedFlag = true;
      this.$emit("succeed", this.succeedFlag);
    }
  },
}
</script>

