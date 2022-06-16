import type { BasicFetchResult, BasicPageParams } from '~/apis/model/baseModel'

export interface AuthorModel {
  id: string | number
  firstName: string
  lastName: string
  email: string
  primary: boolean
}

export interface StatusModel {
  title: 'First trial' | 'Reception' | 'Accepted' | 'Rejected' | 'Pay' | 'Finish'
  createdAt: string
  content: string
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

export type PreprintStrategy = 'all' | 'rejected' | 'accepted' | 'unfinished' | 'finished' | 'unreviewed' | 'reviewed'

export type PreprintParams = BasicPageParams & { strategy: PreprintStrategy }

export type GetPreprintListModel = BasicFetchResult<PreprintModel>
