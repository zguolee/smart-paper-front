<script setup lang="ts">
import type { FormInst, FormItemInst, FormItemRule, FormRules } from 'naive-ui'
import { getAppEnvConfig } from '~/utils/env'
import { registerApi } from '~/apis/sys/user'

const router = useRouter()

interface ModelType {
  username: string
  password: string
  reenteredPassword: string
}

const { VITE_APP_TITLE } = getAppEnvConfig()

const formRef = ref<FormInst | null>(null)
const rPasswordFormItemRef = ref<FormItemInst | null>(null)

const modelRef = ref<ModelType>({
  username: 'admin@mail.com',
  password: '123456',
  reenteredPassword: '123456',
})

function validatePasswordStartWith(
  rule: FormItemRule,
  value: string,
): boolean {
  return (
    !!modelRef.value.password
    && modelRef.value.password.startsWith(value)
    && modelRef.value.password.length >= value.length
  )
}
function validatePasswordSame(rule: FormItemRule, value: string): boolean {
  return value === modelRef.value.password
}

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
  reenteredPassword: [
    {
      required: true,
      message: '请再次输入密码',
      trigger: ['input', 'blur'],
    },
    {
      validator: validatePasswordStartWith,
      message: '两次密码输入不一致',
      trigger: 'input',
    },
    {
      validator: validatePasswordSame,
      message: '两次密码输入不一致',
      trigger: ['blur', 'password-input'],
    },
  ],
}

const handlePasswordInput = () => {
  if (modelRef.value.reenteredPassword)
    rPasswordFormItemRef.value?.validate({ trigger: 'password-input' })
}

const handleRegister = (e: MouseEvent) => {
  e.preventDefault()
  formRef.value?.validate(async (errors) => {
    if (!errors) {
      await registerApi({
        username: modelRef.value.username,
        password: modelRef.value.password,
      }, 'message')
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
        <n-input
          v-model:value="modelRef.password" type="password" placeholder="请输入密码" @input="handlePasswordInput"
          @keydown.enter.prevent
        />
      </n-form-item>
      <n-form-item ref="rPasswordFormItemRef" first path="reenteredPassword" label="确认密码">
        <n-input
          v-model:value="modelRef.reenteredPassword" :disabled="!modelRef.password" type="password" placeholder="请输入确认密码"
          @keydown.enter.prevent
        />
      </n-form-item>
      <n-button class="mt-10" type="primary" block @click="handleRegister">
        注册
      </n-button>
      <div p="t4" flex="~" justify-end>
        <n-button
          text
          tag="a"
          target="_blank"
          type="primary"
          @click="router.back()"
        >
          已有账号
        </n-button>
      </div>
    </n-form>
  </div>
</template>

<style scoped>
</style>
