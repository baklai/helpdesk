<script setup>
import { useConfigStore } from '@/stores/config.store';

const configStore = useConfigStore();
</script>

<template>
  <div class="flex h-full w-full flex-col place-content-center items-center">
    <h1 class="mb-2 text-5xl font-bold">Не знайдено</h1>
    <span class="text-surface-500 mb-8 text-xl"> Запитаний ресурс недоступний </span>
    <img
      alt="Не знайдено"
      class="mb-6"
      :src="configStore.appThemeMode === 'light' ? '/img/404-dark.webp' : '/img/404-light.webp'"
      width="300"
    />
    <div class="text-primary-600 hover:text-primary-500 font-semibold uppercase">
      <i class="pi pi-home mr-2"></i>
      <RouterLink :to="{ name: 'home' }"> Головна сторінка </RouterLink>
    </div>
  </div>
</template>
