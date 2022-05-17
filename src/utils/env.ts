import pkg from '../../package.json'
import type { GlobEnvConfig } from '~/config'

export function getCommonStoragePrefix() {
  const { VITE_APP_SHORT_NAME } = getAppEnvConfig()
  return `${VITE_APP_SHORT_NAME}__${getEnv()}`.toUpperCase()
}

export function getAppEnvConfig() {
  const ENV = import.meta.env as unknown as GlobEnvConfig

  const {
    VITE_APP_TITLE,
    VITE_API_URL,
    VITE_APP_SHORT_NAME,
    VITE_API_URL_PREFIX,
    VITE_UPLOAD_URL,
  } = ENV

  if (!/^[a-zA-Z\_]*$/.test(ENV.VITE_APP_SHORT_NAME))
    console.warn('VITE_GLOB_APP_SHORT_NAME Variables can only be characters/underscores, please modify in the environment variables and re-running.')

  return {
    VITE_APP_TITLE,
    VITE_API_URL,
    VITE_APP_SHORT_NAME,
    VITE_API_URL_PREFIX,
    VITE_UPLOAD_URL,
  }
}

// Generate cache key according to version
export function getStorageShortName() {
  return `${getCommonStoragePrefix()}${`__${pkg.version}`}__`.toUpperCase()
}

/**
 * @description: Development model
 */
export const devMode = 'development'

/**
 * @description: Production mode
 */
export const prodMode = 'production'

/**
 * @description: Get environment variables
 * @returns:
 * @example:
 */
export function getEnv(): string {
  return import.meta.env.MODE
}

/**
 * @description: Is it a development mode
 * @returns:
 * @example:
 */
export function isDevMode(): boolean {
  return import.meta.env.DEV
}

/**
 * @description: Is it a production mode
 * @returns:
 * @example:
 */
export function isProdMode(): boolean {
  return import.meta.env.PROD
}