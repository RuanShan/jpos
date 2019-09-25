console.log( "process.env =", process.env)
console.log( "process.env.IS_WEB =", process.env.IS_WEB )
const isWeb = process.env.IS_WEB


let getPrintersFunction = function(){
  if (!isWeb){
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
  if (!isWeb){
    const ipcRenderer = require('electron').ipcRenderer
    return function(params){
      if( params.labelPrinter && params.labelPrinter.length> 0){
        ipcRenderer.send('print-label', params )
        console.log("send print-label" )
      }else{
        alert("请设置条码打印机再打印条码！" )
      }

    }
  }else{
    return function(){  console.warn("please run in electron, now is web."); return {}  }
  }
}

//
let printReceiptFunction = function(  ){
  if (!isWeb){
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
  if (!isWeb){
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
  setStore: downloadFileFunction(),
}

/**
 * 存储localStorage
 */

let setStoreFunction = function(){
  if (!isWeb){
    //const storage = {}
    const storage = require('electron-json-storage');

    return async function(name, json){
      return storage.set(name, json )
    }
  }else{

    return async function(name, content){
      return new Promise( (resolve, reject)=>{
        if (typeof content !== 'string') {
            content = JSON.stringify(content)
        }
        window.localStorage.setItem(name, content)
        resolve()
      })
    }
  }

}

/**
 * 获取localStorage
 */

 let getStoreFunction = function(){
   if (!isWeb){
     //const storage = {}
     const storage = require('electron-json-storage');
     return async function(name){
       return new Promise( (resolve, reject)=>{

         storage.get(name, (error, data)=>{
           console.log(  "error, data", error, data )
           if( error ){
             reject(error)
           }else{
             if( data == null ){
               data = {}
             }
             resolve( data )
           }
         })
       })
     }
   }else{

     return async function(name){
       return new Promise( (resolve, reject)=>{
         let content = window.localStorage.getItem(name)

         if (typeof content == 'string') {
            content = JSON.parse(content)
         }else{
           content = {}
         }
         resolve(content)
       })
     }
   }

 }



export var StorageUtil = {
  getJson: getStoreFunction(),
  setJson: setStoreFunction()
}
