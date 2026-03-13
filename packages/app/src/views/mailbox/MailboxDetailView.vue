<script setup>
import {
  mdiAccountOutline,
  mdiAt,
  mdiCommentTextOutline,
  mdiFileDocumentOutline,
  mdiFormatListBulleted,
  mdiOfficeBuildingOutline
} from '@mdi/js';
import { useQuery } from '@vue/apollo-composable';
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import AppLoading from '@/components/AppLoading.vue';
import MailboxPartial from '@/components/partials/MailboxPartial.vue';
import { FIND_ONE_MAILBOX } from '@/graphql/apollo.gql';
import { dateToStr } from '@/utils/DateMethods';
import NotFoundView from '@/views/error/NotFoundView.vue';

const route = useRoute();
const router = useRouter();

const { result, loading } = useQuery(
  FIND_ONE_MAILBOX,
  { id: route.params.id },
  { fetchPolicy: 'no-cache' }
);

const mailbox = computed(() => result.value?.mailbox);

const statusSeverity = computed(() => {
  switch (mailbox.value?.status) {
    case 'OPENED':
      return 'success';
    case 'BLOCKED':
      return 'danger';
    case 'CLOSED':
      return 'secondary';
    default:
      return 'info';
  }
});

const statusLabel = computed(() => {
  switch (mailbox.value?.status) {
    case 'OPENED':
      return 'Активна';
    case 'BLOCKED':
      return 'Заблокована';
    case 'CLOSED':
      return 'Закрита';
    default:
      return mailbox.value?.status || '-';
  }
});

const handleBack = () => router.back();
const handleEdit = () => router.push({ name: 'mailbox-edit', params: { id: route.params.id } });
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
          v-if="mailbox"
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

    <div v-if="!loading && mailbox" class="flex flex-col gap-6 overflow-y-auto p-4 lg:flex-row">
      <div class="flex flex-1 flex-col gap-4">
        <div class="border-surface-200 dark:border-surface-700 rounded-xl border p-6">
          <div class="mb-4 flex items-center justify-between">
            <div class="flex items-center gap-2">
              <AppIcon :path="mdiAt" :size="20" />
              <span class="text-lg font-medium uppercase">Поштова скринька</span>
            </div>
            <Tag :severity="statusSeverity" :value="statusLabel" />
          </div>

          <div class="flex flex-col gap-4">
            <div class="flex flex-col gap-y-1">
              <p class="text-muted-color text-xs font-medium tracking-wide uppercase">Логін</p>
              <p class="text-primary-500 text-xl font-bold">{{ mailbox.email || '-' }}</p>
            </div>
          </div>
        </div>

        <div class="border-surface-200 dark:border-surface-700 rounded-xl border p-6">
          <div class="mb-4 flex items-center gap-2">
            <AppIcon :path="mdiFileDocumentOutline" :size="20" />
            <span class="text-lg font-medium uppercase">Документи</span>
          </div>

          <div class="flex flex-col gap-3">
            <div class="flex flex-col gap-y-1">
              <p class="text-muted-color text-xs font-medium tracking-wide uppercase">
                Номер листа
              </p>
              <p class="text-base">{{ mailbox.reqnum || '-' }}</p>
            </div>

            <Divider type="dashed" />

            <div class="flex flex-col gap-y-1">
              <p class="text-muted-color text-xs font-medium tracking-wide uppercase">
                Дата відкриття
              </p>
              <p class="text-base">
                {{ mailbox.createdAt ? dateToStr(mailbox.createdAt) : '-' }}
              </p>
            </div>

            <Divider type="dashed" />

            <div class="flex flex-col gap-y-1">
              <p class="text-muted-color text-xs font-medium tracking-wide uppercase">
                Дата оновлення
              </p>
              <p class="text-base">
                {{ mailbox.updatedAt ? dateToStr(mailbox.updatedAt) : '-' }}
              </p>
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
              <p class="text-base">{{ mailbox.organization?.name || '-' }}</p>
            </div>

            <Divider type="dashed" />

            <div class="flex flex-col gap-y-1">
              <p class="text-muted-color text-xs font-medium tracking-wide uppercase">Підрозділ</p>
              <p class="text-base">{{ mailbox.subdivision?.name || '-' }}</p>
            </div>

            <Divider type="dashed" />

            <div class="flex flex-col gap-y-1">
              <p class="text-muted-color text-xs font-medium tracking-wide uppercase">Відділ</p>
              <p class="text-base">{{ mailbox.department?.name || '-' }}</p>
            </div>
          </div>
        </div>

        <div class="border-surface-200 dark:border-surface-700 rounded-xl border p-6">
          <div class="mb-4 flex items-center gap-2">
            <AppIcon :path="mdiAccountOutline" :size="20" />
            <span class="text-lg font-medium uppercase">Користувач</span>
          </div>

          <div class="flex flex-col gap-3">
            <div class="flex flex-col gap-y-1">
              <p class="text-muted-color text-xs font-medium tracking-wide uppercase">
                Прізвище та ім'я
              </p>
              <p class="text-base font-medium">{{ mailbox.fullname || '-' }}</p>
            </div>

            <Divider type="dashed" />

            <div class="flex flex-col gap-y-1">
              <p class="text-muted-color text-xs font-medium tracking-wide uppercase">Посада</p>
              <p class="text-base">{{ mailbox.position?.name || '-' }}</p>
            </div>

            <Divider type="dashed" />

            <div class="flex flex-col gap-y-1">
              <p class="text-muted-color text-xs font-medium tracking-wide uppercase">Телефон</p>
              <p class="text-base">{{ mailbox.phone || '-' }}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="flex flex-1 flex-col gap-4">
        <div
          v-if="mailbox.comment"
          class="border-surface-200 dark:border-surface-700 rounded-xl border p-6"
        >
          <div class="mb-4 flex items-center gap-2">
            <AppIcon :path="mdiCommentTextOutline" :size="20" />
            <span class="text-lg font-medium uppercase">Коментар</span>
          </div>
          <p class="text-base leading-relaxed">
            {{ mailbox.comment }}
          </p>
        </div>

        <div class="border-surface-200 dark:border-surface-700 rounded-xl border p-6">
          <div class="mb-4 flex items-center gap-2">
            <AppIcon :path="mdiFormatListBulleted" :size="20" />
            <span class="text-lg font-medium uppercase">Зведення</span>
          </div>

          <MailboxPartial :data="mailbox" />
        </div>
      </div>
    </div>

    <NotFoundView v-if="!loading && !mailbox" />
  </div>
</template>
