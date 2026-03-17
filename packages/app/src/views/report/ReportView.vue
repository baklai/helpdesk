<script setup>
import { mdiFileChartOutline } from '@mdi/js';
import { useApolloClient, useMutation, useQuery } from '@vue/apollo-composable';
import { useConfirm } from 'primevue/useconfirm';
import { useToast } from 'primevue/usetoast';
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';

import { EXECUTE_ONE_REPORT, FIND_ALL_REPORTS, REMOVE_ONE_REPORT } from '@/graphql/apollo.gql';
import { dateToStr } from '@/utils/DateMethods';

const toast = useToast();
const router = useRouter();
const confirm = useConfirm();

const { result, refetch, loading } = useQuery(FIND_ALL_REPORTS, null, {});

const { mutate: deleteReport } = useMutation(REMOVE_ONE_REPORT);

const { resolveClient } = useApolloClient();
const client = resolveClient();

const filter = ref();

const reports = computed(() => {
  if (filter.value) {
    return result.value?.reports?.filter(item => item?.name?.includes(filter));
  } else {
    return result.value?.reports || [];
  }
});

const handleCreate = () => {
  router.push({ name: 'report-new' });
};

const handleDetail = id => {
  router.push({ name: 'report-detail', params: { id } });
};

const handleUpdate = id => {
  router.push({ name: 'report-edit', params: { id } });
};

const handleDelete = item => {
  confirm.require({
    message: `Ви бажаєте видалити шаблон звіту "${item.name}"?`,
    header: 'Підтвердження видалення',
    icon: 'pi pi-info-circle',
    rejectProps: { label: 'Відмінити', severity: 'secondary', outlined: true },
    acceptProps: { label: 'Видалити', severity: 'danger' },
    accept: async () => {
      try {
        await deleteReport({ id: item.id });
        await refetch();
        toast.add({
          severity: 'success',
          summary: 'Інформація',
          detail: 'Запис видалено',
          life: 3000
        });
      } catch {
        toast.add({
          severity: 'warn',
          summary: 'Попередження',
          detail: 'Запис не видалено',
          life: 3000
        });
      }
    },
    reject: () => {
      toast.add({
        severity: 'info',
        summary: 'Інформація',
        detail: 'Видалення не підтверджено',
        life: 3000
      });
    }
  });
};

const handleExecute = async item => {
  try {
    const { data } = await client.query({
      query: EXECUTE_ONE_REPORT,
      variables: { id: item.id },
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
    const blob = new Blob(['\uFEFF' + `${headers}\n${body}`], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${item.name}-${dateToStr(new Date())}.csv`;
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
  }
};
</script>

<template>
  <div class="flex h-full w-full flex-col overflow-hidden">
    <div class="mb-6 flex items-center justify-between">
      <div class="flex items-center gap-x-2">
        <AppIcon :path="$route.meta.icon" :size="40" />
        <div>
          <h3 class="text-2xl">{{ $route?.meta?.title }}</h3>
          <p class="text-muted-color text-base">{{ $route?.meta?.description }}</p>
        </div>
      </div>

      <div class="flex w-full items-center justify-between gap-2 md:w-max">
        <IconField class="relative w-full sm:w-max">
          <InputIcon class="pi pi-search" />
          <InputText v-model="filter" class="w-full sm:w-max" placeholder="Шукати за назвою" />
          <InputIcon
            v-if="filter"
            v-tooltip.bottom="'Очистити фільтр'"
            class="pi pi-times cursor-pointer"
            @click="filter = null"
          />
        </IconField>

        <div class="flex w-full justify-between gap-2 sm:w-max">
          <Button
            v-tooltip.bottom="'Створити шаблон звіту'"
            icon="pi pi-plus-circle"
            iconClass="text-2xl!"
            rounded
            severity="secondary"
            variant="text"
            @click="handleCreate"
          />

          <Button
            v-tooltip.bottom="'Оновити записи'"
            icon="pi pi-sync"
            iconClass="text-2xl!"
            rounded
            severity="secondary"
            variant="text"
            @click="refetch"
          />
        </div>
      </div>
    </div>

    <AppLoading v-if="loading" />

    <div v-else-if="reports?.length > 0" class="flex flex-wrap gap-4 overflow-y-auto">
      <Card
        v-for="item in reports"
        :key="item.id"
        class="border-surface-200 dark:border-surface-700 w-full cursor-pointer rounded-xl! border sm:w-104"
        @click="handleDetail(item.id)"
      >
        <template #header>
          <div
            class="bg-surface-50 dark:bg-surface-800 flex items-center justify-center rounded-t-xl px-4 pt-6 pb-4"
          >
            <AppIcon class="text-primary-500" :path="mdiFileChartOutline" :size="48" />
          </div>
        </template>

        <template #title>
          <p class="truncate text-base font-bold">{{ item.name }}</p>
        </template>

        <template #subtitle>
          <p class="text-muted-color line-clamp-2 text-sm">
            {{ item?.description || '—' }}
          </p>
        </template>

        <template #content>
          <div class="flex flex-row justify-between">
            <p class="text-muted-color mt-2 text-xs">
              {{ item?.creator?.fullname || '—' }}
            </p>
            <p class="text-muted-color mt-2 text-xs">
              {{ dateToStr(item.updatedAt) || '—' }}
            </p>
          </div>
        </template>

        <template #footer>
          <div class="flex items-center justify-between gap-1">
            <Button
              v-tooltip.top="'Сформувати CSV'"
              icon="pi pi-file-export"
              rounded
              severity="success"
              text
              @click.stop="handleExecute(item)"
            />

            <div class="flex gap-1">
              <Button
                v-tooltip.top="'Редагувати'"
                icon="pi pi-pencil"
                rounded
                severity="secondary"
                text
                @click.stop="handleUpdate(item.id)"
              />
              <Button
                v-tooltip.top="'Видалити'"
                icon="pi pi-trash"
                rounded
                severity="danger"
                text
                @click.stop="handleDelete(item)"
              />
            </div>
          </div>
        </template>
      </Card>
    </div>

    <div v-else class="flex h-full w-full items-stretch justify-center text-center">
      <div class="m-auto flex flex-col gap-2">
        <i class="pi pi-filter-slash text-surface-500 text-7xl!"></i>
        <h5 class="text-2xl font-semibold">Записів не знайдено</h5>
        <p class="text-surface-500 text-base">Спробуйте змінити пошукові запити у фільтрі</p>
        <Button
          class="m-auto my-4 w-max"
          icon="pi pi-filter-slash text-sm"
          label="Очистити фільтри"
          @click="filter = null"
        />
      </div>
    </div>
  </div>
</template>
