import fetch from '@/config/fetch'

/**
 * 登陆
 */

export const login = data => fetch('/users/sign_in', data, 'POST');

/**
 * 退出
 */

export const signout = () => fetch('/admin/singout')

/**
 * 获取用户信息
 */

export const getUserInfo = () => fetch('/users/info', {}, 'GET');

/**
 * 某一天 statis
 */

export const selectedDayCount = () => fetch('/api/v1/sale_days/selected_day')

/**
 * 某一天 statis
 */

export const selectedDaysCount = (data) => fetch('/api/v1/sale_days/selected_days', data, 'PUT')
    /**
     * 某一天 statis
     */

export const todayCount = () => fetch('/api/v1/sale_days/today')

/**
 * Life statis
 */

export const totalCount = () => fetch('/api/v1/sale_days/total')

/**
 * api请求量
 */

export const apiCount = date => fetch('/statis/api/' + date + '/count')

/**
 * 所有api请求量
 */

export const apiAllCount = () => fetch('/statis/api/count')

/**
 * 所有api请求信息
 */

export const apiAllRecord = () => fetch('/statis/api/all')

/**
 * 用户注册量
 */

export const userCount = date => fetch('/statis/user/' + date + '/count')

/**
 * 某天订单数量
 */
export const orderCount = date => fetch('/statis/order/' + date + '/count')

/**
 * 某一天管理员注册量
 */

export const adminDayCount = date => fetch('/statis/admin/' + date + '/count')

/**
 * 管理员列表
 */

export const staffList = data => fetch('/api/v1/staffs', data)
export const adminList = data => fetch('/admin/all', data)

/**
 * 管理员数量
 */

export const adminCount = () => fetch('/admin/count')

/**
 * 获取定位城市
 */

export const cityGuess = () => fetch('/v1/cities', {
    type: 'guess'
})

/**
 * 添加商铺
 */

export const addShop = data => fetch('/shopping/addShop', data, 'POST')

/**
 * 获取搜索地址
 */

export const searchplace = (cityid, value) => fetch('/v1/pois', {
    type: 'search',
    city_id: cityid,
    keyword: value
})

/**
 * 获取当前店铺食品种类
 */

export const getCategory = storeId => fetch('/shopping/getcategory/' + storeId)

/**
 * 添加食品种类
 */

export const addCategory = data => fetch('/shopping/addcategory', data, 'POST')

/**
 * 添加食品
 */

export const addFood = data => fetch('/shopping/addfood', data, 'POST')

/**
 * category 种类列表
 */

export const foodCategory = (latitude, longitude) => fetch('/shopping/v2/restaurant/category')

/**
 * 获取餐馆列表
 */

export const getResturants = data => fetch('/shopping/restaurants', data)

/**
 * 获取餐馆详细信息
 */

export const getStore = storeId => fetch('/api/v1/stores/' + storeId)
    //export const getStore = storeId => fetch('/shopping/restaurant/' + storeId)

/**
 * 获取餐馆数量
 */

export const getResturantsCount = () => fetch('/shopping/restaurants/count')

/**
 * 更新餐馆信息
 */

export const updateResturant = data => fetch('/shopping/updateshop', data, 'POST')

/**
 * 删除餐馆
 */

export const deleteResturant = storeId => fetch('/shopping/restaurant/' + storeId, {}, 'DELETE')

/**
 * 获取selling_services列表
 */
export const getProducts = data => fetch('/api/v1/selling_services', data)
export const getCards = data => fetch('/api/v1/selling_cards', data)

export const getFoods = data => fetch('/shopping/v2/foods', data)

/**
 * 获取食品数量
 */

export const getFoodsCount = data => fetch('/shopping/v2/foods/count', data)

/**
 * 获取menu列表
 */

export const getMenu = data => fetch('/shopping/v2/menu', data)

/**
 * 获取menu数量
 */

export const getMenusCount = data => fetch('/shopping/v2/menus/count', data)

/**
 * 获取menu详情
 */

export const getMenuById = category_id => fetch('/shopping/v2/menu/' + category_id)

