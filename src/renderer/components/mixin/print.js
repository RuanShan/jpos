import  printer  from 'printer'

export var printMixin = {
  methods: {
    getPrinters: function(){
      printer.getPrinters()
    }
  }
}
