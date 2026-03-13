<script setup>
import { dateToStr } from '@/utils/DateMethods';

defineProps({
  icon: { type: String, required: true },
  label: { type: String, required: true },
  value: { type: [String, Number], default: '-' }
});
</script>

<template>
  <div
    class="border-surface-300 bg-surface-50 dark:border-surface-600 dark:bg-surface-800 mb-0 rounded-lg border p-6"
  >
    <div class="mb-4 flex justify-between">
      <div>
        <span class="text-muted-color mb-4 block font-medium">{{ label }}</span>
        <div class="text-surface-900 dark:text-surface-0 text-xl font-medium">
          {{ value }}
        </div>
      </div>
      <div
        class="rounded-border flex h-12 w-12 items-center justify-center bg-blue-100 dark:bg-blue-400/10"
      >
        <AppIcon :path="icon" :size="24" />
      </div>
    </div>
    <span class="text-primary text-sm font-medium">актуально на </span
    ><span class="text-muted-color text-sm">{{ dateToStr(Date.now()) }}</span>
  </div>
</template>
