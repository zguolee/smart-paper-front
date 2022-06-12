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
  date: string
  reviewer: AuthorModel
}

export interface PreprintModel {
  id?: string | number
  title: string
  abstract: string
  keywords: string[]
  creator?: AuthorModel
  authors: AuthorModel[]
  journal: JournalModel
  createTime?: string
  updateTime?: string
  status?: ''
  statusProgress?: StatusModel[]
  pdfUrl?: string
  sourceUrl?: string
  comments?: CommentModel[]
  reviewers?: AuthorModel[]
}

export interface StrategyParams {
  strategy: 'all' | 'rejected' | 'accepted' | 'unfinished' | 'finished' | 'unreviewed' | 'reviewed'
}

export type PreprintParams = BasicPageParams & StrategyParams

export type GetPreprintListModel = BasicFetchResult<PreprintModel>
