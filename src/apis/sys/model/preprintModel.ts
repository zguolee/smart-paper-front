import type { BasicFetchResult, BasicPageParams } from '~/apis/model/baseModel'

export interface AuthorModel {
  id: string | number
  firstName: string
  lastName: string
  username: string
  primary: boolean
}

export interface StatusModel {
  title: 'First trial' | 'Reception' | 'Accepted' | 'Rejected' | 'Pay' | 'Finish'
  createdAt: string
  content: string
}

export interface CommentModel {
  opinion: 'Strong Accept' | 'Accept' | 'Weak Accept' | 'Reject' | 'Weak Reject' | 'Strong Reject'
  content: string
  date: string
  reviewer: AuthorModel
  createdAt: string
}

export interface PreprintModel {
  id?: string | number
  title: string
  abstract: string
  keywords: string
  creator: AuthorModel
  authors: string
  createdAt?: string
  updatedAt?: string
  status: ''
  statusProgresses?: StatusModel[]
  pdfUrl: string
  sourceUrl: string
  comments: CommentModel[]
  reviewers: AuthorModel[]
}

export type PreprintParams = BasicPageParams

export type GetPreprintListModel = BasicFetchResult<PreprintModel>
