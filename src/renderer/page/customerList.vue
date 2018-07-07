<template>
    <div class="fillcontain">
        <div class="table_container">
            <el-table
                :data="tableData"
                highlight-current-row
                style="width: 100%">
                <el-table-column
                  type="index"
                  width="100">
                </el-table-column>
                <el-table-column
                  property="display_created_at"
                  label="注册日期"
                  width="220">
                </el-table-column>
                <el-table-column
                  property="username"
                  label="用户姓名"
                  width="220">
                </el-table-column>
                <el-table-column
                  property="mobile"
                  label="mobile">
                </el-table-column>
            </el-table>
            <div class="Pagination" style="text-align: left;margin-top: 10px;">
                <el-pagination
                  @size-change="handleSizeChange"
                  @current-change="handleCurrentChange"
                  :current-page="currentPage"
                  :page-size="perPage"
                  layout="total, prev, pager, next"
                  :total="count">
                </el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
    import headTop from '@/components/layout/headTop'
    import {getCustomerList} from '@/api/getData'
    export default {
      data () {
        return {
          tableData: [{
            registe_time: '2016-05-02',
            username: '王小虎',
            city: '上海市普陀区金沙江路 1518 弄'
          }, {
            registe_time: '2016-05-04',
            username: '王小虎',
            city: '上海市普陀区金沙江路 1517 弄'
          }, {
            registe_time: '2016-05-01',
            username: '王小虎',
            city: '上海市普陀区金沙江路 1519 弄'
          }, {
            registe_time: '2016-05-03',
            username: '王小虎',
            city: '上海市普陀区金沙江路 1516 弄'
          }],
          currentRow: null,
          perPage: 20,
          count: 0,
          currentPage: 1
        }
      },
      components: {
        headTop
      },
      created () {
        this.initData()
    },
      methods: {
        async initData () {
          try {
            this.getUsers()
          } catch (err) {
            console.log('获取数据失败', err)
          }
        },
        handleSizeChange (val) {
          console.log(`每页 ${val} 条`)
        },
        handleCurrentChange (val) {
          this.currentPage = val
          this.getUsers()
        },
        async getUsers () {
          const response = await getCustomerList({page: this.currentPage, per_page: this.perPage})
          this.tableData = []
          response.users.forEach(item => {
            const tableData = {}
            tableData.username = item.username
            tableData.display_created_at = item.display_created_at
            tableData.mobile = item.mobile
            this.tableData.push(tableData)
          })
          this.count = response.count
        }
      }
    }
</script>

<style lang="scss">
	@import '../style/mixin';
    .table_container{
    padding: 20px 0;
    }
</style>
