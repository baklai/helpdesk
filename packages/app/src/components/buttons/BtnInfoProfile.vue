<script setup>
import { mdiAccountOutline } from '@mdi/js';
import { defineAsyncComponent, ref } from 'vue';

const AppProfile = defineAsyncComponent(() => import('@/components/AppProfile.vue'));

const visible = ref(false);
</script>

<template>
  <Button
    v-tooltip.top="'Профіль облікового запису'"
    rounded
    severity="secondary"
    variant="text"
    @click="visible = !visible"
  >
    <template #icon>
      <AppIcon :path="mdiAccountOutline" :size="24" />
    </template>
  </Button>

  <AppProfile v-if="visible" v-model:visible="visible" />
</template>
