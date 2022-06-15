import type {
  GetUsersModel,
  LoginParams,
  LoginResultModel,
  UserInfoModel,
  UsersPageParams,
} from './model/userModel'
import type { ErrorMessageMode } from '~/utils/http/types'
import { defHttp } from '~/utils/http'

enum Api {
  Login = '/user/login',
  Register = '/user/register',
  Logout = '/logout',
  UserInfo = '/user',
  Users = '/users',
}

export const registerApi = (params: LoginParams, mode: ErrorMessageMode = 'message') =>
  defHttp.post({ url: Api.Register, params }, { errorMessageMode: mode })

export const loginApi = (params: LoginParams, mode: ErrorMessageMode = 'message') =>
  defHttp.post<LoginResultModel>({ url: Api.Login, params }, { errorMessageMode: mode })

export const doLogout = () => defHttp.get({ url: Api.Logout })

export const getUserInfoApi = () => defHttp.get<UserInfoModel>({ url: Api.UserInfo })

export const updateUserInfoApi = (id: string | number, params: any) =>
  defHttp.put<UserInfoModel>({ url: `${Api.UserInfo}/${id}`, params })

export const getUsersApi = (params: UsersPageParams) =>
  defHttp.get<GetUsersModel>({ url: Api.Users, params })

