import { getPrinters, printDirect } from 'printer'
import fs from 'fs'
import _ from 'lodash'
import iconv from 'iconv-lite'

//  let printParams = { receiptTitle: this.storeInfo.receiptTitle, receiptFooter: this.storeInfo.receiptFooter, storeName: this.storeInfo.name,  order: order }
export function printLabel ( params ){
  const encoding="gb2312"
  // Select the adapter based on your printer type
  // {title, code, memo}
  let path = __dirname + '/templates/20x50_barcode_label.tspl'
  console.log('path', path)

  fs.readFile(path,'ascii', function(err,data){
   if(err){
    console.log(err);
   }else{

     let printers =  getPrinters()

     console.log( "printers", printers )
     let printer = printers.find( (printer)=>{
       return (printer.name.indexOf('TSC') >=0)
     })
     // 只能打印3个图片，维修(wx.BMP)，清洗(qx.BMP)，保养(by.BMP)
     //PUTBMP 46,350,"weixin40.BMP"  维修图片
     //PUTBMP 46,300,"elm40.BMP"
     //PUTBMP 46,250,"qq40.BMP"
     //Append linebreak (\r) to all commands
     data = data + "\r" //Use double quotes to interpolate
     var compiled = _.template( data );
     // 根据物品数量打印编码
     var order = params.order;
     order.lineItemGroups.forEach((group)=>{
       var itemMemos = group.lineItems.map((item)=>{ return item.memo}).join( ' ')
       var lableParams = { 'label_title': '永峰皮具养护物品条码', 'group_number': group.number, 'item_memos': itemMemos, 'item1_icon':'','item2_icon':'','item3_icon':'' }

       group.lineItems.forEach((item,i)=>{
         lableParams['item'+(i+1)+'_icon'] = item.labelIconName
       })
       data = iconv.encode( compiled(lableParams), encoding);
       console.log("raw data", data, printer)
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

     })

   }
  })

}
