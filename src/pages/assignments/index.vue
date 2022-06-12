<script setup lang="ts">
import { getPreprintListApi } from '~/apis/sys/preprint'
import type { PreprintModel } from '~/apis//sys/model/preprintModel'

const router = useRouter()
const { t } = useI18n()

const checkStrategy = ref<'all' | 'unfinished' | 'finished'>('all')

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
  strategy: 'all' | 'unfinished' | 'finished',
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
    <div class="rounded-lg p-10 w-65%" bg="white dark:gray-700" m="t-10 auto">
      <div m="b-2" flex="~" justify="between" items="center">
        <n-h2>
          {{ t('assignments.index.preprint_list') }}
        </n-h2>
        <n-radio-group v-model:value="checkStrategy">
          <n-radio-button value="all">
            {{ t('assignments.index.actions.all') }}
          </n-radio-button>
          <n-radio-button value="unfinished">
            {{ t('assignments.index.actions.unfinished') }}
          </n-radio-button>
          <n-radio-button value="finished">
            {{ t('assignments.index.actions.finished') }}
          </n-radio-button>
        </n-radio-group>
      </div>
      <n-list bordered>
        <n-list-item v-for="(preprint, _preprintIdx) of preprintResult?.items" :key="_preprintIdx">
          <div flex="~" justify-between items-center>
            <n-thing :title="preprint.title">
              <template #avatar>
                <div class="h-full w-full" flex="~" items-center justify-center>
                  <n-tag type="primary" class="h-10 w-10" flex="~" items-center justify-center>
                    {{ _preprintIdx + 1 }}
                  </n-tag>
                </div>
              </template>
              <template #description>
                <n-ellipsis style="width: 400px;">
                  {{ preprint.abstract }}
                </n-ellipsis>
              </template>
            </n-thing>
            <n-thing :title="t('assignments.index.preprint.year')">
              <template #description>
                {{ preprint.journal?.year }}
              </template>
            </n-thing>
            <n-thing w="30" :title="t('assignments.index.preprint.authors')">
              <template #description>
                <div flex="~ gap-2" items-center justify-start>
                  <template v-for="author, _idx of preprint.authors" :key="_idx">
                    <n-badge :dot="author.primary">
                      <n-tag> {{ author.firstName }} </n-tag>
                    </n-badge>
                  </template>
                </div>
              </template>
            </n-thing>
            <n-thing :title="t('assignments.index.preprint.status')">
              <template #description>
                <div
                  class="cursor-pointer w-20 underline decoration-green-500"
                  @click="router.push(`/assignments/preprints/${preprint.id}`)"
                >
                  {{ preprint.statusProgress?.slice(-1)[0]?.title }}
                </div>
              </template>
            </n-thing>
            <n-thing :title="t('assignments.index.preprint.update_time')">
              <template #description>
                {{ preprint.updateTime }}
              </template>
            </n-thing>
            <NButton quaternary type="primary" @click="router.push(`/assignments/preprints/create/${preprint.id}`)">
              Detail
            </NButton>
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
