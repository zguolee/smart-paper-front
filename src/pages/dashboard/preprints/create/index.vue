<script setup lang="ts">
import type { FormInst, FormItemRule, FormRules } from 'naive-ui'
import { useMessage } from 'naive-ui'
import { createPreprintApi } from '~/apis/sys/preprint'

const message = useMessage()
const router = useRouter()
const { t } = useI18n()

const formRef = ref<FormInst | null>(null)
const formValue = ref({
  authors: [
    {
      firstName: '',
      lastName: '',
      email: '',
      primary: false,
    },
  ],
  title: '',
  abstract: '',
  keywords: [],
})

const removeAuthorItem = (index: number) => formValue.value.authors.splice(index, 1)

const addAuthorItem = () => formValue.value.authors.push({ firstName: '', lastName: '', email: '', primary: false })

const handleSubmit = (e: MouseEvent) => {
  // e.preventDefault()
  formRef.value?.validate(async (errors) => {
    if (!errors) {
      const res = await createPreprintApi(Object.assign({}, formValue.value, { authors: JSON.stringify(formValue.value.authors), keywords: JSON.stringify(formValue.value.keywords) }))
      if (res.id) {
        message.success(t('dashboard.preprints.create.success'))
        router.replace('/dashboard')
      }
      else {
        message.error(t('dashboard.preprints.create.failure'))
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
  <div class="rounded-lg p-10 w-80%" bg="white dark:gray-700" m="t-10 auto">
    <n-h2>
      {{ t('dashboard.preprints.index.create_preprint') }}
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
              <n-switch v-model:value="author.primary" />
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
        <n-button class="flex-1 mt-10" type="primary" @click="handleSubmit">
          Submit
        </n-button>
        <n-button class="flex-1 mt-10" type="info">
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
