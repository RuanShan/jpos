const escpos = require('escpos');

import {
  getPrinters,
  printDirect
} from 'printer'


export function printReceipt(param) {
  // Select the adapter based on your printer type
  const device = new escpos.Console(function(data) {
    let printers =  getPrinters()

    let printer = printers.find((printer) => {
      return (printer.name.indexOf('DL-581') >= 0)
    })
    console.log("raw data", data, printer)
    if (printer) {
      printDirect({
        printer: printer.name,
        data: data // or simple String: "some text"
          //, printer:'Foxit Reader PDF Printer' // printer name, if missing then will print to default printer
          ,
        type: 'RAW' // type: RAW, TEXT, PDF, JPEG, .. depends on platform
          ,
        success: function(jobID) {
          console.log("sent to printer with ID: " + jobID);
        },
        error: function(err) {
          console.log("error->",err);
        }
      });
    }
  })
  // const device  = new escpos.Network('localhost');
  // const device  = new escpos.Serial('/dev/usb/lp0');

  const options = {
    encoding: "GB18030" /* default */
  }
  // encoding is optional

  const printer = new escpos.Printer(device, options)

  let params = {
    title: "永峰皮具养护",
    storeName: "大连新开路",
    orders: {
      creatorName: '员工姓名',
      total: 100.00,
      paymentTotal: 0,
      payments: [],
      lineItems: [ {cname:"皮具保养xxx嘻嘻嘻", saleUnitPrice:20, discountPercent:100, price:100.00} ],
      extraLineItems: [],
      lineItemGroups: [],
      displayCreatedAtDateTime: '2018年07月11日 星期三 20时 35分 05秒'
    }
  }
  //小票内容:  店名，日期，时间，会员号，订单号，门店员工，消费内容，金额合计，支付方式，已付，未付，电话

    device.open(function(){
      console.log('device.open')
      //标题
      printer.font('a').align('ct').style('bu').size(1, 1)
      printer.text(params.title)
      let line = '----------------------------------'
      //内容
      let line1 =  `门  店:${params.storeName}  员  工:${params.creatorName}`
      let line2 =  `订单号:${params.order.number} 会员号: xxx`
      // print line
      let line4 =  '项目        单价  数量  折扣率  金额'
      // print line
      let line5 =  `合计:${params.order.total} 数量: ${params.order.lineItems.length}`
      let line6 =  `支付金额:${params.order.paymentTotal} 支付状态: ${params.order.paymentState}`
      let line7 =  '其中:'
      let line8 =  '会员卡支付：${}'
      let line8 =  '微信支付：${} '
      let line9 =  `${params.displayCreatedAtDateTime}  `
      // print line
      let linea = '永峰皮具服务电话：13812345678'
      //费用
      printer.cut().close()

    });

}
