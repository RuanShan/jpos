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
    baseUrl = 'http://localhost:3001'
    baseImgPath = 'http://localhost:3001/img/'
} else {
<<<<<<< HEAD
    baseUrl = 'http://cangdu.org:8001'
    baseImgPath = 'http://cangdu.org:8001/img/'
=======
  baseUrl = 'http://jpos_api.firecart.cn:3001'
  baseImgPath = 'http://jpos_api.firecart.cn:3001/img/'
>>>>>>> 7e6ad39f038429c4233ce72a61004f762977cbf7
}

export {
    baseUrl,
    routerMode,
    baseImgPath
}