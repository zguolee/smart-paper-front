<script setup lang="ts">
import { toggleDark } from '~/composables'
import { getAppEnvConfig } from '~/utils/env'
import { useUserStore } from '~/stores/user'

const userStore = useUserStore()

const router = useRouter()

const { t, availableLocales, locale } = useI18n()
const { VITE_APP_TITLE } = getAppEnvConfig()

const userInfo = computed(() => userStore.getUserInfo())

const toggleLocales = () => {
  // change to some real logic
  const locales = availableLocales
  locale.value = locales[(locales.indexOf(locale.value) + 1) % locales.length]
}
</script>

<template>
  <nav class="bg-white shadow text-xl p-4 dark:bg-#121212" dark="shadow-gray-700" flex="~" justify-between items-center>
    <div flex="~ gap-10" justify-center items-center>
      <div class="transition ease-in-out duration-200" flex="~ gap-2" justify-center items-center>
        <div class="bg-gradient-to-br from-green-200 to-green-500" i="carbon-campsite" text="3xl" />
        <div class="font-medium">
          {{ VITE_APP_TITLE }}
        </div>
      </div>
      <n-button class="text-xl" text tag="a" target="_blank" type="primary" @click="router.push('/dashboard')">
        {{ t('menu.preprints') }}
      </n-button>
    </div>
    <div flex="~ gap-4" justify-center items-center>
      <div class="cursor-pointer justify-center items-center" flex="~ gap-2" @click="router.push(`/users/${userInfo.userId}`)">
        <n-avatar round size="small" :src="userInfo.avatar" />
        <div hover="text-teal-600">
          {{ userInfo.firstName }}
        </div>
      </div>
      <div class="cursor-pointer transition ease-in-out duration-200" i="carbon-logout" hover="text-teal-600" @click="userStore.logout(true)" />
      <div
        class="cursor-pointer transition ease-in-out duration-200" i="carbon-language" hover="text-teal-600"
        @click="toggleLocales"
      />
      <div
        class="cursor-pointer transition ease-in-out duration-200" i="carbon-sun dark:carbon-moon"
        hover="text-teal-600" @click="toggleDark()"
      />
    </div>
  </nav>
</template>
