/**
 * @description: Login interface parameters
 */
export interface LoginParams {
  username: string
  password: string
}

export interface RoleInfo {
  roleName: string
  value: string
}

/**
 * @description: Login interface return value
 */
export interface LoginResultModel {
  userId: string | number
  token: string
  role: RoleInfo
}

/**
 * @description: Get user information return value
 */
export interface UserInfoModel {
  roles: RoleInfo[]
  userId: string | number
  username: string
  firstName: string
  lastName: string
  email: string
  organization?: string
  institute?: string
  avatar?: string
}
