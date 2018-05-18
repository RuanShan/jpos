<template rsf="centerWindow">
  <div class="customer_container">
    <el-row>
      <div class="grid-content bg-purple-light">
        <!-- 会员中心窗口 -> START -->
        <el-dialog title="会员中心" :visible.sync="dialogVisible" :close-on-press-escape="false" :fullscreen="true" center @close="closeWindow()" style="color: #1533db;">
          <!-- <el-button type="primary" @click="test">主要按钮</el-button> -->
          <el-form status-icon label-width="100px" class="MCenter-el-form">
            <el-row>
              <el-col :span="12">
                <!-- 上部信息左侧 -->
                <div class="grid-content bg-purple-light">
                  <div>
                    <h2>ID:&nbsp;&nbsp;&nbsp;{{memberCenterData.id}}</h2>
                  </div>
                  <div>
                    <h2>姓名:&nbsp;&nbsp;&nbsp;{{memberCenterData.username}}</h2>
                  </div>
                  <div>
                    <h2>电话:&nbsp;&nbsp;&nbsp;{{memberCenterData.mobile}}</h2>
                  </div>
                </div>
              </el-col>
              <el-col :span="12">
                <!-- 上部信息右侧 -->
                <div class="grid-content bg-purple-light">
                  <el-col :span="8" class="center">
                    <div class="grid-content bg-purple">
                      <h3>余额</h3>
                      <div>
                        ¥ {{memberCenterData.memberCardRemaining}}
                      </div>
                      <div>
                        <el-button type="warning" plain size="mini" @click="rechargeButton">充值</el-button>
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
                      <h3>充值记录</h3>
                      <div>
                        ****
                      </div>
                      <div>
                        <el-button type="warning" plain size="mini" @click="openTopUpRecordWindow()">查看</el-button>
                      </div>
                    </div>
                  </el-col>
                </div>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12" style="margin-top:400px">
                <el-table id="tablexxxx" :data="tableData" :show-header="true" border style="width: 100%;">
                  <el-table-column prop="name"> </el-table-column>
                  <el-table-column prop="data"> </el-table-column>
                </el-table>
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="12">
                <el-table id="tablexxxx" :data="tableData" :show-header="true" border style="width: 100%;">
                  <el-table-column prop="name"> </el-table-column>
                  <el-table-column prop="data"> </el-table-column>
                </el-table>
                <!-- <el-table :data="tableData" style="width: 100%">
                  <el-table-column prop="name" label="日期" width="180">
                  </el-table-column>
                  <el-table-column prop="data" label="姓名" width="180">
                  </el-table-column>
                </el-table> -->
              </el-col>
              <el-col :span="12">

              </el-col>
            </el-row>

            <el-row style="margin-top:50px">
              <el-col :span="4">
                <div class="grid-content bg-purple-light">
                  <el-button type="info" @click="editMember()" style="width:100%">编辑</el-button>
                </div>
              </el-col>
              <el-col :span="4">
                <div class="grid-content bg-purple-light"></div>
              </el-col>
              <el-col :span="4">
                <div class="grid-content bg-purple"></div>
              </el-col>
              <el-col :span="4">
                <div class="grid-content bg-purple-light"></div>
              </el-col>
              <el-col :span="4">
                <div class="grid-content bg-purple"></div>
              </el-col>
              <el-col :span="4">
                <div class="grid-content bg-purple-light">
                  <el-button type="danger" @click="selectMember()" style="width:100%;height:80px">
                    <h2>选中会员</h2>
                  </el-button>
                </div>
              </el-col>
            </el-row>
          </el-form>
        </el-dialog>
        <!-- 会员中心窗口 -> END -->
      </div>
    </el-row>

    <!-- 编辑会员窗口 -> Start -->
    <member-edit v-if="memberEditWindows" v-bind:memberCenterData="memberCenterData" v-on:saveEditDataButton="saveEditDataButton($event)">
    </member-edit>
    <!-- 编辑会员窗口 -> END -->

    <!-- 充值中心窗口 -> Start -->
    <member-recharge v-if="memberRechargeWindow" :memberCenterData="memberCenterData" @saveRechargeButton="saveRechargeButton($event)">
    </member-recharge>
    <!-- 充值中心窗口 -> END -->

    <!-- 充值记录查询窗口 -> Start -->
    <member-topup-record v-if="memberTopUpRecordWindow" :memberCenterData="memberCenterData" @topUpRecordButton="topUpRecordButton($event)"></member-topup-record>
    <!-- 充值记录查询窗口 -> END -->
  </div>
