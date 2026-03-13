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
  format: { type: String, default: 'dd.mm.yy' }
});

const { defineField, errors } = useFormContext();
const [value, attrs] = defineField(props.name);
</script>

<template>
  <BaseField :description="description" :error="errors[name]" :label="label">
    <template #field>
      <DatePicker
        v-model="value"
        v-bind="attrs"
        class="w-full"
        :dateFormat="format"
        fluid
        iconDisplay="input"
        :invalid="!!errors[name]"
        :placeholder="placeholder"
        showButtonBar
        showIcon
        size="large"
        variant="filled"
      />
    </template>

    <template #divider>
      <slot />
    </template>
  </BaseField>
</template>
