import type { MockMethod } from 'vite-plugin-mock'
import type { RequestParams } from '../_util'
import { getRequestToken, resultError, resultSuccess } from '../_util'

export function createFakeUserList() {
  return [
    {
      id: '1',
      username: 'admin@mail.com',
      firstName: 'Admin',
      lastName: 'Lee',
      avatar: 'https://avatars.githubusercontent.com/u/40738594?s=40&v=4',
      desc: 'manager',
      password: '123456',
      token: 'fakeToken1',
      roles: [
        {
          roleName: 'Admin',
          value: 'admin',
        },
        {
          roleName: 'Author',
          value: 'author',
        },
        {
          roleName: 'Editor',
          value: 'editor',
        },
        {
          roleName: 'Reviewer',
          value: 'reviewer',
        },
      ],
    },
    {
      id: '2',
      username: 'example@mail.com',
      firstName: 'Example',
      lastName: 'Lee',
      password: '123456',
      realName: 'test user',
      avatar: 'https://q1.qlogo.cn/g?b=qq&nk=339449197&s=640',
      desc: 'tester',
      token: 'fakeToken2',
      roles: [
        {
          roleName: 'Tester',
          value: 'test',
        },
      ],
    },
  ]
}

const fakeCodeList: any = {
  1: ['1000', '3000', '5000'],

  2: ['2000', '4000', '6000'],
}

export default [
  {
    url: '/api/register',
    timeout: 200,
    method: 'post',
    response: ({ body }: { body: { username: string; password: string } }) => {
      const { username } = body
      const checkUser = createFakeUserList().find(
        item => item.username === username,
      )
      if (!checkUser) {
        return resultSuccess({
          username,
        })
      }

      return resultError('User already exists!')
    },
  },
  {
    url: '/api/login',
    timeout: 200,
    method: 'post',
    response: ({ body }: { body: { username: string; password: string } }) => {
      const { username, password } = body
      const checkUser = createFakeUserList().find(
        item => item.username === username && password === item.password,
      )
      if (!checkUser)
        return resultError('Incorrect account or password!')

      const { id, username: _username, token, realName, desc, roles } = checkUser
      return resultSuccess({
        roles,
        id,
        username: _username,
        token,
        realName,
        desc,
      })
    },
  },
  {
    url: '/api/users',
    method: 'get',
    response: (request: RequestParams) => {
      const token = getRequestToken(request)
      if (!token)
        return resultError('Invalid token')
      const checkUser = createFakeUserList().find(item => item.token === token)
      if (!checkUser)
        return resultError('The corresponding user information was not obtained!')

      return resultSuccess(checkUser)
    },
  },
  {
    url: '/api/getPermCode',
    timeout: 200,
    method: 'get',
    response: (request: RequestParams) => {
      const token = getRequestToken(request)
      if (!token)
        return resultError('Invalid token')
      const checkUser = createFakeUserList().find(item => item.token === token)
      if (!checkUser)
        return resultError('Invalid token!')

      const codeList = fakeCodeList[checkUser.id]

      return resultSuccess(codeList)
    },
  },
  {
    url: '/api/logout',
    timeout: 200,
    method: 'get',
    response: (request: RequestParams) => {
      const token = getRequestToken(request)
      if (!token)
        return resultError('Invalid token')
      const checkUser = createFakeUserList().find(item => item.token === token)
      if (!checkUser)
        return resultError('Invalid token!')

      return resultSuccess(undefined, { message: 'Token has been destroyed' })
    },
  },
  {
    url: '/basic-api/testRetry',
    statusCode: 405,
    method: 'get',
    response: () => {
      return resultError('Error!')
    },
  },
] as MockMethod[]
