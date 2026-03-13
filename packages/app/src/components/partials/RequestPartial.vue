<script setup>
import { computed } from 'vue';

import { dateTimeToStr } from '@/utils/DateMethods';

defineOptions({
  inheritAttrs: false
});

const { data } = defineProps({
  data: {
    type: Object,
    default: null
  }
});

// API повертає lowercase значення enum ('opened', 'pending', ...)
const STATUS_LABEL = {
  opened: 'Відкрита',
  pending: 'Очікує',
  processing: 'В роботі',
  resolved: 'Вирішено',
  closed: 'Закрита',
  rejected: 'Відхилена',
  cancelled: 'Скасована'
};

const isClosed = computed(() =>
  ['resolved', 'closed', 'rejected', 'cancelled'].includes(data?.status)
);

const rows = computed(() => [
  { label: 'Відкрив запит', value: data?.opened?.fullname || '-' },
  { label: 'Дата відкриття', value: data?.createdAt ? dateTimeToStr(data?.createdAt) : '-' },
  { label: 'Статус', value: STATUS_LABEL[data?.status] ?? data?.status ?? '-' },
  { label: 'Запит', value: data?.request || '-' },
  { label: 'Розташування', value: data?.location?.name || '-' },
  { label: "Повне ім'я", value: data?.fullname || '-' },
  { label: 'Телефон', value: data?.phone || '-' },
  { label: 'Посада', value: data?.position?.name || '-' },
  { label: 'Номер листа', value: data?.reqnum || '-' },
  { label: 'Організація', value: data?.organization?.name || '-' },
  { label: 'Підрозділ', value: data?.subdivision?.name || '-' },
  { label: 'Відділ', value: data?.department?.name || '-' },
  { label: 'Дата закриття', value: isClosed.value ? dateTimeToStr(data?.updatedAt) : '-' },
  { label: 'Закрив запит', value: data?.closed?.fullname || '-' },
  { label: 'Висновок до запиту', value: data?.conclusion || '-' },
  { label: 'Коментар', value: data?.comment || '-' }
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
