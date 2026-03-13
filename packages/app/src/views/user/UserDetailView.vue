<script setup>
import {
  mdiAccountCheckOutline,
  mdiAccountCogOutline,
  mdiAccountOutline,
  mdiCheckCircleOutline,
  mdiCloseCircleOutline,
  mdiFormatListBulleted,
  mdiShieldAccountOutline
} from '@mdi/js';
import { useQuery } from '@vue/apollo-composable';
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import AppLoading from '@/components/AppLoading.vue';
import UserPartial from '@/components/partials/UserPartial.vue';
import { FIND_ONE_USER } from '@/graphql/apollo.gql.js';
import { dateTimeToStr } from '@/utils/DateMethods';
import { decodeScopeToList } from '@/utils/ScopeMethods';
import NotFoundView from '@/views/error/NotFoundView.vue';

const route = useRoute();
const router = useRouter();

const { result, loading } = useQuery(
  FIND_ONE_USER,
  { id: route.params.id },
  { fetchPolicy: 'no-cache' }
);

const user = computed(() => result.value?.user);
const scopeList = computed(() => decodeScopeToList(user.value?.scope));

const handleBack = () => router.back();
const handleEdit = () => router.push({ name: 'user-edit', params: { id: route.params.id } });

const STATUS_MAP = {
  pending: { label: 'Очікує', severity: 'secondary', icon: mdiCloseCircleOutline },
  active: { label: 'Активний', severity: 'success', icon: mdiCheckCircleOutline },
  blocked: { label: 'Заблоковано', severity: 'danger', icon: mdiCloseCircleOutline },
  disabled: { label: 'Вимкнено', severity: 'secondary', icon: mdiCloseCircleOutline }
};

const statusInfo = computed(
  () =>
    STATUS_MAP[user.value?.status] ?? {
      label: '-',
      severity: 'secondary',
      icon: mdiCloseCircleOutline
    }
);

const ROLE_MAP = {
  admin: { label: 'Адміністратор', severity: 'danger' },
  manager: { label: 'Менеджер', severity: 'warn' },
  support: { label: 'Спеціаліст', severity: 'info' },
  client: { label: 'Клієнт', severity: 'secondary' }
};

const roleInfo = computed(
  () => ROLE_MAP[user.value?.role] ?? { label: user.value?.role ?? '-', severity: 'secondary' }
);

const scopeGroups = computed(() => {
  const groups = {};
  for (const s of scopeList.value) {
    const [resource] = s.split(':');
    if (!groups[resource]) groups[resource] = [];
    groups[resource].push(s);
  }
  return Object.entries(groups).map(([resource, items]) => ({ resource, items }));
});

const SCOPE_ACTION_LABEL = {
  create: 'Створення',
  read: 'Перегляд',
  update: 'Редагування',
  delete: 'Видалення',
  notice: 'Сповіщення'
};

const SCOPE_RESOURCE_LABEL = {
  event: 'Події',
  channel: 'Канали',
  ipaddress: 'IP-адреси',
  mailbox: 'Пошта',
  request: 'Заявки',
  inspector: 'Інспектор',
  report: 'Звіти',
  organization: 'Організації',
  subdivision: 'Підрозділи',
  department: 'Відділи',
  location: 'Локації',
  position: 'Посади',
  device: 'Пристрої',
  user: 'Користувачі',
  notice: 'Сповіщення'
};
</script>

