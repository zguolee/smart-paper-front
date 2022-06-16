import type { UploadApiResult } from './model/uploadModel'
import { defHttp } from '~/utils/http'
import type { UploadFileParams } from '~/utils/http/types'

const uploadUrl = '/upload'

/**
 * @description: Upload interface
 */
export function uploadApi(
  params: UploadFileParams,
  onUploadProgress: (progressEvent: ProgressEvent) => void,
) {
  return defHttp.uploadFile<UploadApiResult>(
    {
      url: uploadUrl,
      onUploadProgress,
    },
    params,
  )
}
