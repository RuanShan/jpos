import moment from 'moment'
import _ from "lodash"
import {
  getLineItemGroupImageUploadPath,
  getExpenseItemImageUploadPath
}
from '@/api/getData'
//import {
//  baseImgPath
//} from "@/config/env"

export var apiResultMixin = {
  data: function(){
    return {
      PaymentStateEnum: { completed: 'completed', void: 'void'}, // void： 支付取消
      OrderStateEnum: { cart: 'cart', canceled: 'canceled'  },
      OrderTypeEnum: { normal: 'normal', card: 'card', deposit: 'deposit', counter: 'counter' },
      OrderPaymentStateEnum:{ paid: 'paid', unpaid:'unpaid' }, // 打卡 登入， 登出
      LineItemGroupPaymentStateEnum: { paid: 'paid', unpaid: 'unpaid'},
      CardStateEnum:{ enabled: 'enabled', disabled:'disabled', replaced: 'replaced' }, // enabled 可用, disabled 不可用
      CardStyleEnum:{ prepaid: 'prepaid', times:'times' }, // prepaid 充值卡， times 次卡
      UserEntryStateEnum:{ clockin: 'clockin', clockout:'clockout' }, // 打卡 登入， 登出
      LineItemGroupStateEnum: {
        pending: 'pending',
        ready_for_factory: "ready_for_factory",
        processing: "processing",
        processed: "processed",
        ready_for_store: "ready_for_store",
        ready: "ready",
        shipped: "shipped",
        canceled: "canceled"
      },
    }
  },
  computed: {
    lineItemGroupProgressStates(){
      let vals = _.values( this.LineItemGroupStateEnum)
      return _.difference(vals,  [this.LineItemGroupStateEnum.shipped, this.LineItemGroupStateEnum.canceled] )
    }
  },
  methods: {
    // order = {
    //    "total": "100.0",
    //    "user_id": null,
    //    "shipment_state": null,
    //    "payment_state": null,
    //    "created_at": "2012-10-24T01:02:25Z",
    //    "line_items": [ ]
    //    "payments": [      ],
    //    "line_item_groups": [       ],
    //    "permissions": {
    //      "can_update": true
    //    }
    // }
    buildOrder: function(orderResult) {
      let order = {
        id: orderResult.id,
        createdById: orderResult.created_by_id,
        userId: orderResult.user_id,
        storeId: orderResult.store_id,
        oddStoreId: orderResult.odd_store_id,
        number: orderResult.number,
        total: parseInt(orderResult.total), //实收价格, 对于充值卡，是付款金额
        cardAmount: 0,  //对于充值卡，是充值金额
        saleTotal: parseInt(orderResult.sale_total), //应收价格,
        userName: orderResult.user_name,
        storeName: orderResult.store_name,
        creatorName: orderResult.creator_name,
        state: orderResult.state,
        groupState: orderResult.group_state,
        paymentState: orderResult.payment_state, // 支付状态 unpaid:欠款， paid:已经支付
        paymentTotal: parseInt(orderResult.payment_total), // 一共支付了多少
        createdAt: moment(orderResult.created_at),
        orderType: orderResult.order_type,
        memo: orderResult.memo,
        cardId: orderResult.card_id,
        lineItemGroups: [],
        extraLineItems: [],
        cardTransactions: []
      }
      order.payments = this.buildPayments( orderResult.payments )
      order.displayCreatedAt = this.getDisplayDateTime(order.createdAt)
      order.displayState = this.getOrderDisplayState( order.state )
      order.displayPaymentState = this.getOrderDisplayPaymentState( order.paymentState )
      order.displayOrderType = this.getOrderDisplayType(order.orderType)
      orderResult.line_item_groups.forEach((groupResult, i) => {
        let group = this.buildLineItemGroup( groupResult )
        group.order = order
        order.lineItemGroups.push(group)
        let groupedlineItems = []
        orderResult.line_items.forEach((lineItemResult)=> {

          if (groupResult.id == lineItemResult.group_id) {
            const lineItem = this.buildLineItem( lineItemResult )
            lineItem.group = group
            lineItem.order = order
            groupedlineItems.push(lineItem)
          }
        })
        group.lineItems = groupedlineItems

      })
      // groupLineItems 当前订单的所有活
      const items = order.lineItemGroups.map((group) => {
        return group.lineItems
      })
      order.groupLineItems = _.flatten(items)
      // 其它子订单 如：购买商品订单，充值订单，购买打折卡订单
      orderResult.line_items.forEach((lineItemResult) => {
        if (!lineItemResult.group_number) {
          const lineItem = this.buildLineItem( lineItemResult )
          order.extraLineItems.push(lineItem)
        }
      })
      // 子订单集合，客服消费列表显示
      order.lineItems = _.concat( order.groupLineItems, order.extraLineItems )
      // 订单详细信息里有customer
      if (orderResult.customer) {
        order.customer = this.buildCustomer(orderResult.customer)
      }

      //充值订单，有card_transactions
      if( orderResult.card_transactions ){
        orderResult.card_transactions.forEach((result, i) => {
           const model = {
              id:  result.id,
              cardId: result.card_id,
              amount: parseInt( result.amount ),
              amountLeft: result.amount_left,
              position: result.position,
              createdAt: moment(result.created_at)
            }
            // 找出每一个订单对应的卡和客户
            model.customer = order.customer
            model.card = order.customer.cards.find((item)=>{ return item.id == model.cardId })
            // 如果是第一条充值记录，我们认为这是一张新卡
            model.displayIsFirst = model.position==1 ? "是": "否"
            model.displayCreatedAt =this.getDisplayDateTime( model.createdAt )
            order.cardTransactions.push(model)
        })
        // 通常一个订单对应一条充值记录或者一条消费记录
        order.cardTransaction = order.cardTransactions[0]
        if( order.cardTransaction  ){
          order.cardAmount = order.cardTransaction.amount
        }
      }
      if( orderResult.payment_at ){
        order.paymentAt = moment(orderResult.payment_at)
      }
      return order
    },

    // orders[
    //    line_items:[]
    //    line_item_groups:[]
    //  ]
    buildOrders: function(ordersResult) {
      let orders = []
      ordersResult.orders.forEach((item, i) => {

        let order = this.buildOrder(item)
        orders.push(order)
      })
      return orders
    },

    buildLineItemGroups: function(itemGroupsResult) {
      let itemGroups = []
      itemGroupsResult.line_item_groups.forEach((item, i) => {
        const group = this.buildLineItemGroup( item )
        itemGroups.push(group)
      })
      return itemGroups
    },

    buildLineItemGroup: function(result) {

      let item = result
      let group = {
        id: item.id,
        orderId: item.order_id,
        storeId: item.store_id,
        storeName: item.store_name,
        name: item.name,
        number: item.number,
        price: parseInt(item.price),
        state: item.state,
        paymentState: item.payment_state,
        createdAt: moment(item.created_at),
        missingImageUrl: item.missing_image_url,
        lineItems: [],
        images: []
      }
      if( item.images ){
        item.images.forEach((imageResult)=> {
          const image = this.buildGroupImage( imageResult )
           // it is required for group image el-carousel, ItemProcess.vue
          image.group = group
          group.images.push(image)
        })
      }
      //有很多地方使用物品图片，
      group.imageUploadPath =  getLineItemGroupImageUploadPath( group.id )
      group.imageUrl = ( group.images.length>0 ? group.images[0].miniUrl : group.missingImageUrl )
      group.displayCreatedAt = this.getDisplayDateTime( group.createdAt )
      group.displayState = this.getGroupDisplayState(group.state)
      group.displayPaymentState = this.getGroupDisplayPaymentState( group.paymentState )

      if( item.line_items ){
        item.line_items.forEach((lineItemResult)=> {
          const lineItem = this.buildLineItem(lineItemResult )
          lineItem.group = group
          group.lineItems.push(lineItem)
        })
      }

      //
      if( item.order){
        let orderResult = item.order
        group.order = { id: orderResult.id, number: orderResult.number, state: orderResult.state }
      }
      return group
    },
    buildGroupImage( result){
      const image = {
        type: "GroupImage",
        id: result.id,
        position: result.position,
        viewableId: result.viewable_id,
        miniUrl: result.mini_url,
        largeUrl: result.large_url,
        originalUrl: result.original_url
      }
      image.groupId = image.viewableId
      image.url = image.largeUrl
      return image
    },
    buildUsers: function(result) {

      const entities = result.users.map((item) => {
        const user = this.buildUser( item )
        return user
      })
      return entities
    },
    buildUser: function(userResult) {
      const user = {
        avatar: 'default.jpg',
        apiKey: ''
      }
      user.id = userResult.id
      user.name = userResult.username
      user.apiKey = userResult.api_key
      user.roleNames = userResult.spree_role_names
      //对于按条件搜索用户和打卡记录时， 打卡记录存在 searched_entries 中
      let entries =  userResult.searched_entries ? userResult.searched_entries: userResult.user_entries
      if( entries ){
        const userEntries = entries.map((model)=>{
          return this.buildUserEntry(model)
        })
        user.userEntries = userEntries
      }
      if( userResult.today_entries ){
        const todayEntries = userResult.today_entries.map((model)=>{
          return this.buildUserEntry(model)
        })
        user.todayEntries = todayEntries

      }

      return user
    },
    // id, name, description, price, has_variants
    buildProduct: function(productResult) {
      //
      const product = {
        className: 'Product',
        id: productResult.id,
        price: productResult,
        name: productResult.name,
        hasVariants: productResult.has_variants,
        variants: [],
        taxonIds: productResult.taxon_ids,
        relateds: []
      }

      if (productResult.has_variants) {
        productResult.variants.forEach((variantResult) => {
          let variant = this.buildVariant(variantResult)
          product.variants.push(variant)
        })
      }
      product.master = this.buildVariant(productResult.master)

      //商品对每种卡的折扣
      //relateds:[{
      //    "relation_type_id": 1,
      //    "relatable_id": 1, 会员卡类型ID
      //    "related_to_id": 6, 打折商品ID
      //    "discount_amount": "0.0",
      //    "discount_percent": "70.0" 折扣率
      // }],
      productResult.relateds.forEach((relatedResult) => {
        let related = {
          relationTypeId: relatedResult.relation_type_id,
          relatableId: relatedResult.relatable_id,
          relatedToId: relatedResult.related_to_id,
          discountAmount: parseInt(relatedResult.discount_amount),
          discountPercent: parseInt(relatedResult.discount_percent)
        }
        product.relateds.push(related)
      })
      return product
    },

    buildVariant: function(variantResult) {
      const variant = {
        className: 'Variant',
        id: variantResult.id,
        price: variantResult.price,
        name: variantResult.name,
        images: variantResult.images,
        optionsText: variantResult.options_text,
        sku: variantResult.sku,
        optionValueTexts: []
      }
      variantResult.option_values.forEach(function(ov) {
        variant.optionValueTexts.push(ov.presentation)
      })
      return variant
    },

    buildProducts: function(productsResult) {
      const products = productsResult.products.map((productResult) => {
        return this.buildProduct(productResult)
      })
      return products
    },

    buildCustomer: function(userResult) {
      const user = {
        storeId: 0,
        avatar: 'default.jpg',
        apiKey: '',
        prepaidCard: {}
      }
      user.storeId = userResult.store_id
      user.id = userResult.id
      user.mobile = userResult.mobile
      user.userName = userResult.username
      user.gender = userResult.gender
      user.birth = userResult.birth
      user.customerType = userResult.customer_type
      user.createdAt = moment(userResult.created_at),
      user.address = userResult.address
      user.memo = userResult.memo
      user.normalOrderTotal = parseInt(userResult.normal_order_total)
      user.normalOrderCount = userResult.normal_order_count
      user.wxFollowerNickname = userResult.wx_follower_nickname
      user.wxFollowerHeadimgurl = userResult.wx_follower_headimgurl
      user.number = userResult.number
      user.storeName = userResult.store_name
      user.cards = []
      if( user.birth ){
        user.birth = moment( user.birth )
        user.displayBirth = user.birth.format('YYYY-MM-DD')
      }
      // cards:[{"id":1,"user_id":8,"code":"7f9bd55a64254af48694723d4622eabfcd4f5197","current_value":"2000.0","name":"PrepaidCard1000 - Master","discount_percent":null,"discount_amount":null,"product_id":1]
      // 客户详细信息里，有会员卡信息
      if (userResult.cards) {
        userResult.cards.forEach((model)=>{
          const card = this.buildCard( model )
          card.customer = user
          user.cards.push(card)
        })
        // 排序， enabled , disabled
        user.cards.sort((a,b)=>{
           return  b.state.charCodeAt() -a.state.charCodeAt()
        })
        // 选择第一个可用的card作为 缺省会员卡
        user.prepaidCard = user.cards.find((card)=>{ return (card.state == this.CardStateEnum.enabled && card.style== this.CardStyleEnum.prepaid)})
        user.timesCard = user.cards.find((card)=>{ return (card.state == this.CardStateEnum.enabled && card.style== this.CardStyleEnum.times)})
        user.card = user.prepaidCard || user.timesCard
      }

      if( ! user.prepaidCard ){
        user.prepaidCard = {}
      }
      user.displayType = user.cards.length>0 ? "会员" : "散客"
      user.displayGender = this.getDisplayGender(user.gender)
      user.displayCreatedAt = this.getDisplayDateTime( user.createdAt)
      user.displayCreatedDate = this.getDisplayDate( user.createdAt)
      user.displayCardCode = user.prepaidCard.code ? user.prepaidCard.code  : "无"
      if( this.stores &&  user.storeId){
        let store = this.stores.find((s)=>{ return s.id == user.storeId })
        user.storeName = store.name
      }

      return user
    },

    // address:"大连市沙河口区西安路"
    // bill_address:null
    // birth:"2013-04-29T00:00:00.000+08:00"
    // cards:Array[3]
    // created_at:"2018-05-16T10:47:32.000+08:00"
    // email:""
    // id:8
    // memo:null
    // mobile:"13812340005"
    // ship_address:null
    // updated_at:"2018-05-16T10:47:32.000+08:00"
    // username:"刘德华"


    buildCustomers: function(customersResult) {
      const customers = customersResult.users.map((productResult) => {
        return this.buildCustomer(productResult)
      })
      console.log("customersResult=", customersResult, "customers=", customers)
      return customers
    },

    //构造客户统计信息
    buildCustomerStatis:  function(result) {
      // normalOrderTotal：一般订单消费金额 cardOrderTotal：充值金额, nocardOrderTotal:非会员卡消费金额
      const statis = { orderTotal: 0, normalOrderTotal: 0, cardOrderTotal: 0 }
      statis.normalOrderTotal = parseInt(result.normal_order_total)
      statis.cardOrderTotal = parseInt(result.card_order_total)
      statis.nocardOrderTotal = parseInt( result.nocard_order_total )
      console.log( "buildCustomerStatis=", result, statis)
      return statis
    },

    buildCard: function( model ){
      const card = {
        className: 'Spree::Card',
        id: model.id,
        storeId: model.store_id,
        name: model.name,
        style: model.style, // prepaid 充值卡， times 次卡
        amountRemaining: parseInt(model.amount_remaining),
        amount: parseInt(model.amount), // 充值额度
        money: parseInt(model.money), // 充值金额
        amountUsed: parseInt(model.amount_used), // 使用钱数
        discountPercent: parseInt(model.discount_percent),
        discountAmount: parseInt(model.discount_amount),
        cardTimesRemaining: parseInt(model.card_times_remaining),
        cardTimes: parseInt(model.card_times), // 充值钱数
        cardTimesUsed: parseInt(model.card_times_used), // 使用钱数

        //status: model.status, //enabled:可用， disabled：不可用
        state: model.state, //enabled:可用， disabled：不可用, replaced: 已转卡
        code: (model.code.length < 12 ? model.code : model.code.slice(0, 12)), // 显示前12位
        variantId: model.variant_id,
        productId: model.product_id,
        memo: model.memo,
        paymentPassword: model.payment_password,
        expireAt: model.expire_at, //可能为空
        createdAt: moment(model.created_at),
      }

      if( card.expireAt){
        card.expireAt =  moment(card.expireAt)
        card.displayExpireAt = card.expireAt.format('YYYY-MM-DD HH:mm')
      }
      card.displayCreatedAt =this.getDisplayDate( card.createdAt)
      card.displayCreatedDate = this.getDisplayDate( card.createdAt)

      card.displayCreatedDate = this.getDisplayDate( card.createdAt)
      card.displayStyle = this.getCardDisplayStyle( card.style)
      card.displayState = this.getCardDisplayState( card.state)

      return card
    },
    buildPayments: function( result ){
      //"id": 11,
      //"source_id": null,
      //"amount": "50.0",
      //"display_amount": "¥50.00",
      //"payment_method_id": 1,
      //"state": "checkout",
      //"created_at": "2018-06-22T14:57:05.000+08:00",
      const payments = result.map((model)=>{
        let payment = {
          id: model.id,
          sourceId: model.source_id,
          amount: parseInt( model.amount ),
          paymentMethodId: model.payment_method_id,
          createdAt: moment(model.created_at),
          cname: model.cname,
          state: model.state
        }
        payment.displayState = this.getPaymentDisplayState( payment.state)

        payment.displayCreatedAt = payment.createdAt.format('MM-DD HH:mm')

        return payment
      })
      return payments
    },
    buildUserEntries( result ){
      const entries = result.user_entries.map((model)=>{
        return this.buildUserEntry( model )
      })
      return entries
    },
    buildUserEntry( model ){
        let entry = {
          id: model.id,
          userId: model.user_id,
          storeId: parseInt( model.store_id ),
          state: model.state,
          username:  model.username,
          storeName: model.store_name,
          day: moment(model.day),
          createdAt: moment(model.created_at),
        }
        entry.displayCreatedAt = this.getDisplayDateTime( entry.createdAt )
        entry.displayCreatedAtTime = this.getDisplayTime( entry.createdAt )
        entry.displayState = this.getUserEntryDisplayState( entry.state )
        return entry
    },
    buildExpenseItems( result ){
      const entries = result.expense_items.map((model)=>{
        return this.buildExpenseItem( model )
      })
      return entries
    },
    buildExpenseItem( model ){
        let item = {
          id: model.id,
          userId: model.user_id,
          storeId: parseInt( model.store_id ),
          variantId:  model.variant_id,
          state: model.state,
          userName:  model.user_name,
          storeName: model.store_name,
          price: parseInt(model.price),
          cname: model.cname,
          memo: model.memo,
          day: moment(model.day),
          entryDay: moment(model.entry_day),
          createdAt: moment(model.created_at),
          images: []
        }
        if( model.images ){
          model.images.forEach(function(imageResult) {
            const image = {
              type: "ExpenseImage",
              id: imageResult.id,
              position: imageResult.position,
              expense: item,
              viewableId: imageResult.viewable_id,
              miniUrl: imageResult.mini_url,
              largeUrl: imageResult.large_url,
              originalUrl: imageResult.original_url
            }
            image.url= image.largeUrl // el-upload required
            item.images.push(image)
          })
        }
        item.imageUploadPath = getExpenseItemImageUploadPath( item.id )
        item.displayCreatedAt = this.getDisplayDateTime( item.createdAt )
        item.displayCreatedAtTime = this.getDisplayTime( item.createdAt )
        return item
    },
    buildLineItems( result ){
      const models = result.line_items.map((model)=>{
        return this.buildLineItem( model )
      })
      return models
    },
    buildLineItem( model ){
      const item = {
        id: model.id,
        orderId: model.order_id,
        groupId: model.group_id,
        variantId: model.variant_id,
        groupNumber: model.group_number,
        workerId: model.worker_id,
        workAt: model.work_at,
        cname: model.cname,
        price: parseInt(model.price),
        quantity: model.quantity,
        state: model.state,
        memo: model.memo,
        workerName: model.worker_name,
        storeName: model.store_name,
        saleUnitPrice: model.sale_unit_price,
        discountPercent: model.discount_percent,
        cardId: model.card_id,
        cardAmount: parseInt(model.card_amount),
        createdAt: moment(model.created_at)
      }

      item.displayCreatedAt = this.getDisplayDateTime( item.createdAt )
      item.displayState = this.getLineItemDisplayState(item.state )
      if( item.workAt){
        item.workAt = moment(item.workAt)
        item.displayWorkAt = this.getDisplayDateTime( item.workAt )
      }
      return item
    },
    buildStockItems( result ){
      const models = result.stock_items.map((model)=>{
        return this.buildStockItem( model )
      })
      return models
    },
    buildStockItem( model){
       // {
       //     "id": 17,
       //     "count_on_hand": 0,
       //     "backorderable": false,
       //     "stock_location_id": 1,
       //     "variant_id": 17,
       //     "variant": {
       //         "id": 17,
       //         "name": "保养鞋",
       //         "sku": "YF-0000",
       //         "price": "20.0",
       //         "display_price": "¥20.00",
       //         "options_text": "规格: 低规"
       //     }
       // }
       const item = {
         id: model.id,
         variantId: model.variant_id,
         stockLocationId: model.stock_location_id,
         variantName: model.variant.name,
         variantPrice: parseInt( model.variant.price )
       }
       return item
    },
    buildStockMovements( result ){
      const models = result.stock_movements.map((model)=>{
        let item = {
          id: model.id,
          quantity: model.quantity,
          stockItemId: model.stock_item_id,
          day: model.day,
          memo: model.memo,
          createdByName: model.created_by_name,
          createdAt: moment(model.created_at),
          stockItem: this.buildStockItem( model.stock_item )
        }
        item.variantName = item.stockItem.variantName
        item.stockLocationId = item.stockItem.stockLocationId
        item.displayCreatedAt = this.getDisplayDateTime( item.createdAt )
        return item
      })
      return models

    },

    buildStore( model){
      return {id:model.id, name:model.name, docPrinter: model.doc_printer_name,
        receiptPrinter: model.receipt_printer_name, labelPrinter: model.label_printer_name,
        receiptTitle: model.receipt_title, receiptFooter: model.receipt_footer, type: model.type,
        stockLocationId: model.stock_location_id, checkoutPasswordRequired: model.checkout_password_required
       }
    },
    generateGroupNumber: function() {
      let timestamp = moment().format("YYMMDDHHmmss")
      return timestamp
    },

    getDisplayGender(gender) {
      return gender == "male" ? "男" : "女"
    },
    getCardDisplayStyle(style) {
      return style == "prepaid" ? "储值卡" : "次卡" //prepaid 充值卡， times 次卡
    },
    getCardDisplayState(state) {
      if( state == this.CardStateEnum.enabled) return "可用";
      if( state == this.CardStateEnum.disabled) return "不可用";
      if( state == this.CardStateEnum.replaced) return "已转卡";
      return "未知"
    },
    getGroupDisplayState(state) {
      if (state == "pending") {
        return "新订单"
      } else if (state == "ready") {
        return "待交付"
      } else if (state == "ready_for_factory") {
        return "门店发工厂"
      } else if (state == "processing") {
        return "工厂专业服务"
      } else if (state == "processed") {
        return "工厂验收"
      } else if (state == "ready_for_store") {
        return "工厂发货"
      } else if (state == "shipped") {
        return "已交付客户"
      } else if (state == "canceled") {
        return "服务取消"
      }
      return "未知"
    },
    getUserEntryDisplayState(state) {
      return state == "clockin" ? "登入" : "登出" //clockin 登入 clockout 登出
    },
    getOrderDisplayState(state){
      // order.payment_state
      //支付状态 pending:欠款， paid:已经支付
      return state == "canceled" ? "取消" : "正常"
    },
    getOrderDisplayPaymentState(state){
      // order.payment_state
      //支付状态 unpaid:欠款， paid:已经支付
      return state == "paid" ?  "已付" : "未付"
    },
    getOrderDisplayType(orderType){
      if( orderType == 'card') return "新增会员";
      if( orderType == 'deposit') return "会员充值";
      if( orderType == 'counter') return "其它订单";
      return "服务订单"
    },

    getGroupDisplayPaymentState(state){
      // order.payment_state
      //支付状态 unpaid:欠款， paid:已经支付
      return state == "paid" ?  "已付" : "未付"
    },
    getPaymentDisplayState(state){
      // payment.state
      if( state == 'completed') return "已付";
      if( state == 'void') return "取消";
      return "未付"
    },
    getLineItemDisplayState(state){
      // :pending,  :done
      //console.log( " lineitem.state =", state)
      return state == "done" ?   "已完成" : "待处理"
    },
    getDisplayTime( datetime){ // datetime is instance moment
      return datetime.format('HH:mm')
    },
    getDisplayDateTime( datetime){ // datetime is instance moment
      return datetime.format('MM-DD HH:mm')
    },
    getDisplayFullDateTime( datetime){ // datetime is instance moment
      if( datetime ){
        return datetime.format('YYYY-MM-DD HH:mm')
      }else{
        return ''
      }
    },
    getDisplayDate( datetime){ // datetime is instance moment
      return datetime.format('YYYY-MM-DD')
    },
    getQueryParamToday(){
      let today = moment()
      return today.format('YYYY-MM-DD')
    }

  }
}
