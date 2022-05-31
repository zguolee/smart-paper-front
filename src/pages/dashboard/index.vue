<script setup lang="ts">
import { getPreprintListApi } from '~/apis/sys/preprint'
import type { PreprintModel } from '~/apis//sys/model/preprintModel'

const router = useRouter()

const { t } = useI18n()

const checkStrategy = ref<'all' | 'not_submitted' | 'submitted'>('all')

const preprintResult = ref<{
  items: PreprintModel[]
  total: number
}>()

const paginationState = ref<{
  page: number
  pageSize: number
}>({
  page: 1,
  pageSize: 5,
})

const getPreprintList = async (
  page: number,
  pageSize: number,
  strategy: 'all' | 'not_submitted' | 'submitted',
) => {
  const res = await getPreprintListApi({ page, pageSize, strategy })
  preprintResult.value = res
}
getPreprintList(paginationState.value.page, paginationState.value.pageSize, checkStrategy.value)

watch(checkStrategy, (strategy) => {
  paginationState.value.page = 1
  getPreprintList(paginationState.value.page, paginationState.value.pageSize, strategy)
})

const handlePreprintList = (page: number) => {
  paginationState.value.page = page
  getPreprintList(paginationState.value.page, paginationState.value.pageSize, checkStrategy.value)
}
</script>

<template>
  <div>
    <div class="rounded-lg p-10 w-80%" bg="white dark:gray-700" m="t-10 auto">
      <div m="b-2" flex="~ gap-10" justify="between" items="center">
        <div>
          {{ t('dashboard.preprint_list') }}
        </div>
        <n-radio-group v-model:value="checkStrategy">
          <n-radio-button value="all">
            {{ t('dashboard.actions.all') }}
          </n-radio-button>
          <n-radio-button value="not_submitted">
            {{ t('dashboard.actions.not_submitted') }}
          </n-radio-button>
          <n-radio-button value="submitted">
            {{ t('dashboard.actions.submitted') }}
          </n-radio-button>
        </n-radio-group>
      </div>
      <n-button type="primary" block dashed>
        <div text="xl" i="carbon-add" />
        {{ t('dashboard.actions.add_new_preprint') }}
      </n-button>
      <n-list bordered>
        <n-list-item v-for="(preprint, preprintIdx) of preprintResult?.items" :key="preprintIdx">
          <div flex="~ gap-4" justify-between items-center>
            <n-thing :title="preprint.title">
              <template #avatar>
                <div class="h-full w-full" flex="~" items-center justify-center>
                  <n-tag type="primary" class="h-10 w-10" flex="~" items-center justify-center>
                    {{ preprintIdx + 1 }}
                  </n-tag>
                </div>
              </template>
              <template #description>
                <n-ellipsis style="max-width: 400px">
                  {{ preprint.abstract }}
                </n-ellipsis>
              </template>
            </n-thing>
            <n-thing title="Year">
              <template #description>
                {{ preprint.journal?.year }}
              </template>
            </n-thing>
            <n-thing title="Authors">
              <template #description>
                <div flex="~ gap-2" items-center justify-start>
                  <template v-for="(author) of preprint.authors" :key="author.id">
                    <n-badge :dot="author.primary">
                      <n-tag> {{ author.name }} </n-tag>
                    </n-badge>
                  </template>
                </div>
              </template>
            </n-thing>
            <div class="w-20">
              {{ preprint.status }}
            </div>
            <n-thing title="Update time">
              <template #description>
                {{ preprint.updateTime }}
              </template>
            </n-thing>
          </div>
        </n-list-item>
      </n-list>
      <div p="t4" flex="~" justify="center">
        <n-pagination
          v-model:page="paginationState.page"
          :page-count="Math.floor((preprintResult?.total || 0) / paginationState.pageSize) + 1"
          :on-update:page="handlePreprintList"
        />
      </div>
    </div>
  </div>
</template>

<route lang="yaml">
meta:
  layout: dashboard
</route>
