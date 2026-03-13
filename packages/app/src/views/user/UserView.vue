<script setup lang="jsx">
import { mdiAccountOutline } from '@mdi/js';
import { FilterMatchMode, FilterOperator } from '@primevue/core/api';
import { useApolloClient, useLazyQuery, useMutation } from '@vue/apollo-composable';
import { useConfirm } from 'primevue/useconfirm';
import { useToast } from 'primevue/usetoast';
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';

import { FIND_ALL_USERS, FIND_ONE_USER, REMOVE_ONE_USER } from '@/graphql/apollo.gql';

const toast = useToast();
const router = useRouter();
const confirm = useConfirm();

const { resolveClient } = useApolloClient();
const client = resolveClient();

const { load, result, refetch, loading } = useLazyQuery(FIND_ALL_USERS, null, {
  fetchPolicy: 'cache-and-network',
  notifyOnNetworkStatusChange: true,
  keepPreviousResult: true
});

const { mutate: deleteUser } = useMutation(REMOVE_ONE_USER);

const docs = computed(() => result.value?.users?.docs || []);
const limit = computed(() => result.value?.users?.limit || 10);
const offset = computed(() => result.value?.users?.offset || 0);
const totalDocs = computed(() => result.value?.users?.totalDocs || 0);

const refMenu = ref();

const doc = ref(null);

const filter = ref({
  field: 'fullname',
  matchMode: FilterMatchMode.CONTAINS,
  placeholder: 'Шукати за прізвищем'
});

const columns = ref([
  {
    header: { text: "Прізвище та ім'я", width: '14rem' },
    column: { field: 'fullname' },
    sorter: { field: 'fullname' },
    filter: {
      field: 'fullname',
      matchMode: FilterMatchMode.CONTAINS,
      filterOperator: FilterOperator.AND,
      showFilterMatchModes: true
    },
    frozen: true
  },

  {
    header: { text: 'Електронна пошта', width: '16rem' },
    column: {
      field: 'email',
      render(value) {
        return <span class="text-primary-500 cursor-pointer font-bold">{value}</span>;
      },
      action(data) {
        handleSelected(data);
      }
    },
    sorter: { field: 'email' },
    filter: {
      field: 'email',
      matchMode: FilterMatchMode.CONTAINS,
      filterOperator: FilterOperator.AND,
      showFilterMatchModes: true
    }
  },

  {
    header: { text: 'Номер телефону', width: '16rem' },
    column: { field: 'phone' },
    sorter: { field: 'phone' },
    filter: {
      field: 'phone',
      matchMode: FilterMatchMode.CONTAINS,
      filterOperator: FilterOperator.AND,
      showFilterMatchModes: true
    }
  },

  {
    header: { text: 'Статус', width: '12rem' },
    column: {
      field: 'status',
      render(value) {
        switch (value) {
          case 'PENDING':
            return <Badge severity="secondary">{value}</Badge>;
          case 'ACTIVE':
            return <Badge severity="success">{value}</Badge>;
          case 'BLOCKED':
            return <Badge severity="warn">{value}</Badge>;
          case 'DISABLED':
            return <Badge severity="danger">{value}</Badge>;
          default:
            return <span>-</span>;
        }
      }
    },
    sorter: { field: 'status' },
    filter: {
      field: 'status',
      matchMode: FilterMatchMode.EQUALS,
      showFilterMatchModes: false
    }
  },

  {
    header: { text: 'Роль', width: '12rem' },
    column: {
      field: 'role',
      render(value) {
        switch (value) {
          case 'ADMIN':
            return <Badge severity="secondary">{value}</Badge>;
          case 'MANAGER':
            return <Badge severity="secondary">{value}</Badge>;
          case 'SUPPORT':
            return <Badge severity="secondary">{value}</Badge>;
          case 'CLIENT':
            return <Badge severity="secondary">{value}</Badge>;
          default:
            return <span>-</span>;
        }
      }
    },
    sorter: { field: 'role' },
    filter: {
      field: 'role',
      matchMode: FilterMatchMode.EQUALS,
      showFilterMatchModes: false
    }
  },

  {
    header: { text: 'Набори дозволів', width: '12rem' },
    column: {
      field: 'scope',
      render(value) {
        return (
          <Tag
            class="bg-surface-500/20! px-6 text-base! font-normal! text-black! dark:text-white!"
            value={value ? `${value?.length} / ???` : '-'}
          />
        );
      }
    },
    sorter: { field: 'scope' },
    filter: {
      field: 'scope',
      matchMode: FilterMatchMode.CONTAINS,
      filterOperator: FilterOperator.AND,
      showFilterMatchModes: true
    }
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
  router.push({ name: 'user-detail', params: { id } });
};

const handleCreate = () => {
  router.push({ name: 'user-new' });
};

const handleUpdate = ({ id }) => {
  router.push({ name: 'user-edit', params: { id } });
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
      await deleteUser({ id });
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
      query: FIND_ONE_USER,
      variables: { id },
      fetchPolicy: 'no-cache'
    });

    doc.value = data.user;
  } catch {
    doc.value = null;
  }
};
</script>

<template>
  <div class="flex h-full w-full">
    <OptionsMenu
      ref="refMenu"
      filed="fullname"
      @create="handleCreate"
      @delete="handleDelete"
      @detail="handleDetail"
      @update="handleUpdate"
    />

    <CRUDDataTable
      :columns="columns"
      :doc="doc"
      :docs="docs"
      :globalFilter="filter"
      :limit="limit"
      :loading="loading"
      :offset="offset"
      :storageKey="`app-datatable-${$route.name}`"
      :totalDocs="totalDocs"
      @close-sidebar="doc = null"
      @create="handleCreate"
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

      <template #sidebar-icon>
        <AppIcon :path="mdiAccountOutline" :size="40" />
      </template>

      <template #sidebar-title> {{ doc?.fullname }} </template>

      <template #sidebar-subtitle> {{ doc?.email }} </template>

      <template #sidebar-content v-if="doc">
        <UserPartial :data="doc" />
      </template>
    </CRUDDataTable>
  </div>
</template>
