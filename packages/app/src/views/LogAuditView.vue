<script setup lang="jsx">
import { FilterMatchMode, FilterOperator } from '@primevue/core/api';
import { useLazyQuery, useMutation } from '@vue/apollo-composable';
import { useConfirm } from 'primevue/useconfirm';
import { useToast } from 'primevue/usetoast';
import { computed, ref } from 'vue';

import { FIND_ALL_SYSLOGS, REMOVE_ALL_SYSLOGS, REMOVE_ONE_SYSLOG } from '@/graphql/apollo.gql';
import { dateTimeToStr } from '@/utils/DateMethods';

const toast = useToast();
const confirm = useConfirm();

const { load, result, refetch, loading } = useLazyQuery(FIND_ALL_SYSLOGS, null, {
  fetchPolicy: 'cache-and-network',
  notifyOnNetworkStatusChange: true,
  keepPreviousResult: true
});

const { mutate: deleteSysLog } = useMutation(REMOVE_ONE_SYSLOG);

const { mutate: deleteAllSysLogs } = useMutation(REMOVE_ALL_SYSLOGS);

const docs = computed(() => result.value?.syslogs?.docs || []);
const limit = computed(() => result.value?.syslogs?.limit || 10);
const offset = computed(() => result.value?.syslogs?.offset || 0);
const totalDocs = computed(() => result.value?.syslogs?.totalDocs || 0);

const refMenu = ref();

const filter = ref({
  field: 'ipaddress',
  matchMode: FilterMatchMode.CONTAINS,
  placeholder: 'Пошук за IP-адресою'
});

const columns = ref([
  {
    header: { text: 'IP-адреса', width: '12rem' },
    column: {
      field: 'ipaddress',
      render(value) {
        return (
          <Tag
            class="bg-surface-500/20! px-6 text-base! font-normal! text-black! dark:text-white!"
            value={value}
          />
        );
      }
    },
    sorter: { field: 'ipaddress' },
    filter: {
      field: 'ipaddress',
      value: null,
      matchMode: FilterMatchMode.CONTAINS,
      filterOperator: FilterOperator.AND,
      showFilterMatchModes: true
    },
    selectable: true,
    filtrable: true,
    sortable: true,
    frozen: true
  },

  {
    header: { text: 'Дата і час', width: '12rem' },
    column: {
      field: 'createdAt',
      render(value) {
        return <span>{dateTimeToStr(value) || '-'}</span>;
      }
    },
    sorter: { field: 'createdAt' },
    filter: {
      field: 'createdAt',
      value: null,
      matchMode: FilterMatchMode.DATE_IS
    },
    selectable: true,
    filtrable: true,
    sortable: true,
    frozen: false
  },

  {
    header: { text: 'Користувач', width: '16rem' },
    column: {
      field: 'user.fullname',
      render(value) {
        return (
          <Tag
            class="bg-surface-500/20! px-6 text-base! font-normal! text-black! dark:text-white!"
            value={value || 'anonymous'}
          />
        );
      }
    },
    sorter: { field: 'user' },
    filter: {
      field: 'user',
      value: null,
      matchMode: FilterMatchMode.CONTAINS,
      filterOperator: FilterOperator.AND,
      showFilterMatchModes: true
    },
    selectable: true,
    filtrable: true,
    sortable: true,
    frozen: true
  },

  {
    header: { text: 'Метод', width: '12rem' },
    column: {
      field: 'method',
      render(value) {
        return (
          <Tag
            class="bg-surface-500/20! w-full max-w-32 px-6 text-base! font-normal! text-black! dark:text-white!"
            value={value}
          />
        );
      }
    },
    sorter: { field: 'method' },
    filter: {
      field: 'method',
      value: null,
      matchMode: FilterMatchMode.CONTAINS
    },
    selectable: true,
    filtrable: true,
    sortable: true,
    frozen: false
  },

  {
    header: { text: 'Статус', width: '10rem' },
    column: {
      field: 'status',
      render(value) {
        return (
          <Tag
            class={[
              { 'text-blue-500!': value < 200 },
              { 'text-green-500!': value >= 200 && value < 300 },
              { 'text-gray-500!': value >= 300 && value < 400 },
              { 'text-orange-500!': value >= 400 && value < 500 },
              { 'text-red-500!': value >= 500 },

              'rounded! px-6 text-base! font-bold!',
              'bg-surface-500/20!'
            ]}
            value={value}
          />
        );
      }
    },
    sorter: { field: 'status' },
    selectable: true,
    filtrable: false,
    sortable: true,
    frozen: false
  },

  {
    header: { text: 'Назва метода', width: '20rem' },
    column: {
      field: 'methodName',
      render(value) {
        return (
          <Tag
            class="bg-surface-500/20! w-full max-w-[16rem] px-6 text-base! font-normal! text-black! dark:text-white!"
            value={value}
          />
        );
      }
    },
    sorter: { field: 'methodName' },
    filter: {
      field: 'methodName',
      value: null,
      matchMode: FilterMatchMode.CONTAINS,
      filterOperator: FilterOperator.AND,
      showFilterMatchModes: true
    },
    selectable: true,
    filtrable: true,
    sortable: true,
    frozen: false
  },

  {
    header: { text: 'Агент користувача', width: '25rem' },
    column: {
      field: 'userAgent',
      render(value) {
        return <span>{value}</span>;
      }
    },
    sorter: { field: 'userAgent' },
    filter: {
      field: 'userAgent',
      value: null,
      matchMode: FilterMatchMode.CONTAINS,
      filterOperator: FilterOperator.AND,
      showFilterMatchModes: true
    },
    selectable: true,
    filtrable: true,
    sortable: true,
    frozen: false
  },

  {
    header: { text: 'Інформація про помилку', width: '30rem' },
    column: {
      field: 'error',
      render(value) {
        return <span>{value || '-'}</span>;
      }
    },
    sorter: { field: 'error' },
    filter: {
      field: 'error',
      value: null,
      matchMode: FilterMatchMode.CONTAINS,
      filterOperator: FilterOperator.AND,
      showFilterMatchModes: true
    },
    selectable: true,
    filtrable: true,
    sortable: true,
    frozen: false
  }
]);

