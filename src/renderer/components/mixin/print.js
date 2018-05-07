import  printer  from 'electron-printer'

export var printMixin = {
  methods: {
    getPrinters: function(){
      printer.getPrinters()
    }
  }
}
