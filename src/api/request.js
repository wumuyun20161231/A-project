import axios from 'axios'
import host from '../../config/hostCfg'

const baseUrl = process.env.NODE_ENV === 'production' ? host.build.host : host.build.host

// create an axios instance
const service = axios.create({
  timeout: 1000 * 30, // request timeout
  headers: { 'Content-Type': 'application/json' }
})

service.interceptors.request.use(
  config => {
    config.headers.Authorization = `bearer ${getUrlParam('token')}`
    if (config.admin) {
      config.url = baseUrl + '/memorial-hall-admin/' + config.url
    } else {
      // config.url = baseUrl + '/memorial-hall-app/' + config.url
      config.url = baseUrl + config.url
    }
    return config
  },
  error => {
    // Do something with request error
    console.log(error) // for debug
    Promise.reject(error)
  }
)

// respone interceptor
service.interceptors.response.use(
  response => response.data,
  error => {
    console.log('网络异常')
    return Promise.reject(error)
  }
)

// 获取url参数
function getUrlParam(name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
  var r = window.location.search.substr(1).match(reg);  //匹配目标参数
  if (r != null) return unescape(r[2]); return null; //返回参数值
}

console.log(getUrlParam('token'))

export default service
