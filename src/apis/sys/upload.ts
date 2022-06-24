import type { UploadApiResult } from './model/uploadModel'
import { defHttp } from '~/utils/http'
import type { UploadFileParams } from '~/utils/http/types'

const uploadUrl = 'http://121.41.227.161:18080/api/upload'

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
