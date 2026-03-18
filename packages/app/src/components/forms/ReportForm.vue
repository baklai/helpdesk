<script setup>
import { mdiCableData, mdiFileDocumentMultipleOutline, mdiInformationOutline } from '@mdi/js';
import { useQuery } from '@vue/apollo-composable';
import { useForm } from 'vee-validate';
import { computed, ref } from 'vue';
import * as yup from 'yup';

import { GET_REPORT_COLLECTIONS } from '@/graphql/apollo.gql';

const props = defineProps({
  initialValues: { type: Object, default: () => ({}) },
  loading: { type: Boolean, default: false }
});

const emit = defineEmits(['submit', 'cancel']);

const { result } = useQuery(GET_REPORT_COLLECTIONS);

const fieldRows = ref([]);

const { values, errors, handleSubmit, controlledValues } = useForm({
  validationSchema: yup.object({
    name: yup.string().required('Потрібно вказати назву звіту'),
    description: yup.string().nullable(),
    datacollection: yup.string().required('Потрібно обрати колекцію')
  }),
  initialValues: props.initialValues
});

const panelIndex = ref(0);
const panels = [
  {
    key: 'base',
    label: 'Базові відомості',
    icon: mdiInformationOutline
  },
  {
    key: 'data',
    label: 'Джерело даних',
    icon: mdiCableData
  },
  {
    key: 'report',
    label: 'Звіт',
    icon: mdiFileDocumentMultipleOutline
  }
];

const panel = computed(() => panels[panelIndex.value]);

const collections = computed(() => result?.value?.collections || []);

const selectedCollection = computed(() =>
  collections?.value?.find(c => c.name === values?.datacollection)
);

if (props.initialValues?.fields && typeof props.initialValues.fields === 'object') {
  fieldRows.value = Object.entries(props.initialValues.fields).map(([dbField, label]) => ({
    dbField,
    label
  }));
}

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

const isPanelInvalid = panel => {
  const errorKeys = Object.keys(errors.value);
  if (errorKeys.length === 0) return false;
  return panel?.items?.some(item => {
    if (!item.name) return false;
    return errorKeys.includes(item.name);
  });
};

const nextSection = () => {
  if (panelIndex.value < panels.length - 1) {
    panelIndex.value++;
  }
};

const prevSection = () => {
  if (panelIndex.value > 0) {
    panelIndex.value--;
  }
};

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
  <Tabs
    v-model:value="panelIndex"
    class="flex flex-col! lg:flex-row!"
    style="height: calc(100vh - 12rem)"
  >
    <TabList
      :pt="{
        tabList: { class: 'flex lg:flex-col px-4 border-none!' },
        root: { class: 'lg:border-none! lg:min-w-90! hidden! lg:block!' }
      }"
    >
      <Tab
        v-for="(item, index) in panels"
        :key="`tab-${item.key}-index-${index}`"
        class="flex items-center border-dashed! px-0! py-4!"
        :class="{ 'text-red-400!': isPanelInvalid(item) && index !== panelIndex }"
        :value="index"
      >
        <AppIcon :path="item.icon" :size="14" />
        <span> {{ item.label }} </span>
      </Tab>
    </TabList>

    <Divider class="hidden! lg:block!" layout="vertical" />

    <TabPanels class="h-full w-full">
      <form v-autocomplete-off class="flex h-full flex-col" @submit.prevent="handleSave">
        <div class="flex items-center gap-4 self-stretch p-4">
          <AppIcon :path="panel.icon" :size="24" />
          <span class="text-surface-950 dark:text-surface-0 flex-1 text-xl leading-7 font-medium">
            {{ panel.label }}
          </span>
        </div>

        <Divider layout="horizontal" type="dashed" />

        <TabPanel as="section" class="flex h-full flex-col overflow-y-auto p-6" :value="0">
          <InputTextField
            description="Назві звіту"
            label="Назві звіту"
            name="name"
            placeholder="Введіть назву звіту"
          />

          <Divider layout="horizontal" type="dashed" />

          <TextareaField
            description="Опис звіту"
            label="Опис звіту"
            name="description"
            placeholder="Короткий опис звіту"
            :rows="8"
          />
        </TabPanel>

        <TabPanel as="section" class="flex h-full flex-col overflow-y-auto p-6" :value="1">
          <SelectField
            dataKey="name"
            description="Колекція"
            label="Колекція"
            name="datacollection"
            optionLabel="label"
            :options="collections"
            optionValue="name"
            placeholder="Оберіть колекцію даних"
            @change="fieldRows = []"
          />

          <Divider layout="horizontal" type="dashed" />

          <div>
            <div v-if="selectedCollection?.fields?.length" class="mt-4">
              <p class="text-muted-color mb-2 text-xs uppercase">
                Доступні поля — натисніть щоб додати:
              </p>
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

          <Divider layout="horizontal" type="dashed" />

          <div>
            <div class="mb-4 flex items-center justify-between">
              <div class="flex items-center gap-2">
                <span class="text-lg font-medium">Поля звіту</span>
              </div>
              <Button
                icon="pi pi-plus"
                label="Додати"
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

          <Divider layout="horizontal" type="dashed" />

          <div>
            <div class="mb-4 flex items-center justify-between">
              <div class="flex items-center gap-2">
                <span class="text-lg font-medium">Сортування</span>
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
        </TabPanel>

        <TabPanel as="section" class="flex h-full flex-col overflow-y-auto p-6" :value="2">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque error eius odit commodi
          blanditiis rerum sint quam laudantium tempora ab exercitationem sequi ullam, animi earum,
          architecto recusandae dignissimos sed omnis.
        </TabPanel>

        <Divider layout="horizontal" />

        <div class="flex w-full flex-row gap-x-6 p-4">
          <div class="flex flex-row gap-x-2">
            <Button
              :disabled="panelIndex === 0"
              label="Назад"
              variant="outlined"
              @click="prevSection"
            />
            <Button
              :disabled="panelIndex === panels.length - 1"
              label="Продовжити"
              variant="outlined"
              @click="nextSection"
            />
          </div>
          <div class="flex flex-row gap-x-2">
            <Button class="w-40" label="Готово" :loading="loading" raised type="submit" />
            <Button label="Скасувати" variant="outlined" @click="emit('cancel')" />
          </div>
        </div>
      </form>
    </TabPanels>
  </Tabs>
</template>
