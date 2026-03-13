<script setup>
import { computed } from 'vue';

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
  { label: 'Логін', value: data?.email },
  { label: 'Номер листа', value: data?.reqnum },
  { label: "Прізвище та ім'я", value: data?.fullname },
  { label: 'Номер телефону', value: data?.phone },
  { label: 'Статус', value: data?.status },
  { label: 'Організація', value: data?.organization?.name },
  { label: 'Підрозділ', value: data?.subdivision?.name },
  { label: 'Відділ', value: data?.department?.name },
  { label: 'Посада', value: data?.position?.name },
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
        <td class="py-1">{{ row.value ?? '-' }}</td>
      </tr>
    </tbody>
  </table>

  <slot name="footer" />
</template>
