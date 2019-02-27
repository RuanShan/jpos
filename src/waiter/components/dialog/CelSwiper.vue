<style lang="scss" >
.cel-swiper-dialog{
  .el-icon-close{
    font-size: 1.5em;
  }
}
.cel-swiper{
  .swiper-slide {
    height: 70vh;
    text-align: center;
    background-size: contain;
    background-position: center;
    background-repeat: no-repeat;
    button{
      position: absolute;
      bottom: 0;
      right: 0;
    }
  }
}
</style>
<template>
  <el-dialog :fullscreen="fullscreen" :visible="computedVisible" @opened="handleDialogOpen" append-to-body :show-close="false" class="cel-dialog cel-swiper-dialog"  >
    <div slot="title" class="title-wrap">
      <div class="right back">

        <i class="el-icon-close" @click="handleCloseDialog"></i> </div>
      <div> 图片展示</div>
    </div>
    <swiper :options="swiperOption" class="cel-swiper"  ref="celSwiper">
        <div class="swiper-slide" v-for="image in carouselImages" :style="{backgroundImage: 'url('+image.url+')'}">
        </div>
        <div class="swiper-pagination" slot="pagination"></div>
    </swiper>
    <div slot="footer" v-show="enableDownload" >
      <el-button  @click="handleWebDownloadFile"  icon="el-icon-download" v-show="isWeb"> 网页下载原图 </el-button>
      <el-button  @click="handleDownloadFile"  icon="el-icon-download" v-show="!isWeb" > 下载原图 </el-button>

    </div>

</el-dialog>

</template>

<script>
import {
  DialogMixin
} from '@/components/mixin/DialogMixin'
import {
  DownloadUtil
} from '@/utils/ipcService'


export default {
  mixins: [DialogMixin],
  props: {
    dialogVisible: { type: Boolean },
    carouselImages:{ type: Array, default: []},
    enableDownload:{ type: Boolean, default: true }
  },
  data() {
    return {
      fullscreen: true,
      swiperOption: {
         pagination: {
           el: '.swiper-pagination'
         },
         // some swiper options...
       }
    }
  },
  computed: {
    swiper() {
      return this.$refs.celSwiper.swiper
    }
  },
  methods: {
    handleDialogOpen() {
      console.log("carouselImages=", this.carouselImages)
    },
    handleDownloadFile(){
      let image = this.carouselImages[this.swiper.activeIndex]
      console.log( " handleDownloadFile activeIndex", this.swiper, image)
      if( image  ){
        DownloadUtil.downloadFile( { url: image.originalUrl, downloadDone: ( {savedPath} )=>{
            this.$message({
                dangerouslyUseHTMLString: true,
                message: `图片下载成功！<p>保存路径： ${savedPath}</p>`,
                type: 'success'
              });
         } })
      }
    },
    handleWebDownloadFile(){
      let image = this.carouselImages[this.swiper.activeIndex]
      if( image  ){
        console.log( "handleWebDownloadFile image", image)
        var a = document.createElement('a')
        var event = new MouseEvent('click')

        a.download = '图片'
        a.href = image.originalUrl
        a.target="_blank"
        a.dispatchEvent(event)

      }
    },
    handleMaximizeDialog(){
      this.fullscreen = true
    },
    handleNormalSizeDialog(){
      this.fullscreen = false
    },
    isWeb(){
      return !!window._jpos.isweb
    }
  }
}
</script>
