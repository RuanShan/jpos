import { ipcMain }  from  'electron'

//import { EscPrint }  from  './esc_print'
import { TsplPrint }  from  './tspl_print'

export function bindIpcPrinter(){



  ipcMain.on('jpos-aget-printers', function(event, arg) {

    console.log(arg); // prints "pong"

    //EscPrint()
    TsplPrint()
    console.log("end jpos-aget-printers")
  });

}
