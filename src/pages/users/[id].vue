<script setup lang="ts">
import type { FormInst } from 'naive-ui'
import { useUserStore } from '~/stores/user'

const props = defineProps<{ id: string }>()

const router = useRouter()
const userStore = useUserStore()

const userInfo = computed(() => userStore.getUserInfo())

const formRef = ref<FormInst | null>(null)
const formValue = ref({
  username: userInfo.value.username,
  firstName: userInfo.value.firstName,
  lastName: userInfo.value.lastName,
  organization: '',
  institute: '',
  country: '',
  city: '',
  state: '',
})

const handleSubmit = (e: MouseEvent) => {
  e.preventDefault()
  formRef.value?.validate(async (errors) => {
    if (!errors)
      console.log(formValue.value)
  })
}
</script>

<template>
  <div class="rounded-lg p-10 w-80%" bg="white dark:gray-700" m="t-10 auto">
    <n-h2>
      Profile
    </n-h2>
    <n-form ref="formRef" :model="formValue">
      <n-form-item
        label="Username(Email)" path="username"
        :rule="{ required: true, message: 'Please input email', trigger: ['input', 'blur'] }"
      >
        <n-input v-model:value="formValue.username" placeholder="Please input Username" />
      </n-form-item>
      <n-form-item
        label="First Name:" path="firstName"
        :rule="{ required: true, message: 'Please input first name', trigger: ['input', 'blur'] }"
      >
        <n-input v-model:value="formValue.firstName" placeholder="Please input First Name" />
      </n-form-item>
      <n-form-item
        label="Last Name:" path="lastName"
        :rule="{ required: true, message: 'Please input last name', trigger: ['input', 'blur'] }"
      >
        <n-input v-model:value="formValue.lastName" placeholder="Please input Last Name" />
      </n-form-item>
      <n-form-item
        label="Organization:" path="organization"
        :rule="{ required: true, message: 'Please input organization', trigger: ['input', 'blur'] }"
      >
        <n-input v-model:value="formValue.organization" placeholder="Please input Organization" />
      </n-form-item>
      <n-form-item
        label="Institute:" path="institute"
        :rule="{ required: true, message: 'Please input institute', trigger: ['input', 'blur'] }"
      >
        <n-input v-model:value="formValue.institute" placeholder="Please input Institute" />
      </n-form-item>

      <div class="mx-auto w-40%" flex="~ gap-6" justify-center items-center>
        <n-button class="flex-1 mt-10" type="primary" @click="handleSubmit">
          Save
        </n-button>
        <n-button class="flex-1 mt-10" @click="router.back()">
          Back
        </n-button>
      </div>
    </n-form>
  </div>
</template>

<route lang="yaml">
meta:
  layout: dashboard
</route>
