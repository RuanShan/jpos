import { getPrinters, printDirect } from 'printer'
import fs from 'fs'
import _ from 'lodash'

export function printLabel ( ){
  // Select the adapter based on your printer type
  // {title, code, memo}
  let path = __dirname + '/templates/39-5mm_30-0mm_barcode_data.tspl'
  console.log('path', path)

  fs.readFile(path,'utf-8', function(err,data){
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
     compiled({ 'user': 'fred' });

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
