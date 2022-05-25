<script setup lang="ts">
import type { FormInst, FormRules } from 'naive-ui'
import { useMessage, useNotification } from 'naive-ui'
import { getAppEnvConfig } from '~/utils/env'
import { useUserStore } from '~/stores/user'

const userStore = useUserStore()

const router = useRouter()

interface ModelType {
  username: string
  password: string
}

const { VITE_APP_TITLE } = getAppEnvConfig()

const formRef = ref<FormInst | null>(null)
const message = useMessage()
const notification = useNotification()

const modelRef = ref<ModelType>({
  username: 'admin@mail.com',
  password: '123456',
})

const rules: FormRules = {
  username: [
    {
      required: true,
      message: '请输入账号',
    },
  ],
  password: [
    {
      required: true,
      message: '请输入密码',
    },
  ],
}

const handleLogin = (e: MouseEvent) => {
  e.preventDefault()
  formRef.value?.validate(async (errors) => {
    if (!errors) {
      const userInfo = await userStore.login({
        username: modelRef.value.username,
        password: modelRef.value.password,
        mode: 'none',
      })
      if (userInfo) {
        notification.success({
          content: '登录成功',
          meta: `欢迎回来: ${userInfo.realName}`,
        })
      }
      else {
        message.error('登录失败')
      }
    }
  })
}
</script>

<template>
  <div p="t-20">
    <div text="center" p="10">
      <div class="bg-gradient-to-br from-blue-200 to-blue-500" i="carbon-campsite" text="5xl" />
      <div class="font-medium" text="xl">
        {{ VITE_APP_TITLE }}
      </div>
    </div>
    <n-form ref="formRef" class="m-auto w-100" :model="modelRef" :rules="rules">
      <n-form-item path="username" label="账号">
        <n-input v-model:value="modelRef.username" placeholder="请输入账号" @keydown.enter.prevent />
      </n-form-item>
      <n-form-item path="password" label="密码">
        <n-input v-model:value="modelRef.password" type="password" placeholder="请输入密码" @keydown.enter.prevent />
      </n-form-item>
      <n-button class="mt-10" type="primary" block @click="handleLogin">
        登录
      </n-button>
      <div p="t4" flex="~" justify-end>
        <n-button
          text
          tag="a"
          target="_blank"
          type="primary"
          @click="router.push('/sys/register')"
        >
          注册
        </n-button>
      </div>
    </n-form>
  </div>
</template>

<style scoped>
</style>
