import moment from 'moment'
import _ from "lodash"

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
    //    "line_item_groups": [       ],
    //    "permissions": {
    //      "can_update": true
    //    }
    // }
    buildOrderFromApiResult: function(orderResult) {
      let order = {
        id: orderResult.id,
        number: orderResult.number,
        total: parseInt(orderResult.total), //实收价格
        saleTotal: parseInt(orderResult.sale_total), //应收价格
        userName: orderResult.user_name,
        storeId: orderResult.store_id,
        storeName: orderResult.store_name,
        userId: orderResult.user_id,
        shipmentState: orderResult.shipment_state,
        groupState: orderResult.group_state,
        paymentState: orderResult.payment_state,
        payments: orderResult.payments,
        createdAt: moment(orderResult.created_at),
        lineItemGroups: [],
        extraLineItems: []
      }
      order.displayCreatedAt = order.createdAt.format('MM-DD HH:mm')

      orderResult.line_item_groups.forEach((groupResult, i) => {
        let group = {
          id: groupResult.id,
          orderId: groupResult.order_id,
          order: order,
          number: groupResult.number,
          state: groupResult.state,
          lineItems: [],
          name: groupResult.name,
          price: parseInt(groupResult.price),
          createdAt: moment(groupResult.created_at),
        }
        group.displayCreatedAt = group.createdAt.format('MM-DD HH:mm')
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
              memo: lineItemResult.memo
            }
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
          const lineItem = {
            name: lineItemResult.cname,
            price: lineItemResult.price
          }
          order.extraLineItems.push(lineItem)
        }
      })
      // 订单详细信息里有customer
      if (orderResult.customer) {
        order.customer = this.buildCustomer(orderResult.customer)
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

        let order = this.buildOrderFromApiResult(item)
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
        createdAt: moment(item.created_at),
        lineItems: []
      }
      group.displayCreatedAt = group.createdAt.format('MM-DD HH:mm')
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

    buildUser: function(userResult) {
      const user = {
        storeId: 0,
        avatar: 'default.jpg',
        apiKey: ''
      }
      user.id = userResult.id
      user.storeId = userResult.store_id
      //user.avatar = userResult.avatar
      user.apiKey = userResult.api_key
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
        defaultCard: {}
      }
      user.storeId = userResult.store_id
      user.id = userResult.id
      user.mobile = userResult.mobile
      user.name = userResult.name
      user.gender = userResult.gender
      user.customerType = userResult.customer_type
      user.normalOrderTotal = parseInt(userResult.normal_order_total)
      user.normalOrderCount = userResult.normal_order_count
      user.cards = []
      // cards:[{"id":1,"user_id":8,"code":"7f9bd55a64254af48694723d4622eabfcd4f5197","current_value":"2000.0","name":"PrepaidCard1000 - Master","discount_percent":null,"discount_amount":null,"product_id":1]
      // 客户详细信息里，有会员卡信息
      if (userResult.cards) {
        userResult.cards.forEach((cardResult)=>{
          const card = {
            className: 'Spree::Card',
            id: cardResult.id,
            name: cardResult.name,
            style: cardResult.style, // prepaid 充值卡， counts 次卡
            amountRemaining: parseInt(cardResult.amount_remaining),
            discountPercent: parseInt(cardResult.discount_percent),
            discountAmount: parseInt(cardResult.discount_amount),
            status: cardResult.status, //enabled:可用， disabled：不可用
            code: (cardResult.code.length < 10 ? cardResult.code : cardResult.code.slice(0, 8)), // 显示前8位
            productId: cardResult.product_id
          }
          card.displayStyle = this.getCardDisplayStyle( card.style)
          card.displayStatus = this.getCardDisplayStatus( card.status)
          user.cards.push(card)
        })
        // 选择第一个可用的card作为 缺省会员卡
        user.defaultCard = user.cards.find((card)=>{ return card.status == 'enabled'})
      }

      if( ! user.defaultCard ){
        user.defaultCard = {}
      }
      user.displayType = user.cards.length>0 ? "会员" : "散客"
      user.displayGender = this.getDisplayGender(user.gender)

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
    }
  }
}
