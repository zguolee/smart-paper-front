import type { BasicKeys } from '~/utils/cache/persistent'
import { CacheTypeEnum, TOKEN_KEY } from '~/enums/cacheEnum'
import { Persistent } from '~/utils/cache/persistent'
import projectSetting from '~/settings/projectSetting'

const { permissionCacheType } = projectSetting
const isLocal = permissionCacheType === CacheTypeEnum.LOCAL

export function getAuthCache<T>(key: BasicKeys) {
  const fn = isLocal ? Persistent.getLocal : Persistent.getSession
  return fn(key) as T
}

export function setAuthCache(key: BasicKeys, value: any) {
  const fn = isLocal ? Persistent.setLocal : Persistent.setSession
  return fn(key, value, true)
}

export function getToken() {
  return getAuthCache(TOKEN_KEY)
}
