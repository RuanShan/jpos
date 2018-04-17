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
      let order = { total: orderResult.total,
        user_id: orderResult.user_id,
        shipment_state: orderResult.shipment_state,
        payment_state: orderResult.payment_state,
        payments: orderResult.payments
      }

      order.payments.forEach(function(shipment, i){
        let shipmentOrderItems = []
        orderResult.line_items.forEach(function(orderItem ){
          if( shipment.group_number == orderItem.group_number ){
            shipmentOrderItems.push( orderItem )
          }
        })
        shipment.orderItems = shipmentOrderItems
      })

      return order
    },
    buildOrdersFromApiResult: function( ordersResult ){
      let orders = []
      ordersResult.orders.forEach(function(item, i){

        const order = {}
        order.id = item.id
        order.number = item.number
        order.total_amount = item.display_total
        order.status = item.state
        order.user_id = item.user_id
        order.store_id = item.store_id
        order.user_name = item.user_name
        order.store_name = item.store_name
        order.index = i
        order.shipment_state = item.shipment_state
        order.payment_state = item.payment_state

        orders.push(order)
      })
      return orders
    }
  }
}
