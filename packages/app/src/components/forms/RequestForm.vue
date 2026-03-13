<script setup>
import {
  mdiCardAccountDetailsOutline,
  mdiFileDocumentMultipleOutline,
  mdiInformationOutline,
  mdiIpOutline,
  mdiOfficeBuildingOutline,
  mdiText
} from '@mdi/js';
import { useForm } from 'vee-validate';
import { computed, ref } from 'vue';
import * as yup from 'yup';

import InputTextField from '@/components/fields/InputTextField.vue';
import IPAddressField from '@/components/fields/IPAddressField.vue';
import SelectButtonField from '@/components/fields/SelectButtonField.vue';
import SelectLoadField from '@/components/fields/SelectLoadField.vue';
import TextareaField from '@/components/fields/TextareaField.vue';
import RequestPartial from '@/components/partials/RequestPartial.vue';
import { REQUEST_STATUS } from '@/constants/ui.const';
import {
  FIND_ALL_DEPARTMENTS,
  FIND_ALL_LOCATIONS,
  FIND_ALL_ORGANIZATIONS,
  FIND_ALL_POSITIONS,
  FIND_ALL_SUBDIVISIONS
} from '@/graphql/apollo.gql.js';

const props = defineProps({
  initialValues: { type: Object, default: () => ({}) },
  loading: { type: Boolean, default: false }
});

const emit = defineEmits(['submit', 'cancel']);

const { values, errors, handleSubmit, controlledValues } = useForm({
  validationSchema: yup.object({
    reqnum: yup.string().nullable(),
    request: yup.string().required('Потрібно вказати значення'),
    ipaddress: yup.string().nullable(),
    fullname: yup.string().required('Потрібно вказати значення'),
    phone: yup.string().required('Потрібно вказати значення'),
    status: yup.string().nullable(),
    location: yup.object().nullable(),
    position: yup.object().nullable(),
    organization: yup.object().nullable(),
    subdivision: yup.object().nullable(),
    department: yup.object().nullable(),
    comment: yup.string().nullable(),
    conclusion: yup.string().nullable()
  }),
  initialValues: props.initialValues
});

