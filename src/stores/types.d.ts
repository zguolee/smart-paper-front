import type { RoleInfo } from '~/api/sys/model/userModel'

export interface UserInfo {
  userId: string | number
  username: string
  realName: string
  roles: RoleInfo[]
  avatar?: string
  roles: RoleInfo[]
}
