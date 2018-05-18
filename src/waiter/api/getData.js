import fetch from '@/config/fetch'
/**************************************************************************
 * jpos spree api
 **************************************************************************/
/**
 * 登陆
 *
 */
export const login = data => fetch('/users/sign_in', data, 'POST');
//export const login = data => fetch('/admin/login', data, 'POST');

/**
 * 退出
 */
export const signout = () => fetch('/users/sign_out', {}, 'DELETE');
//export const signout = () => fetch('/admin/singout');

/**
 * 获取用户信息 by cookies
 */

export const getUserInfo = () => fetch('/users/info', {}, 'GET');
//export const getUserInfo = () => fetch('/admin/info');

/**
 * api请求量
 */

export const apiCount = date => fetch('/statis/api/' + date + '/count');

/**
 * 所有api请求量
 */

export const apiAllCount = () => fetch('/statis/api/count');


/**
 * 所有api请求信息
 */

export const apiAllRecord = () => fetch('/statis/api/all');

/**
 * 用户注册量
 */

export const userCount = date => fetch('/statis/user/' + date + '/count');

/**
 * 某一天订单数量
 */

export const orderCount = date => fetch('/statis/order/' + date + '/count');


/**
 * 某一天管理员注册量
 */

export const adminDayCount = date => fetch('/statis/admin/' + date + '/count');

/**
 * 管理员列表
 */

export const adminList = data => fetch('/admin/all', data);

/**
 * 管理员数量
 */

export const adminCount = () => fetch('/admin/count');

/**
 * 获取定位城市
 */

export const cityGuess = () => fetch('/v1/cities', {
    type: 'guess'
});

/**
 * 添加商铺
 */

export const addShop = data => fetch('/shopping/addShop', data, 'POST');

/**
 * 获取搜索地址
 */

export const searchplace = (cityid, value) => fetch('/v1/pois', {
    type: 'search',
    city_id: cityid,
    keyword: value
});

/**
 * 获取当前店铺食品种类
 */

export const getCategory = restaurant_id => fetch('/shopping/getcategory/' + restaurant_id);

/**
 * 添加食品种类
 */

export const addCategory = data => fetch('/shopping/addcategory', data, 'POST');


/**
 * 添加食品
 */

export const addFood = data => fetch('/shopping/addfood', data, 'POST');


/**
 * category 种类列表
 */

export const foodCategory = (latitude, longitude) => fetch('/shopping/v2/restaurant/category');

/**
 * 获取餐馆列表
 */

export const getResturants = data => fetch('/shopping/restaurants', data);

/**
 * 获取餐馆详细信息
 */

export const getStore = restaurant_id => fetch('/shopping/restaurant/' + restaurant_id);

/**
 * 获取餐馆数量
 */

export const getResturantsCount = () => fetch('/shopping/restaurants/count');

/**
 * 更新餐馆信息
 */

export const updateResturant = data => fetch('/shopping/updateshop', data, 'POST');

/**
 * 删除餐馆
 */

export const deleteResturant = restaurant_id => fetch('/shopping/restaurant/' + restaurant_id, {}, 'DELETE');

/**
 * 获取食品列表
 */
export const getProducts = data => fetch('/api/v1/products', data);
//export const getFoods = data => fetch('/shopping/v2/foods', data);

/**
 * 获取食品数量
 */

export const getFoodsCount = data => fetch('/shopping/v2/foods/count', data);


/**
 * 获取menu列表
 */

export const getMenu = data => fetch('/shopping/v2/menu', data);

/**
 * 获取menu详情
 */

export const getMenuById = category_id => fetch('/shopping/v2/menu/' + category_id);

/**
 * 更新食品信息
 */

export const updateFood = data => fetch('/shopping/v2/updatefood', data, 'POST');

/**
 * 删除食品
 */

export const deleteFood = food_id => fetch('/shopping/v2/food/' + food_id, {}, 'DELETE');

/**
 * 获取用户列表
 */

export const getUserList = data => fetch('/v1/users/list', data);

/**
 * 获取用户数量
 */

export const getUserCount = data => fetch('/v1/users/count', data);

/**
 * 获取订单列表
 */
export const getOrderList = data => fetch('/api/v1/pos_orders', data);
//export const getOrderList = data => fetch('/bos/orders', data);

/**
 * 获取订单数量
 */

export const getOrderCount = data => fetch('/bos/orders/count', data);

/**
 * 获取订单Detail
 */

export const getOrder = orderNumber => fetch('/api/v1/orders/' + orderNumber)

/**
 * 获取订单Detail
 */

export const findOrderByGroupNumber = groupNumber => fetch('/api/v1/pos_orders/find_by_group_number/' + groupNumber)


/**
 * 获取Customer信息
 */

export const getCustomer = user_id => fetch('/api/v1/users/' + user_id);

/**
 * 根据客户号码搜索用户信息
 */

export const findCustomers = mobile => fetch('/api/v1/users/search');

/**
 * Update Customer 信息
 */

export const updateCustomer = (user_id, data) => fetch('/api/v1/users/' + user_id, data, "PUT");

/**
 * 获取地址信息
 */

export const getAddressById = address_id => fetch('/v1/addresse/' + address_id);

/**
 * 获取用户分布信息
 */

export const getUserCity = () => fetch('/v1/user/city/count');



/********************************************************************************
 from vue2-elm
********************************************************************************/
/**
 * 获取shop页面菜单列表
 */
export const foodMenu = taxonomy_id => fetch('/api/v1/taxonomies/' + taxonomy_id + '/taxons');
//export const foodMenu = restaurant_id => fetch('/shopping/v2/menu', {
//  restaurant_id
//});

/**
 * 获取shop页面商铺详情
 */
export const shopDetails = (storeId, latitude, longitude) => fetch('/api/v1/stores/' + storeId)
    //export const shopDetails = (shopid, latitude, longitude) => fetch('/shopping/restaurant/' + shopid, {
    //  latitude,
    //  longitude: longitude + '&extras[]=activities&extras[]=album&extras[]=license&extras[]=identification&extras[]=statistics'
    //});

/**
 * create customer
 */

export const createCustomer = (data) => fetch('/api/v1/users', data, 'POST');

/**
 * 支付订单
 */

export const checkout = (entities) => fetch('/api/v1/orders', entities, 'POST');

/**
 * 会员充值
 */

export const recharge = (entities) => fetch('/api/v1/orders', entities, 'POST');


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

export const getLineItemGroup = number => fetch('/api/v1/line_item_groups/' + number)

/**
 * update LineItem worker_id列表
 * data: worker_id,
 *       ids - line_item.id
 */

export const fulfillLineItems = data => fetch('/api/v1/line_items/fulfill', data, 'PUT')


/**
 * get cards 获取会员持有的会员卡信息
 * return: { cards:[{id:xxx, number:xxx, name:xxx, current_value, transactions:[card_id, amount, creat_at, serialNum, status]}]}
 *                   id:        数据库的id号
 *                   number:    会员卡号码
 *                   name:      会员卡名称
 *                   current_value: 剩余金额
 *                   car_id:    等于id
 *                   amount:    剩余金额
 *                   creat_at:  (充值)创建时间
 *                   serialNum: 流水号
 *                   status:    状态
 */

export const getUserCards = (userId) => fetch('/api/v1/users/' + userId + '/cards');

/**
 * get card transactions 根据会员卡Id获取会员卡充值记录
 */

export const getCardTransactions = (cardId) => fetch('/api/v1/cards/' + cardId + '/transactions');