const handleFetch = params => {
  try {
    const variables = {
      limit: params.limit,
      offset: params.offset,
      filters: params.filters,
      sort: params.sort
    };
    load(null, variables) || refetch(variables);
  } catch (err) {
    toast.add({
      severity: 'error',
      summary: 'Помилка завантаження',
      detail: err.message,
      life: 3000
    });
  }
};

const handleDelete = ({ id }) => {
  confirm.require({
    message: `Ви бажаєте видалити запис?`,
    header: 'Попередження',
    icon: 'pi pi-info-circle',
    rejectProps: {
      label: 'Відмінити',
      severity: 'secondary',
      outlined: true
    },
    acceptProps: {
      label: 'Видалити',
      severity: 'danger'
    },
    accept: async () => {
      await deleteSysLog({ id });
      toast.add({
        severity: 'success',
        summary: 'Інформація',
        detail: 'Запис видалено',
        life: 3000
      });
      refetch();
    },
    reject: () => {
      toast.add({
        severity: 'info',
        summary: 'Інформація',
        detail: 'Видалення запису не підтверджено',
        life: 3000
      });
    }
  });
};

const handleAllDelete = () => {
  confirm.require({
    message: `Ви бажаєте видалити всі записи?`,
    header: 'Попередження',
    icon: 'pi pi-info-circle',
    position: 'top',
    rejectProps: {
      label: 'Відмінити',
      severity: 'secondary',
      outlined: true
    },
    acceptProps: {
      label: 'Видалити',
      severity: 'danger'
    },
    accept: async () => {
      await deleteAllSysLogs();
      toast.add({
        severity: 'success',
        summary: 'Інформація',
        detail: 'Запис видалено',
        life: 3000
      });
      refetch();
    },
    reject: () => {
      toast.add({
        severity: 'info',
        summary: 'Інформація',
        detail: 'Видалення запису не підтверджено',
        life: 3000
      });
    }
  });
};
</script>

<template>
  <div class="flex h-full w-full">
    <OptionsMenu ref="refMenu" field="ipaddress" @delete="handleDelete" />

    <CRUDDataTable
      :columns="columns"
      :docs="docs"
      :globalFilter="filter"
      :limit="limit"
      :loading="loading"
      :offset="offset"
      :storageKey="`app-datatable-${$route.name}-v1`"
      :totalDocs="totalDocs"
      @fetch="handleFetch"
      @open-menu="(event, data) => refMenu.toggle(event, data)"
    >
      <template #header-icon>
        <AppIcon :path="$route.meta.icon" :size="40" />
      </template>

      <template #header-title>
        {{ $route?.meta?.title }}
      </template>

      <template #header-subtitle>
        {{ $route?.meta?.description }}
      </template>

      <template #header-actions>
        <Button
          v-tooltip.bottom="'Видалити записи'"
          icon="pi pi-trash"
          iconClass="text-2xl!"
          rounded
          severity="secondary"
          variant="text"
          @click="handleAllDelete"
        />
      </template>
    </CRUDDataTable>
  </div>
</template>
