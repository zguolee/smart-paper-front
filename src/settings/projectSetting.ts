import type { ProjectConfig } from '~/config'
import { CacheTypeEnum } from '~/enums/cacheEnum'
import { PermissionModeEnum, SessionTimeoutProcessingEnum } from '~/enums/appEnum'

// ! You need to clear the browser cache after the change
const setting: ProjectConfig = {

  // Permission mode
  permissionMode: PermissionModeEnum.ROUTE_MAPPING,

  // Permission-related cache is stored in sessionStorage or localStorage
  permissionCacheType: CacheTypeEnum.LOCAL,

  // Session timeout processing
  sessionTimeoutProcessing: SessionTimeoutProcessingEnum.ROUTE_JUMP,

  // Whether to enable KeepAlive cache is best to close during development, otherwise the cache needs to be cleared every time
  openKeepAlive: true,

  // Use error-handler-plugin
  useErrorHandle: false,

  // Whether to delete unclosed messages and notify when switching the interface
  closeMessageOnSwitch: true,

  // Whether to cancel the http request that has been sent but not responded when switching the interface.
  // If it is enabled, I want to overwrite a single interface. Can be set in a separate interface
  removeAllHttpPending: false,
}

export default setting
