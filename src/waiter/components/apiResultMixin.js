import moment from 'moment'

export var apiResultMixin = {
  methods: {
    // order = {
    //    "total": "100.0",
    //    "user_id": null,
    //    "shipment_state": null,
    //    "payment_state": null,
    //    "created_at": "2012-10-24T01:02:25Z",
    //    "line_items": [ ]
    //    "payments": [      ],
    //    "shipments": [      ],
    //    "adjustments": [      ],
    //    "credit_cards": [       ],
    //    "permissions": {
    //      "can_update": true
    //    }
    // }
    buildOrderFromApiResult: function( orderResult ){
      let order = { number: orderResult.number,
        total: orderResult.total,
        userName: orderResult.user_name,
        storeName: orderResult.store_name,
        userId: orderResult.user_id,
        shipmentState: orderResult.shipment_state,
        groupState: orderResult.group_state,
        paymentState: orderResult.payment_state,
        payments: orderResult.payments,
        lineItemGroups: [],
        extraLineItems: []
      }

      orderResult.line_item_groups.forEach(function(groupResult, i){
        let group = { order: order, number: groupResult.number, state: groupResult.state, lineItems:[], name: groupResult.name}
        order.lineItemGroups.push( group )
        let groupedlineItems = []
        orderResult.line_items.forEach(function(lineItemResult ){
          const lineItem = { groupNumber: lineItemResult.group_number, name: lineItemResult.variant.name, price: lineItemResult.price }
          if( groupResult.number == lineItemResult.group_number ){
            groupedlineItems.push( lineItem )
          }
        })
        group.lineItems = groupedlineItems
      })

      // 其它子订单 如：购买商品订单，充值订单，购买打折卡订单
      orderResult.line_items.forEach(function(lineItemResult ){
        if( !lineItemResult.group_number ){
          const lineItem = { name: lineItemResult.variant.name, price: lineItemResult.price }
          order.extraLineItems.push( lineItem )
        }
      })

      return order
    },
    buildOrdersFromApiResult: function( ordersResult ){
      let orders = []
      ordersResult.orders.forEach(function(item, i){

        const order = {}
        order.id = item.id
        order.number = item.number
        order.totalAmount = item.display_total
        order.status = item.state
        order.userId = item.user_id
        order.storeId = item.store_id
        order.userName = item.user_name
        order.storeName = item.store_name
        order.index = i
        order.shipmentState = item.shipment_state
        order.paymentState = item.payment_state
        order.groupState = item.group_state
        order.createdAt = moment(item.created_at)
        order.displayCreatedAt = order.createdAt.format('MM-DD HH:mm')
        orders.push(order)
      })
      return orders
    },
    buildItemGroupsFromApiResult: function( itemGroupsResult ){
      let itemGroups = []
      itemGroupsResult.line_item_groups.forEach(function(item, i){
        let group = {
          id: item.id,
          orderId: item.order_id,
          name: item.name,
          number: item.number,
          cost: item.cost,
          state: item.state,
          lineItems: []
        }

        item.line_items.forEach(function(lineItemResult ){
          const lineItem = { group: group, id: lineItemResult.id,
            groupNumber: lineItemResult.group_number, worker_id: lineItemResult.worker_id,
            name: lineItemResult.variant.name, price: lineItemResult.price }
          group.lineItems.push( lineItem )
        })

        itemGroups.push(group)
      })
      return itemGroups
    },

    buildUser: function( userResult ){
      const user = { storeId: 0, avatar: 'default.jpg',  apiKey: '' }
      user.storeId = userResult.store_id
      user.avatar = userResult.avatar
      user.apiKey = userResult.api_key
      return user
    },
    // id, name, description, price, has_variants
    buildProduct: function( productResult ){
      //
      const product = { className: 'Product', id: productResult.id,
          price: productResult, name: productResult.name,
          variants: [], taxonIds: productResult.taxon_ids, relateds: []
        }

      if( productResult.has_variants ){
        productResult.variants.forEach((variantResult ) => {
          let variant = this.buildVariant( variantResult )
          product.variants.push( variant )
        })
      }
      product.master = this.buildVariant( productResult.master )

      //商品对每种卡的折扣
      //relateds:[{
      //    "relation_type_id": 1,
      //    "relatable_id": 1, 会员卡类型ID
      //    "related_to_id": 6, 打折商品ID
      //    "discount_amount": "0.0",
      //    "discount_percent": "70.0" 折扣率
      // }],
      productResult.relateds.forEach((relatedResult ) => {
        let related = { relationTypeId: relatedResult.relation_type_id,
                  relatableId: relatedResult.relatable_id,
                  relatedToId: relatedResult.related_to_id,
                  discountAmount: parseInt( relatedResult.discount_amount ),
                  discountPercent: parseInt( relatedResult.discount_percent )}
        product.relateds.push( related )
      })
      return product
    },

    buildVariant: function( variantResult){
      const variant = {className: 'Variant', id: variantResult.id,  price: variantResult.price,
        name: variantResult.name, images: variantResult.images,
        optionsText: variantResult.options_text, optionValueTexts: []
      }
      variantResult.option_values.forEach(function(ov){
        variant.optionValueTexts.push(ov.presentation)
      })
      return variant
    },
    buildProducts: function( productsResult) {
      const products = productsResult.products.map( (productResult ) => {
        return  this.buildProduct( productResult )
      })
      return products
    },
    buildCustomer: function( userResult ){
      const user = { storeId: 0, avatar: 'default.jpg',  apiKey: '' }
      user.storeId = userResult.store_id
      user.id = userResult.id
      user.mobile = userResult.mobile
      user.name = userResult.name
      user.customerType =  userResult.customer_type
      user.normalOrderTotal =  userResult.normal_order_total
      user.normalOrderCount =  userResult.normal_order_count
      user.cards = []
      // cards:[{"id":1,"user_id":8,"code":"7f9bd55a64254af48694723d4622eabfcd4f5197","current_value":"2000.0","name":"PrepaidCard1000 - Master","discount_percent":null,"discount_amount":null,"product_id":1]
      userResult.cards.forEach(function(cardResult){
        const card = {
          className: 'Spree::Card',
          id: cardResult.id,
          name: cardResult.name,
          currentValue: parseInt( cardResult.current_value ),
          discountPercent: parseInt( cardResult.discount_percent ),
          discountAmount: parseInt( cardResult.discount_amount ),
          status: cardResult.status,
          code: ( cardResult.code.length <10 ? cardResult.code : cardResult.code.slice(0,8)), // 显示前8位
          productId: cardResult.product_id
        }
        user.cards.push(card)
      })

      return user
    },
    buildCustomers: function( customersResult ){
      const customers = customersResult.users.map( (productResult ) => {
        return  this.buildCustomer( productResult )
      })
      console.log( "customersResult=", customersResult, "customers=",customers)
      return customers
    },

    generateGroupNumber:function(  ){
      let timestamp = moment().format("YYMMDDHHmmss")
      return  timestamp
    }
  }
}
