<script setup>
import { useFormContext } from 'vee-validate';
import { ref } from 'vue';

defineOptions({
  inheritAttrs: false
});

const props = defineProps({
  name: { type: String, required: true }
});

const { defineField } = useFormContext();
const [value, attrs] = defineField(props.name);

const columns = ref([
  { field: 'create', header: 'Створити' },
  { field: 'read', header: 'Читати' },
  { field: 'update', header: 'Оновити' },
  { field: 'delete', header: 'Видалити' },
  { field: 'notice', header: 'Повідомлення' }
]);
</script>

<template>
  <DataTable
    v-bind="attrs"
    v-model="value"
    class="min-w-full overflow-x-auto"
    responsiveLayout="scroll"
    rowHover
    scrollable
    scrollHeight="flex"
    :value="value"
  >
    <template #empty>
      <div class="text-center">
        <h5>Записів не знайдено</h5>
      </div>
    </template>

    <Column class="font-bold" field="scope" filterField="scope" frozen header="">
      <template #body="{ data }">
        {{ data.comment }}
      </template>
    </Column>

    <Column
      v-for="col of columns"
      :key="col.field"
      class="text-center"
      :field="col.field"
      :header="col.header"
      headerClass="text-center"
    >
      <template #body="{ data, field }">
        <Checkbox v-if="data[field] !== undefined" v-model="data[field]" :binary="true" />
        <span v-else class="text-surface-500">-</span>
      </template>
    </Column>
  </DataTable>
</template>
