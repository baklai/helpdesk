<script setup>
import {
  mdiAccountOutline,
  mdiAccountTieOutline,
  mdiCheckCircleOutline,
  mdiClipboardTextOutline,
  mdiCommentTextOutline,
  mdiFileDocumentOutline,
  mdiOfficeBuildingOutline,
  mdiTextBoxOutline
} from '@mdi/js';
import { useQuery } from '@vue/apollo-composable';
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import AppLoading from '@/components/AppLoading.vue';
import { REQUEST_STATUS, REQUEST_STATUS_SEVERITY } from '@/constants/ui.const';
import { FIND_ONE_REQUEST } from '@/graphql/apollo.gql.js';
import { dateTimeToStr } from '@/utils/DateMethods';
import NotFoundView from '@/views/error/NotFoundView.vue';

const route = useRoute();
const router = useRouter();

const { result, loading } = useQuery(
  FIND_ONE_REQUEST,
  { id: route.params.id },
  { fetchPolicy: 'no-cache' }
);

const request = computed(() => result.value?.request);

const handleBack = () => router.back();
const handleEdit = () => router.push({ name: 'request-edit', params: { id: route.params.id } });

const statusInfo = computed(() => {
  return {
    label: REQUEST_STATUS.find(item => item.key === request?.value?.status)?.label ?? '-',
    comment: REQUEST_STATUS.find(item => item.key === request?.value?.status)?.comment ?? '-',
    severity: REQUEST_STATUS_SEVERITY[request?.value?.status] ?? 'secondary'
  };
});

