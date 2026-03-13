<script setup>
import { computed } from 'vue';

import { dateToStr } from '@/utils/DateMethods';

defineOptions({
  inheritAttrs: false
});

const { data } = defineProps({
  data: {
    type: Object,
    default: null
  }
});

const rows = computed(() => [
  { label: 'Номер листа', value: data?.reqnum },
  { label: 'Статус', value: data?.status },
  { label: 'Дата', value: data?.updatedAt ? dateToStr(data.updatedAt) : null },
  { label: 'Коментар', value: data?.comment }
]);
</script>

<template>
  <slot name="header" />

  <table v-if="data" class="dark:text-surface-100 text-surface-700 text-md w-full font-normal">
    <tbody>
      <tr
        v-for="row in rows"
        :key="row.label"
        class="border-surface-200 dark:border-surface-800 border-b"
      >
        <td class="py-1" width="50%">{{ row.label }} :</td>
        <td class="py-1">{{ row.value || '-' }}</td>
      </tr>
    </tbody>
  </table>

  <slot name="footer" />
</template>
