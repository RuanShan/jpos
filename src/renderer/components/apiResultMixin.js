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
        line_item_groups: []
      }

      orderResult.line_item_groups.forEach(function(groupResult, i){
        let group = { number: groupResult.number, state: groupResult.state, lineItems:[]}
        order.line_item_groups.push( group )
        let groupedlineItems = []
        orderResult.line_items.forEach(function(lineItemResult ){
          const lineItem = { groupNumber: lineItemResult.group_number, name: lineItemResult.variant.name, price: lineItemResult.price }
          if( groupResult.number == lineItemResult.group_number ){
            groupedlineItems.push( lineItem )
          }
        })
        group.lineItems = groupedlineItems
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
        order.userID = item.user_id
        order.storeId = item.store_id
        order.userName = item.user_name
        order.storeName = item.store_name
        order.index = i
        order.shipmentState = item.shipment_state
        order.paymentState = item.payment_state
        order.groupState = item.groupState

        orders.push(order)
      })
      return orders
    },
    buildUser: function( userResult ){
      const user = { storeId: 0, avatar: 'default.jpg',  apiKey: '' }
      user.storeId = userResult.store_id
      user.avatar = userResult.avatar
      user.apiKey = userResult.api_key
      return user
    }

  }
}
