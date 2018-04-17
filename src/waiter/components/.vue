<template>
 <div class="customer_container">
   <el-row>
      <div class="grid-content bg-purple-light">
        <el-dialog  title="会员中心"  :visible.sync="dialogVisible" :close-on-press-escape="false" :fullscreen="true" center style="color: #1533db;">
        <!-- <el-button type="primary" @click="test">主要按钮</el-button> -->
          <el-form  status-icon label-width="100px" class="MCenter-el-form">
            <el-row>
              <el-col :span="12"> <!-- 上部信息左侧 -->
                <div class="grid-content bg-purple-light">
                  <div><h2>卡号:&nbsp;&nbsp;&nbsp;{{memberData.memberNum}}</h2></div>
                  <div><h2>姓名:&nbsp;&nbsp;&nbsp;{{memberData.memberName}}</h2></div>
                  <div><h2>电话:&nbsp;&nbsp;&nbsp;{{memberData.memberPhone}}</h2></div>
                </div>
              </el-col>
              <el-col :span="12"><!-- 上部信息右侧 -->
                <div class="grid-content bg-purple-light">
                  <el-col :span="8" class="center">
                    <div class="grid-content bg-purple">
                      <h3>余额</h3>
                      <div>
                        ¥ {{memberData.memberCardRemaining}} 
                      </div>
                      <div>
                        <el-button type="warning" plain size="mini">充值</el-button>
                      </div>
                    </div>
                  </el-col>
                  <el-col :span="8" class="center">
                    <div class="grid-content bg-purple-light">
                      <h3>积分</h3>
                      <div>
                        0
                      </div>
                      <div>
                        <el-button type="warning" plain size="mini">查看</el-button>
                      </div>
                    </div>
                  </el-col>
                  <el-col :span="8" class="center">
                    <div class="grid-content bg-purple">
                      <h3>优惠券</h3>
                      <div>
                        0
                      </div>
                      <div>
                        <el-button type="warning" plain size="mini">兑换</el-button>
                      </div>
                    </div>
                  </el-col>
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
                    <el-button type="info" @click="editMember()" style="width:100%">编辑</el-button>
                  </div>
                </el-col>
                <el-col :span="4"><div class="grid-content bg-purple-light"></div></el-col>
                <el-col :span="4"><div class="grid-content bg-purple"></div></el-col>
                <el-col :span="4"><div class="grid-content bg-purple-light"></div></el-col>
                <el-col :span="4"><div class="grid-content bg-purple"></div></el-col>
                <el-col :span="4">
                  <div class="grid-content bg-purple-light">
                    <el-button type="danger" @click="selectMember()" style="width:100%;height:80px"><h2>选中会员</h2></el-button>
                  </div>
                </el-col>
              </el-row>
          </el-form>
        </el-dialog> <!-- 会员中心窗口 -> END -->
      </div>
  </el-row>
  <!-- 会员中心窗口 -> START -->

 </div>
</template>



<script>
// import MemberEdit from "@/components/MemberEdit.vue";

export default {
  props: ["memberData"],
  data() {
    return {
      dialogVisible: true, //窗口显示标志位
      memberCenterData: {},
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
    };
  },
  mounted() {
    this.memberCenterData = this.memberData;
    this.tableData[3].dataA = this.memberCenterData.openCardDate;
  },
  methods: {
    selectMember() {
      this.$emit("SelectMemberButton", this.memberCenterData);
    },
    editMember() {
      console.log("编辑按钮被按下了!!!");
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
