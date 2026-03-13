<script setup>
import { mdiLanConnect } from '@mdi/js';
import { useQuery } from '@vue/apollo-composable';
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import AppLoading from '@/components/AppLoading.vue';
import ChannelPartial from '@/components/partials/ChannelPartial.vue';
import { FIND_ONE_CHANNEL } from '@/graphql/apollo.gql';
import { dateToStr } from '@/utils/DateMethods';
import NotFoundView from '@/views/error/NotFoundView.vue';

const route = useRoute();
const router = useRouter();

const { result, loading } = useQuery(
  FIND_ONE_CHANNEL,
  { id: route.params.id },
  { fetchPolicy: 'no-cache' }
);

const channel = computed(() => result.value?.channel);

const handleBack = () => router.back();
const handleEdit = () => router.push({ name: 'channel-edit', params: { id: route.params.id } });
</script>

<template>
  <div class="flex w-full flex-col" style="height: calc(100vh - 5rem)">
    <!-- Header -->
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
          v-if="channel"
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

    <div v-if="!loading && channel" class="flex flex-col gap-6 overflow-y-auto p-4 lg:flex-row">
      <!-- Точки підключення -->
      <div class="flex flex-1 flex-col gap-4">
        <div class="border-surface-200 dark:border-surface-700 rounded-xl border p-6">
          <div class="mb-4 flex items-center gap-2">
            <AppIcon :path="mdiLanConnect" :size="20" />
            <span class="text-lg font-medium uppercase">Точки підключення</span>
          </div>

          <div class="flex flex-col gap-3">
            <!-- Від -->
            <div class="bg-surface-50 dark:bg-surface-800 rounded-lg p-4">
              <p class="text-muted-color mb-1 text-xs font-medium tracking-wide uppercase">
                Початкова точка
              </p>
              <p class="text-base font-semibold">{{ channel.locationFrom || '-' }}</p>
              <p class="text-muted-color text-sm">{{ channel.deviceFrom || '-' }}</p>
            </div>

            <!-- Стрілка -->
            <div class="flex items-center justify-center">
              <div
                class="bg-surface-200 dark:bg-surface-700 flex h-8 w-8 items-center justify-center rounded-full"
              >
                <i class="pi pi-arrow-down text-muted-color text-sm" />
              </div>
            </div>

            <!-- До -->
            <div class="bg-surface-50 dark:bg-surface-800 rounded-lg p-4">
              <p class="text-muted-color mb-1 text-xs font-medium tracking-wide uppercase">
                Кінцева точка
              </p>
              <p class="text-base font-semibold">{{ channel.locationTo || '-' }}</p>
              <p class="text-muted-color text-sm">{{ channel.deviceTo || '-' }}</p>
            </div>
          </div>
        </div>

        <!-- Дата -->
        <div class="border-surface-200 dark:border-surface-700 rounded-xl border p-6">
          <div class="flex flex-col gap-3">
            <div class="flex flex-col gap-y-1">
              <p class="text-muted-color text-xs font-medium tracking-wide uppercase">
                Дата створення
              </p>
              <p class="text-base">
                {{ channel.createdAt ? dateToStr(channel.createdAt) : '-' }}
              </p>
            </div>

            <Divider type="dashed" />

            <div class="flex flex-col gap-y-1">
              <p class="text-muted-color text-xs font-medium tracking-wide uppercase">
                Дата оновлення
              </p>
              <p class="text-base">
                {{ channel.updatedAt ? dateToStr(channel.updatedAt) : '-' }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Характеристики -->
      <div class="flex flex-1 flex-col gap-4">
        <div class="border-surface-200 dark:border-surface-700 rounded-xl border p-6">
          <div class="mb-4 flex items-center gap-2">
            <i class="pi pi-sliders-h" />
            <span class="text-lg font-medium uppercase">Характеристики</span>
          </div>

          <div class="flex flex-col gap-3">
            <div class="flex flex-row flex-wrap gap-4">
              <div class="flex min-w-[calc(50%-0.5rem)] flex-1 flex-col gap-y-1">
                <p class="text-muted-color text-xs font-medium tracking-wide uppercase">Рівень</p>
                <Tag severity="info" :value="channel.level || '-'" />
              </div>
              <div class="flex min-w-[calc(50%-0.5rem)] flex-1 flex-col gap-y-1">
                <p class="text-muted-color text-xs font-medium tracking-wide uppercase">Тип</p>
                <Tag severity="secondary" :value="channel.channelType || '-'" />
              </div>
            </div>

            <Divider type="dashed" />

            <div class="flex flex-row flex-wrap gap-4">
              <div class="flex min-w-[calc(50%-0.5rem)] flex-1 flex-col gap-y-1">
                <p class="text-muted-color text-xs font-medium tracking-wide uppercase">
                  Швидкість
                </p>
                <Tag severity="success" :value="channel.speed || '-'" />
              </div>
              <div class="flex min-w-[calc(50%-0.5rem)] flex-1 flex-col gap-y-1">
                <p class="text-muted-color text-xs font-medium tracking-wide uppercase">Статус</p>
                <Tag
                  :severity="
                    channel.status === 'ACTIVE'
                      ? 'success'
                      : channel.status === 'INACTIVE'
                        ? 'danger'
                        : 'warn'
                  "
                  :value="channel.status || '-'"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Оператор і склад -->
        <div class="border-surface-200 dark:border-surface-700 rounded-xl border p-6">
          <div class="mb-4 flex items-center gap-2">
            <i class="pi pi-building" />
            <span class="text-lg font-medium uppercase">Додаткові відомості</span>
          </div>

          <div class="flex flex-col gap-3">
            <div class="flex flex-col gap-y-1">
              <p class="text-muted-color text-xs font-medium tracking-wide uppercase">Оператор</p>
              <p class="text-base">{{ channel.operator || '-' }}</p>
            </div>

            <Divider type="dashed" />

            <div class="flex flex-col gap-y-1">
              <p class="text-muted-color text-xs font-medium tracking-wide uppercase">Склад</p>
              <p class="text-base">{{ channel.composition || '-' }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Зведення (ChannelPartial) -->
      <div class="flex flex-1 flex-col gap-4">
        <div class="border-surface-200 dark:border-surface-700 rounded-xl border p-6">
          <div class="mb-4 flex items-center gap-2">
            <i class="pi pi-list" />
            <span class="text-lg font-medium uppercase">Зведення</span>
          </div>
          <ChannelPartial :data="channel" />
        </div>
      </div>
    </div>

    <NotFoundView v-if="!loading && !channel" />
  </div>
</template>
