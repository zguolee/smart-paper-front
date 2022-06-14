<script setup lang="ts">
import type { FormInst, FormItemRule, FormRules } from 'naive-ui'
import { useMessage } from 'naive-ui'
import type { PreprintModel } from '~/apis/sys/model/preprintModel'
import { getPreprintDetailApi, updatePreprintApi } from '~/apis/sys/preprint'

const props = defineProps<{ id: string }>()

const router = useRouter()
const message = useMessage()
const { t } = useI18n()

const formRef = ref<FormInst | null>(null)
const formValue = ref({
  authors: [
    {
      firstName: '',
      lastName: '',
      email: '',
    },
  ],
  title: '',
  abstract: '',
  keywords: [],
})

const preprintDetail = ref<PreprintModel>()

const handlePreprintDetail = async (id: string) => {
  preprintDetail.value = await getPreprintDetailApi(id)
  Object.assign(formValue.value, preprintDetail.value)
}

handlePreprintDetail(props.id)

const removeAuthorItem = (index: number) => formValue.value.authors.splice(index, 1)

const addAuthorItem = () => formValue.value.authors.push({ firstName: '', lastName: '', email: '' })

const handleSubmit = (e: MouseEvent) => {
  e.preventDefault()
  formRef.value?.validate(async (errors) => {
    if (!errors) {
      const res = await updatePreprintApi(props.id, formValue.value as any)
      if (res.id) {
        message.success(t('dashboard.preprints.update.success'))
        router.replace('/dashboard')
      }
      else {
        message.error(t('dashboard.preprints.update.failure'))
      }
    }
  })
}

const formRules: FormRules = {
  keywords: {
    trigger: ['change'],
    required: true,
    validator(rule: FormItemRule, value: string[]) {
      if (!value.length)
        return new Error('Please enter at least one')
      return true
    },
  },
}
</script>

<template>
  <div class="rounded-lg p-10 w-60%" bg="white dark:gray-700" m="t-10 auto">
    <n-h2>
      {{ t('dashboard.preprints.index.create_preprint') }}
    </n-h2>
    <n-thing title="Periodical information">
      <div>
        Title: The first phase of the Smart Paper
      </div>
      <div>
        Date: February 15, 2022 to June 15, 2022
      </div>
    </n-thing>
    <n-form ref="formRef" :model="formValue" :rules="formRules" label-placement="top">
      <n-h3>
        Authors information
      </n-h3>
      <template v-for="(author, _authorIdx) of formValue.authors" :key="_authorIdx">
        <div flex="~ gap-2" justify-start items-center>
          <n-tag type="primary" class="h-10 w-10" flex="~" items-center justify-center>
            {{ _authorIdx + 1 }}
          </n-tag>
          <div flex="~ gap-2 1">
            <NFormItem
              label="First Name:" :path="`authors[${_authorIdx}].firstName`" label-placement="top"
              class="flex-1" :rule="{ required: true, message: 'Please input first name', trigger: ['input', 'blur'] }"
            >
              <NInput v-model:value="author.firstName" placeholder="Please input First Name" />
            </NFormItem>
            <NFormItem
              label="Last Name:" :path="`authors[${_authorIdx}].lastName`" label-placement="top" class="flex-1"
              :rule="{ required: true, message: 'Please input last name', trigger: ['input', 'blur'] }"
            >
              <NInput v-model:value="author.lastName" placeholder="Please input Last Name" />
            </NFormItem>
            <NFormItem
              label="Email:" :path="`authors[${_authorIdx}].email`" label-placement="top" class="flex-1"
              :rule="{ required: true, message: 'Please input email', trigger: ['input', 'blur'] }"
            >
              <NInput v-model:value="author.email" placeholder="Please input Email" />
            </NFormItem>
          </div>
          <NButton secondary type="error" @click="removeAuthorItem(_authorIdx)">
            Delete
          </NButton>
        </div>
      </template>
      <NButton type="primary" block dashed @click="addAuthorItem">
        <div text="xl" i="carbon-add" />
        Click here to add more author
      </NButton>

      <n-h3>
        Title and Abstract
      </n-h3>
      <NFormItem
        label="Preprint Title:" path="title"
        :rule="{ required: true, message: 'Please input preprint title', trigger: ['input', 'blur'] }"
      >
        <NInput v-model:value="formValue.title" placeholder="Please input Preprint Title" />
      </NFormItem>
      <NFormItem
        label="Abstract:" path="abstract"
        :rule="{ required: true, message: 'Please input abstract', trigger: ['input', 'blur'] }"
      >
        <NInput v-model:value="formValue.abstract" type="textarea" placeholder="Please input Abstract" />
      </NFormItem>
      <n-h3>
        Keywords
      </n-h3>
      <NFormItem label="Keywords:" path="keywords">
        <n-dynamic-tags v-model:value="formValue.keywords" type="success" />
      </NFormItem>
      <n-h3>
        Attachments
      </n-h3>
      <div flex="~ gap-6">
        <n-upload directory-dnd action="https://www.mocky.io/v2/5e4bafc63100007100d8b70f">
          <n-upload-dragger>
            <div m="b-2">
              <div i="carbon-document-attachment" text="2xl" />
            </div>
            <n-text text="sm">
              Click or drag the file to this area to upload.
            </n-text>
          </n-upload-dragger>
        </n-upload>
        <n-upload directory-dnd action="https://www.mocky.io/v2/5e4bafc63100007100d8b70f">
          <n-upload-dragger>
            <div m="b-2">
              <div i="carbon-code" text="2xl" />
            </div>
            <n-text text="sm">
              Click or drag the file to this area to upload.
            </n-text>
          </n-upload-dragger>
        </n-upload>
      </div>
      <div class="mx-auto w-60%" flex="~ gap-6" justify-center items-center>
        <NButton class="flex-1 mt-10" type="primary" @click="handleSubmit">
          Submit
        </NButton>
        <NButton class="flex-1 mt-10" type="info">
          Save
        </NButton>
        <NButton class="flex-1 mt-10" @click="router.back()">
          Back
        </NButton>
      </div>
    </n-form>
  </div>
</template>

<route lang="yaml">
meta:
  layout: dashboard
</route>
