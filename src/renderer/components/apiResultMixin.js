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
    buildOrders: function( ordersResult ){
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
    buildLineItemGroups: function( itemGroupsResult ){
      let itemGroups = []
      itemGroupsResult.line_item_groups.forEach(function(item, i){
        let group = {
          id: item.id,
          orderId: item.order_id,
          name: item.name,
          number: item.number,
          price: item.price,
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
      const product = { className: 'Product', variants: []}

      if( productResult.has_variants ){
        productResult.variants.forEach(function(variantResult ){
          let variant = this.buildVariant( variantResult )
          product.variants.push( variant )
        })

      }else{
        product.master = this.buildVariant( productResult.master )
      }
    },

    buildVariant: function( variantResult){
      const variant = {className: 'Variant', price: variantResult.price, name: variantResult.name, optionValueTexts: ""}
      variantResult.option_values.forEach(function(){

      })
      return variant
    },
    buildProducts: function( productsResult) {

    }
  }
}
