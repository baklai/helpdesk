<script setup>
import { mdiAccountCheckOutline, mdiAccountOutline, mdiShieldAccountOutline } from '@mdi/js';
import { useQuery } from '@vue/apollo-composable';
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import AppLoading from '@/components/AppLoading.vue';
import { USER_ROLES, USER_STATUS } from '@/constants/ui.const';
import { FIND_ONE_USER } from '@/graphql/apollo.gql.js';
import { useScopeStore } from '@/stores/scopes.store';
import { dateTimeToStr } from '@/utils/DateMethods';
import NotFoundView from '@/views/error/NotFoundView.vue';

const route = useRoute();
const router = useRouter();

const { ACTION_DEFINITIONS, getCustomScope, getScopeLength } = useScopeStore();

const { result, loading } = useQuery(
  FIND_ONE_USER,
  { id: route.params.id },
  { fetchPolicy: 'no-cache' }
);

const user = computed(() => result.value?.user);
const userRole = computed(() => USER_ROLES.find(role => role.key === result.value?.user?.role));
const userStatus = computed(() =>
  USER_STATUS.find(status => status.key === result.value?.user?.status)
);
const userScopes = computed(() =>
  result.value?.user?.scope ? getCustomScope(result.value.user.scope) : []
);
const userScopeLength = computed(() =>
  result.value?.user?.scope ? getScopeLength(result.value.user.scope) : 0
);

const handleBack = () => router.back();
const handleEdit = () => router.push({ name: 'user-edit', params: { id: route.params.id } });
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

    <div v-if="!loading && user" class="flex h-full flex-col gap-6 overflow-y-auto p-4 lg:flex-row">
      <div class="flex flex-1 flex-col gap-4">
        <div class="border-surface-200 dark:border-surface-700 rounded-xl border p-6">
          <div class="mb-4 flex items-center justify-between">
            <div class="flex items-center gap-2">
              <AppIcon :path="mdiAccountOutline" :size="20" />
              <span class="text-lg font-medium uppercase">Профіль</span>
            </div>
            <Tag :value="userStatus?.label" />
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
                <p class="text-base font-medium">{{ userRole.key }}</p>
              </div>
              <Tag :value="userRole.label" />
            </div>

            <Divider type="dashed" />

            <div class="flex flex-col gap-y-1">
              <p class="text-muted-color text-xs font-medium tracking-wide uppercase">Опис ролі</p>
              <p class="text-base">
                {{ userRole.comment }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div class="flex flex-1 flex-col gap-4">
        <div class="border-surface-200 dark:border-surface-700 rounded-xl border p-6">
          <div class="mb-4 flex items-center justify-between">
            <div class="flex items-center gap-2">
              <AppIcon :path="mdiShieldAccountOutline" :size="20" />
              <span class="text-lg font-medium uppercase">Права доступу</span>
            </div>
            <Tag severity="secondary" :value="`${userScopeLength} дозволів`" />
          </div>

          <DataTable
            class="min-w-full overflow-x-auto"
            responsiveLayout="scroll"
            rowHover
            scrollable
            scrollHeight="flex"
            :value="userScopes"
          >
            <template #empty>
              <div class="text-center">
                <h5>Записів не знайдено</h5>
              </div>
            </template>

            <Column class="font-bold!" field="scope" frozen header="">
              <template #body="{ data }">
                {{ data.comment }}
              </template>
            </Column>

            <Column
              v-for="col of ACTION_DEFINITIONS"
              :key="col.key"
              class="text-center!"
              :field="col.key"
              headerClass="text-center"
            >
              <template #header>
                <p class="w-full text-center">{{ col.comment }}</p>
              </template>
              <template #body="{ data, field }">
                <Checkbox v-model="data[field]" binary :indeterminate="!data[field]" readonly />
              </template>
            </Column>
          </DataTable>
        </div>
      </div>
    </div>

    <NotFoundView v-if="!loading && !user" />
  </div>
</template>
