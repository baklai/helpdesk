<script setup>
import { onBeforeMount } from 'vue';

import { useConfigStore } from '@/stores/config.store';
import { useSysConfStore } from '@/stores/sysconf.store';

const configStore = useConfigStore();
const { initSysConf } = useSysConfStore();

onBeforeMount(() => {
  initSysConf();
});
</script>

<template>
  <div class="flex h-screen">
    <aside
      :class="[
        'z-50',
        'h-screen',
        'select-none',
        'absolute flex',
        { 'w-full': configStore.appSideBarVisible },
        { 'min-w-min': configStore.appSideBarVisible },
        { 'md:w-auto md:max-w-md': configStore.appSideBarMode === 'static' },
        { 'md:static md:flex-none': configStore.appSideBarMode === 'static' },
        { 'bg-transparent backdrop-blur-sm': configStore.appSideBarVisible }
      ]"
      @click.self="configStore.toggleAppSideBar"
    >
      <transition name="slide">
        <AppSidebar v-if="configStore.appSideBarVisible" />
      </transition>
    </aside>

    <div class="bg-surface-0 dark:bg-surface-900 flex flex-1 flex-col overflow-hidden">
      <AppTopbar />

      <main class="w-full flex-1 overflow-y-auto px-8">
        <RouterView />

        <ConfirmDialog modal position="top" />
      </main>
    </div>
  </div>
</template>

<style scoped>
.nested-enter-active .inner,
.nested-leave-active .inner {
  transition: all 0.3s ease-in-out;
}

.nested-enter-from .inner,
.nested-leave-to .inner {
  transform: translateX(30px);
  opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease-in-out;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(-100%);
}
</style>
