<script setup>
import { useFormContext } from 'vee-validate';

defineOptions({
  inheritAttrs: false
});

const props = defineProps({
  name: { type: String, default: 'ipaddress' },
  label: { type: String, default: 'IP-адреса' },
  description: {
    type: String,
    default: 'Унікальна IP-адреса адресу для пристрою'
  },
  placeholder: { type: String, default: 'Вкажіть IP-адресу' },
  dataKey: { type: String, default: 'id' },
  optionLabel: { type: String, default: 'name' },
  filterPlaceholder: { type: String, default: 'Пошук' }
});

const { defineField, errors } = useFormContext();
const [value, attrs] = defineField(props.name);
</script>

<template>
  <BaseField :description="description" :error="errors[name]" :label="label">
    <template #field>
      <InputText
        v-model="value"
        fluid
        v-bind="attrs"
        :invalid="!!errors[name]"
        :placeholder="placeholder"
        size="large"
        variant="filled"
      />

      <Button v-tooltip.bottom="'Перевірити IP-адресу'" icon="pi pi-search" severity="secondary" />
    </template>

    <template #divider>
      <slot />
    </template>
  </BaseField>
</template>
