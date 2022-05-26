import type { GetPreprintListModel } from './model/preprintModel'
// import type { ErrorMessageMode } from '~/utils/http/types'
import { defHttp } from '~/utils/http'

enum Api {
  Preprints = '/preprints',
}

export function getPreprintListApi() {
  return defHttp.get<GetPreprintListModel>({ url: Api.Preprints })
}
