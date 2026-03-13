<script setup>
import { mdiCogOutline } from '@mdi/js';
import { defineAsyncComponent, ref } from 'vue';

const AppConfig = defineAsyncComponent(() => import('@/components/AppConfig.vue'));

const visible = ref(false);
</script>

<template>
  <button
    v-tooltip.left="'HD опції'"
    :class="[
      'group fixed top-1/2 right-0 z-50 block -translate-y-1/2 transform p-2',
      'bg-surface-800 dark:bg-surface-700',
      'rounded-none rounded-tl-md rounded-bl-md shadow-lg',
      'cursor-pointer text-white opacity-80 hover:opacity-100'
    ]"
    type="button"
    @click="visible = !visible"
  >
    <i class="inline-block rotate-0 transition duration-1000 group-hover:rotate-45">
      <AppIcon :path="mdiCogOutline" :size="24" />
    </i>
  </button>

  <AppConfig v-if="visible" v-model:visible="visible" />
</template>
