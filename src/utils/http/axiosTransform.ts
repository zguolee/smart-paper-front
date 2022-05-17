/**
 * Data processing class, can be configured according to the project
 */
import type { AxiosRequestConfig, AxiosResponse } from 'axios'
import type { RequestOptions, Result } from './types'

export interface CreateAxiosOptions extends AxiosRequestConfig {
  authenticationScheme?: string
  urlPrefix?: string
  transform?: any
  requestOptions?: RequestOptions
}

export abstract class AxiosTransform {
  /**
   * @description: Process configuration before request
   */
  beforeRequestHook?: (config: AxiosRequestConfig, options: RequestOptions) => AxiosRequestConfig

  /**
   * @description: Request successful processing
   */
  transformRequestHook?: (res: AxiosResponse<Result>, options: RequestOptions) => any

  /**
   * @description: Request failure processing
   */
  requestCatchHook?: (e: Error, options: RequestOptions) => Promise<any>

  /**
   * @description: The interceptor before request
   */
  requestInterceptors?: (
    config: AxiosRequestConfig,
    options: CreateAxiosOptions
  ) => AxiosRequestConfig

  /**
   * @description: The interceptor after request
   */
  responseInterceptors?: (res: AxiosResponse<any>) => AxiosResponse<any>

  /**
   * @description: Interceptor error handling before request
   */
  requestInterceptorsCatch?: (error: Error) => void

  /**
   * @description: Interceptor error handling after request
   */
  responseInterceptorsCatch?: (error: Error) => void
}
