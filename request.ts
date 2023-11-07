/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-sequences */
import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios'
import { useRouter } from 'vue-router'
import { ElLoading, configProviderContextKey } from 'element-plus'
import Loading from './Loading.js'
import sha256 from 'crypto-js/sha256'
import enchex from 'crypto-js/enc-hex'
import { formatParams } from '@/utils'
import Message from '@/utils/Message.js'

const router = useRouter()

// 1 创建实例
const instance = axios.create({
  timeout: 50000,
  // baseURL: 'http://dapp-server.nft-apps.shdev.bj',
  headers: {
    'Content-Type': 'application/json'
  }
})
// 2 拦截器
// 请求拦截
instance.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    // config.url = config.url?.replace('/api', '')
    if (config.options?.loading) {
      Loading.open()
    }
    const timestamp = Math.floor(new Date().getTime() / 1000)
    const signNameData = encryptParams(config, timestamp)

    if (!config.headers) {
      config.headers = {}
    }
    config.headers['X-Timestamp'] = timestamp
    config.headers['X-Signature'] = signNameData
    return config
  },
  (err) => {
    console.log(err)
  }
)
// 响应拦截
instance.interceptors.response.use(
  (response: AxiosResponse) => {
    Loading.close()
    if (response.data.status !== 'success') {
      Message.error(response.data.err_msg)
      return response.data.data
    } else {
      return response.data.data
    }
  },
  (error: AxiosError) => {
    handleReqError(error)
    return Promise.reject(error)
  }
)
// 3 返回实例，instance本身就是一个pormise
export default instance

export const request = instance.request

function handleReqError(error: AxiosError) {
  if (axios.isCancel(error)) {
    console.log('axios cancel', error)
  } else if (error?.response) {
    switch (error?.response.status) {
      case 400:
        Message.error('Request Error') // 请求错误(400)
        break
      case 401:
        // router.push({ name: 'login' })
        break
      case 403:
        Message.error('Access Denied') // 拒绝访问(403)
        break
      case 404:
        Message.error('Not Found') // 未发现(404)
        break
      case 408:
        Message.error('Request Timeout') // 请求超时(408)
        break
      case 500:
        Message.error('Server Error') // 服务器错误(500)
        break
      case 501:
        Message.error('Service not realized') // 服务未实现(501)
        break
      case 502:
        Message.error('Bad Gateway') // 网络错误(502)
        break
      case 503:
        Message.error('Service Unavailable') // 服务不可用
        break
      case 504:
        Message.error('Network Timeout') // 网络超时(504)
        break
      case 505:
        Message.error('HTTP version is not supported') // HTTP版本不受支持(505)
        break
      default:
        Message.error('Connect Error') // 连接出错!
    }
  } else {
    Message.error('Failed to connect to the server!') // 连接服务器失败!
  }
}

function encryptParams(config: AxiosRequestConfig, timestamp: number) {
  const method = config.method
  const url = config.url?.replace(/^\/api/, '')
  const uri = method === 'get' ? `${url}${formatParams(config.params)}` : `${url}`
  const requestBody = method === 'get' ? '' : config.data ? JSON.stringify(config.data) : ''
  const signStr = `${uri}|${requestBody}|${timestamp}|${import.meta.env.VITE_API_SECRET}`
  return enchex.stringify(sha256(signStr))
}

export const CancelToken = axios.CancelToken
