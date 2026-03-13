<script setup>
import { useFormContext } from 'vee-validate';

import { CIDR } from '@/constants/cidr.const';

defineOptions({
  inheritAttrs: false
});

const props = defineProps({
  name: { type: String, default: 'cidr' },
  label: { type: String, default: 'Маска IP-адреси' },
  description: { type: String, default: 'Мережева маска відповідно до структури підмережі' },
  placeholder: { type: String, default: 'Оберіть мережеву маску' },
  dataKey: { type: String, default: 'value' },
  optionLabel: { type: String, default: 'name' },
  filterPlaceholder: { type: String, default: 'Пошук' }
});

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
        v-bind="attrs"
        :invalid="!!errors[name]"
        :optionLabel="obj => `${obj.mask}/${obj.value}`"
        :options="CIDR"
        overlayClass="max-w-10"
        :placeholder="placeholder"
        resetFilterOnClear
        resetFilterOnHide
        selectOnFocus
        showClear
        size="large"
        variant="filled"
      />
    </template>

    <template #divider>
      <slot />
    </template>
  </BaseField>
</template>
