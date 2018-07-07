<template>
    <div class="fillcontain">
        <div class="table_container">
            <el-table
                :data="tableData"
                @expand='expand'
                :expand-row-keys='expendRow'
                :row-key="row => row.index"
                style="width: 100%">
                <el-table-column type="expand">
                  <template slot-scope="props">
                    <el-form label-position="left" inline class="demo-table-expand">
                      <el-form-item label="食品名称">
                        <span>{{ props.row.name }}</span>
                      </el-form-item>
                      <el-form-item label="餐馆名称">
                        <span>{{ props.row.restaurant_name }}</span>
                      </el-form-item>
                      <el-form-item label="食品 ID">
                        <span>{{ props.row.item_id }}</span>
                      </el-form-item>
                      <el-form-item label="餐馆 ID">
                        <span>{{ props.row.restaurant_id }}</span>
                      </el-form-item>
                      <el-form-item label="食品介绍">
                        <span>{{ props.row.description }}</span>
                      </el-form-item>
                      <el-form-item label="餐馆地址">
                        <span>{{ props.row.restaurant_address }}</span>
                      </el-form-item>
                      <el-form-item label="食品评分">
                        <span>{{ props.row.rating }}</span>
                      </el-form-item>
                      <el-form-item label="食品分类">
                        <span>{{ props.row.category_name }}</span>
                      </el-form-item>
                      <el-form-item label="月销量">
                        <span>{{ props.row.month_sales }}</span>
                      </el-form-item>
                    </el-form>
                  </template>
                </el-table-column>
                <el-table-column
                  label="分类名称"
                  prop="name">
                </el-table-column>
                <el-table-column
                  label="分类介绍"
                  prop="description">
                </el-table-column>
                <el-table-column
                  label="产品数量"
                  prop="rating">
                </el-table-column>
                <el-table-column label="操作" width="160">
                  <template slot-scope="scope">
                    <el-button
                      size="small"
                      @click="handleEdit(scope.row)">编辑</el-button>
                    <el-button
                      size="small"
                      type="danger"
                      @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                  </template>
                </el-table-column>
            </el-table>
            <div class="Pagination">
                <el-pagination
                  @size-change="handleSizeChange"
                  @current-change="handleCurrentChange"
                  :current-page="currentPage"
                  :page-size="20"
                  layout="total, prev, pager, next"
                  :total="count">
                </el-pagination>
            </div>
            <el-dialog title="修改分类信息" :visible.sync="dialogFormVisible">
            <el-form :model="selectTable">
                <el-form-item label="分类名称" label-width="100px">
                    <el-input v-model="selectTable.name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="分类介绍" label-width="100px">
                    <el-input v-model="selectTable.description"></el-input>
                </el-form-item>
            </el-form>

              <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="updateMenu">确 定</el-button>
              </div>
            </el-dialog>


            <el-dialog title="添加规格" :visible.sync="specsFormVisible">
              <el-form :rules="specsFormrules" :model="specsForm">
                <el-form-item label="规格" label-width="100px" prop="specs">
                   <el-input v-model="specsForm.specs" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="包装费" label-width="100px">
                <el-input-number v-model="specsForm.packing_fee" :min="0" :max="100"></el-input-number>
              </el-form-item>
              <el-form-item label="价格" label-width="100px">
                <el-input-number v-model="specsForm.price" :min="0" :max="10000"></el-input-number>
              </el-form-item>
              </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="specsFormVisible = false">取 消</el-button>
              <el-button type="primary" @click="addspecs">确 定</el-button>
            </div>
          </el-dialog>
        </div>
    </div>
</template>

