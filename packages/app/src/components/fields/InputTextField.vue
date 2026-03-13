<script setup>
import { useFormContext } from 'vee-validate';

defineOptions({
  inheritAttrs: false
});

const props = defineProps({
  name: { type: String, required: true },
  label: { type: String, required: true },
  description: { type: String, required: true },
  placeholder: { type: String, required: true }
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
    </template>

    <template #divider>
      <slot />
    </template>
  </BaseField>
</template>
