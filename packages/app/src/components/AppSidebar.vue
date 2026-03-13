<script setup>
import { useConfigStore } from '@/stores/config.store';

const configStore = useConfigStore();
</script>

<template>
  <div class="flex h-full list-none flex-row">
    <nav
      :class="[
        'z-10',
        'flex flex-col',
        'bg-surface-100 dark:bg-surface-900',
        'border-r-surface-200 dark:border-r-surface-700 border-r border-solid'
      ]"
    >
      <div class="flex h-full flex-col">
        <div v-if="configStore.appSideBarMini" class="flex flex-none justify-center py-4">
          <RouterLink :to="{ name: 'home' }">
            <AppLogo class="text-surface-500" :size="32" />
          </RouterLink>
        </div>

        <SidebarMMenu class="flex flex-auto flex-col justify-center" />

        <div class="flex flex-none justify-center py-2">
          <BtnAuth v-if="configStore.appSideBarMini" />
        </div>
      </div>
    </nav>

    <transition name="slide">
      <div
        v-if="!configStore.appSideBarMini"
        :class="['flex flex-col', 'h-full w-full px-6', 'bg-surface-100/50 dark:bg-surface-900/50']"
      >
        <RouterLink class="mb-6 flex justify-center py-4" :to="{ name: 'home' }">
          <div class="mb-2 flex flex-col items-center justify-center">
            <div class="text-surface-900 dark:text-surface-50 flex flex-row items-center">
              <p class="text-4xl font-bold uppercase" lang="en" translate="no">
                h&nbsp;e&nbsp;l&nbsp;p&nbsp;
              </p>
              <AppLogo class="text-primary-500 mx-1" :size="32" />
              <p class="text-4xl font-bold uppercase" lang="en" translate="no">
                &nbsp;d&nbsp;e&nbsp;s&nbsp;k
              </p>
            </div>
            <div class="flex text-center">
              <p class="text-surface-500 text-base font-medium">Веб-додаток сервісної підтримки</p>
            </div>
          </div>
        </RouterLink>

        <div v-if="$route?.meta?.title" class="mt-2 mb-10 flex justify-start">
          <div class="mr-2 flex items-center justify-center">
            <Avatar class="mr-2" size="xlarge">
              <AppIcon :path="$route.meta.icon" :size="32" />
            </Avatar>
          </div>
          <div class="flex flex-col items-start justify-center">
            <span class="text-2xl">{{ $route?.meta?.title }}</span>
            <p class="text-surface-500 text-sm">
              {{ $route?.meta?.description }}
            </p>
          </div>
        </div>

        <div class="flex flex-auto flex-col overflow-y-scroll" style="scrollbar-width: none">
          <SidebarMenu />
        </div>

        <div class="flex flex-none flex-row content-center items-center justify-between py-2">
          <BtnInfoProfile />
          <BtnToggleTheme />
          <BtnStorageClient />
          <BtnAuth />
        </div>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease-in-out;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(-100%);
}
</style>
