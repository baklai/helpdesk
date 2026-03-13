<script setup>
import {
  mdiAccessPointNetwork,
  mdiFileDocumentMultipleOutline,
  mdiInformationOutline,
  mdiSwapHorizontal
} from '@mdi/js';
import { useForm } from 'vee-validate';
import { computed, ref } from 'vue';
import * as yup from 'yup';

import InputTextField from '@/components/fields/InputTextField.vue';
import ChannelPartial from '@/components/partials/ChannelPartial.vue';

const props = defineProps({
  initialValues: { type: Object, default: () => ({}) },
  loading: { type: Boolean, default: false }
});

const emit = defineEmits(['submit', 'cancel']);

const { values, errors, handleSubmit, controlledValues } = useForm({
  validationSchema: yup.object({
    locationFrom: yup.string().required('Потрібно вказати значення'),
    deviceFrom: yup.string().required('Потрібно вказати значення'),
    locationTo: yup.string().required('Потрібно вказати значення'),
    deviceTo: yup.string().required('Потрібно вказати значення'),
    level: yup.string().required('Потрібно вказати значення'),
    channelType: yup.string().required('Потрібно вказати значення'),
    speed: yup.string().required('Потрібно вказати значення'),
    status: yup.string().required('Потрібно вказати значення'),
    operator: yup.string().required('Потрібно вказати значення'),
    composition: yup.string().required('Потрібно вказати значення')
  }),
  initialValues: props.initialValues
});

const panelIndex = ref(0);
const panels = [
  {
    key: 'endpoints',
    label: 'Точки підключення',
    icon: mdiSwapHorizontal,
    items: [
      {
        component: InputTextField,
        name: 'locationFrom',
        label: 'Початкове розташування',
        description: 'Місцезнаходження початкової точки каналу',
        placeholder: 'Вкажіть початкове розташування'
      },
      {
        component: InputTextField,
        name: 'deviceFrom',
        label: 'Початковий пристрій',
        description: 'Пристрій на початковій точці каналу',
        placeholder: 'Вкажіть початковий пристрій'
      },
      {
        component: InputTextField,
        name: 'locationTo',
        label: 'Кінцеве розташування',
        description: 'Місцезнаходження кінцевої точки каналу',
        placeholder: 'Вкажіть кінцеве розташування'
      },
      {
        component: InputTextField,
        name: 'deviceTo',
        label: 'Кінцевий пристрій',
        description: 'Пристрій на кінцевій точці каналу',
        placeholder: 'Вкажіть кінцевий пристрій'
      }
    ]
  },
  {
    key: 'channel',
    label: 'Характеристики каналу',
    icon: mdiAccessPointNetwork,
    items: [
      {
        component: InputTextField,
        name: 'level',
        label: 'Рівень',
        description: 'Рівень мережевої моделі OSI для цього каналу',
        placeholder: 'Вкажіть рівень каналу'
      },
      {
        component: InputTextField,
        name: 'channelType',
        label: 'Тип',
        description: "Тип фізичного або логічного з'єднання",
        placeholder: 'Вкажіть тип каналу'
      },
      {
        component: InputTextField,
        name: 'speed',
        label: 'Швидкість',
        description: 'Пропускна здатність каналу',
        placeholder: 'Вкажіть швидкість каналу'
      },
      {
        component: InputTextField,
        name: 'status',
        label: 'Статус',
        description: 'Поточний стан каналу',
        placeholder: 'Вкажіть статус каналу'
      }
    ]
  },
  {
    key: 'details',
    label: 'Додаткові відомості',
    icon: mdiInformationOutline,
    items: [
      {
        component: InputTextField,
        name: 'operator',
        label: 'Оператор',
        description: 'Оператор або провайдер, що обслуговує канал',
        placeholder: 'Вкажіть оператора'
      },
      {
        component: InputTextField,
        name: 'composition',
        label: 'Склад',
        description: 'Склад або конфігурація каналу',
        placeholder: 'Вкажіть склад каналу'
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
    locationFrom: controlledValues?.value?.locationFrom,
    deviceFrom: controlledValues?.value?.deviceFrom,
    locationTo: controlledValues?.value?.locationTo,
    deviceTo: controlledValues?.value?.deviceTo,
    level: controlledValues?.value?.level,
    channelType: controlledValues?.value?.channelType,
    speed: controlledValues?.value?.speed,
    status: controlledValues?.value?.status,
    operator: controlledValues?.value?.operator,
    composition: controlledValues?.value?.composition
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
            <ChannelPartial :data="values" />
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
