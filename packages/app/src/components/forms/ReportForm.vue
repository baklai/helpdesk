<script setup>
import { useForm } from 'vee-validate';
import { computed, ref, watch } from 'vue';
import * as yup from 'yup';

const props = defineProps({
  initialValues: { type: Object, default: () => ({}) },
  collections: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false }
});

const emit = defineEmits(['submit', 'cancel']);

const { errors, handleSubmit, controlledValues, defineField, setFieldValue } = useForm({
  validationSchema: yup.object({
    name: yup.string().required('Потрібно вказати назву звіту'),
    description: yup.string().nullable(),
    datacollection: yup.string().required('Потрібно обрати колекцію')
  }),
  initialValues: props.initialValues
});

const [name, nameAttrs] = defineField('name');
const [description, descriptionAttrs] = defineField('description');
const [datacollection, datacollectionAttrs] = defineField('datacollection');

// fields: { dbField: label } — редагується через таблицю нижче
const fieldRows = ref([]);

// Ініціалізація полів з initialValues
if (props.initialValues?.fields && typeof props.initialValues.fields === 'object') {
  fieldRows.value = Object.entries(props.initialValues.fields).map(([dbField, label]) => ({
    dbField,
    label
  }));
}

// Обрана колекція
const selectedCollection = computed(() =>
  props.collections.find(c => c.name === datacollection.value)
);

// При зміні колекції — скидаємо поля
watch(datacollection, () => {
  fieldRows.value = [];
});

const addField = () => {
  fieldRows.value.push({ dbField: '', label: '' });
};

const removeField = index => {
  fieldRows.value.splice(index, 1);
};

const addFromCollection = field => {
  if (!fieldRows.value.find(r => r.dbField === field)) {
    fieldRows.value.push({ dbField: field, label: field });
  }
};

// sorts: { field: 1 | -1 }
const sortRows = ref([]);

if (props.initialValues?.sorts && typeof props.initialValues.sorts === 'object') {
  sortRows.value = Object.entries(props.initialValues.sorts).map(([field, order]) => ({
    field,
    order
  }));
}

const addSort = () => {
  sortRows.value.push({ field: '', order: 1 });
};

const removeSort = index => {
  sortRows.value.splice(index, 1);
};

const sortOrderOptions = [
  { label: 'За зростанням (ASC)', value: 1 },
  { label: 'За спаданням (DESC)', value: -1 }
];

const handleSave = handleSubmit(() => {
  const fields = {};
  for (const { dbField, label } of fieldRows.value) {
    if (dbField.trim()) fields[dbField.trim()] = label.trim() || dbField.trim();
  }

  const sorts = {};
  for (const { field, order } of sortRows.value) {
    if (field.trim()) sorts[field.trim()] = order;
  }

  emit('submit', {
    ...controlledValues.value,
    fields,
    sorts,
    filters: props.initialValues?.filters ?? {}
  });
});
</script>

