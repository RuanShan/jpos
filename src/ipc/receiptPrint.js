const escpos = require('escpos');
const _ = require('lodash');

import {
  getPrinters,
  printDirect
} from 'printer'


export function printReceipt(params) {
  if( params == null){
    console.error("print receipt params is null")
    return
  }
  // Select the adapter based on your printer type
  const device = new escpos.Console(function(data) {
    let printers =  getPrinters()

    let realPrinter = printers.find((p) => {
      return (p.name.indexOf('DL-581') >= 0)
    })
    console.log("raw data", data, realPrinter, printers)
    if (realPrinter) {
      // attributes: [ 'DO-COMPLETE-FIRST', 'LOCAL', 'OFFLINE' ],
      let isOffline = realPrinter.attributes.indexOf((attr)=>{ return attr == 'OFFLINE'})
      if( isOffline< 0  )
      printDirect({
        printer: realPrinter.name,
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

  //const options = {
  //  encoding: "GB18030" /* default */
  //}
  // encoding is optional
  const printer = new escpos.Printer(device)

  // let param = {
  //   receiptTitle: "永峰皮具养护",
  //   receiptFooter: "永峰皮具服务电话：13812345678",
  //   storeName: "大连新开路",
  //   order: {
  //     number: 'R00000001',
  //     creatorName: '员工姓名',
  //     total: 100.00,
  //     paymentTotal: 0,
  //     paymentState: 'paid',
  //     displayPaymentState: '已付',
  //     payments: [{cname:'会员卡支付', amount: 100}],
  //     lineItems: [ {cname:"皮具保养xxx嘻嘻嘻", saleUnitPrice:20, discountPercent:100, price:100.00, quantity: 1} ],
  //     extraLineItems: [],
  //     lineItemGroups: [],
  //     displayCreatedDateTime: '2018年07月11日 20时 35分 05秒'
  //   }
  // }
  //小票内容:  店名，日期，时间，会员号，订单号，门店员工，消费内容，金额合计，支付方式，已付，未付，电话

    device.open(function(){
      console.log('device.open')
      //标题
      printer.font('a').align('ct').style('bu').size(1, 1)
      printer.text(params.receiptTitle)
      printer.align('lt')
      let line = '--------------------------------'
      //内容
      let line1 =  `门店:${params.storeName}  员工:${params.order.creatorName}`
      let line2 =  `订单:${params.order.number} 会员:${params.order.customer.number}`
      // print line
      let line4 =  '项目       单价 数量 折扣率 金额'
      let line4x = params.order.lineItems.map((item)=>{
        // cname 保证7个字符之内
        let name =item.cname.padEnd( 7 ).slice(0,7)
        return `${name} ${item.saleUnitPrice}  ${item.quantity}   ${item.discountPercent}    ${item.price}`
      })
      // print line
      let line5 =  `合计金额:${_.toString(params.order.total).padEnd(8)}     数量: ${params.order.lineItems.length}`
      let line6 =  `支付金额:${_.toString(params.order.paymentTotal).padEnd(8)} 支付状态: ${params.order.displayPaymentState}`
      let line7 =  '其中:'
      let line7x = params.order.payments.map((item)=>{
        return `${item.cname} ${item.amount}`
      })
      //'会员卡支付：${}' '微信支付：${} '
      let linea =  `${params.order.displayCreatedDateTime}`
      // print line
      let lineb = `${params.receiptFooter}`
      let lines = [line, line1, line2, line, line4, ...line4x, line, line5, line6, line7, line7x, linea, line, lineb]
      console.log('after device.lines', lines)
      lines.forEach((li)=>{
        printer.text(li)
      })
      //不要调用close， Console 没有 close
      printer.cut().flush()

    });

}
