import type { GetUserInfoModel, LoginParams, LoginResultModel } from './model/userModel'
import type { ErrorMessageMode } from '~/utils/http/types'
import { defHttp } from '~/utils/http'

enum Api {
  Login = '/login',
  Register = '/register',
  Logout = '/logout',
  GetUserInfo = '/users',
}

export function registerApi(params: LoginParams, mode: ErrorMessageMode = 'message') {
  return defHttp.post(
    {
      url: Api.Register,
      params,
    },
    {
      errorMessageMode: mode,
    },
  )
}

export function loginApi(params: LoginParams, mode: ErrorMessageMode = 'message') {
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

export function getUserInfoApi() {
  return defHttp.get<GetUserInfoModel>({ url: Api.GetUserInfo })
}

export function doLogout() {
  return defHttp.get({ url: Api.Logout })
}
