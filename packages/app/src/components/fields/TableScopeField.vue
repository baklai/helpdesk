<script setup>
import { useFormContext } from 'vee-validate';

defineOptions({
  inheritAttrs: false
});

const props = defineProps({
  name: { type: String, required: true }
});

const { defineField } = useFormContext();
const [value, attrs] = defineField(props.name);
</script>

<template>
  <SCOPEDataTable v-bind="attrs" v-model="value" :value="value" />
</template>
