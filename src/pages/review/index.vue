<script setup lang="ts">
import { getPreprintListApi } from '~/apis/sys/preprint'
import type { PreprintModel } from '~/apis//sys/model/preprintModel'
import { useUserStore } from '~/stores/user'
import { formatDate } from '~/utils/dayjs'

const { t } = useI18n()
const router = useRouter()
const userStore = useUserStore()

const preprintResult = ref<{ items: PreprintModel[]; total: number }>()
const paginationState = ref<{ page: number; pageSize: number }>({ page: 1, pageSize: 10 })
const searchTitle = ref<string>('')

const getPreprintList = async (page: number, pageSize: number, title?: string) => {
  const res = await getPreprintListApi({ page, pageSize, title })
  preprintResult.value = res
}
getPreprintList(paginationState.value.page, paginationState.value.pageSize)

const handleSearch = (e: MouseEvent) => {
  e.preventDefault()
  getPreprintList(1, paginationState.value.pageSize, searchTitle.value)
}

const handlePreprintList = (page: number) => {
  paginationState.value.page = page
  getPreprintList(paginationState.value.page, paginationState.value.pageSize)
}

const checkReviewed = (item: PreprintModel) => {
  return item.comments?.find(comment => comment.reviewer.id === userStore.getUserInfo().id) !== undefined
}
</script>

<template>
  <div>
    <div class="rounded-lg p-10 w-80%" bg="white dark:gray-700" m="t-10 auto">
      <div m="b-2" flex="~" justify="between" items="center">
        <n-h2>
          {{ t('review.index.preprint_list') }}
        </n-h2>
        <div>
          <n-input-group>
            <n-input v-model:value="searchTitle" clearable class="!w-100" placeholder="Please input title" />
            <n-button type="primary" ghost @click="handleSearch">
              Search
            </n-button>
          </n-input-group>
        </div>
      </div>
      <n-table class="mt-4 text-center" :single-line="false">
        <thead>
          <tr>
            <th>ID</th>
            <th>{{ t('review.index.preprint.title_abstract') }}</th>
            <th>{{ t('review.index.preprint.authors') }}</th>
            <th>{{ t('review.index.preprint.status') }}</th>
            <th>{{ t('review.index.preprint.update_time') }}</th>
            <th>{{ t('review.index.preprint.actions') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(preprint, _preprintIdx) of preprintResult?.items" :key="_preprintIdx">
            <td>{{ _preprintIdx + 1 }}</td>
            <td class="text-left">
              <div class="font-black text-xl">
                {{ preprint.title }}
              </div>
              <n-ellipsis style="width: 400px;">
                {{ preprint.abstract }}
              </n-ellipsis>
            </td>
            <td>
              <div flex="~ col gap-2" items-start justify-start>
                <template v-for="author, _idx of JSON.parse(preprint.authors)" :key="_idx">
                  <n-badge :dot="author.primary">
                    <n-tag> {{ `${author.firstName} ${author.lastName}` }} </n-tag>
                  </n-badge>
                </template>
              </div>
            </td>
            <td>
              <n-tag :type="checkReviewed(preprint) ? 'success' : 'error'" size="small">
                <div class="cursor-pointer font-black underline">
                  {{ checkReviewed(preprint) ? 'Reviewed' : 'Unreviewed' }}
                </div>
              </n-tag>
            </td>
            <td>
              {{ formatDate(preprint.updatedAt) }}
            </td>
            <td>
              <NButton type="primary" dashed @click="router.push(`/review/${preprint.id}`)">
                Detail
              </NButton>
            </td>
          </tr>
        </tbody>
      </n-table>
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
