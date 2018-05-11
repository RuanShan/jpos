
let getPrintersFunction = function(){
  if (!process.env.IS_WEB){
    const ipcRenderer = require('electron').ipcRenderer;
    return function(){
      console.log("send jpos-aget-printers")
      ipcRenderer.send('jpos-aget-printers', 'ping');
    }
  }else{
    return function(){  console.warn("please run in electron, now is web.")   }
  }
}



export var printMixin = {
  methods: {
    getPrinters: getPrintersFunction()

  }
}