<script>
    import headTop from '@/components/layout/headTop'
    import {baseUrl, baseImgPath} from '@/config/env'
    import {mapState} from 'vuex'
    import {getFoods, getMenu, getMenusCount, updateMenu,  deleteFood} from '@/api/getData'
    export default {
      data () {
        return {
          baseUrl,
          baseImgPath,
          restaurant_id: null,
          city: {},
          offset: 0,
          limit: 20,
          count: 0,
          tableData: [],
          currentPage: 1,
          selectTable: {},
          dialogFormVisible: false,
          selectMenu: {},
          selectIndex: null,
          specsForm: {
            specs: '',
            packing_fee: 0,
            price: 20
          },
          specsFormrules: {
            specs: [
              { required: true, message: '请输入规格', trigger: 'blur' }
            ]
          },
          specsFormVisible: false,
          expendRow: []
        }
      },
      created () {
        console.log(this.userInfo)
        this.restaurant_id = this.userInfo.shop_id
        this.initData()
      },
      computed: {
        ...mapState(['userInfo']),
        specs: function () {
          let specs = []
          if (this.selectTable.specfoods) {
            this.selectTable.specfoods.forEach(item => {
              specs.push({
                specs: item.specs_name,
                packing_fee: item.packing_fee,
                price: item.price
              })
            })
          }
          return specs
        }
      },
      components: {
        headTop
      },
      methods: {
        async initData () {
          try {
            const countData = await getMenusCount({restaurant_id: this.restaurant_id})
            if (countData.status == 1) {
              this.count = countData.count
            } else {
              throw new Error('获取数据失败')
            }
            this.getMenu()
          } catch (err) {
            console.log('获取数据失败', err)
          }
        },
        async getMenu () {
          try {
            const menu = await getMenu({restaurant_id: this.restaurant_id, allMenu: true})
            this.tableData = []
            menu.forEach((item, index) => {

              const tableData = {}
              tableData.id = item.id
              tableData.name = item.name
              tableData.description = item.description

              tableData.icon_url = item.icon_url
              tableData.foods = item.foods
              tableData.index = index
              this.tableData.push(tableData)

            })
          } catch (err) {
            console.log('获取食品种类失败', err)
          }
        },
        async getFoods () {
          const Foods = await getFoods({offset: this.offset, limit: this.limit, restaurant_id: this.restaurant_id})
          this.tableData = []
          Foods.forEach((item, index) => {
            const tableData = {}
            tableData.name = item.name
            tableData.item_id = item.item_id
            tableData.description = item.description
            tableData.rating = item.rating
            tableData.month_sales = item.month_sales
            tableData.restaurant_id = item.restaurant_id
            tableData.category_id = item.category_id
            tableData.image_path = item.image_path
            tableData.specfoods = item.specfoods
            tableData.index = index
            this.tableData.push(tableData)
          })
        },
        tableRowClassName (row, index) {
          if (index === 1) {
            return 'info-row'
          } else if (index === 3) {
            return 'positive-row'
          }
          return ''
        },
        addspecs () {
          this.specs.push({...this.specsForm})
          this.specsForm.specs = ''
          this.specsForm.packing_fee = 0
          this.specsForm.price = 20
          this.specsFormVisible = false
        },
        deleteSpecs (index) {
              this.specs.splice(index, 1)
        },
        handleSizeChange (val) {
          console.log(`每页 ${val} 条`)
        },
        handleCurrentChange (val) {
          this.currentPage = val
          this.offset = (val - 1) * this.limit
          this.getFoods()
        },
        expand (row, status) {
          if (status) {
            this.getSelectItemData(row)
          } else {
            const index = this.expendRow.indexOf(row.index)
            this.expendRow.splice(index, 1)
          }
        },
        handleEdit (row) {
          console.log('handle edit')
          this.getSelectItemData(row, 'edit')
          this.dialogFormVisible = true
        },
        async getSelectItemData (row, type) {
          //const restaurant = await getStore(row.restaurant_id)
          //const category = await getMenuById(row.category_id)
          this.selectTable = {...row }

          if (type == 'edit' && this.restaurant_id != row.restaurant_id) {
            this.getMenu()
          }
        },
        handleSelect (index) {
          this.selectIndex = index
        },
        async handleDelete (index, row) {
          try {
            const res = await deleteFood(row.item_id)
            if (res.status == 1) {
              this.$message({
                type: 'success',
                message: '删除分类成功'
              })
              this.tableData.splice(index, 1)
            } else {
              throw new Error(res.message)
            }
          } catch (err) {
            this.$message({
              type: 'error',
              message: err.message
            })
            console.log('删除分类失败')
          }
        },
        handleServiceAvatarScucess (res, file) {
          if (res.status == 1) {
            this.selectTable.image_path = res.image_path
          } else {
            this.$message.error('上传图片失败！')
          }
        },
        beforeAvatarUpload (file) {
          const isRightType = (file.type === 'image/jpeg') || (file.type === 'image/png')
          const isLt2M = file.size / 1024 / 1024 < 2

          if (!isRightType) {
            this.$message.error('上传头像图片只能是 JPG 格式!')
          }
          if (!isLt2M) {
            this.$message.error('上传头像图片大小不能超过 2MB!')
          }
          return isRightType && isLt2M
        },
        async updateMenu () {
          this.dialogFormVisible = false
          try {
            const subData = {new_category_id: this.selectMenu.value, specs: this.specs}
            const postData = {...this.selectTable, ...subData}
            const id = postData.id
            console.log(this.selectTable )
            const res = await updateMenu(id, postData)
            if (res.status == 1) {
              this.$message({
                type: 'success',
                message: '更新分类信息成功'
              })
              this.getMenu()
            } else {
              this.$message({
                type: 'error',
                message: res.message
              })
            }
          } catch (err) {
            console.log('更新餐馆信息失败', err)
          }
        }
      }
    }
</script>

<style lang="scss">
  @import '../style/mixin';
    .demo-table-expand {
        font-size: 0;
    }
    .demo-table-expand label {
        width: 90px;
        color: #99a9bf;
    }
    .demo-table-expand .el-form-item {
        margin-right: 0;
        margin-bottom: 0;
        width: 50%;
    }
    .table_container{
    padding: 20px 0;
    }
    .Pagination{
        display: flex;
        justify-content: flex-start;
        margin-top: 8px;
    }
    .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }
    .avatar-uploader .el-upload:hover {
        border-color: #20a0ff;
    }
    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 120px;
        height: 120px;
        line-height: 120px;
        text-align: center;
    }
    .avatar {
        width: 120px;
        height: 120px;
        display: block;
    }
</style>
