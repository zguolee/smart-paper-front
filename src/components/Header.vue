<script setup lang="ts">
import { toggleDark } from '~/composables'
import { getAppEnvConfig } from '~/utils/env'

const { t, availableLocales, locale } = useI18n()
const { VITE_APP_TITLE } = getAppEnvConfig()

const toggleLocales = () => {
  // change to some real logic
  const locales = availableLocales
  locale.value = locales[(locales.indexOf(locale.value) + 1) % locales.length]
}

const options = [
  {
    label: '用户资料',
    key: 'profile',
  },
  {
    label: '编辑用户资料',
    key: 'editProfile',
  },
  {
    label: '退出登录',
    key: 'logout',
  },
]
</script>

<template>
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
      <router-link
        class="transition ease-in-out duration-200"
        flex="~ gap-2" justify-center items-center
        to="/" :title="t('menu.preprints')" hover="text-teal-600"
      >
        <div i="carbon-campsite" />{{ t('menu.preprints') }}
      </router-link>
    </div>
    <div flex="~ gap-4" justify-center items-center>
      <NDropdown :options="options">
        <div flex="~ gap-2" justify-center items-center>
          <NAvatar
            round
            size="small"
            src="https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg"
          />
          <div hover="text-teal-600">
            User
          </div>
        </div>
      </NDropdown>
      <div
        class="transition ease-in-out duration-200"
        i="carbon-language" :title="t('button.toggle_langs')"
        hover="text-teal-600"
        @click="toggleLocales"
      />
      <div
        class="transition ease-in-out duration-200"
        i="carbon-sun dark:carbon-moon" :title="t('button.toggle_dark')"
        hover="text-teal-600"
        @click="toggleDark()"
      />
      <a
        class="transition ease-in-out duration-200"
        rel="noreferrer" href="https://github.com/zguolee/easy-paper" target="_blank" title="GitHub"
      >
        <div i="carbon-logo-github" />
      </a>
    </div>
  </nav>
</template>
