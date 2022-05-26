import type { MockMethod } from 'vite-plugin-mock'
import type { RequestParams } from '../_util'
import { getRequestToken, resultError, resultSuccess } from '../_util'

export function createFakePreprintList() {
  return [
    {
      id: '1',
      title: 'Here is the title',
      abstract: 'Here is the abstract. Here is the abstract. Here is the abstract. Here is the abstract. Here is the abstract.',
      authors: [
        {
          id: '1',
          name: 'Author 1',
          primary: true,
        },
        {
          id: '2',
          name: 'Author 2',
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
      createTime: '2020-01-01',
      updateTime: '2020-01-02',
    },
  ]
}

export default [
  {
    url: '/api/preprints',
    method: 'get',
    response: (request: RequestParams) => {
      const token = getRequestToken(request)
      if (!token)
        return resultError('Invalid token')
      const preprintList = createFakePreprintList()
      return resultSuccess(preprintList || [])
    },
  },
] as MockMethod[]
