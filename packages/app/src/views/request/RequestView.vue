<script setup lang="jsx">
import { FilterMatchMode, FilterOperator } from '@primevue/core/api';
import { useApolloClient, useLazyQuery, useMutation } from '@vue/apollo-composable';
import { useConfirm } from 'primevue/useconfirm';
import { useToast } from 'primevue/usetoast';
import QRCode from 'qrcode';
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';

import { REQUEST_STATUS, REQUEST_STATUS_SEVERITY } from '@/constants/ui.const';
import {
  FIND_ALL_DEPARTMENTS,
  FIND_ALL_LOCATIONS,
  FIND_ALL_ORGANIZATIONS,
  FIND_ALL_POSITIONS,
  FIND_ALL_REQUESTS,
  FIND_ALL_SUBDIVISIONS,
  FIND_ALL_USERS,
  FIND_ONE_REQUEST,
  REMOVE_ONE_REQUEST
} from '@/graphql/apollo.gql.js';
import { dateTimeToStr } from '@/utils/DateMethods';

const toast = useToast();
const router = useRouter();
const confirm = useConfirm();

const { resolveClient } = useApolloClient();
const client = resolveClient();

const { load, result, refetch, loading } = useLazyQuery(FIND_ALL_REQUESTS, null, {
  fetchPolicy: 'cache-and-network',
  notifyOnNetworkStatusChange: true,
  keepPreviousResult: true
});

const { mutate: deleteRequest } = useMutation(REMOVE_ONE_REQUEST);

const { load: loadOraganizations } = useLazyQuery(FIND_ALL_ORGANIZATIONS);
const { load: loadSubdivisions } = useLazyQuery(FIND_ALL_SUBDIVISIONS);
const { load: loadDepartments } = useLazyQuery(FIND_ALL_DEPARTMENTS);
const { load: loadPositions } = useLazyQuery(FIND_ALL_POSITIONS);
const { load: loadLocations } = useLazyQuery(FIND_ALL_LOCATIONS);
const { load: loadUsers } = useLazyQuery(FIND_ALL_USERS);

const docs = computed(() => result.value?.requests?.docs || []);
const limit = computed(() => result.value?.requests?.limit || 10);
const offset = computed(() => result.value?.requests?.offset || 0);
const totalDocs = computed(() => result.value?.requests?.totalDocs || 0);

const refMenu = ref(null);
const qrcode = ref(false);

const doc = ref(null);

const filter = ref({
  field: 'request',
  matchMode: FilterMatchMode.CONTAINS,
  placeholder: 'Пошук за запитом'
});

