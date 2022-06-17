<script setup lang="ts">
import type { FormInst, FormItemRule, FormRules, UploadCustomRequestOptions } from 'naive-ui'
import { useMessage } from 'naive-ui'
import type { PreprintModel } from '~/apis/sys/model/preprintModel'
import { getPreprintDetailApi, updatePreprintApi } from '~/apis/sys/preprint'
import { uploadApi } from '~/apis/sys/upload'
import { downloadByUrl } from '~/utils/file/download'

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
      corresponding: false,
    },
  ],
  title: '',
  abstract: '',
  keywords: [],
  pdfUrl: '',
  sourceUrl: '',
})

const preprintDetail = ref<PreprintModel>()

const handlePreprintDetail = async (id: string) => {
  preprintDetail.value = await getPreprintDetailApi(id)
  Object.assign(formValue.value, preprintDetail.value, { authors: JSON.parse(preprintDetail.value.authors), keywords: JSON.parse(preprintDetail.value.keywords) })
}

handlePreprintDetail(props.id)

const removeAuthorItem = (index: number) => formValue.value.authors.splice(index, 1)

const addAuthorItem = () => formValue.value.authors.push({ firstName: '', lastName: '', email: '', corresponding: false })

const handleSubmit = (e: MouseEvent) => {
  e.preventDefault()
  formRef.value?.validate(async (errors) => {
    if (!errors) {
      const res = await updatePreprintApi(props.id, Object.assign({}, formValue.value, { authors: JSON.stringify(formValue.value.authors), keywords: JSON.stringify(formValue.value.keywords) }))
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

const uploadProcess = ref(0)

const handleUpload = async (file: File | Blob, type: 'document' | 'code') => {
  const { data } = await uploadApi(
    { file },
    (progressEvent: ProgressEvent) => {
      uploadProcess.value = ((progressEvent.loaded / progressEvent.total) * 100) | 0
    },
  )
  const { code, url } = data
  if (code === 0) {
    if (type === 'document')
      formValue.value.pdfUrl = url
    else
      formValue.value.sourceUrl = url
    message.success(t('dashboard.preprints.create.upload.success'))
  }

  else { message.error(t('dashboard.preprints.create.upload.failure')) }
}

const handleUploadDocument = async ({ file }: UploadCustomRequestOptions) => {
  handleUpload(file.file as File | Blob, 'document')
}

const handleUploadCode = async ({ file }: UploadCustomRequestOptions) => {
  handleUpload(file.file as File | Blob, 'code')
}

const handleDownload = (type: 'document' | 'code') => {
  if (type === 'document')
    downloadByUrl({ url: formValue.value.pdfUrl })
  else
    downloadByUrl({ url: formValue.value.sourceUrl })
}
</script>

<template>
  <div class="rounded-lg p-10 w-80%" bg="white dark:gray-700" m="t-10 auto">
    <n-h2>
      Edit Preprint
    </n-h2>
    <n-form ref="formRef" :model="formValue" :rules="formRules" label-placement="top">
      <n-h3>
        Title and Abstract
      </n-h3>
      <n-form-item
        label="Title" path="title"
        :rule="{ required: true, message: 'Please input preprint title', trigger: ['input', 'blur'] }"
      >
        <n-input v-model:value="formValue.title" placeholder="Please input Preprint Title" />
      </n-form-item>
      <n-form-item
        label="Abstract" path="abstract"
        :rule="{ required: true, message: 'Please input abstract', trigger: ['input', 'blur'] }"
      >
        <n-input v-model:value="formValue.abstract" type="textarea" placeholder="Please input Abstract" />
      </n-form-item>
      <n-h3>
        Authors information
      </n-h3>
      <template v-for="(author, _authorIdx) of formValue.authors" :key="_authorIdx">
        <div flex="~ gap-2" justify-start items-center>
          <n-tag type="primary" class="h-10 w-10" flex="~" items-center justify-center>
            {{ _authorIdx + 1 }}
          </n-tag>
          <div flex="~ gap-2 1">
            <n-form-item
              label="First Name" :path="`authors[${_authorIdx}].firstName`" label-placement="top"
              class="flex-1" :rule="{ required: true, message: 'Please input first name', trigger: ['input', 'blur'] }"
            >
              <n-input v-model:value="author.firstName" placeholder="Please input First Name" />
            </n-form-item>
            <n-form-item
              label="Last Name" :path="`authors[${_authorIdx}].lastName`" label-placement="top"
              class="flex-1" :rule="{ required: true, message: 'Please input last name', trigger: ['input', 'blur'] }"
            >
              <n-input v-model:value="author.lastName" placeholder="Please input Last Name" />
            </n-form-item>
            <n-form-item
              label="Email" :path="`authors[${_authorIdx}].email`" label-placement="top" class="flex-1"
              :rule="{ required: true, message: 'Please input email', trigger: ['input', 'blur'] }"
            >
              <n-input v-model:value="author.email" placeholder="Please input Email" />
            </n-form-item>
            <n-form-item label="Corresponding" :path="`authors[${_authorIdx}].primary`" label-placement="top">
              <n-switch v-model:value="author.corresponding" />
            </n-form-item>
          </div>
          <n-button secondary type="error" @click="removeAuthorItem(_authorIdx)">
            Delete
          </n-button>
        </div>
      </template>
      <n-button type="primary" block dashed @click="addAuthorItem">
        <div text="xl" i="carbon-add" />
        Click here to add more author
      </n-button>
      <n-h3>
        Keywords
      </n-h3>
      <n-form-item label="Keywords" path="keywords">
        <n-dynamic-tags v-model:value="formValue.keywords" size="large" type="success" />
      </n-form-item>
      <n-descriptions title="Attachments" label-align="right" label-placement="left">
        <n-descriptions-item label="PDF document">
          <div class="flex gap-2">
            <n-upload :max="1" :custom-request="handleUploadDocument">
              <n-button type="primary">
                <div class="mr-2" i="carbon-document" text="2xl" />
                Click to upload PDF document
              </n-button>
            </n-upload>
            <n-button v-if="formValue.pdfUrl" type="info" @click="handleDownload('document')">
              <div i="carbon-document" m="r2" />
              Download
            </n-button>
          </div>
        </n-descriptions-item>
        <n-descriptions-item label="Source file">
          <div class="flex gap-2">
            <n-upload :max="1" :custom-request="handleUploadCode">
              <n-button type="primary">
                <div class="mr-2" i="carbon-code" text="2xl" />
                Click to upload source code
              </n-button>
            </n-upload>
            <n-button v-if="formValue.sourceUrl" type="info" @click="handleDownload('code')">
              <div i="carbon-branch" m="r2" />
              Download
            </n-button>
          </div>
        </n-descriptions-item>
      </n-descriptions>
      <div class="mx-auto w-60%" flex="~ gap-6" justify-center items-center>
        <NButton class="flex-1 mt-10" type="primary" @click="handleSubmit">
          Submit
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
