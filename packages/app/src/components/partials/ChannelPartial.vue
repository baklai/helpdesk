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
  { label: 'Поч. розташування', value: data?.locationFrom },
  { label: 'Поч. пристрій', value: data?.deviceFrom },
  { label: 'Кін. розташування', value: data?.locationTo },
  { label: 'Кін. пристрій', value: data?.deviceTo },
  { label: 'Рівень', value: data?.level },
  { label: 'Тип', value: data?.channelType },
  { label: 'Швидкість', value: data?.speed },
  { label: 'Статус', value: data?.status },
  { label: 'Оператор', value: data?.operator },
  { label: 'Склад', value: data?.composition },
  { label: 'Дата створення', value: data?.createdAt ? dateToStr(data.createdAt) : null }
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
        <td class="py-0.5" width="50%">{{ row.label }} :</td>
        <td class="py-0.5">{{ row.value || '-' }}</td>
      </tr>
    </tbody>
  </table>

  <slot name="footer" />
</template>
