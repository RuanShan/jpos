const escpos = require('escpos-without-adapter');
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
      let isOffline = realPrinter.attributes.indexOf('OFFLINE')
      if( isOffline< 0  ){
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
      }else{
        console.log("Printer is OFFLINE", realPrinter.name);
      }

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
      let storeName = _.toString(params.storeName).padEnd(6).slice(0,6)
      let creatorName = _.toString(params.storeName).padEnd(6).slice(0,6)
      let number = _.toString(params.order.number).padEnd(11)
      let mobile = _.toString(params.order.customer.mobile).padEnd(11).slice(0,11)
      let line1 =  `门店:${storeName} 员工:${creatorName}`
      let line2 =  `订单:${number}顾客:${mobile}`
      // print line
      let line4 =  '项目            单价 折扣率 金额'
      let line4x = []
      params.order.lineItemGroups.map((group)=>{
        let title = `物品编号：${group.number}`
        line4x.push(title)
        line4x.push(line4)
        let lineitems = group.lineItems.map((item, i)=>{
          // cname 保证7个字符之内
          let x = _.toString(i+1).padStart(2)
          let name =item.cname.padEnd( 7 ).slice(0,7)
          let salePrice = _.toString(item.saleUnitPrice).padStart(4)
          let discountPercent = _.toString(item.discountPercent).padStart(3)
          let price = _.toString(item.price).padStart(4)
          return `${x}. ${name} ${salePrice} ${discountPercent} ${price}`
        })
        line4x.push( ...lineitems )
        line4x.push(line)

      })
      // let otherlineitems = params.order.extraLineItems.map((item, i)=>{
      //
      // })
      // print line
      let line5 =  `合计金额:${_.toString(params.order.total).padEnd(8)}   物品数量: ${params.order.lineItemGroups.length}`
      let line6 =  `支付金额:${_.toString(params.order.paymentTotal).padEnd(8)}     活数量: ${params.order.groupLineItems.length}`
      let line7 =  `其中:            支付状态: ${params.order.displayPaymentState}`
      let line7x = params.order.payments.map((item)=>{
        return `${item.cname} ${item.amount}`
      })
      //'会员卡支付：${}' '微信支付：${} '
      let time = params.order.displayCreatedDateTime //'2018年07月11日 20时 35分 05秒'
      // print line--------------------------------
      let liney = '________________________________'

      //http://weixin.qq.com/r/RDt3b-rExqe5rb4M925W
      let lineb1 = `匠心修复 鞋履生辉`
      let lineb2 = `${params.receiptFooter}`
      let lines = [line, line1, line2, line, ...line4x, line5, line6, line7, line7x, time, liney]
      console.log('after device.lines', lines)
      lines.forEach((li)=>{
        printer.text(li)
      })

      //printImage(printer)
      printer.align('ct')
      printer.text('微信公众号,订单追踪')
      printer.qrimage('http://weixin.qq.com/r/li0SClHEAgx9rRVp93iE', function(err){
        printer.text(lineb1)
        printer.text(lineb2)
        this.cut();
        this.close();
      });
      //不要调用close， Console 没有 close
      //printer.cut().flush()

    });

}

// const path = require('path');
//
// function printImage(printer){
//   // 打印图片
//   const tux = path.join(__dirname, 'qrcode.jpg');
//   escpos.Image.load(tux, function(image){
//       printer
//       .align('ct')
//
//       .image(image, 's8')
//       .image(image, 'd8')
//       .image(image, 's24')
//       .image(image, 'd24')
//
//       .raster(image)
//       .raster(image, 'dw')
//       .raster(image, 'dh')
//       .raster(image, 'dwdh')
//
//       .cut()
//       .close();
//
//     });
//
// }
