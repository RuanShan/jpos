/**
 * 配置编译环境和线上环境之间的切换
 *
 * baseUrl: 域名地址
 * routerMode: 路由模式
 * baseImgPath: 图片存放地址
 *
 */
let baseUrl = ''
let routerMode = 'history'
let baseImgPath

if (process.env.NODE_ENV == 'development') {
    baseUrl = 'http://jpos_api.firecart.cn:3001'
    baseImgPath = 'http://jpos_api.firecart.cn/images/'
} else {
  baseUrl = 'http://jpos_api.firecart.cn:3001'
  baseImgPath = 'http://jpos_api.firecart.cn:3001/img/'
}

export {
    baseUrl,
    routerMode,
    baseImgPath
}
