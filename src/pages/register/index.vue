<script setup lang="ts">
import type { FormInst, FormItemInst, FormItemRule, FormRules } from 'naive-ui'
import { useMessage } from 'naive-ui'
import { getAppEnvConfig } from '~/utils/env'
import { registerApi } from '~/apis/sys/user'

const router = useRouter()
const message = useMessage()

interface ModelType {
  username: string
  password: string
  reenteredPassword: string
}

const { VITE_APP_TITLE } = getAppEnvConfig()

const formRef = ref<FormInst | null>(null)
const rPasswordFormItemRef = ref<FormItemInst | null>(null)

const modelRef = ref<ModelType>({
  username: '',
  password: '',
  reenteredPassword: '',
})

function validatePasswordSame(rule: FormItemRule, value: string): boolean {
  return value === modelRef.value.password
}

const rules: FormRules = {
  username: [
    {
      required: true,
      message: 'please input account',
    },
  ],
  password: [
    {
      required: true,
      message: 'please input password',
    },
  ],
  reenteredPassword: [
    {
      required: true,
      message: 'please input password again',
      trigger: ['input', 'blur'],
    },
    {
      validator: validatePasswordSame,
      message: 'password should be same as the password',
      trigger: ['input', 'blur', 'password-input'],
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
      const userInfo = await registerApi({
        username: modelRef.value.username,
        password: modelRef.value.password,
      }, 'message')
      if (userInfo.id) {
        message.success('register success')
        router.replace('/login')
      }
    }
  })
}
</script>

<template>
  <div class="pt-20">
    <div text="center" p="10">
      <div class="bg-gradient-to-br from-blue-200 to-blue-500" i="carbon-campsite" text="5xl" />
      <div class="font-medium" text="xl">
        {{ VITE_APP_TITLE }}
      </div>
    </div>
    <n-form ref="formRef" class="m-auto w-100" :model="modelRef" :rules="rules">
      <n-form-item path="username" label="Username">
        <n-input v-model:value="modelRef.username" placeholder="Please input Username" @keydown.enter.prevent />
      </n-form-item>
      <n-form-item path="password" label="Password">
        <n-input
          v-model:value="modelRef.password" type="password" placeholder="Please input Password" @input="handlePasswordInput"
          @keydown.enter.prevent
        />
      </n-form-item>
      <n-form-item ref="rPasswordFormItemRef" first path="reenteredPassword" label="Confirm Password">
        <n-input
          v-model:value="modelRef.reenteredPassword" :disabled="!modelRef.password" type="password" placeholder="Please input the confirmation password"
          @keydown.enter.prevent
        />
      </n-form-item>
      <n-button class="mt-10" type="primary" block @click="handleRegister">
        Register
      </n-button>
      <div p="t4" flex="~" justify-end>
        <n-button
          text
          tag="a"
          target="_blank"
          type="primary"
          @click="router.back()"
        >
          Existing account
        </n-button>
      </div>
    </n-form>
  </div>
</template>

<style scoped>
</style>
