<script lang="ts" setup>
import { useMessage } from 'naive-ui'
window.$message = useMessage()
</script>

<template>
  <main class="min-h-full" text="gray-700 dark:gray-200" bg="light dark:dark">
    <RouterView />
    <div class="opacity-25" text="center sm">
      [Default Layout]
    </div>
  </main>
</template>

