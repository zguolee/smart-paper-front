import type { MockMethod } from 'vite-plugin-mock'
import type { RequestParams } from '../_util'
import { getRequestToken, resultError, resultPageSuccess, resultSuccess } from '../_util'
import type { PreprintModel } from '~/apis/sys/model/preprintModel'

export function createFakePreprintList() {
  return Array.from({ length: Math.floor(Math.random() * 50) + 1 },
    (_, i) => {
      return {
        id: (i + 1).toString(),
        title: 'Here is the title',
        abstract: 'Here is the abstract.'.repeat(Math.floor(Math.random() * 10) + 1),
        authors: [
          {
            id: '1',
            firstName: 'Neil',
            lastName: 'Lee',
            email: 'example@mail.com',
            primary: true,
          },
          {
            id: '2',
            firstName: 'Neil',
            lastName: 'Lee',
            email: 'example@mail.com',
            primary: false,
          },
        ],
        journal: {
          id: '1',
          name: 'Journal 1',
          issn: '12345678',
          eissn: '12345678',
          publisher: 'Publisher 1',
          country: 'China',
          language: 'Chinese',
          url: 'http://www.journal1.com',
          year: '2020',
        },
        keywords: ['keyword1', 'keyword2'],
        status: ['Saved', 'First trial', 'Reception', 'Accepted', 'Rejected', 'Pay', 'Finish'][Math.floor(Math.random() * 6)],
        createTime: '2020-01-01',
        updateTime: '2020-01-02',
      }
    },
  )
}

const preprintList = createFakePreprintList()

export default [
  {
    url: '/api/preprints',
    method: 'get',
    response: (request: RequestParams) => {
      const token = getRequestToken(request)
      if (!token)
        return resultError('Invalid token')
      const { page = 1, pageSize = 5, strategy = 'all' } = request.query as { page: number; pageSize: number; strategy: 'all' | 'not_submitted' | 'submitted' }
      const resPreprintList = preprintList.filter((preprint) => {
        if (strategy === 'all')
          return true
        if (strategy === 'not_submitted')
          return preprint.status === 'Saved'
        if (strategy === 'submitted')
          return preprint.status !== 'Saved'
        return false
      })
      return resultPageSuccess(page, pageSize, resPreprintList || [])
    },
  },
  {
    url: '/api/preprints/:id',
    method: 'get',
    response: (request: RequestParams) => {
      const token = getRequestToken(request)
      if (!token)
        return resultError('Invalid token')
      const { id = 1 } = request.query as { id: number }
      const checkPreprint = preprintList.find((preprint) => { return preprint.id === id.toString() })
      return resultSuccess(checkPreprint)
    },
  },
  {
    url: '/api/preprints',
    method: 'post',
    response: (request: RequestParams) => {
      const token = getRequestToken(request)
      if (!token)
        return resultError('Invalid token')
      const { body } = request
      const preprint = body as PreprintModel
      preprint.id = (preprintList.length + 1).toString()
      preprintList.push(preprint as any)
      return resultSuccess(preprint)
    },
  },
  {
    url: '/api/preprints/:id',
    method: 'put',
    response: (request: RequestParams) => {
      const token = getRequestToken(request)
      if (!token)
        return resultError('Invalid token')
      const { id = 1 } = request.query as { id: number }
      const preprint = preprintList.find((preprint) => { return preprint.id === id.toString() })
      if (!preprint)
        return resultError('Preprint not found')
      const { body } = request
      Object.assign(preprint, body)
      return resultSuccess(preprint)
    },
  },
] as MockMethod[]
