import { useMessage } from 'naive-ui'
import type { ErrorMessageMode } from './types'
import { useUserStore } from '~/stores/user'
import { SessionTimeoutProcessingEnum } from '~/enums/appEnum'
import projectSetting from '~/settings/projectSetting'
const createMessage = useMessage()

const stp = projectSetting.sessionTimeoutProcessing

export function checkStatus(
  status: number,
  msg: string,
  errorMessageMode: ErrorMessageMode = 'message',
): void {
  const userStore = useUserStore()
  let errorMessage = ''

  switch (status) {
    case 400:
      errorMessage = `${msg}`
      break
    // 401: Not logged in
    // Jump to the login page if not logged in, and carry the path of the current page
    // Return to the current page after successful login. This step needs to be operated on the login page.
    case 401:
      errorMessage = '用户没有权限（令牌、用户名、密码错误）!'
      if (stp === SessionTimeoutProcessingEnum.PAGE_COVERAGE) {
        userStore.setUserToken(undefined)
        userStore.setSessionTimeout(true)
      }
      else {
        // userStore.logout(true)
      }
      break
    case 403:
      errorMessage = '用户得到授权，但是访问是被禁止的。!'
      break
    // 404请求不存在
    case 404:
      errorMessage = '网络请求错误,未找到该资源!'
      break
    case 405:
      errorMessage = '网络请求错误,请求方法未允许!'
      break
    case 408:
      errorMessage = '网络请求超时!'
      break
    case 500:
      errorMessage = '服务器错误,请联系管理员!'
      break
    case 501:
      errorMessage = '网络未实现!'
      break
    case 502:
      errorMessage = '网络错误!'
      break
    case 503:
      errorMessage = '服务不可用，服务器暂时过载或维护!'
      break
    case 504:
      errorMessage = '网络超时!'
      break
    case 505:
      errorMessage = 'http版本不支持该请求!'
      break
    default:
  }

  if (errorMessage) {
    if (errorMessageMode === 'modal')
      console.error({ title: '错误提示', message: errorMessage })

    else if (errorMessageMode === 'message')
      createMessage.error(errorMessage)
  }
}
