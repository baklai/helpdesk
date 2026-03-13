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
  loading: { type: Boolean, default: false }
});

const emit = defineEmits(['save']);

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

      <Button
        v-tooltip.bottom="'Зберегти'"
        icon="pi pi-save"
        :loading="loading"
        :pt="{ root: { class: 'w-12!' }, icon: { class: 'text-xl!' } }"
        severity="secondary"
        @click="emit('save', name)"
      />
    </template>
  </BaseField>
</template>
