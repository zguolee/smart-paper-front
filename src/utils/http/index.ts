import type { AxiosResponse } from 'axios'
import type { AxiosTransform, CreateAxiosOptions } from './axiosTransform'
import { VAxios } from './Axios'
import { checkStatus } from './checkStatus'
import { formatRequestDate, joinTimestamp } from './helper'
import type { RequestOptions, Result } from './types'
import { ContentTypeEnum, RequestEnum, ResultEnum } from '~/enums/httpEnum'
import { deepMerge, setObjToUrlParams } from '~/utils'
import { getToken } from '~/utils/auth'
import { isString } from '~/utils/is'

// const apiUrl = 'http://192.168.2.143:8080/api'
const apiUrl = 'http://121.41.227.161:18080/api'
const urlPrefix = ''

/**
 * @description: 数据处理，方便区分多种处理方式
 */
const transform: AxiosTransform = {
  /**
   * @description: 处理请求数据。如果数据不是预期格式，可直接抛出错误
   */
  transformRequestHook: (res: AxiosResponse<Result>, options: RequestOptions) => {
    const { isTransformResponse, isReturnNativeResponse } = options
    // 是否返回原生响应头 比如：需要获取响应头时使用该属性
    if (isReturnNativeResponse)
      return res

    // 不进行任何处理，直接返回
    // 用于页面代码可能需要直接获取code，data，message这些信息时开启
    if (!isTransformResponse)
      return res.data

    // 错误的时候返回
    const { data } = res
    if (!data)
      throw new Error('The interface request failed, please try again later!')

    //  这里 code，result，message为 后台统一的字段，需要在 types.ts内修改为项目自己的接口返回格式
    const { code, result, message } = data
    // 这里逻辑可以根据项目进行修改
    const hasSuccess = data && Reflect.has(data, 'code') && code === ResultEnum.SUCCESS
    if (hasSuccess)
      return result

    // 在此处根据自己项目的实际情况对不同的code执行不同的操作
    // 如果不希望中断当前请求，请return数据，否则直接抛出异常即可
    let timeoutMsg = ''
    switch (code) {
      case ResultEnum.TIMEOUT:
        timeoutMsg = 'Login timed out, please log in again!'
        break
      default:
        if (message)
          timeoutMsg = message
    }
    // errorMessageMode='modal' 的时候会显示modal错误弹窗，而不是消息提示，用于一些比较重要的错误
    // errorMessageMode='none' 一般是调用时明确表示不希望自动弹出错误提示
    if (options.errorMessageMode === 'modal')
      console.error({ title: '错误提示', message: timeoutMsg })

    else if (options.errorMessageMode === 'message')
      window.$message.error(timeoutMsg)

    // throw new Error(timeoutMsg || 'The interface request failed, please try again later!')
    return timeoutMsg
  },

  // 请求之前处理config
  beforeRequestHook: (config, options) => {
    const { apiUrl, joinPrefix, joinParamsToUrl, formatDate, joinTime = true } = options

    if (joinPrefix)
      config.url = `${urlPrefix}${config.url}`

    if (apiUrl && isString(apiUrl))
      config.url = `${apiUrl}${config.url}`

    const params = config.params || {}
    if (config.method?.toUpperCase() === RequestEnum.GET) {
      if (!isString(params)) {
        // Request to add timestamp parameters to avoid taking data from the cache
        config.params = Object.assign(params || {}, joinTimestamp(joinTime, false))
      }
      else {
        // Compatible with restful style
        config.url = `${config.url + params}${joinTimestamp(joinTime, true)}`
        config.params = undefined
      }
    }
    else {
      if (!isString(params)) {
        formatDate && formatRequestDate(params)
        config.data = params
        config.params = undefined
        if (joinParamsToUrl)
          config.url = setObjToUrlParams(config.url as string, config.data)
      }
      else {
        // Compatible with restful style
        config.url = config.url + params
        config.params = undefined
      }
    }
    return config
  },

  /**
   * @description: 请求拦截器处理
   */
  requestInterceptors: (config, options) => {
    // 请求之前处理config
    const token = getToken()
    if (token) {
      // jwt token
      (config as Recordable).headers.Authorization = options.authenticationScheme
        ? `${options.authenticationScheme} ${token}`
        : token
    }
    return config
  },

  /**
   * @description: 响应拦截器处理
   */
  responseInterceptors: (res: AxiosResponse<any>) => {
    return res
  },

  /**
   * @description: 响应错误处理
   */
  responseInterceptorsCatch: (error: any) => {
    const { response, code, message, config } = error || {}
    const errorMessageMode = config?.requestOptions?.errorMessageMode || 'none'
    const msg: string = response?.data?.error?.message ?? ''
    const err: string = error?.toString?.() ?? ''
    let errMessage = ''

    try {
      if (code === 'ECONNABORTED' && message.includes('timeout'))
        errMessage = '接口请求超时,请刷新页面重试!'

      if (err?.includes('Network Error'))
        errMessage = '网络异常，请检查您的网络连接是否正常!'

      if (errMessage) {
        if (errorMessageMode === 'modal')
          console.error({ title: '错误提示', message: errMessage })

        else if (errorMessageMode === 'message')
          window.$message.error(errMessage)

        return Promise.reject(error)
      }
    }
    catch (error) {
      throw new Error(error as unknown as string)
    }

    checkStatus(error?.response?.status, msg, errorMessageMode)
    return Promise.reject(error)
  },
}

function createAxios(options?: Partial<CreateAxiosOptions>) {
  return new VAxios(
    deepMerge(
      {
        // authenticationScheme: 'Bearer',
        authenticationScheme: 'Bearer',
        // baseURL: '/basic-api',
        timeout: 5 * 1000,
        // 接口可能会有通用的地址部分，可以统一抽取出来
        urlPrefix,
        headers: { 'Content-Type': ContentTypeEnum.JSON },
        // 如果是form-data格式
        // headers: { 'Content-Type': ContentTypeEnum.FORM_URLENCODED },
        // 数据处理方式
        transform,
        // 配置项，下面的选项都可以在独立的接口请求中覆盖
        requestOptions: {
          // 默认将prefix 添加到url
          joinPrefix: true,
          // 是否返回原生响应头 比如：需要获取响应头时使用该属性
          isReturnNativeResponse: false,
          // 需要对返回数据进行处理
          isTransformResponse: true,
          // post请求的时候添加参数到url
          joinParamsToUrl: false,
          // 格式化提交参数时间
          formatDate: true,
          // 消息提示类型
          errorMessageMode: 'message',
          // 接口地址
          apiUrl,
          // 接口拼接地址
          urlPrefix,
          //  是否加入时间戳
          joinTime: false,
          // 忽略重复请求
          ignoreCancelToken: true,
        },
      },
      options || {},
    ),
  )
}

export const defHttp = createAxios()
