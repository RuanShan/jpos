<template>
 <div class="customer_container">
   <el-row>
      <div class="grid-content bg-purple-light">
        <el-dialog  title="编辑会员"  :visible.sync="dialogVisible" :close-on-press-escape="false" 
            :fullscreen="true" center style="font-size: 36px;color: #115df5; !important">
        <!-- <el-button type="primary" @click="test">主要按钮</el-button> -->
          <el-form  status-icon label-width="100px" class="MCenter-el-form">
            <el-row>
              <el-col :span="12"> <!-- 上部信息左侧 -->
                <div class="grid-content bg-purple-light">
                  <div><h2>卡号:&nbsp;&nbsp;&nbsp;{{memberEditData.memberNum}}</h2></div>
                  <div><h2>姓名:&nbsp;&nbsp;&nbsp;
                          <span>
                            <el-input style="width:auto" v-model="memberEditData.memberName"  clearable>
                            </el-input>
                          </span>
                      </h2>
                  </div>
                  <div>
                    <!-- <h2>电话:&nbsp;&nbsp;&nbsp; -->
                          <!-- <span> -->
                        <el-form :model="memberEditData" :rules="rules" ref="memberEditData" >
                            <el-form-item label="会员电话" prop="memberPhone">
                              <el-input v-model="memberEditData.memberPhone"></el-input>
                            </el-form-item>
                        </el-form>
                            <!-- <el-input style="width:auto" v-model="memberEditData.memberPhone" clearable> </el-input> -->
                          <!-- </span> -->
                      <!-- </h2> -->
                  </div> 
                </div>
              </el-col>
            </el-row>

            <el-table :data="tableData" :show-header="false" border style="width: 100%; background-color:#ffcbb3">
              <el-table-column prop="nameA" >
              </el-table-column>
              <el-table-column  prop="dataA"   >
              </el-table-column>
              <el-table-column prop="nameB" >
              </el-table-column>
              <el-table-column  prop="dataB" >
              </el-table-column>
            </el-table>

              <el-row style="margin-top:50px">
                <!-- <el-col :span="4"><div class="grid-content bg-purple">123123</div></el-col> -->
                <el-col :span="4">
                  <div class="grid-content bg-purple-light">
                    <el-button type="info" @click="cancel()" style="width:100%">取消</el-button>
                  </div>
                </el-col>
                <el-col :span="4"><div class="grid-content bg-purple-light"></div></el-col>
                <el-col :span="4"><div class="grid-content bg-purple"></div></el-col>
                <el-col :span="4"><div class="grid-content bg-purple-light"></div></el-col>
                <el-col :span="4"><div class="grid-content bg-purple"></div></el-col>
                <el-col :span="4">
                  <div class="grid-content bg-purple-light">
                    <el-button type="danger" @click="save()" style="width:100%;height:80px"><h2>保存</h2></el-button>
                  </div>
                </el-col>
              </el-row>
          </el-form>
        </el-dialog> <!-- 会员中心窗口 -> END -->
      </div>
  </el-row>
  <!-- 会员中心窗口 -> START -->

  <!-- <member-edit></member-edit> -->

 </div>
</template>



<script>
export default {
  props: ["memberCenterData"],
  data() {
    //验证规则---电话号码
    var validPhone = (rule, value, callback) => {
      if (!isvalidPhone(value)) {
        // console.log(value);
        callback(new Error("请输入正确的11位手机号码"));
      } else {
        callback();
      }
    };
    function isvalidPhone(str) {
      var reg = /^1[3|4|5|7|8][0-9]\d{8}$/;
      return reg.test(str);
    }
    return {
      dialogVisible: true, //窗口显示标志位
      memberEditData: {}, //编辑会员窗口的会员数据
      tableData: [
        {
          nameA: "会员等级",
          dataA: "",
          nameB: "持有次卡",
          dataB: ""
        },
        {
          nameA: "会员折扣",
          dataA: "",
          nameB: "购物卡",
          dataB: ""
        },
        {
          nameA: "会员生日",
          dataA: "",
          nameB: "联系地址",
          dataB: ""
        },
        {
          nameA: "开卡日期",
          dataA: "",
          nameB: "到期时间",
          dataB: ""
        }
      ],
      rules: {
        memberPhone: [
          { required: true, message: "请输入电话号码", trigger: "blur" },
          {
            min: 4,
            max: 11,
            message: "长度在 8 到 12 个字符",
            trigger: "blur"
          },
          { required: true, validator: validPhone, trigger: "blur" }
        ]
      }
    };
  },
  mounted() {
    this.memberEditData = this.memberCenterData;
    this.tableData[3].dataA = this.memberEditData.openCardDate; //给表格赋值
    this.tableData[2].dataA = this.memberEditData.memberBirthday; //给表格赋值
  },
  methods: {
    cancel() {
      console.log("cancel");
      this.dialogVisible = false; //关闭当前窗口
    },
    save() {
      // console.log("Save");
      this.dialogVisible = false; //关闭当前窗口
      this.$emit("saveEditDataButton", this.memberEditData);
    }
  }
};
</script>

<style scoped>
.center {
  text-align: center;
}
.el-form.MCenter-el-form {
  padding: 0 10%;
}
/* el-table.warning-row {
    background-color: oldlace  !important;
  }
el-table-column .warning-row {
    background-color: oldlace  !important;
  } */
el-table__row {
  background-color: oldlace !important;
}

.el-col {
  border-radius: 4px;
}
.bg-purple-dark {
  background: #99a9bf;
}
.bg-purple {
  background: #d3dce6;
}
.bg-purple-light {
  background: #e5e9f2;
}
.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}
</style>
