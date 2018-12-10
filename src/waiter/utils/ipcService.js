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
      ipcRenderer.send('print-label', params )
      console.log("send print-label" )

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
      ipcRenderer.send('print-receipt', params)
      console.log("send print-receipt")
    }
  }else{
    return function(){  console.warn("please run in electron, now is web."); return {}  }
  }
}

let downloadFileFunction = function(  ){
  if (!process.env.IS_WEB){
    const ipcRenderer = require('electron').ipcRenderer
    return function(params){
      ipcRenderer.send('download-file', params)
      console.log("send download-file")
      if( params.downloadDone ){
        ipcRenderer.on('download-file-done', (event, arg) => {
          console.log('download-file-done', arg)
          params.downloadDone( arg )
        })
      }

    }
  }else{
    return function(){  console.warn("please run in electron, now is web."); return {}  }
  }
}
export var PrintUtil = {
  getPrinters: getPrintersFunction(),
  printLabel: printLabelFunction( ),
  printReceipt: printReceiptFunction( ),
}
export var DownloadUtil = {
  downloadFile: downloadFileFunction(),
}
