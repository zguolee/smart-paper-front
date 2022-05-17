import { acceptHMRUpdate, defineStore } from 'pinia'
import type { UserInfo } from './types'
import type { RoleEnum } from '~/enums/roleEnum'
import { getAuthCache, setAuthCache } from '~/utils/auth'
import { ROLES_KEY, TOKEN_KEY, USER_INFO_KEY } from '~/enums/cacheEnum'
import { PageEnum } from '~/enums/pageEnum'
import type { GetUserInfoModel, LoginParams } from '~/apis/sys/model/userModel'
import type { ErrorMessageMode } from '~/utils/http/types'
import { getUserInfoApi, loginApi } from '~/apis/sys/user'

export const useUserStore = defineStore('user', () => {
  const router = useRouter()

  const userInfo = ref<Nullable<UserInfo>>(null)
  const userToken = ref<string | undefined>()
  const userRoleList = ref<RoleEnum[]>([])
  const sessionTimeout = ref(false)

  const getUserInfo = (): UserInfo => userInfo.value || getAuthCache<UserInfo>(USER_INFO_KEY) || {}

  const getUserToken = (): string => userToken.value || getAuthCache<string>(TOKEN_KEY)

  const getUserRoleList = (): RoleEnum[] =>
    userRoleList.value.length ? userRoleList.value : getAuthCache<RoleEnum[]>(ROLES_KEY)

  const setUserInfo = (info: UserInfo) => {
    userInfo.value = info
    setAuthCache(USER_INFO_KEY, info)
  }

  const setUserToken = (token: string | undefined) => {
    userToken.value = token
    setAuthCache(TOKEN_KEY, token)
  }

  const setUserRoleList = (roleList: RoleEnum[]) => {
    userRoleList.value = roleList
    setAuthCache(ROLES_KEY, roleList)
  }
  const setSessionTimeout = (flag: boolean) => {
    sessionTimeout.value = flag
  }

  const resetState = () => {
    userInfo.value = null
    userToken.value = ''
    userRoleList.value = []
    sessionTimeout.value = false
  }

  const getUserInfoAction = async () => {
    const userInfo = await getUserInfoApi()
    const { roles } = userInfo
    const roleList = roles.map(item => item.value) as RoleEnum[]
    setUserInfo(userInfo)
    setUserRoleList(roleList)
    return userInfo
  }

  const login = async (params: LoginParams & { goHome?: boolean; mode?: ErrorMessageMode }): Promise<GetUserInfoModel | null> => {
    try {
      const { goHome = true, mode, ...loginParams } = params
      const data = await loginApi(loginParams, mode)
      const { token } = data
      // save token
      setUserToken(token)
      // get user info
      const userInfo = await getUserInfoAction()
      const sessionTimeoutTemp = sessionTimeout.value
      sessionTimeoutTemp && setSessionTimeout(false)
      !sessionTimeoutTemp && goHome && router.replace(PageEnum.BASE_PROFILE)
      return userInfo
    }
    catch (error) {
      return Promise.reject(error)
    }
  }

  const logout = (goLogin = false) => {
    goLogin && router.push(PageEnum.BASE_LOGIN)
  }

  return {
    getUserInfo,
    getUserToken,
    getUserRoleList,
    setUserInfo,
    setUserToken,
    setUserRoleList,
    setSessionTimeout,
    resetState,
    login,
    logout,
  }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot))
