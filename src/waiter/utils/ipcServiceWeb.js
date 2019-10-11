


let getPrintersFunction = function(){

    return function(){  console.warn("please run in electron, now is web."); return []  }
}

//
let printLabelFunction = function(  ){

    return function(){  console.warn("please run in electron, now is web."); return {}  }
}

//
let printReceiptFunction = function(  ){

    return function(){  console.warn("please run in electron, now is web."); return {}  }
}

let downloadFileFunction = function(  ){

    return function(){  console.warn("please run in electron, now is web."); return {}  }
}


export var PrintUtil = {
  getPrinters: getPrintersFunction(),
  printLabel: printLabelFunction( ),
  printReceipt: printReceiptFunction( ),
}
export var DownloadUtil = {
  setStore: downloadFileFunction(),
}
