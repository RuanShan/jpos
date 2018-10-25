<style lang="scss">
.scan-container{
  position: fixed;
  top:0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1;
  .cover{
    height: 100%;
    width: 100%;
    background: #000;
    opacity: .5;
  }
  .camera-wrap{
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
}
.camera-position {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 100px;

  .camera-display {
    /*vh、vw、vmin、vmax*/
    width: 75vmin;
    height: 75vmin;
    border: 1px solid #0080ff;
    video{
      width: 100%;
      height:100%;
    }
    background-color:#f4f4f4;
  }
  .text-positoin {
    display: flex;
    // justify-content: center;
    margin-top: 0px;

  }
  .close-button {
    width: 480px;
    height: 60px;
  }
}
</style>


<template>
  <div class="scan-container">
    <div class="cover"> </div>
    <div class="camera-wrap">
      <div class="camera-position">
      <div class="camera-display" id="video"></div>
      <div class="text-positoin">
        <h1 class="bg-warning">垂直对准条码{{tiaoMa.barCodeNum}}</h1>
      </div>
      <mt-button class="close-button" primary size="large" @click="closeCamera">关闭相机</mt-button>
    </div>
    </div>
    <div>
      <audio id="audioPlayScan" >
        <source src="/static/audio/sound.ogg" type="audio/ogg">
        <source src="/static/audio/sound.mp3" type="audio/mpeg">
      </audio>
    </div>
  </div>
</template>


<script>
import Quagga from 'quagga'

export default {
  props: ['cameraIsOpen'],
  data() {
    return {
      tiaoMa: {
        barCodeNum: ""
      }
    }
  },
  mounted() {
    console.log();
    if (this.cameraIsOpen == true) {
      let tempCode = '';
      console.log("请打开摄像头!!!");
      Quagga.init({
        locate: true,
        inputStream: {
          name: "Live",
          type: "LiveStream",
          target: document.querySelector('#video'), // Or '#yourElement' (optional)
          constraints: {
            width: 640,
            height: 480,
            facingMode: "environment",
            deviceId: ""
          },
          area: { // defines rectangle of the detection/localization area
            top: "0%", // top offset
            right: "0%", // right offset
            left: "0%", // left offset
            bottom: "0%" // bottom offset
          },
          singleChannel: false // true: only the red color-channel is read
        },
        frequency: 1000,
        decoder: {
          readers: ['code_128_reader'],
          debug: {
            drawBoundingBox: false,
            showFrequency: false,
            drawScanline: false,
            showPattern: false
          },
          multiple: false
        },
        Locator: {
          halfSample: true,
          patchSize: "medium", // x-small, small, medium, large, x-large
        },
      }, (err) => {
        if (err) {
          console.log(err);
          return
        }
        console.log("Initialization finished. Ready to start");
        Quagga.start();
        Quagga.onDetected((data) => {
          console.log(data);
          if (data.codeResult.format === "code_128") {
            tempCode = data.codeResult.code;
            console.log(tempCode, data.codeResult.code);
            this.soundsPlay(tempCode);
            Quagga.stop();
          }
        })
      });
    }
  },
  methods: {
    //传递给父组件的消息函数
    closeCamera() {
      Quagga.stop();
      this.$emit('closeCamera', false);
    },
    //声音播放函数-----1.更改条码数据; 2.传给父组件数据
    soundsPlay(tempCode) {
      let audioPlay = document.getElementById('audioPlayScan');
      console.log(audioPlay);
      audioPlay.play();/*在这里建议使用原生来获取，使用jQuery会有点问题*/
      console.log("声音播放完毕了*************");
      this.$set(this.tiaoMa, 'barCodeNum', tempCode);
      this.$emit("barCodeNum",this.tiaoMa.barCodeNum);
    },
  }
}
</script>
