<script setup>
import { mdiFullscreen, mdiFullscreenExit } from '@mdi/js';
import { useFullscreen } from '@vueuse/core';

const { isFullscreen, toggle } = useFullscreen();
</script>

<template>
  <Button
    v-tooltip.bottom="isFullscreen ? 'Зменшити' : 'Збільшити'"
    rounded
    severity="secondary"
    variant="text"
    @click="toggle"
  >
    <template #icon>
      <AppIcon :path="isFullscreen ? mdiFullscreenExit : mdiFullscreen" :size="24" />
    </template>
  </Button>
</template>
