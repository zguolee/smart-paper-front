import type { LoginParams, LoginResultModel, UserInfoModel } from './model/userModel'
import type { ErrorMessageMode } from '~/utils/http/types'
import { defHttp } from '~/utils/http'

enum Api {
  Login = '/login',
  Register = '/register',
  Logout = '/logout',
  GetUserInfo = '/users',
}

export const registerApi = (params: LoginParams, mode: ErrorMessageMode = 'message') =>
  defHttp.post(
    {
      url: Api.Register,
      params,
    },
    {
      errorMessageMode: mode,
    },
  )

export const loginApi = (params: LoginParams, mode: ErrorMessageMode = 'message') =>
  defHttp.post<LoginResultModel>(
    {
      url: Api.Login,
      params,
    },
    {
      errorMessageMode: mode,
    },
  )

export const getUserInfoApi = () => defHttp.get<UserInfoModel>({ url: Api.GetUserInfo })

export const doLogout = () => defHttp.get({ url: Api.Logout })
