<script setup>
import {
  mdiCardAccountDetailsOutline,
  mdiFileDocumentMultipleOutline,
  mdiInformationOutline,
  mdiOfficeBuildingOutline
} from '@mdi/js';
import { useForm } from 'vee-validate';
import { computed, ref } from 'vue';
import * as yup from 'yup';

import InputTextField from '@/components/fields/InputTextField.vue';
import SelectButtonField from '@/components/fields/SelectButtonField.vue';
import SelectLoadField from '@/components/fields/SelectLoadField.vue';
import TextareaField from '@/components/fields/TextareaField.vue';
import MailboxPartial from '@/components/partials/MailboxPartial.vue';
import { MAILBOX_STATUS } from '@/constants/ui.const';
import {
  FIND_ALL_DEPARTMENTS,
  FIND_ALL_ORGANIZATIONS,
  FIND_ALL_POSITIONS,
  FIND_ALL_SUBDIVISIONS
} from '@/graphql/apollo.gql';

const props = defineProps({
  initialValues: { type: Object, default: () => ({}) },
  loading: { type: Boolean, default: false }
});

const emit = defineEmits(['submit', 'cancel']);

const { errors, handleSubmit, controlledValues } = useForm({
  validationSchema: yup.object({
    status: yup.string(),
    reqnum: yup.string().required('Потрібно вказати значення'),
    fullname: yup.string().required('Потрібно вказати значення'),
    phone: yup.string().required('Потрібно вказати значення'),
    email: yup.string().email('Невірний формат email').required('Потрібно вказати значення'),
    comment: yup.string().nullable(),
    position: yup.object().nullable(),
    organization: yup.object().nullable(),
    subdivision: yup.object().nullable(),
    department: yup.object().nullable()
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
        component: SelectButtonField,
        name: 'status',
        label: 'Статус електронної пошти',
        description: 'Статус доступу електронної скриньки',
        placeholder: 'Оберіть статус',
        options: MAILBOX_STATUS
      },
      {
        component: InputTextField,
        name: 'email',
        label: 'Електронна пошта',
        description: 'Реєстраційний логін поштової скриньки',
        placeholder: 'Вкажіть електронну пошту'
      },
      {
        component: TextareaField,
        name: 'comment',
        label: 'Коментар',
        description: 'Додаткові умови або обмеження щодо поштової скриньки',
        placeholder: 'Напишіть коментар',
        rows: 6
      }
    ]
  },
  {
    key: 'user',
    label: 'Обліковий запис',
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
    key: 'report',
    label: 'Звіт',
    icon: mdiFileDocumentMultipleOutline,
    items: [
      {
        component: MailboxPartial,
        name: 'mailbox-partial'
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
    status: controlledValues?.value?.status,
    reqnum: controlledValues?.value?.reqnum,
    email: controlledValues?.value?.email,
    fullname: controlledValues?.value?.fullname,
    phone: controlledValues?.value?.phone,
    comment: controlledValues?.value?.comment,
    location: controlledValues?.value?.location?.id,
    organization: controlledValues?.value?.organization?.id,
    subdivision: controlledValues?.value?.subdivision?.id,
    department: controlledValues?.value?.department?.id,
    position: controlledValues?.value?.position?.id
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
          <component
            :is="item.component"
            v-for="(item, idxField) in tabPanel.items"
            :key="item.name || `field-${idxField}`"
            v-bind="item"
            :data="tabPanel.key === 'report' ? controlledValues : undefined"
          >
            <Divider
              v-if="idxField < tabPanel.items.length - 1"
              layout="horizontal"
              type="dashed"
            />
          </component>
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
