const isWeb = process.env.IS_WEB

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
