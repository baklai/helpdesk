<script setup>
import {
  mdiAccountOutline,
  mdiCommentTextOutline,
  mdiFileDocumentOutline,
  mdiFormatListBulleted,
  mdiIpOutline,
  mdiOfficeBuildingOutline,
  mdiWeb
} from '@mdi/js';
import { useQuery } from '@vue/apollo-composable';
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import AppLoading from '@/components/AppLoading.vue';
import IPAddressPartial from '@/components/partials/IPAddressPartial.vue';
import { FIND_ONE_IPADDRESS } from '@/graphql/apollo.gql';
import { dateToStr } from '@/utils/DateMethods';
import NotFoundView from '@/views/error/NotFoundView.vue';

const route = useRoute();
const router = useRouter();

const { result, loading } = useQuery(
  FIND_ONE_IPADDRESS,
  { id: route.params.id },
  { fetchPolicy: 'no-cache' }
);

const ipaddress = computed(() => result.value?.ipaddress);

const handleBack = () => router.back();
const handleEdit = () => router.push({ name: 'ipaddress-edit', params: { id: route.params.id } });

const internetStatus = computed(() => {
  const status = ipaddress.value?.internet?.status;
  if (!status || status === 'NONE') return null;
  return status;
});

const internetSeverity = computed(() => {
  switch (internetStatus.value) {
    case 'NONE':
      return 'secondary';
    case 'ACTIVE':
      return 'success';
    case 'BLOCKED':
      return 'danger';
    case 'CLOSED':
      return 'secondary';
    default:
      return 'secondary';
  }
});

