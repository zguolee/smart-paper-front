<script setup lang="ts">
import type { FormInst } from 'naive-ui'
import type { PreprintModel } from '~/apis/sys/model/preprintModel'
import { getPreprintDetailApi } from '~/apis/sys/preprint'

const props = defineProps<{ id: string }>()

const router = useRouter()

const reviewerOptions = ref<{
  label: string
  value: string
}[]>([
  { label: 'Neil1', value: '1' },
  { label: 'Neil2', value: '2' },
  { label: 'Neil3', value: '3' },
])

const formRef = ref<FormInst | null>(null)
const formValue = ref({
  reviewers: [],
  reviewers2: [
    { reviewer: null },
  ],
})

const preprintDetail = ref<PreprintModel>()
const handlePreprintDetail = async (id: string) => {
  preprintDetail.value = await getPreprintDetailApi(id)
  // if (preprintDetail.value?.reviewers && preprintDetail.value.reviewers.length > 0) {
  //   formValue.value.reviewers = preprintDetail.value.reviewers.map(item => ({
  //     reviewer: item.reviewer,
  //   }))
  // }
}
handlePreprintDetail(props.id)

const removeReviewerItem = (index: number) => formValue.value.reviewers.splice(index, 1)

const addReviewerItem = () => formValue.value.reviewers.push({ reviewer: null })

const handleSearch = (query: string) => {
  console.log(query)
}

const handleSubmit = (e: MouseEvent) => {
  e.preventDefault()
  formRef.value?.validate(async (errors) => {
    if (!errors)
      console.log(formValue.value)
  })
}

const selectValue = ref<string | null>(null)
</script>

<template>
  <div class="rounded-lg p-10 w-80%" bg="white dark:gray-700" m="t-10 auto">
    <n-h2>
      Review Paper
    </n-h2>

    <n-descriptions title="Periodical information" label-placement="left">
      <n-descriptions-item label="Title">
        The first phase of the Smart Paper
      </n-descriptions-item>
      <n-descriptions-item label="Date">
        February 15, 2022 to June 15, 2022
      </n-descriptions-item>
    </n-descriptions>

    <n-descriptions title="Preprint information" :column="1" label-align="right" label-placement="left">
      <n-descriptions-item label="Title">
        {{ preprintDetail?.title }}
      </n-descriptions-item>
      <n-descriptions-item label="Abstract">
        {{ preprintDetail?.abstract }}
      </n-descriptions-item>
      <n-descriptions-item label="Keywords">
        {{ preprintDetail?.keywords.join('; ') }}
      </n-descriptions-item>
    </n-descriptions>

    <n-descriptions title="Authors" label-align="right" label-placement="left">
      <template v-for="author, _idx of preprintDetail?.authors" :key="_idx">
        <n-descriptions-item label="First Name">
          {{ author.firstName }}
        </n-descriptions-item>
        <n-descriptions-item label="Last Name">
          {{ author.lastName }}
        </n-descriptions-item>
        <n-descriptions-item label="Email">
          {{ author.email }}
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
        Reviewers information
      </n-h3>
      <n-form-item label="Reviewers" path="keywords">
        <n-dynamic-tags v-model:value="formValue.reviewers" type="success">
          <template #input="{ submit, deactivate }">
            <n-auto-complete
              ref="autoCompleteInstRef"
              v-model:value="selectValue"
              size="small"
              :options="reviewerOptions"
              placeholder="邮箱"
              :clear-after-select="true"
              @select="submit($event)"
              @blur="deactivate"
            />
            <!-- <n-select
              v-model:value="selectValue"
              filterable placeholder="Please select reviewer"
              :options="reviewerOptions" clearable remote on-update:value="submit($event)"
              @search="handleSearch"
              @blur="deactivate"
            /> -->
          </template>
          <template #trigger="{ activate, disabled }">
            <n-button
              size="small"
              type="primary"
              dashed
              :disabled="disabled"
              @click="activate()"
            >
              <div i="carbon-add" m="r2" />
              添加
            </n-button>
          </template>
        </n-dynamic-tags>
      </n-form-item>
      <template v-for="(reviewer, _reviewerIdx) of formValue.reviewers" :key="_reviewerIdx">
        <div flex="~ gap-4" justify-start items-center>
          <n-tag type="primary" class="h-10 w-10" flex="~" items-center justify-center>
            {{ _reviewerIdx + 1 }}
          </n-tag>
          <NFormItem class="flex-1">
            <n-select
              v-model:value="reviewer.reviewer" filterable placeholder="Please select reviewer"
              :options="reviewerOptions" clearable remote @search="handleSearch"
            />
          </NFormItem>
          <NButton secondary type="error" @click="removeReviewerItem(_reviewerIdx)">
            Delete
          </NButton>
        </div>
      </template>
      <n-button type="primary" block dashed @click="addReviewerItem">
        <div text="xl" i="carbon-add" />
        Click here to add more reviewer
      </n-button>
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
