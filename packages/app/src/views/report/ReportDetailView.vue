<script setup>
import { mdiFileChartOutline } from '@mdi/js';
import { useApolloClient, useQuery } from '@vue/apollo-composable';
import { useToast } from 'primevue/usetoast';
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { EXECUTE_ONE_REPORT, FIND_ONE_REPORT } from '@/graphql/apollo.gql';
import { dateToStr } from '@/utils/DateMethods';
import NotFoundView from '@/views/error/NotFoundView.vue';

const route = useRoute();
const router = useRouter();
const toast = useToast();

const { resolveClient } = useApolloClient();
const client = resolveClient();

const { result, loading } = useQuery(
  FIND_ONE_REPORT,
  { id: route.params.id },
  { fetchPolicy: 'no-cache' }
);

const report = computed(() => result.value?.report);

const executing = ref(false);

const handleBack = () => router.back();
const handleEdit = () => router.push({ name: 'report-edit', params: { id: route.params.id } });

const handleExecute = async () => {
  try {
    executing.value = true;

    const { data } = await client.query({
      query: EXECUTE_ONE_REPORT,
      variables: { id: route.params.id },
      fetchPolicy: 'no-cache'
    });

    const rows = data?.rows || [];

    if (!rows.length) {
      return toast.add({
        severity: 'info',
        summary: 'Інформація',
        detail: 'Звіт не містить даних',
        life: 3000
      });
    }

    const headers = Object.keys(rows[0]).join(';');
    const body = rows.map(row => Object.values(row).join(';')).join('\n');
    const csv = `${headers}\n${body}`;

    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${report.value?.name ?? 'report'}-${dateToStr(new Date())}.csv`;
    a.click();
    URL.revokeObjectURL(url);

    toast.add({
      severity: 'success',
      summary: 'Інформація',
      detail: 'Звіт успішно сформовано',
      life: 3000
    });
  } catch (err) {
    toast.add({ severity: 'warn', summary: 'Попередження', detail: err.message, life: 3000 });
  } finally {
    executing.value = false;
  }
};
</script>

<template>
  <div class="flex w-full flex-col" style="height: calc(100vh - 5rem)">
    <div class="flex flex-row items-center justify-between">
      <div class="flex flex-wrap items-center gap-x-2">
        <AppIcon :path="$route.meta.icon" :size="42" />
        <div class="flex flex-col">
          <h3 class="text-2xl font-normal">{{ $route?.meta?.title }}</h3>
          <p class="text-muted-color text-base font-normal">{{ $route?.meta?.description }}</p>
        </div>
      </div>

      <div class="flex flex-row gap-x-2">
        <Button
          v-if="report"
          icon="pi pi-file-export"
          label="Сформувати"
          :loading="executing"
          severity="success"
          variant="outlined"
          @click="handleExecute"
        />
        <Button
          v-if="report"
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

    <div v-if="!loading && report" class="flex flex-col gap-6 overflow-y-auto p-4 lg:flex-row">
      <div class="flex flex-1 flex-col gap-4">
        <div class="border-surface-200 dark:border-surface-700 rounded-xl border p-6">
          <div class="mb-4 flex items-center gap-2">
            <AppIcon :path="mdiFileChartOutline" :size="20" />
            <span class="text-lg font-medium uppercase">Шаблон звіту</span>
          </div>

          <div class="flex flex-col gap-3">
            <div class="flex flex-col gap-y-1">
              <p class="text-muted-color text-xs font-medium tracking-wide uppercase">Назва</p>
              <p class="text-base font-semibold">{{ report.name }}</p>
            </div>

            <Divider type="dashed" />

            <div class="flex flex-col gap-y-1">
              <p class="text-muted-color text-xs font-medium tracking-wide uppercase">Опис</p>
              <p class="text-base">{{ report.description || '-' }}</p>
            </div>

            <Divider type="dashed" />

            <div class="flex flex-col gap-y-1">
              <p class="text-muted-color text-xs font-medium tracking-wide uppercase">Колекція</p>
              <Tag severity="info" :value="report.datacollection" />
            </div>
          </div>
        </div>

        <div class="border-surface-200 dark:border-surface-700 rounded-xl border p-6">
          <div class="flex flex-col gap-3">
            <div class="flex flex-col gap-y-1">
              <p class="text-muted-color text-xs font-medium tracking-wide uppercase">
                Дата створення
              </p>
              <p class="text-base">{{ report.createdAt ? dateToStr(report.createdAt) : '-' }}</p>
            </div>
            <Divider type="dashed" />
            <div class="flex flex-col gap-y-1">
              <p class="text-muted-color text-xs font-medium tracking-wide uppercase">
                Дата оновлення
              </p>
              <p class="text-base">{{ report.updatedAt ? dateToStr(report.updatedAt) : '-' }}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="flex flex-1 flex-col gap-4">
        <div class="border-surface-200 dark:border-surface-700 rounded-xl border p-6">
          <div class="mb-4 flex items-center gap-2">
            <i class="pi pi-table" />
            <span class="text-lg font-medium uppercase">Поля звіту</span>
          </div>

          <div
            v-if="report.fields && Object.keys(report.fields).length"
            class="flex flex-col gap-2"
          >
            <div
              v-for="(label, field) in report.fields"
              :key="field"
              class="bg-surface-50 dark:bg-surface-800 flex items-center justify-between rounded-lg px-3 py-2"
            >
              <p class="text-muted-color font-mono text-xs">{{ field }}</p>
              <p class="text-sm font-medium">{{ label }}</p>
            </div>
          </div>
          <p v-else class="text-muted-color text-sm">Поля не визначені</p>
        </div>
      </div>

      <div class="flex flex-1 flex-col gap-4">
        <div class="border-surface-200 dark:border-surface-700 rounded-xl border p-6">
          <div class="mb-4 flex items-center gap-2">
            <i class="pi pi-filter" />
            <span class="text-lg font-medium uppercase">Фільтри</span>
          </div>

          <pre
            v-if="report.filters && Object.keys(report.filters).length"
            class="bg-surface-50 dark:bg-surface-800 overflow-x-auto rounded-lg p-3 font-mono text-xs"
            >{{ JSON.stringify(report.filters, null, 2) }}</pre
          >
          <p v-else class="text-muted-color text-sm">Фільтри не визначені</p>
        </div>

        <div class="border-surface-200 dark:border-surface-700 rounded-xl border p-6">
          <div class="mb-4 flex items-center gap-2">
            <i class="pi pi-sort-alt" />
            <span class="text-lg font-medium uppercase">Сортування</span>
          </div>

          <div v-if="report.sorts && Object.keys(report.sorts).length" class="flex flex-col gap-2">
            <div
              v-for="(order, field) in report.sorts"
              :key="field"
              class="bg-surface-50 dark:bg-surface-800 flex items-center justify-between rounded-lg px-3 py-2"
            >
              <p class="font-mono text-xs">{{ field }}</p>
              <Tag
                :severity="order === 1 ? 'success' : 'warn'"
                :value="order === 1 ? 'ASC ↑' : 'DESC ↓'"
              />
            </div>
          </div>
          <p v-else class="text-muted-color text-sm">Сортування не визначено</p>
        </div>
      </div>
    </div>

    <NotFoundView v-if="!loading && !report" />
  </div>
</template>
