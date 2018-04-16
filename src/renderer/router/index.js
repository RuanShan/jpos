import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const Abstract = r => require.ensure([], () => r(require('@/page/abstract')), 'abstract')
const NotFound = r => require.ensure([], () => r(require('@/page/404')), '404')
const login = r => require.ensure([], () => r(require('@/page/login')), 'login')
const root = r => require.ensure([], () => r(require('@/page/manage')), 'manage')
const home = r => require.ensure([], () => r(require('@/page/home')), 'home')
const addShop = r => require.ensure([], () => r(require('@/page/addShop')), 'addShop')
const addGoods = r => require.ensure([], () => r(require('@/page/addGoods')), 'addGoods')
const userList = r => require.ensure([], () => r(require('@/page/userList')), 'userList')
const shopList = r => require.ensure([], () => r(require('@/page/shopList')), 'shopList')
const menuList = r => require.ensure([], () => r(require('@/page/menuList')), 'menuList')
const foodList = r => require.ensure([], () => r(require('@/page/foodList')), 'foodList')
const adminList = r => require.ensure([], () => r(require('@/page/adminList')), 'adminList')
const visitor = r => require.ensure([], () => r(require('@/page/visitor')), 'visitor')
const newMember = r => require.ensure([], () => r(require('@/page/newMember')), 'newMember')
const uploadImg = r => require.ensure([], () => r(require('@/page/uploadImg')), 'uploadImg')
const vueEdit = r => require.ensure([], () => r(require('@/page/vueEdit')), 'vueEdit')
const adminSet = r => require.ensure([], () => r(require('@/page/adminSet')), 'adminSet')
const sendMessage = r => require.ensure([], () => r(require('@/page/sendMessage')), 'sendMessage')
const explain = r => require.ensure([], () => r(require('@/page/explain')), 'explain')

const orderList = r => require.ensure([], () => r(require('@/page/orderList')), 'orderList')
const orderProcess = r => require.ensure([], () => r(require('@/page/orderProcess')), 'orderProcess')

// const routesX = [
//   {
//     path: '/',
//     component: login
//   },
//   {
//     path: '/manage',
//     component: manage,
//     name: '',
//     children: [{
//       path: '',
//       component: home,
//       meta: []
//     }, {
//       path: '/addShop',
//       component: addShop,
//       meta: ['添加数据', '添加商铺']
//     }, {
//       path: '/addGoods',
//       component: addGoods,
//       meta: ['添加数据', '添加商品']
//     }, {
//       path: '/userList',
//       component: userList,
//       meta: ['数据管理', '用户列表']
//     }, {
//       path: '/shopList',
//       component: shopList,
//       meta: ['数据管理', '商家列表']
//     }, {
//       path: '/menuList',
//       component: menuList,
//       meta: ['数据管理', '菜单列表']
//     }, {
//       path: '/foodList',
//       component: foodList,
//       meta: ['数据管理', '食品列表']
//     }, {
//       path: '/orderList',
//       component: orderList,
//       meta: ['数据管理', '订单列表']
//     }, {
//       path: '/adminList',
//       component: adminList,
//       meta: ['数据管理', '管理员列表']
//     }, {
//       path: '/visitor',
//       component: visitor,
//       meta: ['图表', '用户分布']
//     }, {
//       path: '/newMember',
//       component: newMember,
//       meta: ['图表', '用户数据']
//     }, {
//       path: '/uploadImg',
//       component: uploadImg,
//       meta: ['文本编辑', 'MarkDown']
//     }, {
//       path: '/vueEdit',
//       component: vueEdit,
//       meta: ['编辑', '文本编辑']
//     }, {
//       path: '/adminSet',
//       component: adminSet,
//       meta: ['设置', '管理员设置']
//     }, {
//       path: '/sendMessage',
//       component: sendMessage,
//       meta: ['设置', '发送通知']
//     }, {
//       path: '/explain',
//       component: explain,
//       meta: ['说明', '说明']
//     }]
//   }
// ]

