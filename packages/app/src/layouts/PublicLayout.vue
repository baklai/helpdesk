<script setup>
import { inject, ref } from 'vue';

const $helpdesk = inject('helpdesk');

const disabledSelectedFromHTML = ref({
  '-webkit-user-select': 'none',
  '-moz-user-select': 'none',
  '-ms-user-select': 'none',
  '-o-user-select': 'none',
  'user-select': 'none'
});
</script>

<template>
  <div
    class="from-surface-950 to-primary-950 flex h-screen min-h-screen min-w-full overflow-hidden bg-linear-to-tr"
    :style="disabledSelectedFromHTML"
  >
    <div
      :class="[
        'bg-surface-50 dark:bg-surface-900 flex h-full w-full flex-col justify-between px-6 py-6 lg:w-1/3',
        'bg-[url(/img/background.svg)] bg-cover bg-center bg-no-repeat lg:bg-none'
      ]"
    >
      <div class="mb-2 flex flex-col items-center justify-center">
        <div class="flex flex-row items-center">
          <p
            class="text-surface-950 dark:text-surface-50 text-6xl font-bold uppercase"
            lang="en"
            translate="no"
          >
            help
          </p>
          <AppLogo class="text-primary-500 mx-2" :size="60" />
          <p
            class="text-surface-950 dark:text-surface-50 text-6xl font-bold uppercase"
            lang="en"
            translate="no"
          >
            desk
          </p>
        </div>

        <p class="text-surface-500 text-xl font-medium">Веб-додаток сервісної підтримки</p>
      </div>

      <main class="flex flex-col items-center gap-4">
        <RouterView />
      </main>

      <p class="font-mormal text-surface-500 text-center">
        Є проблема? Дозвольте нам допомогти вам.
      </p>
    </div>

    <div
      class="hidden w-2/3 flex-col items-center justify-between bg-[url('/img/background.svg')] bg-cover bg-center bg-no-repeat px-6 py-6 lg:flex"
    >
      <div class="m-auto flex flex-col items-center justify-center">
        <div class="mb-2 flex flex-row items-center">
          <p class="text-surface-100 text-8xl font-bold uppercase" lang="en" translate="no">help</p>
          <AppLogo class="text-primary-500 mx-2" :size="98" :stroke="'rgb(var(--primary-900))'" />
          <p class="text-surface-100 text-8xl font-bold uppercase" lang="en" translate="no">desk</p>
        </div>

        <div class="mb-8 text-center">
          <p class="text-surface-300 text-xl font-medium">Веб-додаток сервісної підтримки</p>
        </div>

        <div class="mb-8 w-136 text-center">
          <p class="line-height-2 text-surface-400 text-xl">
            Сервісна підтримка - це тип обслуговування клієнтів, яка надає допомогу клієнтам з
            сервісними та технічними проблемами щодо їхніх продуктів або послуг
          </p>
        </div>

        <p class="text-center">
          <RouterLink
            class="text-primary-600 hover:text-primary-500 font-medium uppercase"
            :to="{ name: 'home' }"
          >
            Головна сторінка
          </RouterLink>
        </p>
      </div>

      <div class="text-surface-300 flex items-center">
        <p class="py-4 font-semibold">
          {{ $helpdesk?.settings?.copyright }}
        </p>
      </div>
    </div>
  </div>
</template>
