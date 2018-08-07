import { getPrinters, printDirect } from 'printer'
import fs from 'fs'
import _ from 'lodash'
import iconv from 'iconv-lite'

export function printLabel ( ){
  const encoding="gb2312"
  // Select the adapter based on your printer type
  // {title, code, memo}
  let path = __dirname + '/templates/20x50_barcode_label.tspl'
  console.log('path', path)

  fs.readFile(path,'ascii', function(err,data){
   if(err){
    console.log(err);
   }else{

     let printers =  getPrinters()

     console.log( "printers", printers )
     let printer = printers.find( (printer)=>{
       return (printer.name.indexOf('TSC') >=0)
     })
     //Append linebreak (\r) to all commands
     data = data + "\r" //Use double quotes to interpolate
     var compiled = _.template( data );
     data = iconv.encode( compiled({ 'label_title': '永峰皮具养护物品条码', 'group_number': '0614010001', 'item_memos': '1这是多行工作注释内容 2这是多行工作注释,内容3这是多行工作注释内容，约30字'}), encoding);

     console.log("raw data", data, printer)
     if( printer ){
       printDirect({
         printer: printer.name
         , data: data// or simple String: "some text"
         //, printer:'Foxit Reader PDF Printer' // printer name, if missing then will print to default printer
         , type: 'RAW' // type: RAW, TEXT, PDF, JPEG, .. depends on platform
         , success:function(jobID){
           console.log("sent to printer with ID: "+jobID);
         }
         , error:function(err){console.log(err);}
       });
     }

    console.log(data);
   }
  })

}
