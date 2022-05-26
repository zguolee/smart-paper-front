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

export interface GetPreprintListModel {
  id: string | number
  title: string
  abstract: string
  authors: AuthorModel[]
  journal: JournalModel[]
  createTime: string
  updateTime: string
  state?: 'First trial' | 'Reception' | 'Accepted' | 'Rejected' | 'Pay' | 'Finish'
}
