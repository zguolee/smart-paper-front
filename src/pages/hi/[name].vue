<script setup lang="ts">
const props = defineProps<{ name: string }>()
const router = useRouter()
const { t } = useI18n()
</script>

<template>
  <div>
    <div class="text-4xl">
      <div i="carbon-pedestrian" />
    </div>
    <p>
      {{ t('intro.hi', { name: props.name }) }}
    </p>

    <p class="text-sm opacity-50">
      <em>{{ t('intro.dynamic-route') }}</em>
    </p>

    <div>
      <button class="text-sm btn" m="3 t-6" @click="router.back()">
        {{ t('button.back') }}
      </button>
    </div>
  </div>
</template>
