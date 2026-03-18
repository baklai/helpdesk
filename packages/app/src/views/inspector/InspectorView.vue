<script setup lang="jsx">
import { FilterMatchMode, FilterOperator } from '@primevue/core/api';
import { useApolloClient, useLazyQuery, useMutation } from '@vue/apollo-composable';
import { useConfirm } from 'primevue/useconfirm';
import { useToast } from 'primevue/usetoast';
import QRCode from 'qrcode';
import { computed, ref } from 'vue';

import {
  FIND_ALL_INSPECTORS,
  FIND_ONE_INSPECTOR,
  REMOVE_ONE_INSPECTOR
} from '@/graphql/apollo.gql';
import { dateTimeToStr } from '@/utils/DateMethods';
import { byteToStr } from '@/utils/UtilityMethods';

const toast = useToast();
const confirm = useConfirm();

const { resolveClient } = useApolloClient();
const client = resolveClient();

const { load, result, refetch, loading } = useLazyQuery(FIND_ALL_INSPECTORS, null, {
  fetchPolicy: 'cache-and-network',
  notifyOnNetworkStatusChange: true,
  keepPreviousResult: true
});

const { mutate: deleteInspector } = useMutation(REMOVE_ONE_INSPECTOR);

const docs = computed(() => result.value?.inspectors?.docs || []);
const limit = computed(() => result.value?.inspectors?.limit || 10);
const offset = computed(() => result.value?.inspectors?.offset || 0);
const totalDocs = computed(() => result.value?.inspectors?.totalDocs || 0);

const refMenu = ref();
const refModal = ref();
const qrcode = ref(false);

const doc = ref(null);

const filter = ref({
  field: 'ipaddress',
  matchMode: FilterMatchMode.STARTS_WITH,
  placeholder: 'Пошук за IP-адресою'
});

