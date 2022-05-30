import type { GetPreprintListModel, PreprintParams } from './model/preprintModel'
// import type { ErrorMessageMode } from '~/utils/http/types'
import { defHttp } from '~/utils/http'

enum Api {
  Preprints = '/preprints',
}

export function getPreprintListApi(params: PreprintParams) {
  return defHttp.get<GetPreprintListModel>({
    url: Api.Preprints,
    params,
  })
}
