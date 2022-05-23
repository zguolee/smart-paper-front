<template>
  <main class="h-full" text="gray-700 dark:gray-200">
    <n-notification-provider>
      <n-message-provider>
        <RouterView />
      </n-message-provider>
    </n-notification-provider>
    <div class="opacity-25" m="x-auto t-5" text="center sm">
      [Default Layout]
    </div>
  </main>
</template>
