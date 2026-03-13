<script setup>
import { mdiTable } from '@mdi/js';
import { computed, defineAsyncComponent, ref, shallowRef } from 'vue';

const refMenu = ref();
const refModal = shallowRef(null);

const options = computed(() => [
  {
    label: 'Системні пристрої',
    items: [
      {
        label: 'Пристрій',
        icon: 'pi pi-desktop',
        command: () => {
          refModal.value = defineAsyncComponent(
            () => import('@/components/modals/DeviceModal.vue')
          );
        }
      }
    ]
  },
  {
    label: 'Системні локації',
    items: [
      {
        label: 'Розташування',
        icon: 'pi pi-map-marker',
        command: () => {
          refModal.value = defineAsyncComponent(
            () => import('@/components/modals/LocationModal.vue')
          );
        }
      }
    ]
  },
  {
    label: 'Системні організації',
    items: [
      {
        label: 'Організація',
        icon: 'pi pi-building',
        command: () => {
          refModal.value = defineAsyncComponent(
            () => import('@/components/modals/OrganizationModal.vue')
          );
        }
      },
      {
        label: 'Підрозділ',
        icon: 'pi pi-building',
        command: () => {
          refModal.value = defineAsyncComponent(
            () => import('@/components/modals/SubdivisionModal.vue')
          );
        }
      },
      {
        label: 'Відділ',
        icon: 'pi pi-building',
        command: () => {
          refModal.value = defineAsyncComponent(
            () => import('@/components/modals/DepartmentModal.vue')
          );
        }
      }
    ]
  },
  {
    label: 'Системні посади',
    items: [
      {
        label: 'Посада',
        icon: 'pi pi-briefcase',
        command: () => {
          refModal.value = defineAsyncComponent(
            () => import('@/components/modals/PositionModal.vue')
          );
        }
      }
    ]
  }
]);
</script>

<template>
  <Menu ref="refMenu" :model="options" popup>
    <template #submenulabel="{ item }">
      <span class="text-surface-500">{{ item.label }}</span>
    </template>
    <template #item="{ item, props: itemProps }">
      <a class="flex items-center" v-bind="itemProps.action">
        <span :class="item.icon" />
        <span>{{ item.label }}</span>
      </a>
    </template>
  </Menu>

  <Button
    v-tooltip.bottom="'Системні таблиці'"
    rounded
    severity="secondary"
    variant="text"
    @click="event => refMenu.toggle(event)"
  >
    <template #icon>
      <AppIcon :path="mdiTable" :size="24" />
    </template>
  </Button>

  <component :is="refModal" />
</template>
