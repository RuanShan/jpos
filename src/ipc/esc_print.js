const escpos = require('escpos');

import { getPrinters, printDirect } from 'printer'


export function EscPrint ( ){
  // Select the adapter based on your printer type
  const device  = new escpos.Console(function(data){

    let printers =  getPrinters()

    console.log( "printers", printers )
    let printer = printers.find( (printer)=>{
      return (printer.name.indexOf('DL-581') >=0)
    })

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
  })
  // const device  = new escpos.Network('localhost');
  // const device  = new escpos.Serial('/dev/usb/lp0');
  let devices = escpos.USB.findPrinter();

  const options = { encoding: "GB18030" /* default */ }
  // encoding is optional

  const printer = new escpos.Printer(device, options)

  console.log('In EscPrint console', device)
  console.log('In EscPrint usb', devices)

  device.open(function(){
    console.log('device.open')
    printer
    .font('a')
    .align('ct')
    .style('bu')
    .size(1, 1)
    .text('The quick brown fox jumps over the lazy dog')
    .text('敏捷的棕色狐狸跳过懒狗')
    .barcode('1234567', 'EAN8')
    .qrimage('https://github.com/song940/node-escpos', function(err){
      this.cut();
      this.close();
    });
  });

}
