<script setup>
import { mdiViewGridOutline } from '@mdi/js';
import { ref } from 'vue';

const isOpen = ref(false);
const isClosing = ref(false);
const isAnimationComplete = ref(false);

const paths = ref([
  'm0.005959,200.364029l207.551124,0l0,204.342453l-207.551124,0l0,-204.342453z',
  'm0.005959,400.45401l207.551124,0l0,204.342499l-207.551124,0l0,-204.342499z',
  'm0.005959,600.544067l207.551124,0l0,204.342468l-207.551124,0l0,-204.342468z',
  'm205.752151,-0.36l207.551163,0l0,204.342437l-207.551163,0l0,-204.342437z',
  'm204.744629,200.364029l207.551147,0l0,204.342453l-207.551147,0l0,-204.342453z',
  'm204.744629,400.45401l207.551147,0l0,204.342499l-207.551147,0l0,-204.342499z',
  'm204.744629,600.544067l207.551147,0l0,204.342468l-207.551147,0l0,-204.342468z',
  'm410.416046,-0.36l207.551117,0l0,204.342437l-207.551117,0l0,-204.342437z',
  'm410.416046,200.364029l207.551117,0l0,204.342453l-207.551117,0l0,-204.342453z',
  'm410.416046,400.45401l207.551117,0l0,204.342499l-207.551117,0l0,-204.342499z',
  'm410.416046,600.544067l207.551117,0l0,204.342468l-207.551117,0l0,-204.342468z',
  'm616.087402,-0.36l207.551086,0l0,204.342437l-207.551086,0l0,-204.342437z',
  'm616.087402,200.364029l207.551086,0l0,204.342453l-207.551086,0l0,-204.342453z',
  'm616.087402,400.45401l207.551086,0l0,204.342499l-207.551086,0l0,-204.342499z',
  'm616.087402,600.544067l207.551086,0l0,204.342468l-207.551086,0l0,-204.342468z',
  'm821.748718,-0.36l207.550964,0l0,204.342437l-207.550964,0l0,-204.342437z',
  'm821.748718,200.364029l207.550964,0l0,204.342453l-207.550964,0l0,-204.342453z',
  'm821.748718,400.45401l207.550964,0l0,204.342499l-207.550964,0l0,-204.342499z',
  'm821.748718,600.544067l207.550964,0l0,204.342468l-207.550964,0l0,-204.342468z',
  'm1027.203979,-0.36l207.550903,0l0,204.342437l-207.550903,0l0,-204.342437z',
  'm1027.203979,200.364029l207.550903,0l0,204.342453l-207.550903,0l0,-204.342453z',
  'm1027.203979,400.45401l207.550903,0l0,204.342499l-207.550903,0l0,-204.342499z',
  'm1027.203979,600.544067l207.550903,0l0,204.342468l-207.550903,0l0,-204.342468z',
  'm1232.659302,-0.36l207.551147,0l0,204.342437l-207.551147,0l0,-204.342437z',
  'm1232.659302,200.364029l207.551147,0l0,204.342453l-207.551147,0l0,-204.342453z',
  'm1232.659302,400.45401l207.551147,0l0,204.342499l-207.551147,0l0,-204.342499z',
  'm1232.659302,600.544067l207.551147,0l0,204.342468l-207.551147,0l0,-204.342468z',
  'm-0.791443,-0.360001l207.551163,0l0,204.342438l-207.551163,0l0,-204.342438z'
]);

const pathVisible = ref(Array(paths.value.length).fill(false));

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function toggleOverlay() {
  if (isOpen.value) {
    closeOverlay();
  } else {
    openOverlay();
  }
}

function openOverlay() {
  shuffleArray(paths.value);
  isOpen.value = true;
  isAnimationComplete.value = false;

  let cnt = 0;
  paths.value.forEach((_, i) => {
    setTimeout(() => {
      pathVisible.value[i] = true;
      cnt++;
      if (cnt === paths.value.length) {
        isAnimationComplete.value = true;
      }
    }, i * 30);
  });
}
function closeOverlay() {
  isClosing.value = true;
  isAnimationComplete.value = false;

  let cnt = 0;
  paths.value.forEach((_, i) => {
    setTimeout(() => {
      pathVisible.value[i] = false;
      cnt++;
      if (cnt === paths.value.length) {
        isOpen.value = false;
        isClosing.value = false;
      }
    }, i * 30);
  });
}
</script>

