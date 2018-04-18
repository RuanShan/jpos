export var apiResultMixin = {
  methods: {
    async ChangeOrderState( orderNumbers = [], forward = true) {

        const posOrdersReturn = await evolvePosOrders({
            order_numbers: orderNumbers,
            forward
        })
        console.log('ChangeOrderStates', orderNumbers)
        return posOrdersReturn
    },
  }
}
