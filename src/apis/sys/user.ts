import type { GetUserInfoModel, LoginParams, LoginResultModel } from './model/userModel'
import type { ErrorMessageMode } from '~/utils/http/types'
import { defHttp } from '~/utils/http'

enum Api {
  Login = '/login',
  Logout = '/logout',
  GetUserInfo = '/users',
}

/**
 * @description: user login api
 */
export function loginApi(params: LoginParams, mode: ErrorMessageMode = 'modal') {
  return defHttp.post<LoginResultModel>(
    {
      url: Api.Login,
      params,
    },
    {
      errorMessageMode: mode,
    },
  )
}

/**
 * @description: getUserInfo
 */
export function getUserInfoApi() {
  return defHttp.get<GetUserInfoModel>({ url: Api.GetUserInfo })
}

export function doLogout() {
  return defHttp.get({ url: Api.Logout })
}
