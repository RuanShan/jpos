/**
 * 配置编译环境和线上环境之间的切换
 *
 * baseUrl: 域名地址
 * routerMode: 路由模式
 * baseImgUrl: 图片存放地址
 *
 */
let baseUrl = ''
let routerMode = 'history'
let baseImgUrl

if (process.env.NODE_ENV == 'development') {
  baseUrl = 'http://localhost:8001'
  baseImgUrl = 'http://localhost:8001/img/'
//  baseUrl = 'http://jpos_api.firecart.cn'
//  baseImgUrl = 'http://jpos_api.firecart.cn/img/'
} else {
  baseUrl = 'http://cangdu.org:8001'
  baseImgUrl = 'http://cangdu.org:8001/img/'
}

export {
  baseUrl,
  routerMode,
  baseImgUrl
}