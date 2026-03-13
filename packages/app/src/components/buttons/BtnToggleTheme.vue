<script setup>
import { mdiThemeLightDark } from '@mdi/js';

import { useConfigStore } from '@/stores/config.store';

const configStore = useConfigStore();
</script>

<template>
  <Button
    v-tooltip.bottom="configStore.isDarkAppTheme ? 'Світла тема' : 'Темна тема'"
    rounded
    severity="secondary"
    variant="text"
    @click="
      configStore.isDarkAppTheme
        ? configStore.setAppThemeMode('light')
        : configStore.setAppThemeMode('dark')
    "
  >
    <template #icon>
      <AppIcon :path="mdiThemeLightDark" :size="22" />
    </template>
  </Button>
</template>
