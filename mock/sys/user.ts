import type { MockMethod } from 'vite-plugin-mock'
import type { RequestParams } from '../_util'
import { getRequestToken, resultError, resultPageSuccess, resultSuccess } from '../_util'
import type { UsersPageParams } from '~/apis/sys/model/userModel'

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
          title: 'Admin',
          value: 'admin',
        },
        {
          title: 'Author',
          value: 'author',
        },
        {
          title: 'Editor',
          value: 'editor',
        },
        {
          title: 'Reviewer',
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
          title: 'Tester',
          value: 'test',
        },
      ],
    },
  ]
}

export const fakeUserList = createFakeUserList() as any[]

export default [
  {
    url: '/api/user/register',
    timeout: 200,
    method: 'post',
    response: ({ body }: { body: { username: string; password: string } }) => {
      const { username } = body
      const checkUser = fakeUserList.find(item => item.username === username)
      if (!checkUser) {
        fakeUserList.push({
          id: `${fakeUserList.length + 1}`,
          username,
          password: body.password,
        })
        return resultSuccess(fakeUserList[fakeUserList.length - 1])
      }

      return resultError('User already exists!')
    },
  },
  {
    url: '/api/user/login',
    timeout: 200,
    method: 'post',
    response: ({ body }: { body: { username: string; password: string } }) => {
      const { username, password } = body
      const checkUser = fakeUserList.find(
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
    url: '/api/logout',
    timeout: 200,
    method: 'get',
    response: (request: RequestParams) => {
      const token = getRequestToken(request)
      if (!token)
        return resultError('Invalid token')
      const checkUser = fakeUserList.find(item => item.token === token.split(' ')[1])
      if (!checkUser)
        return resultError('Invalid token!')

      return resultSuccess(undefined, { message: 'Token has been destroyed' })
    },
  },
  {
    url: '/api/user',
    method: 'get',
    response: (request: RequestParams) => {
      const token = getRequestToken(request)
      if (!token)
        return resultError('Invalid token')
      const checkUser = fakeUserList.find(item => item.token === token.split(' ')[1])
      if (!checkUser)
        return resultError('The corresponding user information was not obtained!')

      return resultSuccess(checkUser)
    },
  },
  {
    url: '/api/user/:id',
    method: 'put',
    response: (request: RequestParams) => {
      const token = getRequestToken(request)
      if (!token)
        return resultError('Invalid token')
      const checkUser = fakeUserList.find(item => item.token === token.split(' ')[1])
      if (!checkUser)
        return resultError('The corresponding user information was not obtained!')
      Object.assign(checkUser, request.body)
      return resultSuccess(checkUser)
    },
  },
  {
    url: '/api/users',
    method: 'get',
    response: (request: RequestParams) => {
      const token = getRequestToken(request)
      if (!token)
        return resultError('Invalid token')
      const { page = 1, pageSize = 5 } = request.query as UsersPageParams
      return resultPageSuccess(page, pageSize, fakeUserList || [])
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
