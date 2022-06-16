<script setup lang="ts">
import type { FormInst } from 'naive-ui'
import { useMessage } from 'naive-ui'
import type { PreprintModel } from '~/apis/sys/model/preprintModel'
import { getPreprintDetailApi, reviewPreprintApi } from '~/apis/sys/preprint'
import { useUserStore } from '~/stores/user'

const props = defineProps<{ id: string }>()

const { t } = useI18n()
const router = useRouter()
const message = useMessage()
const userStore = useUserStore()

const formRef = ref<FormInst | null>(null)
const formValue = ref({
  opinion: 'Accept',
  content: '',
})

const opinionOptions = ['Strong Accept', 'Accept', 'Weak Accept', 'Reject', 'Weak Reject', 'Strong Reject']
  .map((item) => { return { label: item, value: item } })

const preprintDetail = ref<PreprintModel>()
const handlePreprintDetail = async (id: string) => {
  preprintDetail.value = await getPreprintDetailApi(id)
  Object.assign(formValue.value, preprintDetail.value.comments.find(item => item.reviewer.id === userStore.getUserInfo().id))
}
handlePreprintDetail(props.id)

const handleSubmit = (e: MouseEvent) => {
  e.preventDefault()
  formRef.value?.validate(async (errors) => {
    if (!errors) {
      const res = await reviewPreprintApi(props.id, formValue.value as any)
      if (res.id) {
        message.success(t('review.preprints.update.success'))
        router.replace('/review')
      }
      else {
        message.error(t('review.preprints.update.failure'))
      }
    }
  })
}
</script>

<template>
  <div class="rounded-lg p-10 w-80%" bg="white dark:gray-700" m="t-10 auto">
    <n-h2>
      Review Paper
    </n-h2>

    <n-descriptions title="Preprint information" :column="1" label-align="right" label-placement="left">
      <n-descriptions-item label="Title">
        {{ preprintDetail?.title }}
      </n-descriptions-item>
      <n-descriptions-item label="Abstract">
        {{ preprintDetail?.abstract }}
      </n-descriptions-item>
      <n-descriptions-item label="Keywords">
        {{ preprintDetail?.keywords ? JSON.parse(preprintDetail?.keywords).join('; ') : [] }}
      </n-descriptions-item>
    </n-descriptions>

    <n-descriptions title="Authors" label-align="right" label-placement="left">
      <template v-for="author, _idx of preprintDetail?.authors ? JSON.parse(preprintDetail?.authors) : []" :key="_idx">
        <n-descriptions-item label="Name">
          {{ author.firstName }} {{ author.lastName }}
        </n-descriptions-item>
        <n-descriptions-item label="Email">
          {{ author.email }}
        </n-descriptions-item>
        <n-descriptions-item label="Corresponding">
          {{ author.corresponding }}
        </n-descriptions-item>
      </template>
    </n-descriptions>

    <n-descriptions title="Attachments" label-align="right" label-placement="left">
      <n-descriptions-item label="PDF document">
        <n-button type="info" size="small">
          <div i="carbon-document" m="r2" />
          Download the article
        </n-button>
      </n-descriptions-item>
      <n-descriptions-item label="Source file">
        <n-button type="info" size="small">
          <div i="carbon-branch" m="r2" />
          Download the source code
        </n-button>
      </n-descriptions-item>
    </n-descriptions>

    <n-form ref="formRef" :model="formValue" label-placement="top">
      <n-h3 class="m-0">
        Comment
      </n-h3>
      <n-form-item label="Opinion" path="opinion">
        <n-select v-model:value="formValue.opinion" placeholder="Select an opinion" :options="opinionOptions" />
      </n-form-item>
      <n-form-item label="Content" path="content">
        <n-input
          v-model:value="formValue.content" placeholder="Please enter your content" type="textarea"
          :autosize="{ minRows: 3, maxRows: 5 }"
        />
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
