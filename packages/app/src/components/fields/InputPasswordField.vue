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
      <Password
        v-model="value"
        v-bind="attrs"
        class="w-full"
        fluid
        :invalid="!!errors[name]"
        mediumLabel="Середня складність"
        :placeholder="placeholder"
        promptLabel="Оберіть пароль"
        size="large"
        strongLabel="Складний пароль"
        toggleMask
        variant="filled"
        weakLabel="Занадто простий"
      >
        <template #header>
          <h6>Поточний пароль</h6>
        </template>
        <template #footer>
          <Divider />
          <p class="mt-2">Рекомендації:</p>
          <ul class="mt-0 ml-2 list-disc pl-2 leading-normal">
            <li>Принаймні одна маленька літера</li>
            <li>Принаймні одна велика літера</li>
            <li>Принаймні одна цифра</li>
            <li>Мінімум 8 символів</li>
          </ul>
        </template>
      </Password>
    </template>

    <template #divider>
      <slot />
    </template>
  </BaseField>
</template>
