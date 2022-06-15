<script lang="ts" setup>
import { useMessage } from 'naive-ui'
window.$message = useMessage()
</script>

<template>
  <main class="min-h-full py-20" text="gray-700 dark:gray-200" bg="light dark:dark">
    <Header />
    <RouterView />
    <div class="mt-6 opacity-25" text="center sm">
      [Dashboard Layout]
    </div>
  </main>
</template>
