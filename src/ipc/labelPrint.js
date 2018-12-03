import { getPrinters, printDirect } from 'printer'
import _ from 'lodash'
import iconv from 'iconv-lite'
import { te310_20x50_barcode_label_tspl } from './templates/te310/20x50_barcode_label'
//  let printParams = { receiptTitle: this.storeInfo.receiptTitle, receiptFooter: this.storeInfo.receiptFooter, storeName: this.storeInfo.name,  order: order }
export function printLabel ( params ){
  const encoding="gb2312"
  // Select the adapter based on your printer type
  // {title, code, memo}
  //let path = __dirname + '/templates/te310/20x50_barcode_label.tspl'
  //console.log('path', path, 'params', params)

  let data = te310_20x50_barcode_label_tspl
     let printName = params.labelPrinter
     let printers =  getPrinters()

     console.log( "printers", printers )
     let printer = printers.find( (printer)=>{
       return (printer.name==printName)
     })
     // 只能打印3个图片，维修(wx.BMP)，清洗(qx.BMP)，保养(by.BMP)
     //PUTBMP 46,350,"weixin40.BMP"  维修图片
     //PUTBMP 46,300,"elm40.BMP"
     //PUTBMP 46,250,"qq40.BMP"
     //Append linebreak (\r) to all commands
     data = data + "\r" //Use double quotes to interpolate
     let compiled = _.template( data )
     // 根据物品数量打印编码
     let order = params.order
     let labelPrintCount = params.labelPrintCount || 2 //默认打印2个
     order.lineItemGroups.forEach((group, i)=>{
       let itemMemos = group.lineItems.map((item)=>{ return item.memo}).join( "\n")
       let lableParams = { 'label_title': '永峰皮具养护中心', 'store_name': '西安路店', 'group_number': group.number, 'item_memos': itemMemos, 'item1_icon':'','item2_icon':'','item3_icon':'' }

       data = iconv.encode( compiled(lableParams), encoding);
       console.log("raw data", data, printer)
       for( let j = 0; j< labelPrintCount; j++){
         //一个物品条码打印多次
         if( printer ){
           printDirect({
             printer: printer.name
             , data: data// or simple String: "some text"
             //, printer:'Foxit Reader PDF Printer' // printer name, if missing then will print to default printer
             , type: 'RAW' // type: RAW, TEXT, PDF, JPEG, .. depends on platform
             , success:function(jobID){
               console.log("sent to printer with ID: "+jobID);
             }
             , error:function(err){console.log(err);}
           });
         }
       }

     })

}
