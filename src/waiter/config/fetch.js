import { baseUrl } from './env'
import store from '@/store'

var Promise = require('es6-promise').Promise;

export default async (url = '', data = {}, type = 'GET', method = 'fetch') => {
  type = type.toUpperCase()
  url = baseUrl + url

  if (type == 'GET') {
    let dataStr = '' // 数据拼接字符串
    Object.keys(data).forEach(key => {
      dataStr += key + '=' + data[key] + '&'
    })

    if (dataStr !== '') {
      dataStr = dataStr.substr(0, dataStr.lastIndexOf('&'))
      url = url + '?' + dataStr
    }
  }

  if (window.fetch && method == 'fetch') {
    let requestConfig = {
      credentials: 'include',
      method: type,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-Jpos-Site-Id': 1
        //'X-Spree-Token': store.state.userInfo.apiKey
      },
      mode: 'cors',
      cache: 'force-cache'
    }

    if (type == 'POST' || type == 'PUT') {
      Object.defineProperty(requestConfig, 'body', {
        value: JSON.stringify(data)
      })
    }

    try {
      const response = await fetch(url, requestConfig)
      let responseJson = null
      // 401
      if( response.status ==401 ){
        store.commit('resetUser')
      }
      if( type=='DELETE' &&  response.status == 204 ){
        //删除成功时，没有返回内容
        responseJson = { ret: 'success' }
      }else{
        responseJson = await response.json()
      }
      return responseJson
    } catch (error) {
      console.log(error)
      throw new Error(error)
    }
  } else {
    return new Promise((resolve, reject) => {
      let requestObj = new XMLHttpRequest()

      let sendData = ''
      if (type == 'POST') {
        sendData = JSON.stringify(data)
      }

      requestObj.open(type, url, true)
      requestObj.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
      requestObj.send(sendData)

      requestObj.onreadystatechange = () => {
        if (requestObj.readyState == 4) {
          if (requestObj.status == 200) {
            let obj = requestObj.response
            if (typeof obj !== 'object') {
              obj = JSON.parse(obj)
            }
            resolve(obj)
          } else {
            reject(requestObj)
          }
        }
      }
    })
  }
}
