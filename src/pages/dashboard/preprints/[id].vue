<script setup lang="ts">
import type { PreprintModel } from '~/apis/sys/model/preprintModel'
import { getPreprintDetailApi } from '~/apis/sys/preprint'

const props = defineProps<{ id: string }>()

const router = useRouter()

const preprintDetail = ref<PreprintModel>()
const handlePreprintDetail = async (id: string) => {
  preprintDetail.value = await getPreprintDetailApi(id)
}
handlePreprintDetail(props.id)
</script>

<template>
  <div class="rounded-lg p-10 w-60%" bg="white dark:gray-700" m="t-10 auto">
    <n-h2>
      Preprint Review Process
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

    <n-thing title="Review Process">
      <n-timeline horizontal>
        <template v-for="status, _idx of preprintDetail?.statusProgress" :key="_idx">
          <n-timeline-item
            :type="status.title === 'Rejected' ? 'error' : 'success'"
            :title="status.title"
            :time="status.date"
          >
            <template #default>
              {{ status.comment }}
            </template>
          </n-timeline-item>
        </template>
      </n-timeline>
    </n-thing>
    <div flex="~" justify-center>
      <n-button class="mt-10 w-50" @click="router.back()">
        Back
      </n-button>
    </div>
  </div>
</template>

<route lang="yaml">
meta:
  layout: dashboard
</route>
