<script setup lang="ts">
import { getPreprintListApi } from '~/apis/sys/preprint'
import type { PreprintModel, PreprintStrategy } from '~/apis//sys/model/preprintModel'

const router = useRouter()

const { t } = useI18n()

const checkStrategy = ref<PreprintStrategy>('all')

const preprintResult = ref<{
  items: PreprintModel[]
  total: number
}>()

const paginationState = ref<{
  page: number
  pageSize: number
}>({
  page: 1,
  pageSize: 6,
})

const getPreprintList = async (
  page: number,
  pageSize: number,
  strategy: PreprintStrategy,
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

const showStatusProgressesModal = ref(false)
const choosePreprint = ref<PreprintModel>()
const handleShowPreprintStatusProgresses = (preprint: PreprintModel) => {
  choosePreprint.value = preprint
  showStatusProgressesModal.value = true
}
</script>

<template>
  <div>
    <div class="rounded-lg p-10 w-80%" bg="white dark:gray-700" m="t-10 auto">
      <div m="b-2" flex="~" justify="between" items="center">
        <n-h2>
          {{ t('dashboard.index.preprint_list') }}
        </n-h2>
        <n-radio-group v-model:value="checkStrategy">
          <n-radio-button value="all">
            {{ t('dashboard.index.actions.all') }}
          </n-radio-button>
          <n-radio-button value="accepted">
            {{ t('dashboard.index.actions.accepted') }}
          </n-radio-button>
          <n-radio-button value="rejected">
            {{ t('dashboard.index.actions.rejected') }}
          </n-radio-button>
        </n-radio-group>
      </div>
      <n-button type="primary" block dashed @click="router.push('/dashboard/preprints/create')">
        <div text="xl" i="carbon-add" />
        {{ t('dashboard.index.actions.create_new_preprint') }}
      </n-button>
      <n-table class="mt-4 text-center" :single-line="false">
        <thead>
          <tr>
            <th>ID</th>
            <th>{{ t('dashboard.index.preprint.title_abstract') }}</th>
            <th>{{ t('dashboard.index.preprint.authors') }}</th>
            <th>{{ t('dashboard.index.preprint.status') }}</th>
            <th>{{ t('dashboard.index.preprint.update_time') }}</th>
            <th>{{ t('dashboard.index.preprint.actions') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(preprint, _preprintIdx) of preprintResult?.items" :key="_preprintIdx">
            <td>
              {{ _preprintIdx + 1 }}
            </td>
            <td class="text-left">
              <div class="font-black text-xl">
                {{ preprint.title }}
              </div>
              <n-ellipsis style="width: 400px;">
                {{ preprint.abstract }}
              </n-ellipsis>
            </td>
            <td>
              <div flex="~ gap-2" items-center justify-start>
                <template v-for="author, _idx of JSON.parse(preprint.authors)" :key="_idx">
                  <n-badge :dot="author.primary">
                    <n-tag> {{ `${author.firstName} ${author.lastName}` }} </n-tag>
                  </n-badge>
                </template>
              </div>
            </td>
            <td>
              <n-tag
                :type="preprint.statusProgresses?.some(item => item.title === 'Rejected') ? 'error' : 'success'"
                size="small"
                @click="handleShowPreprintStatusProgresses(preprint)"
              >
                <div class="cursor-pointer font-black underline">
                  {{ preprint.statusProgresses?.slice(-1)[0]?.title }}
                </div>
              </n-tag>
            </td>
            <td>
              {{ preprint.updatedAt }}
            </td>
            <td>
              <NButton
                type="primary" dashed
                :disabled="!preprint.statusProgresses?.some(item => item.title === 'Rejected') && !(preprint.statusProgresses?.length === 1)"
                @click="router.push(`/dashboard/preprints/create/${preprint.id}`)"
              >
                Detail
              </NButton>
            </td>
          </tr>
        </tbody>
      </n-table>
      <div class="mt-4" flex="~" justify="center">
        <n-pagination
          v-model:page="paginationState.page"
          :page-count="Math.floor((preprintResult?.total || 0) / paginationState.pageSize) + 1"
          :on-update:page="handlePreprintList"
        />
      </div>
    </div>
    <n-modal v-model:show="showStatusProgressesModal">
      <n-card style="width: 600px" title="Review Process" :bordered="false" size="huge" role="dialog" aria-modal="true">
        <n-timeline>
          <template v-for="status, _idx of choosePreprint?.statusProgresses" :key="_idx">
            <n-timeline-item
              :type="status.title === 'Rejected' ? 'error' : 'success'"
              :title="status.title"
              :time="status.createdAt"
            >
              <template #default>
                {{ status.content }}
              </template>
            </n-timeline-item>
          </template>
        </n-timeline>
        <template #footer>
          Good luck!
        </template>
      </n-card>
    </n-modal>
  </div>
</template>

<route lang="yaml">
meta:
  layout: dashboard
</route>
