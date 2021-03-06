import type { MockMethod } from 'vite-plugin-mock'
import type { RequestParams } from '../_util'
import { getRequestToken, resultError, resultPageSuccess, resultSuccess } from '../_util'
import { fakeUserList } from './user'
import type { AuthorModel, PreprintModel, PreprintParams, StatusModel } from '~/apis/sys/model/preprintModel'
import type { UserInfoModel } from '~/apis/sys/model/userModel'

const createstatusProgresses = (): StatusModel[] => {
  const firstStatus: StatusModel = { title: 'First trial', createdAt: '2020-01-01', content: '' }
  const receptionStatus: StatusModel = { title: 'Reception', createdAt: '2020-01-02', content: '' }
  const acceptedStatus: StatusModel = { title: 'Accepted', createdAt: '2020-01-03', content: 'Check email for more information.' }
  const rejectedStatus: StatusModel = { title: 'Rejected', createdAt: '2020-01-03', content: 'Check email for more information.' }
  const payStatus: StatusModel = { title: 'Pay', createdAt: '2020-01-04', content: 'You have paid.' }
  const finishStatus: StatusModel = { title: 'Finish', createdAt: '2020-01-05', content: '' }

  return [[firstStatus],
    [firstStatus, receptionStatus],
    [firstStatus, receptionStatus, acceptedStatus],
    [firstStatus, receptionStatus, rejectedStatus],
    [firstStatus, receptionStatus, acceptedStatus, payStatus],
    [firstStatus, receptionStatus, acceptedStatus, payStatus, finishStatus]][Math.floor(Math.random() * 6)]
}

export function createFakePreprintList() {
  return Array.from({ length: Math.floor(Math.random() * 50) + 20 },
    (_, i) => {
      return {
        id: (i + 1).toString(),
        title: `Here is the title${(i + 1)}`,
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
        ] as AuthorModel[],
        keywords: ['keyword1', 'keyword2'],
        statusProgresses: createstatusProgresses(),
        createdAt: ['2020-01-05', '2020-01-06'][Math.floor(Math.random() * 2)],
        upcreatedAtdAt: ['2020-01-05', '2020-01-06'][Math.floor(Math.random() * 2)],
        reviewers: Array.from(
          { length: Math.floor(Math.random() * 3) },
          (_, i) => {
            return {
              id: '1',
              firstName: `Neil${i + 1}`,
              lastName: 'Lee',
              email: 'example@mail.com',
            }
          }),
        contents: [
          {
            opinion: 'Strong Accept',
            content: 'Here is the content.'.repeat(Math.floor(Math.random() * 10) + 1),
            createdAt: '2020-01-05',
            reviewer: {
              id: ['1', '2', '3'][Math.floor(Math.random() * 2)],
              firstName: 'Neil',
              lastName: 'Lee',
              email: '',
            },
          },
        ],
      } as unknown as PreprintModel
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
      const { page = 1, pageSize = 5, strategy = 'all' } = request.query as PreprintParams
      const resPreprintList = preprintList.filter((preprint) => {
        if (strategy === 'all')
          return true

        if (strategy === 'unfinished')
          return (preprint.statusProgresses?.length || 3) <= 2

        if (strategy === 'finished')
          return (preprint.statusProgresses?.length || 0) > 2

        if (strategy === 'reviewed') {
          const checkUser = fakeUserList.find(item => item.token === token.split(' ')[1]) as unknown as UserInfoModel
          return preprint.contents?.some(content => content.reviewer.id.toString() === checkUser.id)
        }

        if (strategy === 'unreviewed') {
          const checkUser = fakeUserList.find(item => item.token === token.split(' ')[1]) as unknown as UserInfoModel
          return !preprint.contents?.some(content => content.reviewer.id.toString() === checkUser.id)
        }

        return preprint.statusProgresses?.some(status => status.title.toLowerCase() === strategy.toLowerCase())
      })
      return resultPageSuccess(page, pageSize, resPreprintList || [])
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
  {
    url: '/api/preprints/:id/review',
    method: 'post',
    response: (request: RequestParams) => {
      const token = getRequestToken(request)
      if (!token)
        return resultError('Invalid token')
      const { id = 1 } = request.query as { id: number }
      const preprint = preprintList.find((preprint) => { return preprint.id === id.toString() })
      if (!preprint)
        return resultError('Preprint not found')
      const { body } = request
      const { opinion, content } = body as { opinion: any; content: string }
      preprint.contents.push({
        opinion,
        content,
        createdAt: new createdAt().toISOString(),
        reviewer: {
          id: fakeUserList.find(item => item.token === token.split(' ')[1])?.id as string,
          firstName: 'Neil',
          lastName: 'Lee',
          email: '',
        } as any,
      })
      return resultSuccess(preprint)
    },
  },
] as MockMethod[]
