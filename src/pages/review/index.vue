<script setup lang="ts">
import { getPreprintListApi } from '~/apis/sys/preprint'
import type { PreprintModel } from '~/apis//sys/model/preprintModel'
import { useUserStore } from '~/stores/user'

const { t } = useI18n()
const router = useRouter()
const userStore = useUserStore()

const checkStrategy = ref<'all' | 'unreviewed' | 'reviewed'>('all')

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
  strategy: 'all' | 'unreviewed' | 'reviewed',
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

const checkReviewed = (item: PreprintModel) => {
  return item.comments?.some(comment => comment.reviewer.id.toString() === userStore.getUserInfo().id)
}
</script>

<template>
  <div>
    <div class="rounded-lg p-10 w-65%" bg="white dark:gray-700" m="t-10 auto">
      <div m="b-2" flex="~" justify="between" items="center">
        <n-h2>
          {{ t('review.index.preprint_list') }}
        </n-h2>
        <n-radio-group v-model:value="checkStrategy">
          <n-radio-button value="all">
            {{ t('review.index.actions.all') }}
          </n-radio-button>
          <n-radio-button value="unreviewed">
            {{ t('review.index.actions.unreviewed') }}
          </n-radio-button>
          <n-radio-button value="reviewed">
            {{ t('review.index.actions.reviewed') }}
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
            <n-thing :title="t('review.index.preprint.year')">
              <template #description>
                {{ preprint.journal?.year }}
              </template>
            </n-thing>
            <n-thing w="20" :title="t('review.index.preprint.status')">
              <template #description>
                <n-tag
                  :type="checkReviewed(preprint) ? 'success' : 'error'"
                  size="small"
                >
                  <div
                    class="cursor-pointer font-black underline"
                    @click="router.push(`/review/preprints/${preprint.id}`)"
                  >
                    {{ checkReviewed(preprint) ? 'Reviewed' : 'Unreviewed' }}
                  </div>
                </n-tag>
              </template>
            </n-thing>
            <n-thing :title="t('review.index.preprint.update_time')">
              <template #description>
                {{ preprint.updateTime }}
              </template>
            </n-thing>
            <NButton type="primary" dashed @click="router.push(`/review/${preprint.id}`)">
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
