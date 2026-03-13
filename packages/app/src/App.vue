<script setup>
import { onBeforeMount } from 'vue';

import { useConfigStore } from '@/stores/config.store';

const { initAppConfigs } = useConfigStore();

onBeforeMount(() => {
  initAppConfigs();
});
</script>

<template>
  <BtnConfig />

  <RouterView />

  <Toast class="z-100" position="top-right" />
</template>
