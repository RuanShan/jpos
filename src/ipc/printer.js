import { ipcMain }  from  'electron'
import { getPrinters, getDefaultPrinterName } from 'printer'

import { EscPrint }  from  './esc_print'
import { TsplPrint }  from  './tspl_print'

export function bindIpcPrinter(){



  ipcMain.on('get-printers', function(event, arg) {
    //EscPrint()
    //TsplPrint()
    let printers =  getPrinters()
    let defaultPrinterName = getDefaultPrinterName()
    const printerInfos = printers.map((printer)=>{
      const isDefault = (printer.name == defaultPrinterName)
      let statusDesc = ''
      let isUsable = true
      if( printer.statusNumber == 128 ){
        statusDesc = '脱机'
        isUsable = false
      }
      const data = { name: printer.name, statusNumber: printer.statusNumber,  isDefault, isUsable, statusDesc }
      return data
    })
    event.returnValue = printerInfos
    console.log("end get-printers", printers)
  });

  ipcMain.on('print-esc', function(event, arg) {

    console.log(arg);
    EscPrint()
    //TsplPrint()
    console.log("end print-esc")
  });

  ipcMain.on('print-tspl', function(event, arg) {

    console.log(arg);
    TsplPrint()
    console.log("end print-tspl")
  });

}