const columns = ref([
  {
    header: { text: 'Відкрив заявку', width: '16rem' },
    column: { field: 'opened.fullname' },
    filter: {
      field: 'opened',
      matchMode: FilterMatchMode.IN,
      options: {
        key: 'id',
        value: 'id',
        label: 'fullname',
        onRecords: async () => {
          const response = await loadUsers();
          return response?.users || [];
        }
      }
    },
    frozen: true
  },

  {
    header: { text: 'Дата відкриття', width: '15rem' },
    column: {
      field: 'createdAt',
      render(value) {
        return <span class="font-semibold">{dateTimeToStr(value) || '-'}</span>;
      }
    },
    sorter: { field: 'createdAt' },
    filter: {
      field: 'createdAt',
      matchMode: FilterMatchMode.DATE_IS
    }
  },

  {
    header: { text: 'Статус', width: '13rem' },
    column: {
      field: 'status',
      render(value) {
        const status = REQUEST_STATUS.find(item => item.key === value)?.label ?? '-';
        const severity = REQUEST_STATUS_SEVERITY[value] ?? 'secondary';
        return <Tag class="cursor-pointer" severity={severity} value={status} />;
      },
      action(data) {
        handleSelected(data);
      }
    },
    sorter: { field: 'status' },
    filter: {
      field: 'status',
      matchMode: FilterMatchMode.EQUALS,
      showFilterMatchModes: false,
      options: {
        key: 'key',
        value: 'key',
        label: 'label',
        onRecords: () => REQUEST_STATUS
      }
    }
  },

  {
    header: { text: 'Номер листа', width: '16rem' },
    column: { field: 'reqnum' },
    sorter: { field: 'reqnum' },
    filter: {
      field: 'reqnum',
      matchMode: FilterMatchMode.CONTAINS,
      filterOperator: FilterOperator.AND,
      showFilterMatchModes: true
    }
  },

  {
    header: { text: 'Запит', width: '25rem' },
    column: {
      field: 'request',
      render(value) {
        return <span class="cursor-pointer font-semibold">{value}</span>;
      },
      action(data) {
        handleSelected(data);
      }
    },
    sorter: { field: 'request' },
    filter: {
      field: 'request',
      matchMode: FilterMatchMode.CONTAINS,
      filterOperator: FilterOperator.AND,
      showFilterMatchModes: true
    },
    frozen: true
  },

  {
    header: { text: 'Розташування', width: '15rem' },
    column: { field: 'location.name' },
    filter: {
      field: 'location',
      matchMode: FilterMatchMode.IN,
      options: {
        key: 'id',
        value: 'id',
        label: 'name',
        grouped: true,
        onRecords: async () => {
          const response = await loadLocations();
          return response?.locations || [];
        }
      }
    }
  },

  {
    header: { text: "Прізвище та ім'я", width: '16rem' },
    column: { field: 'fullname' },
    sorter: { field: 'fullname' },
    filter: {
      field: 'fullname',
      matchMode: FilterMatchMode.CONTAINS,
      filterOperator: FilterOperator.AND,
      showFilterMatchModes: true
    }
  },

  {
    header: { text: 'Номер телефону', width: '15rem' },
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
    header: { text: 'Посада', width: '16rem' },
    column: { field: 'position.name' },
    filter: {
      field: 'position',
      matchMode: FilterMatchMode.IN,
      options: {
        key: 'id',
        value: 'id',
        label: 'name',
        onRecords: async () => {
          const response = await loadPositions();
          return response?.positions || [];
        }
      }
    }
  },

  {
    header: { text: 'IP-адреса', width: '16rem' },
    column: { field: 'ipaddress' },
    sorter: { field: 'ipaddress' },
    filter: {
      field: 'ipaddress',
      matchMode: FilterMatchMode.CONTAINS,
      filterOperator: FilterOperator.AND,
      showFilterMatchModes: true
    }
  },

  {
    header: { text: 'Організація', width: '16rem' },
    column: { field: 'organization.name' },
    filter: {
      field: 'organization',
      matchMode: FilterMatchMode.IN,
      options: {
        key: 'id',
        value: 'id',
        label: 'name',
        onRecords: async () => {
          const response = await loadOraganizations();
          return response?.organizations || [];
        }
      }
    }
  },

  {
    header: { text: 'Підрозділ', width: '16rem' },
    column: { field: 'subdivision.name' },
    filter: {
      field: 'subdivision',
      matchMode: FilterMatchMode.IN,
      options: {
        key: 'id',
        value: 'id',
        label: 'name',
        onRecords: async () => {
          const response = await loadSubdivisions();
          return response?.subdivisions || [];
        }
      }
    }
  },

  {
    header: { text: 'Відділ', width: '16rem' },
    column: { field: 'department.name' },
    filter: {
      field: 'department',
      matchMode: FilterMatchMode.IN,
      options: {
        key: 'id',
        value: 'id',
        label: 'name',
        onRecords: async () => {
          const response = await loadDepartments();
          return response?.departments || [];
        }
      }
    }
  },

  {
    header: { text: 'Дата закриття', width: '15rem' },
    column: {
      field: 'updatedAt',
      render(value) {
        return <span>{dateTimeToStr(value) || '-'}</span>;
      }
    },
    sorter: { field: 'updatedAt' },
    filter: {
      field: 'updatedAt',
      matchMode: FilterMatchMode.DATE_IS
    }
  },

  {
    header: { text: 'Закрив запит', width: '16rem' },
    column: { field: 'closed.fullname' },
    filter: {
      field: 'closed',
      matchMode: FilterMatchMode.IN,
      options: {
        key: 'id',
        value: 'id',
        label: 'fullname',
        onRecords: async () => {
          const response = await loadUsers();
          return response?.users || [];
        }
      }
    }
  },

  {
    header: { text: 'Висновок на запит', width: '25rem' },
    column: { field: 'conclusion' }
  },

  {
    header: { text: 'Коментар', width: '25rem' },
    column: { field: 'comment' }
  }
]);

const getQRCode = async () => {
  if (!doc.value) {
    qrcode.value = null;
    return;
  }

  if (qrcode.value) {
    qrcode.value = null;
    return;
  }

  const qrCodeText = `
    Повне ім'я :	${doc.value?.fullname || '-'}
    Посада :	${doc.value?.position?.name || '-'}
    Телефон :	${doc.value?.phone || '-'}
  `;

  qrcode.value = await QRCode.toDataURL(qrCodeText);
};

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
  router.push({ name: 'request-detail', params: { id } });
};

const handleCreate = () => {
  router.push({ name: 'request-new' });
};

const handleUpdate = ({ id }) => {
  router.push({ name: 'request-edit', params: { id } });
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
      await deleteRequest({ id });
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
  qrcode.value = null;

  try {
    const { data } = await client.query({
      query: FIND_ONE_REQUEST,
      variables: { id },
      fetchPolicy: 'no-cache'
    });

    doc.value = data.request;
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

      <template #header-actions>
        <BtnDBTables />
      </template>

      <template #sidebar-icon>
        <AppIcon :path="$route.meta.icon" :size="40" />
      </template>

      <template #sidebar-title>
        {{ doc?.reqnum || doc?.request }}
      </template>

      <template #sidebar-subtitle>
        Статус : {{ REQUEST_STATUS.find(item => item.key === doc.status)?.label ?? '-' }}
      </template>

      <template #sidebar-actions>
        <Button
          v-tooltip.bottom="'QR-Code'"
          class="h-12 w-12"
          icon="pi pi-qrcode"
          rounded
          severity="secondary"
          variant="text"
          @click="getQRCode"
        />
      </template>

      <template v-if="doc" #sidebar-content>
        <Image
          v-if="qrcode"
          alt="Request QR Code"
          class="w-full"
          imageClass="w-full"
          preview
          :src="qrcode"
        />

        <RequestPartial :data="doc" />
      </template>
    </CRUDDataTable>
  </div>
</template>