<template>
  <div class="flex flex-1 flex-col gap-6 overflow-y-auto p-4">
    <!-- Основна інформація -->
    <div class="border-surface-200 dark:border-surface-700 rounded-xl border p-6">
      <div class="mb-4 flex items-center gap-2">
        <i class="pi pi-info-circle text-primary-500" />
        <span class="text-lg font-medium uppercase">Основна інформація</span>
      </div>

      <div class="flex flex-col gap-4 lg:flex-row">
        <div class="flex flex-1 flex-col gap-y-2">
          <label class="text-sm font-medium uppercase">Назва звіту</label>
          <InputText
            v-model="name"
            v-bind="nameAttrs"
            :invalid="!!errors.name"
            placeholder="Введіть назву звіту"
            size="large"
          />
          <Message v-if="errors.name" severity="error" size="small" variant="simple">
            {{ errors.name }}
          </Message>
        </div>

        <div class="flex flex-1 flex-col gap-y-2">
          <label class="text-sm font-medium uppercase">Опис</label>
          <InputText
            v-model="description"
            v-bind="descriptionAttrs"
            placeholder="Короткий опис звіту"
            size="large"
          />
        </div>
      </div>
    </div>

    <!-- Колекція -->
    <div class="border-surface-200 dark:border-surface-700 rounded-xl border p-6">
      <div class="mb-4 flex items-center gap-2">
        <i class="pi pi-database text-primary-500" />
        <span class="text-lg font-medium uppercase">Джерело даних</span>
      </div>

      <div class="flex flex-col gap-y-2">
        <label class="text-sm font-medium uppercase">Колекція</label>
        <Select
          v-model="datacollection"
          v-bind="datacollectionAttrs"
          :invalid="!!errors.datacollection"
          optionLabel="label"
          :options="collections"
          optionValue="name"
          placeholder="Оберіть колекцію даних"
          size="large"
        >
          <template #option="{ option }">
            <div class="flex flex-col py-1">
              <p class="font-medium">{{ option.label }}</p>
              <p class="text-muted-color text-xs">{{ option.name }}</p>
            </div>
          </template>
        </Select>
        <Message v-if="errors.datacollection" severity="error" size="small" variant="simple">
          {{ errors.datacollection }}
        </Message>
      </div>

      <!-- Доступні поля колекції -->
      <div v-if="selectedCollection?.fields?.length" class="mt-4">
        <p class="text-muted-color mb-2 text-xs uppercase">Доступні поля — натисніть щоб додати:</p>
        <div class="flex flex-wrap gap-2">
          <Tag
            v-for="field in selectedCollection.fields"
            :key="field"
            class="cursor-pointer transition-opacity hover:opacity-70"
            severity="secondary"
            :value="field"
            @click="addFromCollection(field)"
          />
        </div>
      </div>
    </div>

    <!-- Поля звіту -->
    <div class="border-surface-200 dark:border-surface-700 rounded-xl border p-6">
      <div class="mb-4 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <i class="pi pi-table text-primary-500" />
          <span class="text-lg font-medium uppercase">Поля звіту</span>
        </div>
        <Button
          icon="pi pi-plus"
          label="Додати поле"
          severity="secondary"
          size="small"
          variant="outlined"
          @click="addField"
        />
      </div>

      <div v-if="fieldRows.length" class="flex flex-col gap-2">
        <div
          v-for="(row, index) in fieldRows"
          :key="index"
          class="bg-surface-50 dark:bg-surface-800 flex items-center gap-2 rounded-lg p-2"
        >
          <InputText
            v-model="row.dbField"
            class="flex-1"
            :list="`fields-list-${index}`"
            placeholder="Поле БД (напр. organization.name)"
            size="small"
          />
          <datalist v-if="selectedCollection?.fields" :id="`fields-list-${index}`">
            <option v-for="f in selectedCollection.fields" :key="f" :value="f" />
          </datalist>
          <i class="pi pi-arrow-right text-muted-color" />
          <InputText
            v-model="row.label"
            class="flex-1"
            placeholder="Заголовок колонки"
            size="small"
          />
          <Button
            icon="pi pi-trash"
            rounded
            severity="danger"
            size="small"
            text
            @click="removeField(index)"
          />
        </div>
      </div>
      <p v-else class="text-muted-color text-sm">
        Поля не додано. Оберіть колекцію і натисніть на поля вище або додайте вручну.
      </p>
    </div>

    <!-- Сортування -->
    <div class="border-surface-200 dark:border-surface-700 rounded-xl border p-6">
      <div class="mb-4 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <i class="pi pi-sort-alt text-primary-500" />
          <span class="text-lg font-medium uppercase">Сортування</span>
        </div>
        <Button
          icon="pi pi-plus"
          label="Додати"
          severity="secondary"
          size="small"
          variant="outlined"
          @click="addSort"
        />
      </div>

      <div v-if="sortRows.length" class="flex flex-col gap-2">
        <div
          v-for="(row, index) in sortRows"
          :key="index"
          class="bg-surface-50 dark:bg-surface-800 flex items-center gap-2 rounded-lg p-2"
        >
          <InputText
            v-model="row.field"
            class="flex-1"
            placeholder="Поле сортування"
            size="small"
          />
          <Select
            v-model="row.order"
            class="w-56"
            optionLabel="label"
            :options="sortOrderOptions"
            optionValue="value"
            size="small"
          />
          <Button
            icon="pi pi-trash"
            rounded
            severity="danger"
            size="small"
            text
            @click="removeSort(index)"
          />
        </div>
      </div>
      <p v-else class="text-muted-color text-sm">
        Сортування не визначено — буде використано за датою створення (DESC).
      </p>
    </div>

    <!-- Кнопки -->
    <div class="flex flex-row gap-2 pb-4">
      <Button icon="pi pi-check" label="Зберегти" :loading="loading" raised @click="handleSave" />
      <Button icon="pi pi-times" label="Скасувати" variant="outlined" @click="emit('cancel')" />
    </div>
  </div>
</template>
