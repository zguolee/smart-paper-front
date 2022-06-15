<script setup lang="ts">
import { getUsersApi } from '~/apis/sys/user'
import type { UserInfoModel } from '~/apis/sys/model/userModel'

const { t } = useI18n()
const router = useRouter()

const checkStrategy = ref<'all' | 'accepted' | 'rejected'>('all')

const usersResult = ref<{
  items: UserInfoModel[]
  total: number
}>()

const paginationState = ref<{
  page: number
  pageSize: number
}>({
  page: 1,
  pageSize: 5,
})

const getUsersList = async (
  page: number,
  pageSize: number,
  strategy: 'all' | 'accepted' | 'rejected',
) => {
  const res = await getUsersApi({ page, pageSize })
  usersResult.value = res
}
getUsersList(paginationState.value.page, paginationState.value.pageSize, checkStrategy.value)

watch(checkStrategy, (strategy) => {
  paginationState.value.page = 1
  getUsersList(paginationState.value.page, paginationState.value.pageSize, strategy)
})

const handleUsersList = (page: number) => {
  paginationState.value.page = page
  getUsersList(paginationState.value.page, paginationState.value.pageSize, checkStrategy.value)
}
</script>

<template>
  <div>
    <div class="rounded-lg p-10 w-80%" bg="white dark:gray-700" m="t-10 auto">
      <div m="b-2" flex="~" justify="between" items="center">
        <n-h2>
          {{ t('users.index.user_list') }}
        </n-h2>
        <n-radio-group v-model:value="checkStrategy">
          <n-radio-button value="all">
            {{ t('users.index.actions.all') }}
          </n-radio-button>
          <n-radio-button value="author">
            {{ t('users.index.actions.author') }}
          </n-radio-button>
          <n-radio-button value="reviewer">
            {{ t('users.index.actions.reviewer') }}
          </n-radio-button>
          <n-radio-button value="editor">
            {{ t('users.index.actions.editor') }}
          </n-radio-button>
        </n-radio-group>
      </div>
      <n-table class="mt-4" :single-line="false">
        <thead>
          <tr>
            <th>ID</th>
            <th>{{ t('users.index.user.name') }}</th>
            <th>{{ t('users.index.user.email') }}</th>
            <th>{{ t('users.index.user.organization') }}</th>
            <th>{{ t('users.index.user.institute') }}</th>
            <th>{{ t('users.index.user.roles') }}</th>
            <th>{{ t('users.index.user.actions') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(user, _userIdx) of usersResult?.items" :key="_userIdx">
            <td>
              <n-tag type="primary" class="h-10 w-10" flex="~" items-center justify-center>
                {{ _userIdx + 1 }}
              </n-tag>
            </td>
            <td>{{ `${user.firstName} ${user.lastName}` }}</td>
            <td>{{ user.email }}</td>
            <td>{{ user.organization }}</td>
            <td>{{ user.institute }}</td>
            <td flex="~ gap-2" items-center justify-start>
              <template v-for="role, _idx of user.roles" :key="_idx">
                <n-tag type="success">
                  {{ role.roleName }}
                </n-tag>
              </template>
            </td>
            <td>
              <NButton size="small" type="primary" dashed>
                Detail
              </NButton>
            </td>
          </tr>
        </tbody>
      </n-table>
      <div class="mt-4" flex="~" justify="center">
        <n-pagination
          v-model:page="paginationState.page"
          :page-count="Math.floor((usersResult?.total || 0) / paginationState.pageSize) + 1"
          :on-update:page="handleUsersList"
        />
      </div>
    </div>
  </div>
</template>

<route lang="yaml">
meta:
  layout: dashboard
</route>
