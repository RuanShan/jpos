let getPrintersFunction = function(){
  if (!process.env.IS_WEB){
    const ipcRenderer = require('electron').ipcRenderer
    return function(){
      const printers = ipcRenderer.sendSync('get-printers', 'ping')
      //console.log("sendSync jpos-get-printers", printers)
      return printers
    }
  }else{
    return function(){  console.warn("please run in electron, now is web."); return []  }
  }
}

//
let printLabelFunction = function(  ){
  if (!process.env.IS_WEB){
    const ipcRenderer = require('electron').ipcRenderer
    return function(params){
      const result = ipcRenderer.sendSync('print-label', {title: 'test print label'})
      //console.log("sendSync jpos-get-printers", printers)
      return result
    }
  }else{
    return function(){  console.warn("please run in electron, now is web."); return {}  }
  }
}

//
let printReceiptFunction = function(  ){
  if (!process.env.IS_WEB){
    const ipcRenderer = require('electron').ipcRenderer
    return function(params){
      const result = ipcRenderer.sendSync('print-receipt', {title: 'test print receipt'})
      //console.log("sendSync jpos-get-printers", printers)
      return result
    }
  }else{
    return function(){  console.warn("please run in electron, now is web."); return {}  }
  }
}


export var PrintUtil = {
  getPrinters: getPrintersFunction(),
  printLabel: printLabelFunction(),
  printReceipt: printReceiptFunction(),
}