</template>



<script>
import MemberEdit from "@/components/MemberEdit.vue";
import MemberRecharge from "@/components/MemberRecharge.vue";
import MemberTopUpRecord from "@/components/MemberTopUpRecord.vue";
import { getCustomer } from "@/api/getData";

export default {
  props: ["customerId"],
  components: {
    "member-edit": MemberEdit,
    "member-recharge": MemberRecharge,
    "member-topup-record": MemberTopUpRecord
  },
  data() {
    return {
      dialogVisible: true, //窗口显示标志位
      memberEditWindows: false, //会员编辑窗口显示标志位
      memberRechargeWindow: false, //充值中心窗口显示标志位
      memberTopUpRecordWindow: false, //查询会员记录窗口标志位
      memberCenterData: {}, //会员中心的会员数据
      tableData: [
        {
          name: "创建时间",
          data: ""
        },
        {
          name: "会员生日",
          data: ""
        },
        {
          name: "E-Mail",
          data: ""
        },
        {
          name: "地址",
          data: ""
        }
      ],
      returnSerVerData: {} //接收到的SerVer数据
    };
  },
  mounted() {
    this.getSverVerCustomer(this.customerId).then(() => {
      this.memberCenterData = this.returnSerVerData;
      this.tableData[0].data = this.memberCenterData.created_at.substring(
        0,
        10
      );
      this.tableData[1].data = this.memberCenterData.birth.substring(0, 10);
      this.tableData[2].data = this.memberCenterData.email;
      this.tableData[3].data = this.memberCenterData.address;
    });
  },
  methods: {
    //单击选中会员按钮后向父窗口"MemberKeyWord"发送本窗口的会员数据
    selectMember() {
      this.$emit("SelectMemberButton", this.memberCenterData);
    },
    //单击编辑按钮是执行
    editMember() {
      this.memberEditWindows = true; //打开编辑会员窗口
      console.log("编辑按钮被按下了!!!");
    },
    //接收到编辑会员窗口的数据后执行
    saveEditDataButton(memberEditData) {
      this.dialogVisible = true; //打开当前窗口
      this.memberEditWindows = false; //关闭编辑会员窗口
      // this.memberCenterData = memberEditData; //把编辑会员窗口的会员数据发给本窗口的会员数据
      this.getSverVerCustomer(this.memberCenterData.Id).then(() => {
        this.memberCenterData = this.returnSerVerData; // 把从SerVer得到的用户数据给当前窗口的用户数据
        //***刷新数据 */
      });
    },
    //充值按钮点击事件
    rechargeButton() {
      console.log("充值开始了");
      this.memberRechargeWindow = true;
    },
    //获取SerVer用户数据,异步获取
    async getSverVerCustomer(Id) {
      this.returnSerVerData = await getCustomer(Id);
    },
    //接收到充值页面来的数据
    saveRechargeButton(id) {
      // console.log("saveRechargeButton=" + id);
      this.dialogVisible = true;
      this.getSverVerCustomer(this.memberCenterData.Id).then(() => {
        this.memberCenterData = this.returnSerVerData; // 把从SerVer得到的用户数据给当前窗口的用户数据
        this.memberRechargeWindow = false; //关闭充值窗口
        this.tableData[0].dataA = this.memberCenterData.memberCardGrade; //显示数据
      });
    },
    closeWindow() {
      console.log("Center  关闭了***");
    },
    //MemberKeyWord打开用户中心窗口时的事件处理函数
    updateForId(id) {
      // console.log(Id);
      this.getSverVerCustomer(id).then(() => {
        this.memberCenterData = this.returnSerVerData; // 把从SerVer得到的用户数据给当前窗口的用户数据
        //更新页面数据
      });
    },
    //打开充值记录窗口
    openTopUpRecordWindow() {
      this.memberTopUpRecordWindow = true;
    },
    //充值记录窗口关闭时触发的事件处理
    topUpRecordButton(Id) {
      this.dialogVisible = true;
      this.memberTopUpRecordWindow = false;
      this.getSverVerCustomer(Id).then(() => {
        this.memberCenterData = this.returnSerVerData; // 把从SerVer得到的用户数据给当前窗口的用户数据
        //更新页面数据
      });
      console.log("充值记录窗口传过来的消息@@@@@@@@@@@");
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
