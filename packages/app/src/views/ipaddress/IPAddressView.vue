<script setup lang="jsx">
import { mdiIpOutline, mdiWeb, mdiWebCancel, mdiWebCheck, mdiWebRemove } from '@mdi/js';
import { FilterMatchMode, FilterOperator } from '@primevue/core/api';
import { useApolloClient, useLazyQuery, useMutation } from '@vue/apollo-composable';
import { useConfirm } from 'primevue/useconfirm';
import { useToast } from 'primevue/usetoast';
import QRCode from 'qrcode';
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';

import {
  FIND_ALL_DEPARTMENTS,
  FIND_ALL_DEVICES,
  FIND_ALL_IPADDRESSES,
  FIND_ALL_LOCATIONS,
  FIND_ALL_ORGANIZATIONS,
  FIND_ALL_POSITIONS,
  FIND_ALL_SUBDIVISIONS,
  FIND_ONE_IPADDRESS,
  REMOVE_ONE_IPADDRESS
} from '@/graphql/apollo.gql';
import { dateToStr } from '@/utils/DateMethods';

const toast = useToast();
const router = useRouter();
const confirm = useConfirm();

const { resolveClient } = useApolloClient();
const client = resolveClient();

const { load, result, refetch, loading } = useLazyQuery(FIND_ALL_IPADDRESSES, null, {
  fetchPolicy: 'cache-and-network',
  notifyOnNetworkStatusChange: true,
  keepPreviousResult: true
});

const { mutate: deleteIpAddress } = useMutation(REMOVE_ONE_IPADDRESS);

const { load: loadOraganizations } = useLazyQuery(FIND_ALL_ORGANIZATIONS);
const { load: loadSubdivisions } = useLazyQuery(FIND_ALL_SUBDIVISIONS);
const { load: loadDepartments } = useLazyQuery(FIND_ALL_DEPARTMENTS);
const { load: loadPositions } = useLazyQuery(FIND_ALL_POSITIONS);
const { load: loadLocations } = useLazyQuery(FIND_ALL_LOCATIONS);
const { load: loadDevices } = useLazyQuery(FIND_ALL_DEVICES);

const docs = computed(() => result.value?.ipaddresses?.docs || []);
const limit = computed(() => result.value?.ipaddresses?.limit || 10);
const offset = computed(() => result.value?.ipaddresses?.offset || 0);
const totalDocs = computed(() => result.value?.ipaddresses?.totalDocs || 0);

const refMenu = ref(null);
const qrcode = ref(false);

const doc = ref(null);

const filter = ref({
  field: 'ipaddress',
  matchMode: FilterMatchMode.STARTS_WITH,
  placeholder: 'Пошук IP-адреси'
});

