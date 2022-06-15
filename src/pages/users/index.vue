<script setup lang="ts">
import type { FormInst } from 'naive-ui'
import { useMessage } from 'naive-ui'
import { getUsersApi, updateUserInfoApi } from '~/apis/sys/user'
import type { UserInfoModel, UsersStrategy } from '~/apis/sys/model/userModel'

const { t } = useI18n()
const message = useMessage()

const checkStrategy = ref<UsersStrategy>('all')

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
  strategy: UsersStrategy,
) => {
  const res = await getUsersApi({ page, pageSize, strategy })
  usersResult.value = res
}

const reload = () => getUsersList(paginationState.value.page, paginationState.value.pageSize, checkStrategy.value)

reload()

watch(checkStrategy, (strategy) => {
  paginationState.value.page = 1
  reload()
})

const handleUsersList = (page: number) => {
  paginationState.value.page = page
  getUsersList(paginationState.value.page, paginationState.value.pageSize, checkStrategy.value)
}

const showDrawer = ref(false)
const formRef = ref<FormInst | null>(null)
const formValue = ref({
  username: '',
  firstName: '',
  lastName: '',
  organization: '',
  institute: '',
  roles: [] as string[],
})

const rolesOptions = [
  { label: 'Author', value: 'author' },
  { label: 'Editor', value: 'editor' },
  { label: 'Reviewer', value: 'reviewer' },
  { label: 'Admin', value: 'admin' },
]

const editUserId = ref<string | number>(0)

const handleShowEditDrawer = (userInfo: UserInfoModel) => {
  editUserId.value = userInfo.id
  formValue.value = {
    username: userInfo.username,
    firstName: userInfo.firstName,
    lastName: userInfo.lastName,
    organization: userInfo.organization,
    institute: userInfo.institute,
    roles: userInfo.roles.map(role => role.value),
  }
  showDrawer.value = true
}

const handleSubmit = (e: MouseEvent) => {
  e.preventDefault()
  formRef.value?.validate(async (errors) => {
    if (!errors) {
      formValue.value.roles = formValue.value.roles.map(role => ({ title: role[0].toUpperCase() + role.slice(1), value: role })) as []
      const res = await updateUserInfoApi(editUserId.value, formValue.value)
      if (res.id) {
        message.success(t('users.index.update.success'))
        reload()
        showDrawer.value = false
      }
      else {
        message.error(t('users.index.update.failure'))
      }
    }
  })
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
      <n-table class="mt-4 text-center" :single-line="false">
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
            <td>{{ _userIdx + 1 }}</td>
            <td>{{ `${user.firstName} ${user.lastName}` }}</td>
            <td>{{ user.username }}</td>
            <td>{{ user.organization }}</td>
            <td>{{ user.institute }}</td>
            <td>
              <div flex="~ gap-2" items-center justify-start>
                <template v-for="role, _idx of user.roles" :key="_idx">
                  <n-tag type="success">
                    {{ role.title }}
                  </n-tag>
                </template>
              </div>
            </td>
            <td>
              <NButton size="small" type="primary" dashed @click="handleShowEditDrawer(user)">
                Edit
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
    <n-drawer v-model:show="showDrawer" :width="502">
      <n-drawer-content :title="t('users.index.update.user_info')" closable>
        <n-form ref="formRef" :model="formValue">
          <n-form-item
            label="Username(Email)" path="username"
            :rule="{ required: true, message: 'Please input email', trigger: ['input', 'blur'] }"
          >
            <n-input v-model:value="formValue.username" placeholder="Please input Username" />
          </n-form-item>
          <n-form-item
            label="First Name" path="firstName"
            :rule="{ required: true, message: 'Please input first name', trigger: ['input', 'blur'] }"
          >
            <n-input v-model:value="formValue.firstName" placeholder="Please input First Name" />
          </n-form-item>
          <n-form-item
            label="Last Name" path="lastName"
            :rule="{ required: true, message: 'Please input last name', trigger: ['input', 'blur'] }"
          >
            <n-input v-model:value="formValue.lastName" placeholder="Please input Last Name" />
          </n-form-item>
          <n-form-item
            label="Organization" path="organization"
            :rule="{ required: true, message: 'Please input organization', trigger: ['input', 'blur'] }"
          >
            <n-input v-model:value="formValue.organization" placeholder="Please input Organization" />
          </n-form-item>
          <n-form-item
            label="Institute" path="institute"
            :rule="{ required: true, message: 'Please input institute', trigger: ['input', 'blur'] }"
          >
            <n-input v-model:value="formValue.institute" placeholder="Please input Institute" />
          </n-form-item>
          <n-form-item label="Roles" path="roles" placeholder="Please select roles">
            <n-select v-model:value="formValue.roles" multiple :options="rolesOptions" />
          </n-form-item>

          <n-button block type="primary" @click="handleSubmit">
            Save
          </n-button>
        </n-form>
      </n-drawer-content>
    </n-drawer>
  </div>
</template>

<route lang="yaml">
meta:
  layout: dashboard
</route>
