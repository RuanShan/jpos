<template>
 <div class="customer_container">
   <el-row>
      <div class="grid-content bg-purple-light">
        <el-dialog  title="会员中心"  :visible.sync="dialogVisible" :close-on-press-escape="false" :fullscreen="true" >
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
                        ¥XXX,XXX
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

            <el-table :data="tableData" :show-header="false" border style="width: 100%">
              <el-table-column prop="nameA" >
              </el-table-column>
              <el-table-column  prop="dataA"   >
              </el-table-column>
              <el-table-column prop="nameB" >
              </el-table-column>
              <el-table-column  prop="dataB" >
              </el-table-column>
            </el-table>

          
            <el-form-item>
              <el-button type="primary" @click="submitForm('')">立即创建</el-button>
              <el-button @click="resetForm('')">重置</el-button>
            </el-form-item>
          </el-form>
        </el-dialog> <!-- 会员中心窗口 -> END -->
      </div>
      
  </el-row>
  <!-- 会员中心窗口 -> START -->

 </div>
</template>



<script>
export default {
  props: ["memberData"],
  data() {
    return {
      dialogVisible: true, //窗口显示标志位
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
      ]
    };
  },
  methods: {
    
  }
};
</script>

<style scoped>
.center {
  text-align: center;
}
.el-form.MCenter-el-form  {
  padding: 0 10%;
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