const panelIndex = ref(0);
const panels = [
  {
    key: 'base',
    label: 'Базові відомості',
    icon: mdiInformationOutline,
    items: [
      {
        component: InputTextField,
        name: 'reqnum',
        label: 'Номер листа',
        description: 'Реєстраційний номер службового листа або розпорядження',
        placeholder: 'Вкажіть номер листа'
      },
      {
        component: TextareaField,
        name: 'request',
        label: 'Заявка',
        description: 'Опис заявки від користувача',
        placeholder: 'Опишіть заявку',
        rows: 8
      },
      {
        component: TextareaField,
        name: 'comment',
        label: 'Коментар',
        description: 'Додаткова інформація або примітки щодо цього запису',
        placeholder: 'Напишіть коментар',
        rows: 4
      }
    ]
  },
  {
    key: 'network',
    label: 'Мережа',
    icon: mdiIpOutline,
    items: [
      {
        component: IPAddressField,
        name: 'ipaddress'
      },
      {
        component: SelectLoadField,
        name: 'location',
        label: 'Розташування',
        description: 'Фізичне або логічне місце встановлення пристрою',
        placeholder: 'Оберіть місце розташування',
        gql: FIND_ALL_LOCATIONS,
        optionLabel: option => `${option.name} (${option.region})`
      }
    ]
  },
  {
    key: 'organization',
    label: 'Організація',
    icon: mdiOfficeBuildingOutline,
    items: [
      {
        component: SelectLoadField,
        name: 'organization',
        label: 'Організація',
        description: 'Організація, до якої належить користувач або пристрій',
        placeholder: 'Оберіть організацію',
        gql: FIND_ALL_ORGANIZATIONS
      },
      {
        component: SelectLoadField,
        name: 'subdivision',
        label: 'Підрозділ',
        description: 'Структурний підрозділ у межах організації',
        placeholder: 'Оберіть підрозділ',
        gql: FIND_ALL_SUBDIVISIONS
      },
      {
        component: SelectLoadField,
        name: 'department',
        label: 'Відділ',
        description: 'Конкретний відділ або служба',
        placeholder: 'Оберіть відділ',
        gql: FIND_ALL_DEPARTMENTS
      }
    ]
  },
  {
    key: 'user',
    label: 'Користувач',
    icon: mdiCardAccountDetailsOutline,
    items: [
      {
        component: InputTextField,
        name: 'fullname',
        label: "Прізвище та ім'я",
        description: "Прізвище та ім'я відповідальної особи",
        placeholder: "Вкажіть прізвище та ім'я"
      },
      {
        component: InputTextField,
        name: 'phone',
        label: 'Номер телефону',
        description: 'Контактний номер телефону користувача',
        placeholder: 'Вкажіть номер телефону'
      },
      {
        component: SelectLoadField,
        name: 'position',
        label: 'Посада',
        description: 'Посада відповідальної особи',
        placeholder: 'Оберіть посаду',
        gql: FIND_ALL_POSITIONS
      }
    ]
  },
  {
    key: 'status',
    label: 'Статус',
    icon: mdiText,
    items: [
      {
        component: SelectButtonField,
        name: 'status',
        label: 'Статус заявки',
        description: 'Поточний стан обробки заявки',
        placeholder: 'Оберіть статус',
        options: REQUEST_STATUS,
        dataKey: 'key',
        optionValue: 'key',
        optionLabel: 'label'
      },
      {
        component: TextareaField,
        name: 'conclusion',
        label: 'Висновок до запиту',
        description: 'Технічний висновок за результатами виконання заявки',
        placeholder: 'Вкажіть висновок до запиту',
        rows: 8
      }
    ]
  },
  {
    key: 'report',
    label: 'Звіт',
    icon: mdiFileDocumentMultipleOutline,
    items: [
      {
        component: RequestPartial
      }
    ]
  }
];

const panel = computed(() => panels[panelIndex.value]);

const isPanelInvalid = panel => {
  const errorKeys = Object.keys(errors.value);
  if (errorKeys.length === 0) return false;
  return panel.items.some(item => {
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
  emit('submit', {
    reqnum: controlledValues?.value?.reqnum || undefined,
    request: controlledValues?.value?.request,
    ipaddress: controlledValues?.value?.ipaddress || undefined,
    fullname: controlledValues?.value?.fullname,
    phone: controlledValues?.value?.phone,
    status: controlledValues?.value?.status || undefined,
    comment: controlledValues?.value?.comment || undefined,
    conclusion: controlledValues?.value?.conclusion || undefined,
    location: controlledValues?.value?.location?.id || undefined,
    organization: controlledValues?.value?.organization?.id || undefined,
    subdivision: controlledValues?.value?.subdivision?.id || undefined,
    department: controlledValues?.value?.department?.id || undefined,
    position: controlledValues?.value?.position?.id || undefined
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

        {{ item.label }}
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

        <TabPanel
          v-for="(tabPanel, idxPanel) in panels"
          :key="`tabpanel-${tabPanel.key}`"
          as="section"
          class="flex h-full flex-col overflow-y-auto p-6"
          :value="idxPanel"
        >
          <template v-if="tabPanel.key === 'report'">
            <RequestPartial :data="values" />
          </template>

          <template v-else>
            <component
              :is="item.component"
              v-for="(item, idxField) in tabPanel.items"
              :key="item.name || `field-${idxField}`"
              v-bind="item"
            >
              <Divider
                v-if="idxField < tabPanel.items.length - 1"
                layout="horizontal"
                type="dashed"
              />
            </component>
          </template>
        </TabPanel>

        <Divider layout="horizontal" />

        <div class="flex w-full flex-row gap-x-6">
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
