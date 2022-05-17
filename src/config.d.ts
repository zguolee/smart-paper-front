export interface ProjectConfig {
  // Storage location of permission related information
  permissionCacheType: CacheTypeEnum
  // Permission mode
  permissionMode: PermissionModeEnum
  // Session timeout processing
  sessionTimeoutProcessing: SessionTimeoutProcessingEnum
  // pageLayout whether to enable keep-alive
  openKeepAlive: boolean
  // Use error-handler-plugin
  useErrorHandle: boolean
  // Whether to delete unclosed messages and notify when switching the interface
  closeMessageOnSwitch: boolean
  // Whether to cancel the http request that has been sent but not responded when switching the interface.
  removeAllHttpPending: boolean
}

export interface GlobEnvConfig {
  // Site title
  VITE_APP_TITLE: string
  // Service interface url
  VITE_API_URL: string
  // Service interface url prefix
  VITE_API_URL_PREFIX?: string
  // Project abbreviation
  VITE_APP_SHORT_NAME: string
  // Upload url
  VITE_UPLOAD_URL?: string
}

