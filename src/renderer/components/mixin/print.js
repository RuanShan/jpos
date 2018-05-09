import { ipcRenderer }  from  'electron'

export var printMixin = {
  methods: {
    getPrinters: function(){
      if (!process.env.IS_WEB){
        ipcRenderer.send('jpos-aget-printers', 'ping');      
      }
    }
  }
}