const columns = ref([
  {
    header: { text: "Ім'я комп'ютера", width: '16rem' },
    column: {
      field: 'system.csname',
      render(value) {
        return (
          <div class="cursor-pointer font-medium">
            <i class="pi pi-desktop mr-2"></i>
            <span>{value}</span>
          </div>
        );
      },
      action(value) {
        handleSelected(value);
      }
    },
    sorter: { field: 'system.csname' },
    filter: {
      field: 'os.CSName',
      matchMode: FilterMatchMode.CONTAINS,
      filterOperator: FilterOperator.AND,
      showFilterMatchModes: true
    },
    frozen: true
  },

  {
    header: { text: 'Материнська плата', width: '16rem' },
    column: { field: 'baseboard' },
    sorter: { field: 'baseboard.SerialNumber' },
    filter: {
      field: 'baseboard.SerialNumber',
      matchMode: FilterMatchMode.CONTAINS,
      filterOperator: FilterOperator.AND,
      showFilterMatchModes: true
    },
    selectable: false,
    frozen: true
  },

  {
    header: { text: 'IP-адреса', width: '15rem' },
    column: {
      field: 'ipaddress',
      render(value) {
        return <span class="text-primary-500 cursor-pointer font-bold">{value}</span>;
      },
      action(value) {
        refModal.value.toggle(value);
      }
    },
    sorter: { field: 'ipaddress' },
    filter: {
      field: 'ipaddress',
      matchMode: FilterMatchMode.CONTAINS,
      filterOperator: FilterOperator.AND,
      showFilterMatchModes: true
    },
    frozen: true
  },

  {
    header: { text: 'IP Статус', width: '10rem' },
    column: {
      field: 'isIpaddress',
      render(value) {
        return (
          <span class="text-primary-500 cursor-pointer pl-6 font-bold">
            {value ? (
              <i class="pi pi-verified text-green-500"></i>
            ) : (
              <i class="pi pi-exclamation-triangle text-red-500"></i>
            )}
          </span>
        );
      }
    },
    filter: {
      field: 'isIpaddress',
      matchMode: FilterMatchMode.CONTAINS,
      filterOperator: FilterOperator.AND,
      showFilterMatchModes: true
    }
  },

  {
    header: { text: 'Користувачі', width: '13rem' },
    column: {
      field: 'countUseraccount',
      render(value) {
        return (
          <Tag
            class="bg-surface-500/20! h-8 w-12 text-base! font-semibold! text-black! dark:text-white!"
            value={value || '-'}
          />
        );
      }
    },
    filter: {
      field: 'useraccount.Name',
      matchMode: FilterMatchMode.CONTAINS,
      filterOperator: FilterOperator.AND,
      showFilterMatchModes: true
    }
  },

  {
    header: { text: 'Застосунки', width: '13rem' },
    column: {
      field: 'countProduct',
      render(value) {
        return (
          <Tag
            class="bg-surface-500/20! h-8 w-12 text-base! font-semibold! text-black! dark:text-white!"
            value={value || '-'}
          />
        );
      }
    },
    filter: {
      field: 'product.Name',
      matchMode: FilterMatchMode.CONTAINS,
      filterOperator: FilterOperator.AND,
      showFilterMatchModes: true
    }
  },

  {
    header: { text: 'SMB-ресурс', width: '13rem' },
    column: {
      field: 'countShare',
      render(value) {
        return (
          <Tag
            class="bg-surface-500/20! h-8 w-12 text-base! font-semibold! text-black! dark:text-white!"
            value={value || '-'}
          />
        );
      }
    },
    filter: {
      field: 'share.Name',
      matchMode: FilterMatchMode.CONTAINS,
      filterOperator: FilterOperator.AND,
      showFilterMatchModes: true
    }
  },

  {
    header: { text: 'Оновлення', width: '13rem' },
    column: {
      field: 'fixupdate',
      render(value) {
        return (
          <Tag
            class={[
              'h-8 w-12 text-base! font-semibold! text-black! dark:text-white!',
              'bg-surface-500/20!'
            ]}
            value={value || '-'}
          />
        );
      }
    },
    filter: {
      field: 'fixupdate.HotFixID',
      matchMode: FilterMatchMode.CONTAINS,
      filterOperator: FilterOperator.AND,
      showFilterMatchModes: true
    },
    selectable: false
  },

  {
    header: { text: 'Дата звіту', width: '15rem' },
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
    },
    selectable: true
  },

  {
    header: { text: 'Операційна система', width: '20rem' },
    column: { field: 'system.osname' },
    sorter: { field: 'system.osname' },
    filter: {
      field: 'os.Caption',
      matchMode: FilterMatchMode.CONTAINS,
      filterOperator: FilterOperator.AND,
      showFilterMatchModes: true
    }
  },

  {
    header: { text: 'ОС Платформа', width: '15rem' },
    column: {
      field: 'system.platform',
      render(value) {
        return <span>{value ? value : '32-bit'}</span>;
      }
    },
    sorter: { field: 'system.platform' },
    filter: {
      field: 'os.OSArchitecture',
      matchMode: FilterMatchMode.CONTAINS,
      filterOperator: FilterOperator.AND,
      showFilterMatchModes: true
    }
  },

  {
    header: { text: 'ОС Версія', width: '12rem' },
    column: { field: 'system.version' },
    sorter: { field: 'system.version' },
    filter: {
      field: 'os.Version',
      matchMode: FilterMatchMode.CONTAINS,
      filterOperator: FilterOperator.AND,
      showFilterMatchModes: true
    }
  },

  {
    header: { text: 'CPU', width: '25rem' },
    column: { field: 'cpuName' },
    sorter: { field: 'cpuName' },
    filter: {
      field: 'cpu.Name',
      matchMode: FilterMatchMode.CONTAINS,
      filterOperator: FilterOperator.AND,
      showFilterMatchModes: true
    }
  },

  {
    header: { text: 'RAM', width: '15rem' },
    column: {
      field: 'ramSize',
      render(value) {
        return <span>{byteToStr(value)}</span>;
      }
    },
    sorter: { field: 'ramSize' },
    filter: {
      field: 'ram',
      matchMode: FilterMatchMode.CONTAINS,
      filterOperator: FilterOperator.AND,
      showFilterMatchModes: true
    }
  },

  {
    header: { text: 'HDD', width: '12rem' },
    column: {
      field: 'hddSize',
      render(value) {
        return <span>{byteToStr(value)}</span>;
      }
    },
    sorter: { field: 'hddSize' },
    filter: {
      field: 'hdd',
      matchMode: FilterMatchMode.CONTAINS,
      filterOperator: FilterOperator.AND,
      showFilterMatchModes: true
    }
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
  `;

  qrcode.value = await QRCode.toDataURL(qrCodeText);
};

const handleFetch = params => {
  try {
    const variables = {
      limit: params.limit,
      offset: params.offset,
      filters: params.filters || {},
      sort: params.sort || {}
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

const handleDetail = data => {
  refModal.value.toggle(data);
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
      await deleteInspector({ id });
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
      query: FIND_ONE_INSPECTOR,
      variables: { id },
      fetchPolicy: 'no-cache'
    });

    doc.value = data.inspector;
  } catch {
    doc.value = null;
  }
};
</script>

<template>
  <div class="flex h-full w-full overflow-hidden">
    <OptionsMenu ref="refMenu" field="ipaddress" @delete="handleDelete" @detail="handleDetail" />

    <SysInspectorModal ref="refModal" @close="doc = null" />

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
        <AppIcon :path="$route.meta.icon" :size="40" />
      </template>

      <template #sidebar-title> {{ doc?.os ? doc?.os?.CSName : doc?.host }} </template>

      <template #sidebar-subtitle>
        Дата звіту: {{ dateTimeToStr(doc?.updatedAt) || '-' }}
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

        <SysInspectorPartial :data="doc" />
      </template>
    </CRUDDataTable>
  </div>
</template>
