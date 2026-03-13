<script setup lang="jsx">
import { mdiLanConnect } from '@mdi/js';
import { FilterMatchMode, FilterOperator } from '@primevue/core/api';
import { useApolloClient, useLazyQuery, useMutation } from '@vue/apollo-composable';
import { useConfirm } from 'primevue/useconfirm';
import { useToast } from 'primevue/usetoast';
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';

import { FIND_ALL_CHANNELS, FIND_ONE_CHANNEL, REMOVE_ONE_CHANNEL } from '@/graphql/apollo.gql';
import { dateToStr } from '@/utils/DateMethods';

const toast = useToast();
const router = useRouter();
const confirm = useConfirm();

const { resolveClient } = useApolloClient();
const client = resolveClient();

const { load, result, refetch, loading } = useLazyQuery(FIND_ALL_CHANNELS, null, {
  fetchPolicy: 'cache-and-network',
  notifyOnNetworkStatusChange: true,
  keepPreviousResult: true
});

const { mutate: deleteChannel } = useMutation(REMOVE_ONE_CHANNEL);

const docs = computed(() => result.value?.channels?.docs || []);
const limit = computed(() => result.value?.channels?.limit || 10);
const offset = computed(() => result.value?.channels?.offset || 0);
const totalDocs = computed(() => result.value?.channels?.totalDocs || 0);

const refMenu = ref(null);
const doc = ref(null);

const columns = ref([
  {
    header: { text: 'Поч. розташування', width: '16rem' },
    column: { field: 'locationFrom' },
    sorter: { field: 'locationFrom' },
    filter: {
      field: 'locationFrom',
      value: null,
      matchMode: FilterMatchMode.CONTAINS,
      filterOperator: FilterOperator.AND,
      showFilterMatchModes: true
    }
  },
  {
    header: { text: 'Поч. пристрій', width: '13rem' },
    column: { field: 'deviceFrom' },
    sorter: { field: 'deviceFrom' },
    filter: {
      field: 'deviceFrom',
      value: null,
      matchMode: FilterMatchMode.CONTAINS,
      filterOperator: FilterOperator.AND,
      showFilterMatchModes: true
    }
  },
  {
    header: { text: 'Кін. розташування', width: '16rem' },
    column: { field: 'locationTo' },
    sorter: { field: 'locationTo' },
    filter: {
      field: 'locationTo',
      value: null,
      matchMode: FilterMatchMode.CONTAINS,
      filterOperator: FilterOperator.AND,
      showFilterMatchModes: true
    }
  },
  {
    header: { text: 'Кін. пристрій', width: '13rem' },
    column: { field: 'deviceTo' },
    sorter: { field: 'deviceTo' },
    filter: {
      field: 'deviceTo',
      value: null,
      matchMode: FilterMatchMode.CONTAINS,
      filterOperator: FilterOperator.AND,
      showFilterMatchModes: true
    }
  },
  {
    header: { text: 'Рівень', width: '10rem' },
    column: { field: 'level' },
    sorter: { field: 'level' },
    filter: {
      field: 'level',
      value: null,
      matchMode: FilterMatchMode.CONTAINS,
      filterOperator: FilterOperator.AND,
      showFilterMatchModes: true
    }
  },
  {
    header: { text: 'Тип', width: '12rem' },
    column: { field: 'channelType' },
    sorter: { field: 'channelType' },
    filter: {
      field: 'channelType',
      value: null,
      matchMode: FilterMatchMode.CONTAINS,
      filterOperator: FilterOperator.AND,
      showFilterMatchModes: true
    }
  },
  {
    header: { text: 'Швидкість', width: '12rem' },
    column: { field: 'speed' },
    sorter: { field: 'speed' },
    filter: {
      field: 'speed',
      value: null,
      matchMode: FilterMatchMode.CONTAINS,
      filterOperator: FilterOperator.AND,
      showFilterMatchModes: true
    }
  },
  {
    header: { text: 'Статус', width: '12rem' },
    column: { field: 'status' },
    sorter: { field: 'status' },
    filter: {
      field: 'status',
      value: null,
      matchMode: FilterMatchMode.CONTAINS,
      filterOperator: FilterOperator.AND,
      showFilterMatchModes: true
    }
  },
  {
    header: { text: 'Оператор', width: '12rem' },
    column: { field: 'operator' },
    sorter: { field: 'operator' },
    filter: {
      field: 'operator',
      value: null,
      matchMode: FilterMatchMode.CONTAINS,
      filterOperator: FilterOperator.AND,
      showFilterMatchModes: true
    }
  },
  {
    header: { text: 'Склад', width: '12rem' },
    column: { field: 'composition' },
    sorter: { field: 'composition' },
    filter: {
      field: 'composition',
      value: null,
      matchMode: FilterMatchMode.CONTAINS,
      filterOperator: FilterOperator.AND,
      showFilterMatchModes: true
    }
  },
  {
    header: { text: 'Дата створення', width: '16rem' },
    column: {
      field: 'createdAt',
      render(value) {
        return <span>{dateToStr(value) || '-'}</span>;
      }
    },
    sorter: { field: 'createdAt' },
    filter: {
      field: 'createdAt',
      matchMode: FilterMatchMode.DATE_IS
    },
    selectable: false
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

const handleDetail = ({ id }) => {
  router.push({ name: 'channel-detail', params: { id } });
};

const handleCreate = () => {
  router.push({ name: 'channel-new' });
};

const handleUpdate = ({ id }) => {
  router.push({ name: 'channel-edit', params: { id } });
};

const handleDelete = async ({ id }) => {
  confirm.require({
    message: 'Ви бажаєте видалити канал?',
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
      await deleteChannel({ id });
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

const handleSelected = async ({ id }) => {
  try {
    const { data } = await client.query({
      query: FIND_ONE_CHANNEL,
      variables: { id },
      fetchPolicy: 'no-cache'
    });

    doc.value = data.channel;
  } catch {
    doc.value = null;
  }
};
</script>

<template>
  <div class="flex h-full w-full overflow-hidden">
    <OptionsMenu
      ref="refMenu"
      @create="handleCreate"
      @delete="handleDelete"
      @detail="handleDetail"
      @update="handleUpdate"
    />

    <CRUDDataTable
      :columns="columns"
      :doc="doc"
      :docs="docs"
      :limit="limit"
      :loading="loading"
      :offset="offset"
      :storageKey="`app-datatable-${$route.name}`"
      :totalDocs="totalDocs"
      @close-sidebar="doc = null"
      @create="handleCreate"
      @fetch="handleFetch"
      @open-menu="(event, data) => refMenu.toggle(event, data)"
      @row-click="handleSelected"
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

      <template #sidebar-icon>
        <AppIcon :path="mdiLanConnect" :size="40" />
      </template>

      <template #sidebar-title>Мережевий канал</template>

      <template #sidebar-subtitle>{{ doc?.locationFrom }} — {{ doc?.locationTo }}</template>

      <template #sidebar-content v-if="doc">
        <ChannelPartial :data="doc" />
      </template>
    </CRUDDataTable>
  </div>
</template>
