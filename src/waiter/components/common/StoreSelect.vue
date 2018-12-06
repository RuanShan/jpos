

<template>
  <el-form-item label="门店选择" >
    <el-select  v-model="selectedStoreId" size="mini" @change="handleStoreChanged">
      <el-option v-for="item in storeOptions" :key="item.value" :label="item.name" :value="item.id">
      </el-option>
    </el-select>
  </el-form-item>
</template>

<script>
export default {

  props: ['value', 'disableAll'],
  data(){
    return {
      selectedStoreId:null
    }
  },
  computed:{
    storeOptions(){
      let options = this.stores.map((item) => { return { id: item.id, name: item.name } })
      if( !this.disableAll){
        options.unshift( { id: null, name: "全部" } )
      }
      return options
    }
  },
  mounted(){
    this.selectedStoreId = this.value
  },

  methods:{
    handleStoreChanged(){
      console.log('handleStoreChanged:', this.selectedStoreId)
      this.$emit('update:value', this.selectedStoreId)
    }

  }
}
</script>
