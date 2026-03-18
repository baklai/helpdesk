<script setup>
import { useFormContext } from 'vee-validate';

defineOptions({
  inheritAttrs: false
});

const props = defineProps({
  name: { type: String, required: true },
  label: { type: String, required: true },
  description: { type: String, required: true },
  placeholder: { type: String, required: true },
  options: { type: Array, default: () => [] },
  dataKey: { type: String, default: 'id' },
  optionLabel: { type: [Function, String], default: 'name' },
  optionValue: { type: [Function, String], default: 'id' },
  filterPlaceholder: { type: String, default: 'Пошук' }
});

const emit = defineEmits(['change']);

const { defineField, errors } = useFormContext();
const [value, attrs] = defineField(props.name);
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
        :optionLabel="optionLabel"
        :optionValue="optionValue"
        :options="options"
        overlayClass="max-w-10"
        :placeholder="placeholder"
        resetFilterOnClear
        resetFilterOnHide
        selectOnFocus
        showClear
        size="large"
        variant="filled"
        @value-change="emit('change')"
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
