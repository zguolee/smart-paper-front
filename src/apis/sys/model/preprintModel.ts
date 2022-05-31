import type { BasicFetchResult, BasicPageParams } from '~/apis/model/baseModel'

export interface AuthorModel {
  id: string | number
  name: string
  primary: boolean
}

export interface JournalModel {
  id: string | number
  name: string
  country: string
  language: string
  url: string
  year: string
}

export interface PreprintModel {
  id: string | number
  title: string
  abstract: string
  authors: AuthorModel[]
  journal: JournalModel
  createTime: string
  updateTime: string
  status?: 'First trial' | 'Reception' | 'Accepted' | 'Rejected' | 'Pay' | 'Finish'
}

export type PreprintParams = BasicPageParams & { strategy: 'all' | 'not_submitted' | 'submitted' }

export type GetPreprintListModel = BasicFetchResult<PreprintModel>