<template>
  <Button
    v-tooltip.bottom="'Головне меню'"
    rounded
    severity="secondary"
    variant="text"
    @click="toggleOverlay"
  >
    <template #icon>
      <AppIcon :path="mdiViewGridOutline" :size="24" />
    </template>
  </Button>

  <section
    v-if="isOpen"
    :class="[
      'fixed top-0 right-0 bottom-0 left-0',
      'z-1101 h-[101%] w-full',
      'flex items-center justify-center',
      'pointer-events-auto'
    ]"
  >
    <svg
      class="h-full w-full"
      preserveAspectRatio="none"
      viewBox="0 0 1440 806"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        v-for="(path, index) in paths"
        :key="`path-${index}`"
        class="fill-surface-100 dark:fill-surface-900 z-0 hidden"
        :d="path"
        :style="{ display: pathVisible[index] ? 'block' : 'none' }"
      />
    </svg>

    <transition mode="out-in" name="fade">
      <div
        v-if="!isClosing && isAnimationComplete"
        class="absolute top-0 right-0 left-0 flex items-center justify-between p-4"
      >
        <AppLogo class="text-primary-500 mx-2" :size="24" />
        <Button
          v-tooltip.bottom="'Закрити меню'"
          icon="pi pi-times"
          iconClass="text-2xl!"
          rounded
          severity="secondary"
          variant="text"
          @click="toggleOverlay"
        />
      </div>
    </transition>

    <transition mode="out-in" name="fade">
      <nav v-if="!isClosing && isAnimationComplete" class="absolute flex flex-col">
        <div class="w-full place-content-center overflow-y-auto">
          <div class="my-8 flex flex-col place-content-center lg:my-0 lg:flex-row">
            <div class="flex w-auto flex-col items-center justify-center">
              <header class="flex items-center justify-center">
                <div class="h-auto w-120 text-center">
                  <div class="mb-2 flex flex-row items-center justify-center">
                    <p class="text-6xl font-bold uppercase" lang="en" translate="no">help</p>
                    <AppLogo class="text-primary-500 mx-2" :size="56" />
                    <p class="text-6xl font-bold uppercase" lang="en" translate="no">desk</p>
                  </div>

                  <div class="mb-8 text-center">
                    <p class="text-surface-500 font-medium">Веб-додаток сервісної підтримки</p>
                  </div>

                  <div class="mb-8 text-center">
                    <p class="line-height-2 text-surface-500 text-lg">
                      Сервісна підтримка - це тип обслуговування клієнтів, яке надає допомогу
                      клієнтам з сервісними та технічними проблемами щодо їхніх продуктів або послуг
                    </p>
                  </div>
                </div>
              </header>

              <div class="flex items-center py-4">
                <p class="text-surface-500 text-center text-sm">
                  {{ $helpdesk?.settings?.copyright }}
                </p>
              </div>
            </div>

            <div class="mx-8 w-auto">
              <Divider class="hidden! lg:flex!" layout="vertical" />
              <Divider class="flex! lg:hidden!" layout="horizontal" />
            </div>

            <div class="flex w-auto items-center justify-center py-8">
              <main
                class="text-surface-600 dark:text-surface-300 w-140 items-center justify-center"
              >
                <section id="events" class="mb-6">
                  <h3 class="text-surface-600 dark:text-surface-100 mb-2 text-2xl font-semibold">
                    Календар подій
                  </h3>
                  <span class="text-md font-light">
                    <RouterLink
                      class="text-primary-500 hover:text-primary-400 font-semibold"
                      :to="{ name: 'events' }"
                    >
                      Календар подій
                    </RouterLink>
                    містить усю інформацію, необхідну для планування роботи.
                  </span>
                </section>

                <section id="hd-live-log" class="mb-6">
                  <h3 class="text-surface-600 dark:text-surface-100 mb-2 text-2xl font-semibold">
                    Сервісна підтримка
                  </h3>
                  <span class="text-md font-light">
                    <RouterLink
                      class="text-primary-500 hover:text-primary-400 font-semibold"
                      :to="{ name: 'requests' }"
                    >
                      Сервісна підтримка
                    </RouterLink>
                    веб-додаток дозволяє користувачам надсилати запити на підтримку через
                    веб-інтерфейс, трек статус запиту, а також надавати статистику та аналітику
                    продуктивності служби підтримки.
                  </span>
                </section>

                <section id="ipaddresses">
                  <h3 class="text-surface-600 dark:text-surface-100 mb-2 text-2xl font-semibold">
                    Мережева інформація
                  </h3>
                  <span class="text-md font-light">
                    <RouterLink
                      class="text-primary-500 hover:text-primary-400 font-semibold"
                      :to="{ name: 'ipaddresses' }"
                    >
                      Мережева інформація
                    </RouterLink>
                    веб-сервіс призначений для відстеження IP-адрес мережевих пристроїв і
                    користувачів в локальній мережі. Це дозволяє адміністраторам вести облік, а
                    також забезпечує інформація про наявність пристроїв та їх поточний стан.
                  </span>
                </section>
              </main>
            </div>
          </div>
        </div>
      </nav>
    </transition>
  </section>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
