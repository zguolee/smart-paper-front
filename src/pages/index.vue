<script setup lang="ts">
import { getAppEnvConfig } from '~/utils/env'

const { VITE_APP_TITLE } = getAppEnvConfig()

const router = useRouter()

const { t } = useI18n()
</script>

<template>
  <div>
    <nav
      class="shadow text-xl p-4"
      dark="shadow-gray-700"
      flex="~" justify-between items-center
    >
      <div
        flex="~ gap-4" justify-center items-center
      >
        <div
          class="transition ease-in-out duration-200"
          flex="~ gap-2" justify-center items-center
        >
          <div class="bg-gradient-to-br from-blue-200 to-blue-500" i="carbon-campsite" text="3xl" />
          <div class="font-medium">
            {{ VITE_APP_TITLE }}
          </div>
        </div>
      </div>
    </nav>
    <div bg="green-700" text="white center" p="20">
      <div text="3xl">
        Try Smart Paper, the world's most popular paper submission platform
      </div>
      <div m="t10">
        Millions of people around the world have already made Smart Paper
        <br>
        the place where their dream happens.
      </div>
      <n-button class="mx-auto mt-10 !bg-white !text-green-600 !w-40" type="default" block @click="router.push('/sys/login')">
        开始
      </n-button>
    </div>
  </div>
</template>

<route lang="yaml">
meta:
  layout: default
</route>
