<template>
    <div>
    <section class="data_section">
      <header class="section_title">数据统计</header>
      <el-row :gutter="20" style="margin-bottom: 10px;">
                <el-col :span="4"><div class="data_list today_head"><span class="data_num head">当日数据：</span></div></el-col>
        <el-col :span="4"><div class="data_list"><span class="data_num">{{userCount}}</span> 新增用户</div></el-col>
        <el-col :span="4"><div class="data_list"><span class="data_num">{{orderCount}}</span> 新增订单</div></el-col>
                <el-col :span="4"><div class="data_list"><span class="data_num">{{cardCount}}</span> 新增管理员</div></el-col>
      </el-row>
            <el-row :gutter="20">
                <el-col :span="4"><div class="data_list all_head"><span class="data_num head">总数据：</span></div></el-col>
                <el-col :span="4"><div class="data_list"><span class="data_num">{{allUserCount}}</span> 注册用户</div></el-col>
                <el-col :span="4"><div class="data_list"><span class="data_num">{{allOrderCount}}</span> 订单</div></el-col>
                <el-col :span="4"><div class="data_list"><span class="data_num">{{allCardCount}}</span> 管理员</div></el-col>
            </el-row>
    </section>
    <tendency :sevenDate='sevenDate' :sevenDay='sevenDay'></tendency>
    </div>
</template>

<script>
  import headTop from '@/components/headTop'
  import tendency from '@/components/tendency'
  import dtime from 'time-formater'
  import {selectedDaysCount, todayCount, totalCount} from '@/api/getData'
  var Promise = require('es6-promise').Promise

export default {
    data () {
      return {
        userCount: null,
        orderCount: null,
        cardCount: null,
        allUserCount: null,
        allOrderCount: null,
        allCardCount: null,
        sevenDay: [],
        sevenDate: [[], [], []]
      }
    },
    components: {
      headTop,
      tendency
    },
    mounted () {
      this.initData()
      for (let i = 6; i > -1; i--) {
        const date = dtime(new Date().getTime() - 86400000 * i).format('YYYY-MM-DD')
        this.sevenDay.push(date)
      }
      this.getSevenData()
    },
  computed: {

  },
    methods: {
      async initData () {
        //const today = dtime().format('YYYY-MM-DD')
        Promise.all([todayCount(), totalCount()])
          .then(res => {
            this.userCount = res[0].new_customers_count
            this.orderCount = res[0].new_orders_count
            this.cardCount = res[0].new_cards_count
            this.allUserCount = res[1].new_customers_count
            this.allOrderCount = res[1].new_orders_count
            this.allCardCount = res[1].new_cards_count
          }).catch(err => {
            console.log(err)
          })
      },
      async getSevenData () {

        selectedDaysCount( {days:this.sevenDay} ).then(res => {
          const resArr = [[], [], []]
          res.sale_days.forEach((item, index) => {
            resArr[0].push( item.new_customers_count )
            resArr[1].push( item.new_orders_count )
            resArr[2].push( item.new_cards_count )

          })
          this.sevenDate = resArr
        }).catch(err => {
          console.log(err)
        })
      }
    }
}
</script>

<style lang="scss">
  @import '../style/mixin';
  .data_section{
    padding: 20px;
    margin-bottom: 40px;
    .section_title{
      text-align: center;
      font-size: 30px;
      margin-bottom: 10px;
    }
    .data_list{
      text-align: center;
      font-size: 14px;
      color: #666;
            border-radius: 6px;
            background: #E5E9F2;
            .data_num{
                color: #333;
                font-size: 26px;

            }
            .head{
                border-radius: 6px;
                font-size: 22px;
                padding: 4px 0;
                color: #fff;
                display: inline-block;
            }
        }
        .today_head{
            background: #FF9800;
        }
        .all_head{
            background: #20A0FF;
        }
  }
    .wan{
        @include sc(16px, #333)
    }
</style>
