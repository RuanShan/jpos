import { getPrinters, getSupportedPrintFormats } from 'printer'
import { ipcMain }  from  'electron'

export function bindIpcPrinter(){
  ipcMain.on('jpos-aget-printers', function(event, arg) {
    let printers =  getPrinters()

    console.log( "printers", printers )
    console.log( "getSupportedPrintFormats", getSupportedPrintFormats() )

    console.log(arg); // prints "pong"
  });

}
