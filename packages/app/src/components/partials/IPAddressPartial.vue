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
  { label: 'Пристрій', value: data?.device?.name },
  { label: 'IP-адресa', value: data?.ipaddress },
  { label: 'Маска', value: data?.mask },
  { label: 'Шлюз', value: data?.gateway },
  { label: 'Дата відкриття', value: data?.createdAt ? dateToStr(data.createdAt) : null },
  { label: 'Інвентарний номер', value: data?.inventory },
  { label: 'Розташування', value: data?.location?.name },
  { label: 'Номер листа', value: data?.reqnum },
  { label: 'Організація', value: data?.organization?.name },
  { label: 'Підрозділ', value: data?.subdivision?.name },
  { label: 'Відділ', value: data?.department?.name },
  { label: "Прізвище та ім'я", value: data?.fullname },
  { label: 'Посада', value: data?.position?.name },
  { label: 'Номер телефону', value: data?.phone },
  { label: 'Електронна пошта', value: data?.email },
  { label: 'Автовідповідь', value: data?.autoanswer },
  { label: 'Коментар', value: data?.comment },
  { label: 'Інтернет', value: data?.internet?.status }
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
