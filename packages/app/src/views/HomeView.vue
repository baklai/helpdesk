<script setup></script>

<template>
  <div class="h-full w-full place-content-center">
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
                Сервісна підтримка - це тип обслуговування клієнтів, яка надає допомогу клієнтам з
                сервісними та технічними проблемами щодо їхніх продуктів або послуг
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
        <main class="text-surface-600 dark:text-surface-300 w-140 items-center justify-center">
          <section id="documentation" class="mb-6">
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

          <section id="requests" class="mb-6">
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
              веб-додаток дозволяє користувачам надсилати запити на підтримку через веб-інтерфейс,
              трек статус запиту, а також надавати статистику та аналітику продуктивності служби
              підтримки.
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
              веб-сервіс призначений для відстеження IP-адрес мережевих пристроїв і користувачів в
              локальній мережі. Це дозволяє адміністраторам вести облік, а також забезпечує
              інформація про наявність пристроїв та їх поточний стан.
            </span>
          </section>

          <section id="inspector">
            <h3 class="text-surface-600 dark:text-surface-100 mb-2 text-2xl font-semibold">
              ПК SysInspector
            </h3>
            <span class="text-md font-light">
              <RouterLink
                class="text-primary-500 hover:text-primary-400 font-semibold"
                :to="{ name: 'inspectors' }"
              >
                ПК SysInspector сервіс
              </RouterLink>
              збирає інформацію про комп’ютери в мережі, яка може бути корисною для управління
              парком комп'ютерів і забезпечення безпеки організації.
            </span>
          </section>
        </main>
      </div>
    </div>
  </div>
</template>
