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
  dataKey: { type: String, default: 'key' },
  optionValue: { type: String, default: 'key' },
  optionLabel: { type: [Function, String], default: 'label' }
});

const { defineField, errors } = useFormContext();
const [value, attrs] = defineField(props.name);
</script>

<template>
  <BaseField :description="description" :error="errors[name]" :label="label">
    <template #field>
      <div class="flex w-full flex-col gap-y-4">
        <SelectButton
          v-model="value"
          :dataKey="dataKey"
          fluid
          v-bind="attrs"
          :invalid="!!errors[name]"
          :optionLabel="optionLabel"
          :optionValue="optionValue"
          :options="options"
          :placeholder="placeholder"
          size="large"
          variant="filled"
        />

        <p v-for="option in options" :key="option.key">
          <Tag severity="secondary" :value="option.label" /> - {{ option.comment }}
        </p>
      </div>
    </template>

    <template #divider>
      <slot />
    </template>
  </BaseField>
</template>