/**
 * 更新menu信息
 */

export const updateMenu = (category_id, data) => fetch('/shopping/v2/menu/' + category_id, data, 'POST')

/**
 * 更新食品信息
 */

export const updateFood = data => fetch('/shopping/v2/updatefood', data, 'POST')

/**
 * 删除食品
 */

export const deleteFood = food_id => fetch('/shopping/v2/food/' + food_id, {}, 'DELETE')

/**
 * 获取Customer信息
 */

export const getCustomerList = user_id => fetch('/api/v1/customers');

/**
 * 根据电话号码查找Customer
 */

export const findCustomers = phone_num => fetch('/api/v1/users/search');

/**
 * 获取用户列表
 */

export const getUserList = data => fetch('/v1/users/list', data)

/**
 * 获取用户列表
 */

export const findUsers = data => fetch('/api/v1/users/search', data, 'POST')

/**
 * 获取用户数量
 */

export const getUserCount = data => fetch('/v1/users/count', data)

/**
 * 获取订单列表
 */

export const getOrderList = data => fetch('/api/v1/pos_orders', data)


/**
 * 根据订单状态统计数量
 */
export const getPosOrderCounts = () => fetch('/api/v1/pos_orders/count')

/**
 * 获取订单数量
 */

export const getOrderCount = data => fetch('/bos/orders/count', data)

/**
 * 获取订单Detail
 */

export const getOrder = orderNumber => fetch('/api/v1/orders/' + orderNumber)

/**
 * 获取订单Detail
 */

export const findOrderByGroupNumber = groupNumber => fetch('/api/v1/pos_orders/find_by_group_number/' + groupNumber)


/**
 * 获取用户信息
 */

export const getCustomerInfo = user_id => fetch('/v1/user/' + user_id)

/**
 * 获取地址信息
 */

export const getAddressById = address_id => fetch('/v1/addresse/' + address_id)

/**
 * 获取用户分布信息
 */

export const getUserCity = () => fetch('/v1/user/city/count')

/**
 * POS订单下一步
 * forward: false， 可选参数，如果表示订单转向上一步
 */

export const evolvePosOrder = (order_id, data) => fetch('/api/v1/pos_orders/' + order_id + '/one_step', data, 'PUT');

/**
 * 所有POS订单下一步
 * entities: order_numbers，
 *           forward: false， 可选参数，如果表示订单转向上一步
 *
 */

export const evolvePosOrders = (data) => fetch('/api/v1/pos_orders/all_step', data, 'PUT');

/**
 * 获取Item列表
 */

export const getLineItemGroupList = data => fetch('/api/v1/line_item_groups', data)

/**
 * search Item列表
 */

export const findLineItemGroups = data => fetch('/api/v1/line_item_groups/search', data, 'POST')

/**
 * 根据Item状态统计数量
 */
export const getLineItemGroupCounts = () => fetch('/api/v1/line_item_groups/counts')

/**
 * POS订单下一步
 * forward: false， 可选参数，如果表示订单转向上一步
 */

export const evolveLineItemGroup = (shipment_id, data) => fetch('/api/v1/line_item_groups/' + shipment_id + '/one_step', data, 'PUT');

/**
 * 所有 line_item_group 下一步
 * entities: numbers，
 *           forward: false， 可选参数，如果表示订单转向上一步
 *
 */

export const evolveLineItemGroups = (data) => fetch('/api/v1/line_item_groups/all_step', data, 'PUT');

/**
 * 获取 LineItemGroup Detail
 */

<<<<<<< HEAD
export const getLineItemGroup = number => fetch('/api/v1/line_item_groups/' + number)
=======
export const getLineItemGroup = number => fetch('/api/v1/line_item_groups/'+number)

/**
 * update LineItem worker_id列表
 * data: worker_id,
 *       ids - line_item.id
 */

export const fulfillLineItems = data => fetch('/api/v1/line_items/fulfill', data, 'PUT')
>>>>>>> bc38fc0c439968452376d2336e83e295efdaa377
