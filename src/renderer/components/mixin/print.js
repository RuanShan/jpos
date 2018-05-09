import { ipcRenderer }  from  'electron'

export var printMixin = {
  methods: {
    getPrinters: function(){
      ipcRenderer.send('jpos-aget-printers', 'ping');

    }
  }
}
