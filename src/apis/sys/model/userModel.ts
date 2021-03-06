import type { BasicFetchResult, BasicPageParams } from '~/apis/model/baseModel'

/**
 * @description: Login interface parameters
 */
export interface LoginParams {
  username: string
  password: string
}

export interface RoleInfo {
  id: number
  title: string
  value: string
}

/**
 * @description: Login interface return value
 */
export interface LoginResultModel {
  id: string | number
  token: string
  role: RoleInfo
}

/**
 * @description: Get user information return value
 */
export interface UserInfoModel {
  roles: RoleInfo[]
  id: string | number
  username: string
  firstName: string
  lastName: string
  organization: string
  institute: string
  avatar: string
}

export type UsersStrategy = 'all' | 'author' | 'reviewer' | 'editor' | 'admin'

export type UsersPageParams = BasicPageParams & { strategy?: UsersStrategy; username?: string }

export type GetUsersModel = BasicFetchResult<UserInfoModel>