const internetLabel = computed(() => {
  switch (internetStatus.value) {
    case 'NONE':
      return 'Відсутній';
    case 'ACTIVE':
      return 'Активний';
    case 'BLOCKED':
      return 'Заблоковано';
    case 'CLOSED':
      return 'Закрито';
    default:
      return 'Відсутній';
  }
});
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
          v-if="ipaddress"
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

    <div v-if="!loading && ipaddress" class="flex flex-col gap-6 overflow-y-auto p-4 lg:flex-row">
      <div class="flex flex-1 flex-col gap-4">
        <div class="border-surface-200 dark:border-surface-700 rounded-xl border p-6">
          <div class="mb-4 flex items-center gap-2">
            <AppIcon :path="mdiIpOutline" :size="20" />
            <span class="text-lg font-medium uppercase">Мережа</span>
          </div>

          <div class="flex flex-col gap-4">
            <div class="flex flex-col gap-y-1">
              <p class="text-muted-color text-xs font-medium tracking-wide uppercase">IP-адреса</p>
              <p class="text-primary-500 text-xl font-bold">{{ ipaddress.ipaddress || '-' }}</p>
            </div>

            <div class="flex flex-row flex-wrap gap-4">
              <div class="flex min-w-[calc(50%-0.5rem)] flex-1 flex-col gap-y-1">
                <p class="text-muted-color text-xs font-medium tracking-wide uppercase">Маска</p>
                <p class="text-base">{{ ipaddress.mask || '-' }}</p>
              </div>

              <div class="flex min-w-[calc(50%-0.5rem)] flex-1 flex-col gap-y-1">
                <p class="text-muted-color text-xs font-medium tracking-wide uppercase">Шлюз</p>
                <p class="text-base">{{ ipaddress.gateway || '-' }}</p>
              </div>
            </div>

            <Divider type="dashed" />

            <div class="flex flex-row flex-wrap gap-4">
              <div class="flex min-w-[calc(50%-0.5rem)] flex-1 flex-col gap-y-1">
                <p class="text-muted-color text-xs font-medium tracking-wide uppercase">Пристрій</p>
                <p class="text-base">{{ ipaddress.device?.name || '-' }}</p>
              </div>

              <div class="flex min-w-[calc(50%-0.5rem)] flex-1 flex-col gap-y-1">
                <p class="text-muted-color text-xs font-medium tracking-wide uppercase">
                  Розташування
                </p>
                <p class="text-base">{{ ipaddress.location?.name || '-' }}</p>
              </div>
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
              <p class="text-base">
                {{ ipaddress.reqnum || '-' }}
              </p>
            </div>

            <Divider type="dashed" />

            <div class="flex flex-col gap-y-1">
              <p class="text-muted-color text-xs font-medium tracking-wide uppercase">
                Інвентарний номер
              </p>
              <p class="text-base">
                {{ ipaddress.inventory || '-' }}
              </p>
            </div>

            <Divider type="dashed" />

            <div class="flex flex-col gap-y-1">
              <p class="text-muted-color text-xs font-medium tracking-wide uppercase">
                Дата відкриття
              </p>
              <p class="text-base">
                {{ ipaddress.createdAt ? dateToStr(ipaddress.createdAt) : '-' }}
              </p>
            </div>
          </div>
        </div>

        <div class="border-surface-200 dark:border-surface-700 rounded-xl border p-6">
          <div class="mb-4 flex items-center justify-between">
            <div class="flex items-center gap-2">
              <AppIcon :path="mdiWeb" :size="20" />
              <span class="text-lg font-medium uppercase">Інтернет</span>
            </div>
            <Tag :severity="internetSeverity" :value="internetLabel" />
          </div>

          <div v-if="ipaddress?.internet?.reqnum" class="flex flex-col gap-3">
            <div class="flex flex-col gap-y-1">
              <p class="text-muted-color text-xs font-medium tracking-wide uppercase">
                Номер листа
              </p>
              <p class="text-base">
                {{ ipaddress?.internet?.reqnum || '-' }}
              </p>
            </div>

            <Divider type="dashed" />

            <div class="flex flex-col gap-y-1">
              <p class="text-muted-color text-xs font-medium tracking-wide uppercase">Статус</p>
              <p class="text-base">
                {{ internetLabel || '-' }}
              </p>
            </div>

            <Divider type="dashed" />

            <div class="flex flex-col gap-y-1">
              <p class="text-muted-color text-xs font-medium tracking-wide uppercase">Дата</p>
              <p class="text-base">
                {{ ipaddress?.internet?.updatedAt ? dateToStr(ipaddress.updatedAt) : '-' }}
              </p>
            </div>

            <Divider type="dashed" />

            <div class="flex flex-col gap-y-1">
              <p class="text-muted-color text-xs font-medium tracking-wide uppercase">Коментар</p>
              <p class="text-base">
                {{ ipaddress?.internet?.comment || '-' }}
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
              <p class="text-base">
                {{ ipaddress.organization?.name || '-' }}
              </p>
            </div>

            <Divider type="dashed" />

            <div class="flex flex-col gap-y-1">
              <p class="text-muted-color text-xs font-medium tracking-wide uppercase">Підрозділ</p>
              <p class="text-base">
                {{ ipaddress.subdivision?.name || '-' }}
              </p>
            </div>

            <Divider type="dashed" />

            <div class="flex flex-col gap-y-1">
              <p class="text-muted-color text-xs font-medium tracking-wide uppercase">Відділ</p>
              <p class="text-base">
                {{ ipaddress.department?.name || '-' }}
              </p>
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
              <p class="text-base font-medium">
                {{ ipaddress.fullname || '-' }}
              </p>
            </div>

            <Divider type="dashed" />

            <div class="flex flex-col gap-y-1">
              <p class="text-muted-color text-xs font-medium tracking-wide uppercase">Посада</p>
              <p class="text-base">
                {{ ipaddress.position?.name || '-' }}
              </p>
            </div>

            <Divider type="dashed" />

            <div class="flex flex-col gap-y-1">
              <p class="text-muted-color text-xs font-medium tracking-wide uppercase">Телефон</p>
              <p class="text-base">
                {{ ipaddress.phone || '-' }}
              </p>
            </div>

            <Divider type="dashed" />

            <div class="flex flex-col gap-y-1">
              <p class="text-muted-color text-xs font-medium tracking-wide uppercase">
                Електронна пошта
              </p>
              <p class="text-base">
                {{ ipaddress.email || '-' }}
              </p>
            </div>

            <Divider type="dashed" />

            <div class="flex flex-col gap-y-1">
              <p class="text-muted-color text-xs font-medium tracking-wide uppercase">
                Автовідповідь
              </p>
              <p class="text-base">
                {{ ipaddress.autoanswer || '-' }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div class="flex flex-1 flex-col gap-4">
        <div
          v-if="ipaddress.comment"
          class="border-surface-200 dark:border-surface-700 rounded-xl border p-6"
        >
          <div class="mb-4 flex items-center gap-2">
            <AppIcon :path="mdiCommentTextOutline" :size="20" />
            <span class="text-lg font-medium uppercase">Коментар</span>
          </div>
          <p class="text-base leading-relaxed">
            {{ ipaddress.comment }}
          </p>
        </div>

        <div class="border-surface-200 dark:border-surface-700 rounded-xl border p-6">
          <div class="mb-4 flex items-center gap-2">
            <AppIcon :path="mdiFormatListBulleted" :size="20" />
            <span class="text-lg font-medium">Зведення</span>
          </div>

          <IPAddressPartial :data="ipaddress" />
        </div>
      </div>
    </div>

    <NotFoundView v-if="!loading && !ipaddress" />
  </div>
</template>
