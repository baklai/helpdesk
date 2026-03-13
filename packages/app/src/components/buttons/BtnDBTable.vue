<script setup>
import { mdiPlusCircleOutline } from '@mdi/js';
import { defineAsyncComponent, ref, shallowRef } from 'vue';

defineProps({
  table: {
    type: [String, Boolean],
    default: false
  }
});

const refModal = shallowRef(null);

const datatables = ref({
  device: {
    label: 'Пристрій',
    command: () => {
      refModal.value = defineAsyncComponent(() => import('@/components/modals/DeviceModal.vue'));
    }
  },
  location: {
    label: 'Розташування',
    command: () => {
      refModal.value = defineAsyncComponent(() => import('@/components/modals/LocationModal.vue'));
    }
  },
  organization: {
    label: 'Організація',
    command: () => {
      refModal.value = defineAsyncComponent(
        () => import('@/components/modals/OrganizationModal.vue')
      );
    }
  },
  subdivision: {
    label: 'Підрозділ',
    command: () => {
      refModal.value = defineAsyncComponent(
        () => import('@/components/modals/SubdivisionModal.vue')
      );
    }
  },
  department: {
    label: 'Відділ',
    command: () => {
      refModal.value = defineAsyncComponent(
        () => import('@/components/modals/DepartmentModal.vue')
      );
    }
  },
  position: {
    label: 'Посада',
    command: () => {
      refModal.value = defineAsyncComponent(() => import('@/components/modals/PositionModal.vue'));
    }
  }
});
</script>

<template>
  <Button
    v-if="table && datatables[table]"
    v-tooltip.bottom="datatables[table].label"
    severity="secondary"
    @click="datatables[table].command"
  >
    <template #icon>
      <AppIcon :path="mdiPlusCircleOutline" :size="14" />
    </template>
  </Button>

  <component :is="refModal" />
</template>
