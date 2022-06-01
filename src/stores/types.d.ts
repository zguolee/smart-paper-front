import type { RoleInfo } from '~/api/sys/model/userModel'

export interface UserInfo {
  userId: string | number
  username: string
  firstName: string
  lastName: string
  organization?: string
  institute?: string
  roles: RoleInfo[]
  avatar?: string
  roles: RoleInfo[]
}
