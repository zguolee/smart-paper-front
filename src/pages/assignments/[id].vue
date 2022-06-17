<script setup lang="ts">
import type { FormInst } from 'naive-ui'
import { useMessage } from 'naive-ui'
import type { PreprintModel } from '~/apis/sys/model/preprintModel'
import { distributionPreprintApi, getPreprintDetailApi, updatePreprintStatusApi } from '~/apis/sys/preprint'
import { getUsersApi } from '~/apis/sys/user'
import { formatDate } from '~/utils/dayjs'
import { downloadByUrl } from '~/utils/file/download'

const props = defineProps<{ id: string }>()

const { t } = useI18n()
const router = useRouter()
const message = useMessage()

const reviewerOptions = ref<{ label: string; value: string }[]>([])
const formRef = ref<FormInst | null>(null)
const formValue = ref({
  reviewers: [null],
})

const preprintDetail = ref<PreprintModel>()
const handlePreprintDetail = async (id: string) => {
  preprintDetail.value = await getPreprintDetailApi(id)
  reviewerOptions.value = preprintDetail.value.reviewers.map(reviewer => ({
    label: `${reviewer.firstName} ${reviewer.lastName} ${reviewer.username}`,
    value: reviewer.id,
  })) as any
  formValue.value.reviewers = preprintDetail.value.reviewers.map(item => item.id) as any
}
handlePreprintDetail(props.id)

const removeReviewerItem = (index: number) => formValue.value.reviewers.splice(index, 1)
const addReviewerItem = () => formValue.value.reviewers.push(null)

const handleSearch = async (query: string) => {
  const reviewers = await getUsersApi({ page: 1, pageSize: 10, strategy: 'all', username: query })
  reviewerOptions.value = reviewers.items.map(reviewer => ({
    label: `${reviewer.firstName} ${reviewer.lastName} ${reviewer.username}`,
    value: reviewer.id,
  })) as any
}

const handleSubmit = (e: MouseEvent) => {
  e.preventDefault()
  formRef.value?.validate(async (errors) => {
    if (!errors) {
      const res = await distributionPreprintApi(props.id, { reviewers: formValue.value.reviewers.map(item => ({ id: item })) })
      if (res.id) {
        message.success(t('assignments.preprints.distribution.success'))
        router.replace('/assignments')
      }
      else {
        message.error(t('assignments.preprints.distribution.failure'))
      }
    }
  })
}

const handleDownload = (type: 'document' | 'code') => {
  if (type === 'document')
    downloadByUrl({ url: preprintDetail.value?.pdfUrl as string })
  else
    downloadByUrl({ url: preprintDetail.value?.sourceUrl as string })
}

const statusList = computed(() => {
  const list = ['First trial', 'Reception', 'Accepted', 'Rejected', 'Pay', 'Finish']
  const len = preprintDetail.value?.statusProgresses?.length as number
  return list.slice(len >= 3 ? len + 1 : len)
})

const handlePushStatus = async (title: string) => {
  const msg: any = {
    'First trial': '',
    'Reception': 'Your paper has been received, please wait for the review.',
    'Accepted': 'Your paper has been accepted, please pay for the publication.',
    'Rejected': 'Your paper has been rejected, please check the mailbox for details.',
    'Pay': 'You have paid for the publication, please wait for the publication.',
    'Finish': 'Your paper has been published, please check the mailbox for details.',
  }
  const res = await updatePreprintStatusApi(props.id, { statusProgress: { title, content: msg[title] } })
  if (res.id) {
    handlePreprintDetail(props.id)
    message.success(t('assignments.preprints.status.success'))
  }

  else { message.error(t('assignments.preprints.status.failure')) }
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
        <n-button type="info" @click="handleDownload('document')">
          <div i="carbon-document" m="r2" />
          Download the article
        </n-button>
      </n-descriptions-item>
      <n-descriptions-item label="Source file">
        <n-button type="info" @click="handleDownload('code')">
          <div i="carbon-branch" m="r2" />
          Download the source code
        </n-button>
      </n-descriptions-item>
    </n-descriptions>

    <n-form ref="formRef" :model="formValue" label-placement="top">
      <n-h3 class="m-0">
        Reviewers information
      </n-h3>
      <template v-for="(_reviewer, _reviewerIdx) of formValue.reviewers" :key="_reviewerIdx">
        <div flex="~ gap-4" justify-start items-center>
          <n-tag type="primary" class="h-10 w-10" flex="~" items-center justify-center>
            {{ _reviewerIdx + 1 }}
          </n-tag>
          <n-form-item class="flex-1">
            <n-select
              v-model:value="formValue.reviewers[_reviewerIdx]" filterable
              placeholder="Please search reviewer by email or username" :options="reviewerOptions" clearable remote
              @search="handleSearch"
            />
          </n-form-item>
          <n-button secondary type="error" @click="removeReviewerItem(_reviewerIdx)">
            Delete
          </n-button>
        </div>
      </template>
      <n-button type="primary" block dashed @click="addReviewerItem">
        <div text="xl" i="carbon-add" />
        Click here to add more reviewer
      </n-button>
    </n-form>
    <n-h3>Review</n-h3>
    <n-table class="mt-4 text-center" :single-line="false">
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Opinion</th>
          <th>Content</th>
          <th>Time</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="comment, _idx of preprintDetail?.comments" :key="_idx">
          <td>{{ _idx + 1 }}</td>
          <td>
            {{ comment.reviewer.firstName }} {{ comment.reviewer.lastName }}
          </td>
          <td> {{ comment.opinion }}</td>
          <td>
            {{ comment.content }}
          </td>
          <td>
            {{ formatDate(comment.createdAt, 'YYYY-MM-DD HH:mm:ss') }}
          </td>
        </tr>
      </tbody>
    </n-table>
    <n-h3>Review Progress</n-h3>
    <n-timeline horizontal>
      <template v-for="status, _idx of preprintDetail?.statusProgresses?.reverse()" :key="_idx">
        <n-timeline-item
          :type="status.title === 'Rejected' ? 'error' : 'success'" :title="status.title"
          :time="formatDate(status.createdAt, 'YYYY-MM-DD HH:mm:ss')"
        >
          <template #default>
            {{ status.content }}
          </template>
        </n-timeline-item>
      </template>
      <template v-for="title, _idx of statusList" :key="_idx">
        <n-timeline-item class="cursor-pointer" :title="title" line-type="dashed">
          <template #default>
            <n-popconfirm v-if="!!!_idx || (title === 'Rejected' && _idx === 1)" @positive-click="handlePushStatus(title)">
              <template #trigger>
                Click to change
              </template>
              Are you sure to update status?
            </n-popconfirm>
          </template>
        </n-timeline-item>
      </template>
    </n-timeline>
    <div class="mx-auto w-40%" flex="~ gap-6" justify-center items-center>
      <n-button class="flex-1 mt-10" type="primary" @click="handleSubmit">
        Save
      </n-button>
      <n-button class="flex-1 mt-10" @click="router.back()">
        Back
      </n-button>
    </div>
  </div>
</template>

<route lang="yaml">
meta:
  layout: dashboard
</route>
