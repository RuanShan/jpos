import moment from 'moment'
import _ from "lodash"

export var apiResultMixin = {
  data: function(){
    return {
      LineItemGroupPaymentStateEnum: { paid: 'paid', balance_due: 'balance_due'},
      CardStyleEnum:{ prepaid: 'prepaid', counts:'counts' }, // prepaid 充值卡， counts 次卡
      UserEntryStateEnum:{ clockin: 'clockin', clockout:'clockout' } // 打卡 登入， 登出
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
        number: orderResult.number,
        total: parseInt(orderResult.total), //实收价格
        saleTotal: parseInt(orderResult.sale_total), //应收价格
        userName: orderResult.user_name,
        storeName: orderResult.store_name,
        creatorName: orderResult.creator_name,
        shipmentState: orderResult.shipment_state,
        groupState: orderResult.group_state,
        paymentState: orderResult.payment_state,
        createdAt: moment(orderResult.created_at),
        orderType: orderResult.order_type,
        lineItemGroups: [],
        extraLineItems: [],
        cardTransactions: []
      }
      order.payments = this.buildPayments( orderResult.payments )
      order.displayCreatedAt = this.getDisplayDateTime(order.createdAt)

      orderResult.line_item_groups.forEach((groupResult, i) => {
        let group = {
          id: groupResult.id,
          orderId: groupResult.order_id,
          order: order,
          number: groupResult.number,
          state: groupResult.state,
          paymentState: groupResult.payment_state,
          lineItems: [],
          images: [],
          name: groupResult.name,
          price: parseInt(groupResult.price),
          createdAt: moment(groupResult.created_at),

        }
        group.displayCreatedAt = this.getDisplayDateTime(group.createdAt)
        group.displayState = this.getOrderStateText(group.state)
        order.lineItemGroups.push(group)
        let groupedlineItems = []
        orderResult.line_items.forEach(function(lineItemResult) {

          if (groupResult.number == lineItemResult.group_number) {
            const lineItem = {
              id: lineItemResult.id,
              orderId: lineItemResult.order_id,
              group: group,
              groupNumber: lineItemResult.group_number,
              cname: lineItemResult.cname,
              price: lineItemResult.price,
              quantity: lineItemResult.quantity,
              saleUnitPrice: lineItemResult.sale_unit_price,
              discountPercent: lineItemResult.discount_percent,
              cardId: lineItemResult.card_id,
              memo: lineItemResult.memo
            }
            groupedlineItems.push(lineItem)
          }
        })
        // 如果图片存在
        if( groupResult.images ){
          groupResult.images.forEach(function(imageResult) {
            const image = {
              type: "GroupImage",
              id: imageResult.id,
              position: imageResult.position,
              group: group,
              groupId: imageResult.viewable_id,
              miniUrl: imageResult.mini_url,
              bigUrl: imageResult.big_url,
              originalUrl: imageResult.original_url
            }
            group.images.push(image)
          })
        }
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
          const lineItem = {
            id: lineItemResult.id,
            cname: lineItemResult.cname,
            price: lineItemResult.price,
            cardId: lineItemResult.card_id,
            memo: lineItemResult.memo
          }
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
              amount: result.amount,
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
        // 通常一个订单对应一条充值记录
        order.cardTransaction = order.cardTransactions[0]
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
        name: item.name,
        number: item.number,
        price: item.price,
        state: item.state,
        paymentState: item.payment_state,
        createdAt: moment(item.created_at),
        lineItems: []
      }
      group.displayCreatedAt = this.getDisplayDateTime( group.createdAt )
      group.displayState = this.getOrderStateText(group.state)

      item.line_items.forEach(function(lineItemResult) {
        const lineItem = {
          id: lineItemResult.id,
          group: group,
          groupNumber: lineItemResult.group_number,
          worker_id: lineItemResult.worker_id,
          cname: lineItemResult.cname,
          price: lineItemResult.price,
          state: lineItemResult.state,
          memo: lineItemResult.memo
        }
        group.lineItems.push(lineItem)
      })
      return group
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
      //对于按条件搜索用户和打卡记录时， 打卡记录存在 searched_entries 中
      let entries =  userResult.searched_entries ? userResult.searched_entries: userResult.user_entries
      if( entries ){
        const userEntries = entries.map((model)=>{
          return this.buildUserEntry(model)
        })
        user.userEntries = userEntries
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
      user.memo = userResult.memo
      user.normalOrderTotal = parseInt(userResult.normal_order_total)
      user.normalOrderCount = userResult.normal_order_count
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
        // 选择第一个可用的card作为 缺省会员卡
        user.prepaidCard = user.cards.find((card)=>{ return (card.status == 'enabled' && card.style== this.CardStyleEnum.prepaid)})
      }

      if( ! user.prepaidCard ){
        user.prepaidCard = {}
      }
      user.displayType = user.cards.length>0 ? "会员" : "散客"
      user.displayGender = this.getDisplayGender(user.gender)
      user.displayCreatedAt = this.getDisplayDateTime( user.createdAt)
      user.displayCreatedAtDate = user.createdAt.format('YYYY-MM-DD')

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

    //顾客数据整理
    buildCustomerInfo: function(customerResult) {
      const customer = {
        address: "",
        birth: "",
        displayBirth: "",
        cards: [],
        createdAt: "",
        displayCreatedAt: "",
        email: "",
        id: 0,
        memo: "",
        mobile: "",
        updatedAt: "",
        displayUpdatedAt: "",
        userName: ""
      };
      customer.address = customerResult.address;
      customer.birth = moment(customerResult.birth);
      customer.displayBirth = customer.birth.format('MM-DD');
      customer.cards = customerResult.cards;
      customer.createdAt = moment(customerResult.created_at);
      customer.displayCreatedAt = customer.createdAt.format('YYYY-MM-DD , hh:mm:ss');
      customer.email = customerResult.email;
      customer.id = customerResult.id;
      customer.memo = customerResult.memo;
      customer.mobile = customerResult.mobile;
      customer.updatedAt = moment(customerResult.updated_at);
      customer.displayUpdatedAt = customer.updatedAt.format('YYYY-MM-DD , hh:mm:ss');
      customer.userName = customerResult.username;
      customer.sex = customerResult.sex;
      return customer;
    },

    buildCustomers: function(customersResult) {
      const customers = customersResult.users.map((productResult) => {
        return this.buildCustomer(productResult)
      })
      console.log("customersResult=", customersResult, "customers=", customers)
      return customers
    },

    //构造客户统计信息
    buildCustomerStatis:  function(result) {
      // normalOrderTotal：一般订单消费金额 cardOrderTotal：充值金额
      const statis = { orderTotal: 0, normalOrderTotal: 0, cardOrderTotal: 0 }
      statis.normalOrderTotal = parseInt(result.normal_order_total)
      statis.cardOrderTotal = parseInt(result.card_order_total)
console.log( "buildCustomerStatis=", result, statis)
      return statis
    },

    buildCard: function( model ){
      const card = {
        className: 'Spree::Card',
        id: model.id,
        storeId: model.store_id,
        name: model.name,
        style: model.style, // prepaid 充值卡， counts 次卡
        amountRemaining: parseInt(model.amount_remaining),
        amount: parseInt(model.amount), // 充值钱数
        amountUsed: parseInt(model.amount_used), // 使用钱数
        discountPercent: parseInt(model.discount_percent),
        discountAmount: parseInt(model.discount_amount),
        status: model.status, //enabled:可用， disabled：不可用
        code: (model.code.length < 10 ? model.code : model.code.slice(0, 8)), // 显示前8位
        variantId: model.variant_id,
        productId: model.product_id,
        memo: model.memo,
        expireAt: model.expire_at, //可能为空
        createdAt: moment(model.created_at),
      }

      if( card.expireAt){
        card.expireAt =  moment(card.expireAt)
        card.displayExpireAt = card.expireAt.format('MM-DD HH:mm')
      }
      card.displayCreatedAt = card.createdAt.format('MM-DD HH:mm')
      card.displayStyle = this.getCardDisplayStyle( card.style)
      card.displayStatus = this.getCardDisplayStatus( card.status)

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
        }
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
    generateGroupNumber: function() {
      let timestamp = moment().format("YYMMDDHHmmss")
      return timestamp
    },

    getDisplayGender(gender) {
      return gender == "male" ? "男" : "女"
    },
    getCardDisplayStyle(style) {
      return style == "prepaid" ? "充值卡" : "次卡" //prepaid 充值卡， counts 次卡
    },
    getCardDisplayStatus(status) {
      return status == "enabled" ? "可用" : "不可用" //prepaid 充值卡， counts 次卡
    },
    getOrderStateText(state) {
      if (state == "pending") {
        return "新订单"
      } else if (state == "ready") {
        return "待交付"
      } else if (state == "ready_for_factory") {
        return "准备发工厂"
      } else if (state == "processing") {
        return "专业服务"
      } else if (state == "processed") {
        return "工厂验收"
      } else if (state == "ready_for_store") {
        return "工厂发货"
      } else if (state == "shipped") {
        return "已交付客户"
      }
      return "未知"
    },
    getUserEntryDisplayState(state) {
      return state == "clockin" ? "登入" : "登出" //prepaid 充值卡， counts 次卡
    },
    getDisplayTime( datetime){ // datetime is instance moment
      return datetime.format('HH:mm')
    },
    getDisplayDateTime( datetime){ // datetime is instance moment
      return datetime.format('MM-DD HH:mm')
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
