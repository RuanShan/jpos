<template>
  <div class="orders">
    this is orders page
  </div>
</template>

<script>
    import headTop from '../components/headTop'
    import {getOrderList, getOrderCount, getResturantDetail, getUserInfo, getAddressById} from '@/api/getData'
    export default {
        data(){
            return {
                tableData: [],
                currentRow: null,
                offset: 0,
                limit: 20,
                count: 0,
                currentPage: 1,
                restaurant_id: null,
                expendRow: [],
            }
        },
      components: {
        headTop,
      },
        created(){
          this.restaurant_id = this.$route.query.restaurant_id;
            this.initData();
        },
        mounted(){

        },
        methods: {
            async initData(){
                try{
                    const countData = await getOrderCount({restaurant_id: this.restaurant_id});
                    if (countData.status == 1) {
                        this.count = countData.count;
                    }else{
                        throw new Error('获取数据失败');
                    }
                    this.getOrders();
                }catch(err){
                    console.log('获取数据失败', err);
                }
            },
            handleSizeChange(val) {
                console.log(`每页 ${val} 条`);
            },
            handleCurrentChange(val) {
                this.currentPage = val;
                this.offset = (val - 1)*this.limit;
                this.getOrders()
            },
            async getOrders(){
                const Orders = await getOrderList({offset: this.offset, limit: this.limit, restaurant_id: this.restaurant_id});
                this.tableData = [];
                Orders.forEach((item, index) => {
                    const tableData = {};
                    tableData.id = item.id;
                    tableData.total_amount = item.total_amount;
                    tableData.status = item.status_bar.title;
                    tableData.user_id = item.user_id;
                     tableData.restaurant_id = item.restaurant_id;
                     tableData.address_id = item.address_id;
                    tableData.index = index;
                    this.tableData.push(tableData);
                })
            },
            async expand(row, status){
              if (status) {
                const restaurant = await getResturantDetail(row.restaurant_id);
                const userInfo = await getUserInfo(row.user_id);
                const addressInfo = await getAddressById(row.address_id);

                  this.tableData.splice(row.index, 1, {...row, ...{restaurant_name: restaurant.name, restaurant_address: restaurant.address, address: addressInfo.address, user_name: userInfo.username}});
                    this.$nextTick(() => {
                        this.expendRow.push(row.index);
                    })
              }else{
                    const index = this.expendRow.indexOf(row.index);
                    this.expendRow.splice(index, 1)
                }
            },
        },
    }
</script>
