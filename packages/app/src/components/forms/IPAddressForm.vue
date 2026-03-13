<script setup>
import {
  mdiCardAccountDetailsOutline,
  mdiDeveloperBoard,
  mdiFileDocumentMultipleOutline,
  mdiInformationOutline,
  mdiIpOutline,
  mdiOfficeBuildingOutline,
  mdiWeb
} from '@mdi/js';
import { useForm } from 'vee-validate';
import { computed, ref } from 'vue';
import * as yup from 'yup';

import CIDRFiled from '@/components/fields/CIDRFiled.vue';
import InputTextField from '@/components/fields/InputTextField.vue';
import IPAddressField from '@/components/fields/IPAddressField.vue';
import SelectButtonField from '@/components/fields/SelectButtonField.vue';
import SelectLoadField from '@/components/fields/SelectLoadField.vue';
import TextareaField from '@/components/fields/TextareaField.vue';
import IPAddressPartial from '@/components/partials/IPAddressPartial.vue';
import { INTERNET_STATUS } from '@/constants/ui.const';
import {
  FIND_ALL_DEPARTMENTS,
  FIND_ALL_DEVICES,
  FIND_ALL_LOCATIONS,
  FIND_ALL_ORGANIZATIONS,
  FIND_ALL_POSITIONS,
  FIND_ALL_SUBDIVISIONS
} from '@/graphql/apollo.gql';

const props = defineProps({
  initialValues: { type: Object, default: () => ({}) },
  loading: { type: Boolean, default: false }
});

const emit = defineEmits(['submit', 'cancel']);

const { values, errors, handleSubmit, controlledValues } = useForm({
  validationSchema: yup.object({
    reqnum: yup.string().required('Потрібно вказати значення'),
    inventory: yup.string(),
    ipaddress: yup
      .string()
      .required('Потрібно вказати значення')
      .test('ipaddress', 'Incorrect IP address', value => {
        const ipv4Pattern = /^(\d{1,3}\.){3}\d{1,3}$/;
        return ipv4Pattern.test(value);
      }),
    cidr: yup.object().required('Потрібно вказати значення'),
    internet: yup
      .object({
        reqnum: yup.string().nullable(),
        status: yup.string().nullable(),
        comment: yup.string().nullable()
      })
      .nullable(),
    fullname: yup.string().required('Потрібно вказати значення'),
    phone: yup.string().required('Потрібно вказати значення'),
    email: yup.string().email('Невірний формат email'),
    device: yup.object().required('Потрібно вказати значення'),
    location: yup.object().nullable(),
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
        component: InputTextField,
        name: 'inventory',
        label: 'Інвентарний номер',
        description: 'Внутрішній обліковий номер обладнання',
        placeholder: 'Вкажіть інвентариний номер'
      },
      {
        component: TextareaField,
        name: 'comment',
        label: 'Коментар',
        description: 'Додаткова інформація або примітки щодо цього запису',
        placeholder: 'Напишіть коментар',
        rows: 8
      }
    ]
  },
  {
    key: 'ipaddress',
    label: 'IP-адреса',
    icon: mdiIpOutline,
    items: [
      {
        component: IPAddressField,
        name: 'ipaddress'
      },
      {
        component: CIDRFiled,
        name: 'cidr'
      },
      {
        component: SelectLoadField,
        name: 'device',
        label: 'Пристрій',
        description: 'Обладнання, для якого виконується налаштування або призначення IP-адреси',
        placeholder: 'Оберіть пристрій',
        gql: FIND_ALL_DEVICES
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
    key: 'internet',
    label: 'Інтернет',
    icon: mdiWeb,
    items: [
      {
        component: InputTextField,
        name: 'internet.reqnum',
        label: 'Номер листа',
        description: 'Номер листа, на підставі якого відкрито доступ до Інтернету',
        placeholder: 'Вкажіть номер листа'
      },
      {
        component: SelectButtonField,
        name: 'internet.status',
        label: 'Доступ до мережі',
        description: 'Статус доступу до мережі Інтернет',
        placeholder: 'Оберіть статус',
        options: INTERNET_STATUS
      },
      {
        component: TextareaField,
        name: 'internet.comment',
        label: 'Коментар',
        description: 'Додаткові умови або обмеження щодо Інтернет-доступу',
        placeholder: 'Напишіть коментар',
        rows: 6
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
        component: InputTextField,
        name: 'email',
        label: 'Електронна пошта',
        description: 'Службова електронна пошта',
        placeholder: 'Вкажіть електронну пошту'
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
    key: 'access',
    label: 'Доступи',
    icon: mdiDeveloperBoard,
    items: [
      {
        component: InputTextField,
        name: 'autoanswer',
        label: 'Автовідповідь',
        description: 'Номер автоматичної відповіді або службового повідомлення',
        placeholder: 'Вкажіть автовідповідь'
      }
    ]
  },
  {
    key: 'report',
    label: 'Звіт',
    icon: mdiFileDocumentMultipleOutline
  }
];

const panel = computed(() => panels[panelIndex.value]);

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
  emit('submit', {
    autoanswer: controlledValues?.value?.autoanswer,
    cidr: {
      value: controlledValues?.value?.cidr?.value,
      mask: controlledValues?.value?.cidr?.mask
    },
    comment: controlledValues?.value?.comment,
    department: controlledValues?.value?.department?.id,
    email: controlledValues?.value?.email,
    fullname: controlledValues?.value?.fullname,
    internet: {
      reqnum: controlledValues?.value?.internet?.reqnum,
      status: controlledValues?.value?.internet?.status,
      comment: controlledValues?.value?.internet?.comment
    },
    inventory: controlledValues?.value?.inventory,
    ipaddress: controlledValues?.value?.ipaddress,
    location: controlledValues?.value?.location?.id,
    organization: controlledValues?.value?.organization?.id,
    phone: controlledValues?.value?.phone,
    position: controlledValues?.value?.position?.id,
    reqnum: controlledValues?.value?.reqnum,
    subdivision: controlledValues?.value?.subdivision?.id,
    device: controlledValues?.value?.device?.id
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
            <IPAddressPartial :data="values" />
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
