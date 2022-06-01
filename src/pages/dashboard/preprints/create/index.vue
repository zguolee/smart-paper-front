<script setup lang="ts">
import type { FormInst } from 'naive-ui'

const router = useRouter()
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

const removeAuthorItem = (index: number) => {
  formValue.value.authors.splice(index, 1)
}

const addAuthorItem = () => {
  formValue.value.authors.push({ firstName: '', lastName: '', email: '' })
}

const handleSubmit = (e: MouseEvent) => {
  e.preventDefault()
  formRef.value?.validate(async (errors) => {
    if (!errors)
      console.error(formValue.value)
  })
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
    <n-form
      ref="formRef"
      :model="formValue"
      label-placement="left"
      label-width="auto"
    >
      <n-h3>
        Authors information
      </n-h3>
      <template v-for="(author, idx) of formValue.authors" :key="idx">
        <div flex="~" justify="between">
          <n-h4>{{ `Author${idx + 1}` }}</n-h4>
          <n-form-item
            label="First Name:" :path="`authors[${idx}].firstName`"
            :rule="{ required: true, message: 'Please input first name', trigger: ['input', 'blur'] }"
          >
            <n-input v-model:value="author.firstName" placeholder="Please input First Name" />
          </n-form-item>
          <n-form-item
            label="Last Name:" :path="`authors[${idx}].lastName`"
            :rule="{ required: true, message: 'Please input last name', trigger: ['input', 'blur'] }"
          >
            <n-input v-model:value="author.lastName" placeholder="Please input Last Name" />
          </n-form-item>
          <n-form-item
            label="Email:" :path="`authors[${idx}].email`"
            :rule="{ required: true, message: 'Please input email', trigger: ['input', 'blur'] }"
          >
            <n-input v-model:value="author.email" placeholder="Please input Email" />
          </n-form-item>
          <n-button @click="removeAuthorItem(idx)">
            Delete
          </n-button>
        </div>
      </template>
      <n-button type="primary" block dashed @click="addAuthorItem">
        <div text="xl" i="carbon-add" />
        Click here to add more author
      </n-button>

      <n-h3>
        Title and Abstract
      </n-h3>
      <n-form-item
        label="Preprint Title:" path="title"
        :rule="{ required: true, message: 'Please input preprint title', trigger: ['input', 'blur'] }"
      >
        <n-input v-model:value="formValue.title" placeholder="Please input Preprint Title" />
      </n-form-item>
      <n-form-item
        label="Abstract:" path="abstract"
        :rule="{ required: true, message: 'Please input abstract', trigger: ['input', 'blur'] }"
      >
        <n-input v-model:value="formValue.abstract" type="textarea" placeholder="Please input Abstract" />
      </n-form-item>
      <n-h3>
        Keywords
      </n-h3>
      <n-form-item
        label="Keywords:" path="keywords"
        :rule="{ required: true, message: 'Please input keywords', trigger: ['input', 'blur'] }"
      >
        <n-dynamic-tags v-model:value="formValue.keywords" />
      </n-form-item>
      <n-h3>
        Attachments
      </n-h3>
      <div flex="~">
        <n-upload
          directory-dnd
          action="https://www.mocky.io/v2/5e4bafc63100007100d8b70f"
        >
          <n-upload-dragger>
            <div m="b-2">
              <div i="carbon-document-attachment" text="2xl" />
            </div>
            <n-text text="sm">
              Click or drag the file to this area to upload.
            </n-text>
          </n-upload-dragger>
        </n-upload>
        <n-upload
          directory-dnd
          action="https://www.mocky.io/v2/5e4bafc63100007100d8b70f"
        >
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
      <div flex="~ gap-6" justify-center items-center>
        <n-button class="mt-10 w-50" type="primary" @click="handleSubmit">
          Submit
        </n-button>
        <n-button class="mt-10 w-50" type="info">
          Save
        </n-button>
        <n-button class="mt-10 w-50" @click="router.back()">
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
