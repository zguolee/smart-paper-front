import type { GetPreprintListModel, PreprintModel, PreprintParams } from './model/preprintModel'
import { defHttp } from '~/utils/http'

enum Api {
  Preprints = '/preprints',
}

export const getPreprintListApi = (params: PreprintParams) => defHttp.get<GetPreprintListModel>({
  url: Api.Preprints,
  params,
})

export const getPreprintDetailApi = (id: string) => defHttp.get<PreprintModel>({ url: `${Api.Preprints}/${id}` })

