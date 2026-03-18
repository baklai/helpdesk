<script setup>
import { mdiHelpCircleOutline } from '@mdi/js';

const docsBaseUrl = import.meta.env.VITE_DOCS_BASE_URL || '/docs';
</script>

<template>
  <Button
    v-if="docsBaseUrl"
    v-tooltip.bottom="'Документація'"
    as="a"
    :href="docsBaseUrl"
    rel="noopener"
    rounded
    severity="secondary"
    target="_blank"
    variant="text"
  >
    <template #icon>
      <AppIcon :path="mdiHelpCircleOutline" :size="24" />
    </template>
  </Button>
</template>
