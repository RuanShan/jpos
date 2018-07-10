
let getPrintersFunction = function(){
  if (!process.env.IS_WEB){
    const ipcRenderer = require('electron').ipcRenderer
    return function(){
      const printers = ipcRenderer.sendSync('get-printers', 'ping')
      //console.log("sendSync jpos-get-printers", printers)
      return printers
    }
  }else{
    return function(){  console.warn("please run in electron, now is web."); return {}  }
  }
}



export var PrintMixin = {
  methods: {
    getPrinters: getPrintersFunction()
  }
}

export var PrintUtil = {
  getPrinters: getPrintersFunction()
}
