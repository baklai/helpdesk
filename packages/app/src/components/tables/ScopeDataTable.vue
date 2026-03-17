<script setup>
import { useScopeStore } from '@/stores/scopes.store';

defineProps({
  readonly: { type: Boolean, default: false }
});

const { ACTION_DEFINITIONS } = useScopeStore();
</script>

<template>
  <DataTable
    class="min-w-full overflow-x-auto"
    responsiveLayout="scroll"
    rowHover
    scrollable
    scrollHeight="flex"
  >
    <template #empty>
      <div class="text-center">
        <h5>Записів не знайдено</h5>
      </div>
    </template>

    <Column class="font-bold" field="scope" frozen header="">
      <template #body="{ data }">
        {{ data.comment }}
      </template>
    </Column>

    <Column v-for="col of ACTION_DEFINITIONS" :key="col.key" class="text-center!" :field="col.key">
      <template #header>
        <p class="w-full text-center">{{ col.comment }}</p>
      </template>
      <template #body="{ data, field }">
        <Checkbox
          v-model="data[field]"
          :binary="true"
          :indeterminate="!data[field]"
          :readonly="readonly"
        />
      </template>
    </Column>
  </DataTable>
</template>
