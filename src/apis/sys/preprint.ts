import type { GetPreprintListModel, PreprintModel, PreprintParams } from './model/preprintModel'
import { defHttp } from '~/utils/http'

enum Api {
  Preprints = '/preprints',
}

export const getPreprintListApi = (params: PreprintParams) =>
  defHttp.get<GetPreprintListModel>({ url: Api.Preprints, params })

export const getPreprintDetailApi = (id: string) =>
  defHttp.get<PreprintModel>({ url: `${Api.Preprints}/${id}` })

export const createPreprintApi = (params: any) =>
  defHttp.post<PreprintModel>({ url: Api.Preprints, params })

export const updatePreprintApi = (id: string, params: any) =>
  defHttp.put<PreprintModel>({ url: `${Api.Preprints}/${id}`, params }, { errorMessageMode: 'message' })

export const reviewPreprintApi = (id: string, params: any) =>
  defHttp.put<PreprintModel>({ url: `${Api.Preprints}/${id}/comment`, params })

export const distributionPreprintApi = (id: string, params: any) =>
  defHttp.put<PreprintModel>({ url: `${Api.Preprints}/${id}/distribution`, params })

export const updatePreprintStatusApi = (id: string, params: any) =>
  defHttp.put<PreprintModel>({ url: `${Api.Preprints}/${id}/status`, params })

