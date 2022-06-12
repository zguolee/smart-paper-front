import type { BasicFetchResult, BasicPageParams } from '~/apis/model/baseModel'

export interface AuthorModel {
  id: string | number
  firstName: string
  lastName: string
  email: string
  primary: boolean
}

export interface JournalModel {
  id: string | number
  name: string
  language: string
  url: string
  year: string
  submitStartDate: string
  submitEndDate: string
  publishDate: string
}

export interface StatusModel {
  title: 'First trial' | 'Reception' | 'Accepted' | 'Rejected' | 'Pay' | 'Finish'
  date: string
  comment: string
}

export interface CommentModel {
  opinion: 'Strong Accept' | 'Accept' | 'Weak Accept' | 'Reject' | 'Weak Reject' | 'Strong Reject'
  comment: string
  date?: string
  author?: AuthorModel
}

export interface PreprintModel {
  id?: string | number
  title: string
  abstract: string
  keywords: string[]
  authors: AuthorModel[]
  journal: JournalModel
  createTime?: string
  updateTime?: string
  status?: ''
  statusProgress?: StatusModel[]
  pdfUrl?: string
  sourceUrl?: string
  comments?: CommentModel[]
}

export type PreprintParams = BasicPageParams & { strategy: 'all' | 'rejected' | 'accepted' | 'unfinished' | 'finished' }

export type GetPreprintListModel = BasicFetchResult<PreprintModel>
