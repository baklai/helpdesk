<script setup>
import { mdiMenu } from '@mdi/js';

import { useConfigStore } from '@/stores/config.store';

const { toggleAppSideBar } = useConfigStore();
</script>

<template>
  <header class="transition-left flex h-20 items-center justify-between px-8 py-0 duration-200">
    <Button rounded severity="secondary" variant="text" @click="toggleAppSideBar">
      <template #icon>
        <AppIcon :path="mdiMenu" :size="24" />
      </template>
    </Button>

    <div class="flex gap-x-6">
      <BtnStorageClient class="hidden md:flex" />
      <BtnToggleTheme class="hidden md:flex" />
      <BtnNotifications class="hidden md:flex" />
      <BtnFullScreen class="hidden md:flex" />
      <BtnDocuments class="hidden md:flex" />
      <BtnFullMenu />
    </div>
  </header>
</template>
