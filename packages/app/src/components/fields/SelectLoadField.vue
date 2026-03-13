<script setup>
import { useLazyQuery } from '@vue/apollo-composable';
import { useFormContext } from 'vee-validate';
import { computed } from 'vue';

defineOptions({
  inheritAttrs: false
});

const props = defineProps({
  name: { type: String, required: true },
  label: { type: String, required: true },
  description: { type: String, required: true },
  placeholder: { type: String, required: true },
  gql: { type: Object, required: true },
  dataKey: { type: String, default: 'id' },
  optionLabel: { type: [Function, String], default: 'name' },
  filterPlaceholder: { type: String, default: 'Пошук' }
});

const { defineField, errors } = useFormContext();
const [value, attrs] = defineField(props.name);

const { load, loading, result } = useLazyQuery(props.gql);

const options = computed(() => {
  const records = result.value ? (result.value[Object.keys(result.value).at(-1)] ?? []) : [];

  const selected = value.value;

  return selected && !records.some(r => r[props.dataKey] === selected[props.dataKey])
    ? [selected, ...records]
    : records;
});
</script>

<template>
  <BaseField :description="description" :error="errors[name]" :label="label">
    <template #field>
      <Select
        v-model="value"
        autoFilterFocus
        :dataKey="dataKey"
        filter
        :filterPlaceholder="filterPlaceholder"
        fluid
        :focusOnHover="false"
        v-bind="attrs"
        :invalid="!!errors[name]"
        :loading="loading"
        :optionLabel="optionLabel"
        :options="options"
        overlayClass="max-w-10"
        :placeholder="placeholder"
        resetFilterOnClear
        resetFilterOnHide
        selectOnFocus
        showClear
        size="large"
        variant="filled"
        @before-show="load"
      />

      <BtnDBTable :table="name" />
    </template>

    <template #divider>
      <slot />
    </template>
  </BaseField>
</template>

<style scoped>
:deep(.p-select) {
  overflow: hidden;
  display: flex;
}

:deep(.p-select-label) {
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  display: block;
  width: 0;
  flex: 1 1 auto;
}
</style>
