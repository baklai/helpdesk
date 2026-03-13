<script setup>
import { mdiCloudUploadOutline } from '@mdi/js';
</script>

<template>
  <Button
    v-if="$helpdesk?.settings?.filestorage"
    v-tooltip.bottom="'Файлове сховище'"
    as="a"
    :href="$helpdesk.settings.filestorage"
    rel="noopener"
    rounded
    severity="secondary"
    target="_blank"
    variant="text"
  >
    <template #icon>
      <AppIcon :path="mdiCloudUploadOutline" :size="24" />
    </template>
  </Button>
</template>
