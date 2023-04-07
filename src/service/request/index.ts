import axios, { AxiosResponse } from 'axios'
import type { AxiosInstance } from 'axios'
import { JayRequestConfig, JayRequestInterceptors } from './type'

import { ElLoading } from 'element-plus'
import 'element-plus/theme-chalk/base.css' // 不同大版本放置的目录不同
import 'element-plus/theme-chalk/el-loading.css'

class JayRequset {
  instance: AxiosInstance
  // 存放实例传入拦截器函数
  interceptors?: JayRequestInterceptors
  showLoading: boolean
  loading?: any

  constructor(config: JayRequestConfig) {
    // 一开始我们不知道要用什么类型 鼠标放在create上   ctrl+点击可以到达源码
    // 创建axios实例
    // 有时候我们不同的请求需要不同的baseUrl，
    // 如果在同一个axios实例上定义会被覆盖掉, 我们可以创建不同的实例
    this.instance = axios.create(config)

    // 保存实例传入的拦截器函数
    this.interceptors = config.interceptors

    this.showLoading = config.showLoading ?? true

    // 使用拦截器
    this.instance.interceptors.request.use(
      this.interceptors?.requestInterceptor,
      this.interceptors?.requestInterceptorCatch
    )
    this.instance.interceptors.response.use(
      this.interceptors?.responseInterceptor,
      this.interceptors?.responseInterceptorCatch
    )

    // 每个实例都有的请求拦截器 每次创建实例的时候这些拦截器也会被创建
    this.instance.interceptors.request.use(
      (config) => {
        console.log('所有实例都有的拦截器: 请求成功拦截')
        // 初始化loading
        if (this.showLoading) {
          this.loading = ElLoading.service({
            lock: true,
            text: '正在请求数据....',
            background: 'rgba(0, 0, 0, 0.5)'
          })
        }
        return config
      },
      (err) => {
        console.log('所有实例都有的拦截器: 请求失败拦截')
        return err
      }
    )
    // 每个实例都有的响应拦截器
    this.instance.interceptors.response.use(
      (res) => {
        // 将loading移除
        this.loading?.close()
        console.log('所有实例都有的拦截器: 响应成功拦截')
        return res
      },
      (err) => {
        // 将loading移除
        this.loading?.close()
        console.log('所有实例都有的拦截器: 响应失败拦截')
        return err
      }
    )
  }

  request<T = any>(config: JayRequestConfig<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      // 1.单个请求对请求config的处理
      if (config.interceptors?.requestInterceptor) {
        // 调用requestInterceptor会返回config
        config = config.interceptors.requestInterceptor(config as any)
      }

      // 2.判断是否需要显示loading
      if (config.showLoading === false) {
        this.showLoading = config.showLoading
      }
      this.instance
        .request(config)
        .then((res) => {
          // 1.单个请求对数据的处理
          if (config.interceptors?.responseInterceptor) {
            res = config.interceptors.responseInterceptor(res)
          }
          this.showLoading = false
          resolve(res.data)
          console.log(res.data)
        })
        .catch((err) => {
          this.showLoading = false
          reject(err)
        })
    })
  }

  get<T = any>(config: JayRequestConfig<T>): Promise<T> {
    return this.request<T>({ ...config, method: 'GET' })
  }

  post<T = any>(config: JayRequestConfig<T>): Promise<T> {
    return this.request<T>({ ...config, method: 'POST' })
  }

  delete<T = any>(config: JayRequestConfig<T>): Promise<T> {
    return this.request<T>({ ...config, method: 'DELETE' })
  }

  patch<T = any>(config: JayRequestConfig<T>): Promise<T> {
    return this.request<T>({ ...config, method: 'PATCH' })
  }
}

export default JayRequset
