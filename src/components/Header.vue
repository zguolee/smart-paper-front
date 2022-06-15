<script setup lang="ts">
import { toggleDark } from '~/composables'
import { getAppEnvConfig } from '~/utils/env'
import { useUserStore } from '~/stores/user'

const userStore = useUserStore()
const router = useRouter()
const { t, availableLocales, locale } = useI18n()
const { VITE_APP_TITLE } = getAppEnvConfig()

const userInfo = computed(() => userStore.getUserInfo())
const rolesOptions = computed(() => userInfo.value.roles.map(role => ({ label: role.title, value: role.value })))

const toggleLocales = () => {
  const locales = availableLocales
  locale.value = locales[(locales.indexOf(locale.value) + 1) % locales.length]
}
const roleIcons: any = {
  admin: 'i-carbon-user-settings',
  author: 'i-carbon-edit',
  editor: 'i-carbon-load-balancer-global',
  reviewer: 'i-carbon-user-admin',
}

const routerPath: any = {
  admin: 'dashboard',
  author: 'dashboard',
  editor: 'assignments',
  reviewer: 'review',
}
</script>

<template>
  <nav
    class="bg-white shadow text-xl p-4 top-0 right-0 left-0 z-100 fixed" dark="shadow-gray-700 bg-dark" flex="~"
    justify-between items-center
  >
    <div flex="~ gap-10" justify-center items-center>
      <div class="transition ease-in-out duration-200" flex="~ gap-2" justify-center items-center>
        <div class="bg-gradient-to-br from-green-200 to-green-500" i="carbon-campsite" text="3xl" />
        <div class="font-medium">
          {{ VITE_APP_TITLE }}
        </div>
      </div>
      <n-button class="text-xl" text tag="a" target="_blank" type="primary" @click="router.replace('/dashboard')">
        {{ t('menu.preprints') }}
      </n-button>
      <n-button class="text-xl" text tag="a" target="_blank" type="primary" @click="router.replace('/users')">
        {{ t('menu.users') }}
      </n-button>
    </div>
    <div flex="~ gap-2" justify-center items-center>
      <div
        class="cursor-pointer justify-center items-center" flex="~ gap-2"
        @click="router.push(`/users/${userInfo.id}`)"
      >
        <n-avatar round size="small" :src="userInfo.avatar" />
        <div hover="text-teal-600">
          {{ userInfo.firstName }}
        </div>
      </div>
      <NDivider vertical />

      <div flex="~ gap-2">
        <template v-for="role, _roleIdx of rolesOptions" :key="_roleIdx">
          <div
            class="cursor-pointer transition ease-in-out duration-200" hover="text-teal-600"
            :class="roleIcons[role.value]" :title="role.label"
            @click="router.replace(`/${routerPath[role.value]}`)"
          />
        </template>
      </div>
      <NDivider vertical />
      <div flex="~ gap-2">
        <div
          class="cursor-pointer transition ease-in-out duration-200" i="carbon-logout" hover="text-teal-600"
          @click="userStore.logout(true)"
        />
        <div
          class="cursor-pointer transition ease-in-out duration-200" i="carbon-language" hover="text-teal-600"
          @click="toggleLocales"
        />
        <div
          class="cursor-pointer transition ease-in-out duration-200" i="carbon-sun dark:carbon-moon"
          hover="text-teal-600" @click="toggleDark()"
        />
      </div>
    </div>
  </nav>
</template>