let routes = [
  {
    path: '/login',
    component: login,
    name: 'login',
    meta: {
      hidden: true
    }
  },
  {
    path: '/404',
    component: NotFound,
    name: '404',
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/',
    component: root,
    meta: {
      requiresAuth: true
    },
    children:[ {
        path: '',
        component: home,
        name: 'Dashboard',
        meta: {  iconClass: 'el-icon-news' },
      }, {
        path: '/base',
        component: Abstract,
        name: '数据管理',
        meta: {  iconClass: 'el-icon-tickets' },
        children:[{
            path: 'userList',
            component: userList,
            name: '用户列表',
            meta: { breadcrumbs: ['数据管理', '用户列表'] }
          }, {
            path: 'shopList',
            component: shopList,
            name: '商家列表',
            meta: { breadcrumbs: ['数据管理', '商家列表'] }
          }, {
            path: 'menuList',
            component: menuList,
            name: '菜单列表',
            meta: { breadcrumbs: ['数据管理', '菜单列表'] }
          }, {
            path: '/foodList',
            component: foodList,
            name: '食品列表',
            meta: { breadcrumbs: ['数据管理', '食品列表'] }
          }, {
            path: '/adminList',
            component: adminList,
            name: '管理员列表',
            meta: { breadcrumbs: ['数据管理', '管理员列表'] }
          }
        ]
      }, {
        path: '/orders',
        component: Abstract,
        name: '订单',
        meta: {  iconClass: 'el-icon-goods' },
        children: [
          {
           path: 'orderList',
           component: orderList,
           name: '订单列表',
           meta: { breadcrumbs: ['订单', '订单列表'] }
         }, {
           path: 'orderProcess',
           component: orderProcess,
           name: '订单Process',
           meta: { breadcrumbs: ['订单', '订单Process'] }
         }
        ]
      }, {
        path: '/edit',
        component: Abstract,
        name: '添加数据',
        meta: {  iconClass: 'el-icon-edit-outline' },
        children: [
          {
           path: '/addGoods',
           component: addGoods,
           name: '添加商品',
           meta: { breadcrumbs: ['添加数据', '添加商品'] }
         }, {
           path: '/addShop',
           component: addShop,
           name: '添加商铺',
           meta: { breadcrumbs: ['添加数据', '添加商铺'] }
         }
        ]
      }, {
        path: '/visitor',
        component: visitor,
        name: '用户分布',
        meta: { breadcrumbs: ['图表', '用户分布'] }
      }, {
        path: '/newMember',
        component: newMember,
        name: '用户数据',
        meta: { breadcrumbs: ['图表', '用户数据'] }
      }, {
        path: '/uploadImg',
        component: uploadImg,
        name: 'MarkDown',
        meta: { breadcrumbs: ['文本编辑', 'MarkDown'] }
      }, {
        path: '/vueEdit',
        component: vueEdit,
        name: '文本编辑',
        meta: { breadcrumbs: ['编辑', '文本编辑'] }
      }, {
        path: '/adminSet',
        component: adminSet,
        name: '管理员设置',
        meta: { breadcrumbs: ['设置', '管理员设置'] }
      }, {
        path: '/sendMessage',
        component: sendMessage,
        name: '发送通知',
        meta: { breadcrumbs: ['设置', '发送通知'] }
      }, {
        path: '/explain',
        component: explain,
        name: '说明',
        meta: { breadcrumbs: ['说明', '说明'] }
      }
    ]
  },
  {
    path: '*',
    redirect: {path: '/404'}
  }
]

let menuCount = routes.length;
routes[menuCount - 2].children.forEach(route => {
  if (route.children) {
    if (!route.meta) route.meta = {};
    route.meta.children = route.children;
  }
});

export default new Router({
  routes,
  strict: process.env.NODE_ENV !== 'production'
})
