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

const STATUS_LABEL = {
  pending: 'Очікує активації',
  active: 'Активний',
  blocked: 'Заблоковано',
  disabled: 'Вимкнено'
};

const ROLE_LABEL = {
  admin: 'Адміністратор',
  manager: 'Менеджер',
  support: 'Спеціаліст',
  client: 'Клієнт'
};

const rows = computed(() => [
  { label: "Прізвище та ім'я", value: data?.fullname },
  { label: 'Електронна пошта', value: data?.email },
  { label: 'Номер телефону', value: data?.phone },
  { label: 'Статус', value: STATUS_LABEL[data?.status] ?? data?.status ?? '-' },
  { label: 'Роль', value: ROLE_LABEL[data?.role] ?? data?.role ?? '-' },
  {
    label: 'Кількість дозволів',
    value: data?.scope?.length != null ? `${data.scope.length}` : '-'
  },
  { label: 'Дата реєстрації', value: data?.createdAt ? dateTimeToStr(data.createdAt) : '-' },
  { label: 'Останнє оновлення', value: data?.updatedAt ? dateTimeToStr(data.updatedAt) : '-' }
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
