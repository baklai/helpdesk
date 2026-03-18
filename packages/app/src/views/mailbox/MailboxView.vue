<script setup lang="jsx">
import { mdiEmailAlertOutline, mdiEmailCheckOutline, mdiEmailRemoveOutline } from '@mdi/js';
import { FilterMatchMode, FilterOperator } from '@primevue/core/api';
import { useApolloClient, useLazyQuery, useMutation } from '@vue/apollo-composable';
import { useConfirm } from 'primevue/useconfirm';
import { useToast } from 'primevue/usetoast';
import QRCode from 'qrcode';
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';

import {
  FIND_ALL_DEPARTMENTS,
  FIND_ALL_MAILBOXES,
  FIND_ALL_ORGANIZATIONS,
  FIND_ALL_POSITIONS,
  FIND_ALL_SUBDIVISIONS,
  FIND_ONE_MAILBOX,
  REMOVE_ONE_MAILBOX
} from '@/graphql/apollo.gql';
import { dateTimeToStr, dateToStr } from '@/utils/DateMethods';

const toast = useToast();
const router = useRouter();
const confirm = useConfirm();

const { resolveClient } = useApolloClient();
const client = resolveClient();

const { load, result, refetch, loading } = useLazyQuery(FIND_ALL_MAILBOXES, null, {
  fetchPolicy: 'cache-and-network',
  notifyOnNetworkStatusChange: true,
  keepPreviousResult: true
});

const { mutate: deleteMailbox } = useMutation(REMOVE_ONE_MAILBOX);

const { load: loadOraganizations } = useLazyQuery(FIND_ALL_ORGANIZATIONS);
const { load: loadSubdivisions } = useLazyQuery(FIND_ALL_SUBDIVISIONS);
const { load: loadDepartments } = useLazyQuery(FIND_ALL_DEPARTMENTS);
const { load: loadPositions } = useLazyQuery(FIND_ALL_POSITIONS);

const docs = computed(() => result.value?.mailboxes?.docs || []);
const limit = computed(() => result.value?.mailboxes?.limit || 10);
const offset = computed(() => result.value?.mailboxes?.offset || 0);
const totalDocs = computed(() => result.value?.mailboxes?.totalDocs || 0);

const refMenu = ref();
const qrcode = ref(false);

const doc = ref(null);

const filter = ref({
  field: 'email',
  matchMode: FilterMatchMode.STARTS_WITH,
  placeholder: 'Пошук за логіном'
});

const columns = ref([
  {
    header: { text: 'Логін', width: '16rem' },
    column: {
      field: 'email',
      render(value) {
        return (
          <Tag
            class={[
              'px-4',
              'cursor-pointer',
              'text-base! font-bold',
              'text-primary-600!',
              'bg-surface-500/5!'
            ]}
            value={value}
          />
        );
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
    },
    frozen: true
  },

  {
    header: { text: 'Номер листа', width: '20rem' },
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
    frozen: true
  },

  {
    header: { text: 'Дата оновлення', width: '16rem' },
    column: {
      field: 'updatedAt',
      render(value) {
        return <span class="mr-3">{dateTimeToStr(value)}</span>;
      }
    },
    sorter: { field: 'updatedAt' },
    filter: {
      field: 'updatedAt',
      matchMode: FilterMatchMode.DATE_IS
    },
    selectable: false
  },

  {
    header: { text: 'Статус', width: '10rem' },
    column: {
      field: 'status',
      render(value) {
        switch (value) {
          case 'OPENED':
            return <AppIcon path={mdiEmailCheckOutline} size={14} class="text-green-500" />;

          case 'BLOCKED':
            return <AppIcon path={mdiEmailAlertOutline} size={14} class="text-red-500" />;

          case 'CLOSED':
            return <AppIcon path={mdiEmailRemoveOutline} size={14} class="text-gray-500" />;

          default:
            return <span>-</span>;
        }
      }
    },
    sorter: { field: 'status' },
    filter: {
      field: 'status',
      matchMode: FilterMatchMode.EQUALS,
      options: {
        key: 'key',
        value: 'key',
        label: 'name',
        onRecords: () => {
          return [
            {
              key: 'OPENED',
              name: 'Активна'
            },
            {
              key: 'BLOCKED',
              name: 'Заблокована'
            },
            {
              key: 'CLOSED',
              name: 'Закрита'
            }
          ];
        }
      }
    },
    frozen: true
  },

  {
    header: { text: "Прізвище та ім'я", width: '18rem' },
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
    Логін :	${doc.value?.email || '-'}
    Прізвище та ім'я :	${doc.value?.fullname || '-'}
    Посада :	${doc.value?.position?.name || '-'}
    Номер телефону :	${doc.value?.phone || '-'}
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
  router.push({ name: 'mailbox-detail', params: { id } });
};

const handleCreate = () => {
  router.push({ name: 'mailbox-new' });
};

const handleUpdate = async ({ id }) => {
  router.push({ name: 'mailbox-edit', params: { id } });
};

const handleDelete = ({ id, email }) => {
  confirm.require({
    message: `Ви бажаєте видалити поштову скриньку ${email} ?`,
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
      await deleteMailbox({ id });
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
      query: FIND_ONE_MAILBOX,
      variables: { id },
      fetchPolicy: 'no-cache'
    });

    doc.value = data.mailbox;
  } catch {
    doc.value = null;
  }
};
</script>

<template>
  <div class="flex h-full w-full overflow-hidden">
    <OptionsMenu
      ref="refMenu"
      field="email"
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

      <template #header-actions>
        <BtnDBTables />
      </template>

      <template #sidebar-icon>
        <AppIcon :path="$route.meta.icon" :size="40" />
      </template>

      <template #sidebar-title> Логін : {{ doc?.email }} </template>

      <template #sidebar-subtitle>
        Дата відкриття : {{ dateToStr(doc?.dateOpen) || '-' }}
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

        <MailboxPartial :data="doc" />
      </template>
    </CRUDDataTable>
  </div>
</template>