<template>
  <div class="flex w-full flex-col" style="height: calc(100vh - 5rem)">
    <div class="flex flex-row items-center justify-between">
      <div class="flex flex-wrap items-center gap-x-2">
        <AppIcon :path="$route.meta.icon" :size="42" />
        <div class="flex flex-col">
          <h3 class="text-2xl font-normal">
            {{ $route?.meta?.title }}
          </h3>
          <p class="text-muted-color text-base font-normal">
            {{ $route?.meta?.description }}
          </p>
        </div>
      </div>

      <div class="flex flex-row gap-x-2">
        <Button
          v-if="user"
          icon="pi pi-pencil"
          label="Редагувати"
          severity="secondary"
          variant="outlined"
          @click="handleEdit"
        />
        <Button icon="pi pi-arrow-left" label="Назад" variant="outlined" @click="handleBack" />
      </div>
    </div>

    <Divider />

    <AppLoading v-if="loading" />

    <div v-if="!loading && user" class="flex flex-col gap-6 overflow-y-auto p-4 lg:flex-row">
      <div class="flex flex-1 flex-col gap-4">
        <div class="border-surface-200 dark:border-surface-700 rounded-xl border p-6">
          <div class="mb-4 flex items-center justify-between">
            <div class="flex items-center gap-2">
              <AppIcon :path="mdiAccountOutline" :size="20" />
              <span class="text-lg font-medium uppercase">Профіль</span>
            </div>
            <Tag :severity="statusInfo.severity">
              <template #default>
                <div class="flex items-center gap-1">
                  <AppIcon :path="statusInfo.icon" :size="14" />
                  <span>{{ statusInfo.label }}</span>
                </div>
              </template>
            </Tag>
          </div>

          <div class="flex flex-col gap-4">
            <div class="flex flex-col gap-y-1">
              <p class="text-muted-color text-xs font-medium tracking-wide uppercase">
                Прізвище та ім'я
              </p>
              <p class="text-primary-500 text-xl font-bold">{{ user.fullname || '-' }}</p>
            </div>

            <Divider type="dashed" />

            <div class="flex flex-row flex-wrap gap-4">
              <div class="flex min-w-[calc(50%-0.5rem)] flex-1 flex-col gap-y-1">
                <p class="text-muted-color text-xs font-medium tracking-wide uppercase">
                  Електронна пошта
                </p>
                <p class="text-base">{{ user.email || '-' }}</p>
              </div>

              <div class="flex min-w-[calc(50%-0.5rem)] flex-1 flex-col gap-y-1">
                <p class="text-muted-color text-xs font-medium tracking-wide uppercase">
                  Номер телефону
                </p>
                <p class="text-base">{{ user.phone || '-' }}</p>
              </div>
            </div>

            <Divider type="dashed" />

            <div class="flex flex-row flex-wrap gap-4">
              <div class="flex min-w-[calc(50%-0.5rem)] flex-1 flex-col gap-y-1">
                <p class="text-muted-color text-xs font-medium tracking-wide uppercase">
                  Дата реєстрації
                </p>
                <p class="text-base">
                  {{ user.createdAt ? dateTimeToStr(user.createdAt) : '-' }}
                </p>
              </div>

              <div class="flex min-w-[calc(50%-0.5rem)] flex-1 flex-col gap-y-1">
                <p class="text-muted-color text-xs font-medium tracking-wide uppercase">
                  Останнє оновлення
                </p>
                <p class="text-base">
                  {{ user.updatedAt ? dateTimeToStr(user.updatedAt) : '-' }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div class="border-surface-200 dark:border-surface-700 rounded-xl border p-6">
          <div class="mb-4 flex items-center gap-2">
            <AppIcon :path="mdiAccountCheckOutline" :size="20" />
            <span class="text-lg font-medium uppercase">Роль</span>
          </div>

          <div class="flex flex-col gap-3">
            <div class="flex items-center justify-between">
              <div class="flex flex-col gap-y-1">
                <p class="text-muted-color text-xs font-medium tracking-wide uppercase">
                  Поточна роль
                </p>
                <p class="text-base font-medium">{{ roleInfo.label }}</p>
              </div>
              <Tag :severity="roleInfo.severity" :value="roleInfo.label" />
            </div>

            <Divider type="dashed" />

            <div class="flex flex-col gap-y-1">
              <p class="text-muted-color text-xs font-medium tracking-wide uppercase">Опис ролі</p>
              <p class="text-base">
                <template v-if="user.role === 'admin'">
                  Повний доступ до всіх модулів, налаштувань та логів системи
                </template>
                <template v-else-if="user.role === 'manager'">
                  Управління звітами, перегляд статистики та базове адміністрування
                </template>
                <template v-else-if="user.role === 'support'">
                  Операційна робота: обробка заявок, керування IP-адресами та технікою
                </template>
                <template v-else-if="user.role === 'client'">
                  Тільки перегляд доступних ресурсів (без права редагування)
                </template>
                <template v-else>-</template>
              </p>
            </div>
          </div>
        </div>

        <div class="border-surface-200 dark:border-surface-700 rounded-xl border p-6">
          <div class="mb-4 flex items-center gap-2">
            <AppIcon :path="mdiFormatListBulleted" :size="20" />
            <span class="text-lg font-medium">Зведення</span>
          </div>

          <UserPartial :data="user" />
        </div>
      </div>

      <div class="flex flex-1 flex-col gap-4">
        <div class="border-surface-200 dark:border-surface-700 rounded-xl border p-6">
          <div class="mb-4 flex items-center justify-between">
            <div class="flex items-center gap-2">
              <AppIcon :path="mdiShieldAccountOutline" :size="20" />
              <span class="text-lg font-medium uppercase">Права доступу</span>
            </div>
            <Tag severity="secondary" :value="`${scopeList.length} дозволів`" />
          </div>

          <div v-if="scopeGroups.length === 0" class="text-muted-color text-sm">
            Дозволи не призначені
          </div>

          <div v-else class="flex flex-col gap-4">
            <div v-for="group in scopeGroups" :key="group.resource" class="flex flex-col gap-2">
              <div class="flex items-center gap-2">
                <AppIcon :path="mdiAccountCogOutline" :size="16" />
                <span class="text-sm font-semibold tracking-wide uppercase">
                  {{ SCOPE_RESOURCE_LABEL[group.resource] ?? group.resource }}
                </span>
              </div>

              <div class="flex flex-wrap gap-2 pl-6">
                <Tag
                  v-for="scope in group.items"
                  :key="scope"
                  class="text-xs!"
                  severity="secondary"
                >
                  <template #default>
                    <span>{{
                      SCOPE_ACTION_LABEL[scope.split(':')[1]] ?? scope.split(':')[1]
                    }}</span>
                  </template>
                </Tag>
              </div>

              <Divider
                v-if="group !== scopeGroups[scopeGroups.length - 1]"
                class="my-0!"
                type="dashed"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <NotFoundView v-if="!loading && !user" />
  </div>
</template>
