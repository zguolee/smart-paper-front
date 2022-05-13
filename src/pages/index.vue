<script setup lang="ts">
import { useUserStore } from '~/stores/user'

const user = useUserStore()
const name = $ref(user.savedName)

const router = useRouter()
const go = () => {
  if (name)
    router.push(`/hi/${encodeURIComponent(name)}`)
}

const { t } = useI18n()
</script>

<template>
  <div>
    <div class="text-4xl">
      <div i="carbon-campsite" />
    </div>
    <p>Vitesse</p>
    <p>
      <em class="text-sm opacity-75">{{ t('intro.desc') }}</em>
    </p>

    <div class="py-4" />

    <input
      id="input"
      v-model="name"
      :placeholder="t('intro.whats-your-name')"
      :aria-label="t('intro.whats-your-name')"
      type="text"
      autocomplete="false"
      class="bg-transparent text-center w-250px"
      p="x4 y2"
      border="~ rounded gray-200 dark:gray-700"
      outline="none active:none"
      @keydown.enter="go"
    >
    <label class="hidden" for="input">{{ t('intro.whats-your-name') }}</label>

    <div>
      <button class="m-3 text-sm btn" :disabled="!name" @click="go">
        {{ t('button.go') }}
      </button>
    </div>
  </div>
</template>

<route lang="yaml">
meta:
  layout: home
</route>
