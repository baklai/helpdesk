<script setup>
import {
  mdiAccountKeyOutline,
  mdiFileDocumentMultipleOutline,
  mdiInformationOutline,
  mdiShieldAccountOutline
} from '@mdi/js';
import { useForm } from 'vee-validate';
import { computed, ref } from 'vue';
import * as yup from 'yup';

import InputPasswordField from '@/components/fields/InputPasswordField.vue';
import InputTextField from '@/components/fields/InputTextField.vue';
import SelectButtonField from '@/components/fields/SelectButtonField.vue';
import UserPartial from '@/components/partials/UserPartial.vue';
import ScopeDataTable from '@/components/tables/ScopeDataTable.vue';
import { USER_ROLES, USER_STATUS } from '@/constants/ui.const';
import { useScopeStore } from '@/stores/scopes.store';
import { encodeScopeList } from '@/utils/ScopeMethods';

const props = defineProps({
  initialValues: { type: Object, default: () => ({}) },
  loading: { type: Boolean, default: false }
});

const emit = defineEmits(['submit', 'cancel']);

const { getSelectScope, getDefaultScope, getScopeKeyList } = useScopeStore();

const { errors, handleSubmit, controlledValues, values, setValues } = useForm({
  validationSchema: yup.object({
    fullname: yup.string().required('Потрібно вказати значення'),
    phone: yup
      .string()
      .matches(/^\+\d{7,15}$/, 'Некоректний формат номера телефону')
      .required('Потрібно вказати значення'),
    email: yup.string().email('Невірний формат email').required('Потрібно вказати значення'),
    status: yup.string().required('Потрібно вказати значення'),
    role: yup.string().required('Потрібно вказати значення'),
    scope: yup.array()
  }),
  initialValues: props.initialValues
});

const refSelectMenu = ref();
const selectOptions = ref([
  {
    label: 'Вибрати все',
    icon: 'pi pi-check-circle',
    command: () => {
      setValues({ scope: getSelectScope(true) });
    }
  },
  {
    label: 'Скасувати все',
    icon: 'pi pi-minus-circle',
    command: () => {
      setValues({ scope: getSelectScope(false) });
    }
  },
  { separator: true },
  {
    label: 'За замовчуванням',
    icon: 'pi pi-verified',
    command: () => {
      setValues({ scope: getDefaultScope() });
    }
  }
]);

const panelIndex = ref(0);
const panels = [
  {
    key: 'base',
    label: 'Базові відомості',
    icon: mdiInformationOutline,
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
        component: InputPasswordField,
        name: 'password',
        label: 'Пароль користувача',
        description: 'При редагуванні залиште порожнім, щоб не змінювати пароль',
        placeholder: 'Вкажіть пароль користувача'
      }
    ]
  },
  {
    key: 'status',
    label: 'Стан облікового запису',
    icon: mdiShieldAccountOutline,
    items: [
      {
        component: SelectButtonField,
        name: 'status',
        label: 'Статус облікового запису',
        description: 'Поточний стан облікового запису користувача',
        placeholder: 'Оберіть статус',
        options: USER_STATUS
      },
      {
        component: SelectButtonField,
        name: 'role',
        label: 'Роль користувача',
        description: 'Визначає рівень доступу та повноваження в системі',
        placeholder: 'Оберіть роль',
        options: USER_ROLES
      }
    ]
  },
  {
    key: 'scopes',
    label: 'Права доступу',
    icon: mdiAccountKeyOutline,
    items: [
      {
        component: ScopeDataTable,
        name: 'scope'
      }
    ]
  },
  {
    key: 'report',
    label: 'Звіт',
    icon: mdiFileDocumentMultipleOutline,
    items: []
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
    fullname: controlledValues?.value?.fullname,
    email: controlledValues?.value?.email,
    phone: controlledValues?.value?.phone,
    password: controlledValues?.value?.password || undefined,
    status: controlledValues?.value?.status,
    role: controlledValues?.value?.role,
    // getScopeKeyList → ['event:read', ...] → encodeScopeList → '2097153' (BigInt-рядок для API)
    scope: encodeScopeList(getScopeKeyList(controlledValues?.value?.scope))
  });
});
</script>

<template>
  <Menu ref="refSelectMenu" :model="selectOptions" popup>
    <template #item="{ label, item, props: itemProps }">
      <a :href="item.url" v-bind="itemProps.action">
        <span v-bind="itemProps.icon" />
        <span v-bind="itemProps.label">{{ label }}</span>
      </a>
    </template>
  </Menu>

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

          <Button
            v-if="panel.key === 'scopes'"
            v-tooltip.bottom="'Опції'"
            icon="pi pi-cog"
            rounded
            severity="secondary"
            variant="text"
            @click="event => refSelectMenu.toggle(event)"
          />
        </div>

        <Divider layout="horizontal" type="dashed" />

        <TabPanel
          v-for="(tabPanel, idxPanel) in panels"
          :key="`tabpanel-${tabPanel.key}`"
          as="section"
          class="flex h-full flex-col overflow-y-auto p-6"
          :value="idxPanel"
        >
          <!-- Вкладка "Звіт" — передаємо поточні значення форми у UserPartial -->
          <template v-if="tabPanel.key === 'report'">
            <UserPartial :data="values" />
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