const isClosed = computed(() =>
  ['resolved', 'closed', 'rejected', 'cancelled'].includes(request.value?.status)
);
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
          v-if="request"
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

    <div v-if="!loading && request" class="flex flex-col gap-6 overflow-y-auto p-4 lg:flex-row">
      <div class="flex flex-1 flex-col gap-4">
        <div class="border-surface-200 dark:border-surface-700 rounded-xl border p-6">
          <div class="mb-4 flex items-center justify-between">
            <div class="flex items-center gap-2">
              <AppIcon :path="mdiClipboardTextOutline" :size="20" />
              <span class="text-lg font-medium uppercase">Заявка</span>
            </div>
            <Tag :severity="statusInfo.severity">
              <template #default>
                <div class="flex items-center gap-1">
                  <span>{{ statusInfo.label }}</span>
                </div>
              </template>
            </Tag>
          </div>

          <div class="flex flex-col gap-4">
            <div class="flex flex-col gap-y-1">
              <p class="text-muted-color text-xs font-medium tracking-wide uppercase">
                Номер вхідного запиту
              </p>
              <p class="text-primary-500 text-xl font-bold">{{ request?.reqnum || '-' }}</p>
            </div>

            <Divider type="dashed" />

            <div class="flex flex-row flex-wrap gap-4">
              <div class="flex min-w-[calc(50%-0.5rem)] flex-1 flex-col gap-y-1">
                <p class="text-muted-color text-xs font-medium tracking-wide uppercase">
                  IP-адреса
                </p>
                <p class="text-base">{{ request?.ipaddress || '-' }}</p>
              </div>

              <div class="flex min-w-[calc(50%-0.5rem)] flex-1 flex-col gap-y-1">
                <p class="text-muted-color text-xs font-medium tracking-wide uppercase">
                  Розташування
                </p>
                <p class="text-base">{{ request?.location?.name || '-' }}</p>
              </div>
            </div>

            <Divider type="dashed" />

            <div class="flex flex-col gap-y-1">
              <p class="text-muted-color text-xs font-medium tracking-wide uppercase">
                Дата відкриття
              </p>
              <p class="text-base">
                {{ request?.createdAt ? dateTimeToStr(request.createdAt) : '-' }}
              </p>
            </div>

            <div v-if="isClosed" class="flex flex-col gap-y-1">
              <p class="text-muted-color text-xs font-medium tracking-wide uppercase">
                Дата закриття
              </p>
              <p class="text-base">
                {{ request?.updatedAt ? dateTimeToStr(request.updatedAt) : '-' }}
              </p>
            </div>
          </div>
        </div>

        <div class="border-surface-200 dark:border-surface-700 rounded-xl border p-6">
          <div class="mb-4 flex items-center gap-2">
            <AppIcon :path="mdiTextBoxOutline" :size="20" />
            <span class="text-lg font-medium uppercase">Текст звернення</span>
          </div>
          <p class="text-base leading-relaxed">{{ request?.request || '-' }}</p>
        </div>

        <div class="border-surface-200 dark:border-surface-700 rounded-xl border p-6">
          <div class="mb-4 flex items-center gap-2">
            <AppIcon :path="mdiFileDocumentOutline" :size="20" />
            <span class="text-lg font-medium uppercase">Документи</span>
          </div>

          <div class="flex flex-col gap-3">
            <div class="flex flex-col gap-y-1">
              <p class="text-muted-color text-xs font-medium tracking-wide uppercase">
                Номер вхідного запиту
              </p>
              <p class="text-base">{{ request?.reqnum || '-' }}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="flex flex-1 flex-col gap-4">
        <div class="border-surface-200 dark:border-surface-700 rounded-xl border p-6">
          <div class="mb-4 flex items-center gap-2">
            <AppIcon :path="mdiOfficeBuildingOutline" :size="20" />
            <span class="text-lg font-medium uppercase">Організація</span>
          </div>

          <div class="flex flex-col gap-3">
            <div class="flex flex-col gap-y-1">
              <p class="text-muted-color text-xs font-medium tracking-wide uppercase">
                Організація
              </p>
              <p class="text-base">{{ request?.organization?.name || '-' }}</p>
            </div>

            <Divider type="dashed" />

            <div class="flex flex-col gap-y-1">
              <p class="text-muted-color text-xs font-medium tracking-wide uppercase">Підрозділ</p>
              <p class="text-base">{{ request?.subdivision?.name || '-' }}</p>
            </div>

            <Divider type="dashed" />

            <div class="flex flex-col gap-y-1">
              <p class="text-muted-color text-xs font-medium tracking-wide uppercase">Відділ</p>
              <p class="text-base">{{ request?.department?.name || '-' }}</p>
            </div>
          </div>
        </div>

        <div class="border-surface-200 dark:border-surface-700 rounded-xl border p-6">
          <div class="mb-4 flex items-center gap-2">
            <AppIcon :path="mdiAccountOutline" :size="20" />
            <span class="text-lg font-medium uppercase">Заявник</span>
          </div>

          <div class="flex flex-col gap-3">
            <div class="flex flex-col gap-y-1">
              <p class="text-muted-color text-xs font-medium tracking-wide uppercase">
                Прізвище та ім'я
              </p>
              <p class="text-base font-medium">{{ request?.fullname || '-' }}</p>
            </div>

            <Divider type="dashed" />

            <div class="flex flex-col gap-y-1">
              <p class="text-muted-color text-xs font-medium tracking-wide uppercase">Посада</p>
              <p class="text-base">{{ request?.position?.name || '-' }}</p>
            </div>

            <Divider type="dashed" />

            <div class="flex flex-col gap-y-1">
              <p class="text-muted-color text-xs font-medium tracking-wide uppercase">Телефон</p>
              <p class="text-base">{{ request?.phone || '-' }}</p>
            </div>

            <Divider type="dashed" />

            <div class="flex flex-col gap-y-1">
              <p class="text-muted-color text-xs font-medium tracking-wide uppercase">IP-адреса</p>
              <p class="font-mono text-base">{{ request?.ipaddress || '-' }}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="flex flex-1 flex-col gap-4">
        <div class="border-surface-200 dark:border-surface-700 rounded-xl border p-6">
          <div class="mb-4 flex items-center gap-2">
            <AppIcon :path="mdiAccountTieOutline" :size="20" />
            <span class="text-lg font-medium uppercase">Спеціалісти</span>
          </div>

          <div class="flex flex-col gap-3">
            <div class="flex flex-col gap-y-1">
              <p class="text-muted-color text-xs font-medium tracking-wide uppercase">
                Відкрив заявку
              </p>
              <p class="text-base font-medium">{{ request?.opened?.fullname || '-' }}</p>
            </div>

            <Divider type="dashed" />

            <div class="flex flex-col gap-y-1">
              <p class="text-muted-color text-xs font-medium tracking-wide uppercase">
                Закрив заявку
              </p>
              <p class="text-base font-medium">{{ request?.closed?.fullname || '-' }}</p>
            </div>
          </div>
        </div>

        <div
          v-if="request?.conclusion"
          class="border-surface-200 dark:border-surface-700 rounded-xl border p-6"
        >
          <div class="mb-4 flex items-center gap-2">
            <AppIcon :path="mdiCheckCircleOutline" :size="20" />
            <span class="text-lg font-medium uppercase">Технічний висновок</span>
          </div>
          <p class="text-base leading-relaxed">{{ request.conclusion }}</p>
        </div>

        <div
          v-if="request?.comment"
          class="border-surface-200 dark:border-surface-700 rounded-xl border p-6"
        >
          <div class="mb-4 flex items-center gap-2">
            <AppIcon :path="mdiCommentTextOutline" :size="20" />
            <span class="text-lg font-medium uppercase">Коментар</span>
          </div>
          <p class="text-base leading-relaxed">{{ request.comment }}</p>
        </div>
      </div>
    </div>

    <NotFoundView v-if="!loading && !request" />
  </div>
</template>
