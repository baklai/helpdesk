<script setup>
import { useClipboard } from '@vueuse/core';
import { useToast } from 'primevue/usetoast';
import { computed, getCurrentInstance, ref } from 'vue';

import { useHostTools } from '@/composables/useHostTools';
import { isIP } from '@/utils/UtilityMethods';

const props = defineProps({
  items: { type: Array, default: () => [] },
  field: { type: [String, Boolean], default: false }
});

const emits = defineEmits({
  detail: ({ id }) => !!id,
  create: null,
  update: ({ id }) => !!id,
  delete: ({ id }) => !!id
});

defineExpose({
  toggle: (event, _data) => {
    data.value = _data || {};
    refMenu.value.toggle(event);
  }
});

const toast = useToast();
const { vnode } = getCurrentInstance();
const { copy } = useClipboard();

const { getPINGLink, getRDPLink, getVNCLink } = useHostTools();

const data = ref({});
const refMenu = ref();

const isEmitDetail = computed(() => !!vnode?.props?.onDetail);
const isEmitCreate = computed(() => !!vnode?.props?.onCreate);
const isEmitUpdate = computed(() => !!vnode?.props?.onUpdate);
const isEmitDelete = computed(() => !!vnode?.props?.onDelete);

const fieldValue = computed(() => (props.field && data.value ? data.value[props.field] : null));

const options = computed(() => {
  const items = [];

  if (isEmitDetail.value) {
    items.push({
      label: 'Відкрити запис',
      icon: 'pi pi-eye',
      command: () => emits('detail', data.value)
    });
  }

  if (isEmitCreate.value) {
    items.push({
      label: 'Створити запис',
      icon: 'pi pi-plus-circle',
      command: () => emits('create', {})
    });
  }

  if (isEmitUpdate.value) {
    items.push({
      label: 'Редагувати запис',
      icon: 'pi pi-file-edit',
      command: () => emits('update', data.value)
    });
  }

  if (isEmitDelete.value) {
    items.push({
      label: 'Видалити запис',
      icon: 'pi pi-trash',
      command: () => emits('delete', data.value)
    });
  }

  if (props.items && props.items?.length > 0) {
    items.push({ separator: true }, ...props.items);
  }

  if (props.field && fieldValue.value) {
    items.push(
      { separator: true },
      {
        label: 'Копіювати значення',
        icon: 'pi pi-copy',
        command: () => copyToClipboard(fieldValue.value)
      }
    );
  }

  if (fieldValue.value && isIP(fieldValue.value)) {
    items.push(
      { separator: true },
      {
        label: 'Перевірити через Ping',
        icon: 'pi pi-link',
        command: () => getPINGLink(fieldValue.value)
      },
      {
        label: 'Підключити через RDP',
        icon: 'pi pi-link',
        command: () => getRDPLink(fieldValue.value)
      },
      {
        label: 'Підключити через VNC',
        icon: 'pi pi-link',
        command: () => getVNCLink(fieldValue.value)
      }
    );
  }

  return items;
});

const copyToClipboard = async value => {
  try {
    await copy(value);
    toast.add({
      severity: 'success',
      summary: 'Інформація',
      detail: `Значення ${value} скопійовано в буфер обміну`,
      life: 3000
    });
  } catch {
    toast.add({
      severity: 'warn',
      summary: 'Попередження',
      detail: `Значення ${value} не скопійовано в буфер обміну`,
      life: 3000
    });
  }
};
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
    <template #end v-if="field && fieldValue">
      <div class="bg-surface-300 dark:bg-surface-950 flex justify-center rounded-b-lg py-2">
        <span class="font-bold"> {{ fieldValue }} </span>
      </div>
    </template>
  </Menu>
</template>