const columns = ref([
  {
    header: { text: 'Розташування', width: '15rem' },
    column: { field: 'location.name' },
    sorter: { field: 'location.name' },
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
    },
    frozen: true
  },

  {
    header: { text: 'Пристрій', width: '12rem' },
    column: { field: 'device.name' },
    sorter: { field: 'device.name' },
    filter: {
      field: 'device',
      matchMode: FilterMatchMode.IN,
      options: {
        key: 'id',
        value: 'id',
        label: 'name',
        onRecords: async () => {
          const response = await loadDevices();
          return response?.devices || [];
        }
      }
    }
  },

  {
    header: { text: 'IP-адреса', width: '15rem' },
    column: {
      field: 'ipaddress',
      render(value) {
        return <span class="text-primary-500 cursor-pointer font-bold">{value}</span>;
      },
      action(data) {
        handleSelected(data);
      }
    },
    sorter: { field: 'indexip' },
    filter: {
      field: 'ipaddress',
      matchMode: FilterMatchMode.CONTAINS,
      filterOperator: FilterOperator.AND,
      showFilterMatchModes: true
    },
    frozen: true
  },

  {
    header: { text: 'Маска', width: '12rem' },
    column: { field: 'mask' },
    selectable: false
  },

  {
    header: { text: 'Шлюз', width: '12rem' },
    column: { field: 'gateway' },
    selectable: false
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
    header: { text: 'Дата відкриття', width: '16rem' },
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
    }
  },

  {
    header: { text: 'Інтернет', width: '12rem' },
    column: {
      field: 'internet.status',
      dataType: 'boolean',
      render(value) {
        switch (value) {
          case 'ACTIVE':
            return <AppIcon path={mdiWebCheck} size={14} class="text-green-500" />;

          case 'BLOCKED':
            return <AppIcon path={mdiWebCancel} size={14} class="text-red-500" />;

          case 'CLOSED':
            return <AppIcon path={mdiWebRemove} size={14} class="text-gray-500" />;

          default:
            return <span>-</span>;
        }
      }
    },
    sorter: { field: 'internet.status' },
    filter: {
      field: 'internet.status',
      matchMode: FilterMatchMode.EQUALS,
      options: {
        key: 'key',
        value: 'key',
        label: 'name',
        onRecords: () => {
          return [
            {
              key: 'NONE',
              name: 'Відсутній'
            },
            {
              key: 'ACTIVE',
              name: 'Активний'
            },
            {
              key: 'BLOCKED',
              name: 'Заблоковано'
            },
            {
              key: 'CLOSED',
              name: 'Закрито'
            }
          ];
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
    header: { text: 'Посада', width: '16rem' },
    column: { field: 'position.name' },
    sorter: { field: 'position.name' },
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
    header: { text: 'Електронна пошта', width: '16rem' },
    column: { field: 'email' },
    filter: {
      field: 'email',
      matchMode: FilterMatchMode.CONTAINS,
      filterOperator: FilterOperator.AND,
      showFilterMatchModes: true
    }
  },

  {
    header: { text: 'Організація', width: '16rem' },
    column: { field: 'organization.name' },
    sorter: { field: 'organization.name' },
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
    sorter: { field: 'subdivision.name' },
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
    sorter: { field: 'department.name' },
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
    header: { text: 'Інвентарний номер', width: '14rem' },
    column: { field: 'inventory' },
    sorter: { field: 'inventory' },
    filter: {
      field: 'inventory',
      matchMode: FilterMatchMode.CONTAINS,
      filterOperator: FilterOperator.AND,
      showFilterMatchModes: true
    }
  },

  {
    header: { text: 'Автовідповідь', width: '14rem' },
    column: { field: 'autoanswer' },
    sorter: { field: 'autoanswer' },
    filter: {
      field: 'autoanswer',
      matchMode: FilterMatchMode.CONTAINS,
      filterOperator: FilterOperator.AND,
      showFilterMatchModes: true
    }
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
    IP-адресa :	${doc.value?.ipaddress || '-'}
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
  router.push({ name: 'ipaddress-detail', params: { id } });
};

const handleCreate = () => {
  router.push({ name: 'ipaddress-new' });
};

const handleUpdate = ({ id }) => {
  router.push({ name: 'ipaddress-edit', params: { id } });
};

const handleDelete = async ({ id, ipaddress }) => {
  confirm.require({
    message: `Ви бажаєте видалити IP-адресу ${ipaddress} ?`,
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
      await deleteIpAddress({ id });
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
      query: FIND_ONE_IPADDRESS,
      variables: { id },
      fetchPolicy: 'no-cache'
    });

    doc.value = data.ipaddress;
  } catch {
    doc.value = null;
  }
};
</script>

<template>
  <div class="flex h-full w-full overflow-hidden">
    <OptionsMenu
      ref="refMenu"
      field="ipaddress"
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
      :storageKey="`app-datatable-${$route.name}-v1`"
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
        <AppIcon :path="mdiIpOutline" :size="40" />
      </template>

      <template #sidebar-title> IP {{ doc?.ipaddress }} </template>

      <template #sidebar-subtitle>
        Дата відкриття : {{ dateToStr(doc?.createdAt) || '-' }}
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

      <template #sidebar-content v-if="doc">
        <Image
          v-if="qrcode"
          alt="IP QR Code"
          class="w-full"
          imageClass="w-full"
          preview
          :src="qrcode"
        />

        <IPAddressPartial :data="doc" />

        <InternetPartial
          v-if="doc?.internet && doc?.internet?.status && doc?.internet?.status !== 'NONE'"
          :data="doc?.internet"
        >
          <template #header>
            <div class="my-6 flex w-full flex-row items-center">
              <i class="mr-2">
                <AppIcon :path="mdiWeb" :size="32" />
              </i>
              <div class="flex flex-col">
                <p class="text-lg">Інтернет</p>
                <p class="text-muted-color text-sm font-normal">
                  Дата: {{ dateToStr(doc?.internet?.updatedAt) || '-' }}
                </p>
              </div>
            </div>
          </template>
        </InternetPartial>
      </template>
    </CRUDDataTable>
  </div>
</template>
