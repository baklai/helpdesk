<script setup>
defineProps({
  label: { type: String, required: true },
  description: { type: String, default: '' },
  error: { type: String, default: null }
});
</script>

<template>
  <div class="flex flex-col items-start gap-4 py-2 lg:flex-row lg:gap-8">
    <div class="flex w-full flex-col gap-2 lg:w-120">
      <p class="text-surface-950 dark:text-surface-0 text-lg leading-7 font-medium">{{ label }}</p>
      <p class="text-surface-500 dark:text-surface-400 text-base leading-normal font-normal">
        {{ description }}
      </p>
    </div>

    <div class="flex w-full flex-1 flex-col gap-2">
      <div class="flex w-full flex-row gap-2">
        <slot name="field" />
      </div>
      <Message v-if="error" severity="error" size="small" variant="simple">
        {{ error }}
      </Message>
    </div>
  </div>

  <slot name="divider" />
</template>
