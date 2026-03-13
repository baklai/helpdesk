<script setup>
import { useConfirm } from 'primevue/useconfirm';
import { useToast } from 'primevue/usetoast';
import { useForm } from 'vee-validate';
import { ref } from 'vue';
import * as yup from 'yup';

import { apolloClient } from '@/graphql/apollo.client';
import {
  CREATE_ONE_ORGANIZATION,
  FIND_ALL_ORGANIZATIONS,
  REMOVE_ONE_ORGANIZATION,
  UPDATE_ONE_ORGANIZATION
} from '@/graphql/apollo.gql';

const toast = useToast();
const confirm = useConfirm();

const { values, errors, handleSubmit, controlledValues, setValues, resetForm, defineField } =
  useForm({
    validationSchema: yup.object({
      name: yup.string().required('Потрібно вказати значення')
    }),
    initialValues: {}
  });

const emits = defineEmits(['close']);

const visible = ref(true);

const refMenu = ref();
const options = ref([
  {
    label: 'Створити запис',
    icon: 'pi pi-plus-circle',
    command: async () => await onCreateRecord()
  },
  {
    label: 'Видалити запис',
    icon: 'pi pi-trash',
    command: async () => await onRemoveRecord()
  },
  {
    label: 'Оновити записи',
    icon: 'pi pi-sync',
    command: async () => await onUpdateRecords()
  }
]);

const records = ref([]);

const [name, nameAttrs] = defineField('name');
const [address, addressAttrs] = defineField('address');
const [description, descriptionAttrs] = defineField('description');

const onShowModal = async () => {
  const { data } = await apolloClient.query({
    query: FIND_ALL_ORGANIZATIONS,
    fetchPolicy: 'no-cache'
  });

  records.value = data?.organizations;
};

const onUpdateRecords = async () => {
  resetForm({ values: {} }, { force: true });
  try {
    const { data } = await apolloClient.query({
      query: FIND_ALL_ORGANIZATIONS,
      fetchPolicy: 'no-cache'
    });

    records.value = data?.organizations;

    toast.add({
      severity: 'success',
      summary: 'Інформація',
      detail: 'Записи оновлені',
      life: 3000
    });
  } catch {
    toast.add({
      severity: 'warn',
      summary: 'Попередження',
      detail: 'Записи не оновлено',
      life: 3000
    });
  }
};

const onCreateRecord = async () => {
  resetForm({ values: {} }, { force: true });
  toast.add({
    severity: 'success',
    summary: 'Інформація',
    detail: 'Введіть новий запис',
    life: 5000
  });
};

const onRemoveRecord = async () => {
  if (!values?.id) {
    return toast.add({
      severity: 'warn',
      summary: 'Попередження',
      detail: 'Запис не вибрано',
      life: 5000
    });
  }

  confirm.require({
    message: 'Ви бажаєте видалити цей запис?',
    header: 'Попередження',
    icon: 'pi pi-info-circle',
    rejectProps: {
      label: 'Відмінити',
      severity: 'secondary',
      outlined: true
    },
    acceptProps: {
      label: 'Видалити',
      severity: 'danger'
    },
    accept: async () => {
      try {
        await apolloClient.mutate({
          mutation: REMOVE_ONE_ORGANIZATION,
          fetchPolicy: 'no-cache',
          variables: { id: values.id }
        });

        toast.add({
          severity: 'success',
          summary: 'Інформація',
          detail: 'Запис видалено',
          life: 5000
        });
      } catch {
        toast.add({
          severity: 'warn',
          summary: 'Попередження',
          detail: 'Запис не видалено',
          life: 5000
        });
      } finally {
        visible.value = false;
      }
    }
  });
};

const onSaveRecord = handleSubmit(async values => {
  try {
    const input = controlledValues.value;

    if (values?.id) {
      await apolloClient.mutate({
        mutation: UPDATE_ONE_ORGANIZATION,
        fetchPolicy: 'no-cache',
        variables: { id: values.id, input }
      });
    } else {
      await apolloClient.mutate({
        mutation: CREATE_ONE_ORGANIZATION,
        fetchPolicy: 'no-cache',
        variables: { input }
      });
    }
    toast.add({
      severity: 'success',
      summary: 'Інформація',
      detail: values?.id ? 'Запис оновлено' : 'Запис створено',
      life: 5000
    });
    visible.value = false;
  } catch {
    toast.add({
      severity: 'warn',
      summary: 'Попередження',
      detail: values?.id ? 'Запис не оновлено' : 'Запис не створено',
      life: 5000
    });
  }
});

const onCloseModal = async () => {
  resetForm({ values: {} }, { force: true });
  emits('close', {});
};
</script>

<template>
  <Menu ref="refMenu" :model="options" popup>
    <template #item="{ label, item, props }">
      <a :href="item.url" v-bind="props.action">
        <span v-bind="props.icon" />
        <span v-bind="props.label">{{ label }}</span>
      </a>
    </template>
  </Menu>

  <Dialog
    v-model:visible="visible"
    class="mx-auto w-[90vw] md:w-[60vw] lg:w-[50vw] xl:w-[40vw] 2xl:w-[30vw]"
    closable
    draggable
    @hide="onCloseModal"
    @show="onShowModal"
  >
    <template #header>
      <div class="flex w-full justify-between">
        <div class="flex items-center justify-center">
          <i class="pi pi-building mr-4 text-4xl!"></i>
          <div>
            <p class="line-height-2 text-lg font-bold">Організація</p>
            <p class="line-height-2 text-surface-500 text-base font-normal">
              {{ values?.id ? 'Редагувати обраний запис' : 'Створити новий запис' }}
            </p>
          </div>
        </div>

        <div class="flex items-center">
          <Button
            v-tooltip.bottom="'Меню опцій'"
            icon="pi pi-ellipsis-v"
            rounded
            severity="secondary"
            variant="text"
            @click="event => refMenu.toggle(event)"
          />
        </div>
      </div>
    </template>

    <div class="flex flex-col gap-2">
      <Select
        autofocus
        filter
        filterPlaceholder="Пошук у списку"
        optionLabel="name"
        :options="records"
        placeholder="Пошук у базі даних"
        resetFilterOnHide
        showClear
        :virtualScrollerOptions="{ itemSize: 32 }"
        @change="event => setValues({ ...event.value })"
      >
        <template #option="{ option }">
          <div class="flex h-full items-center text-base">
            {{ option.name }}
          </div>
        </template>
      </Select>
    </div>

    <Divider class="my-6" type="solid" />

    <form v-autocomplete-off class="flex flex-col gap-y-4" @submit.prevent="onSaveRecord">
      <div class="flex flex-col gap-2">
        <label class="font-bold" for="name">Назва організації</label>
        <InputText
          id="name"
          v-model="name"
          v-bind="nameAttrs"
          aria-describedby="name-help"
          :invalid="!!errors?.name"
          placeholder="Назва організації"
        />
        <small v-if="errors?.name" id="name-help" class="text-red-500">
          {{ errors.name }}
        </small>
      </div>

      <div class="flex flex-col gap-2">
        <label class="font-bold" for="address">Адреса організації</label>
        <InputText
          id="address"
          v-model="address"
          v-bind="addressAttrs"
          placeholder="Адреса організації"
        />
      </div>

      <div class="flex flex-col gap-2">
        <label class="font-bold" for="description">Опис організації</label>
        <Textarea
          id="description"
          v-model="description"
          v-bind="descriptionAttrs"
          placeholder="Опис організації"
          rows="5"
        />
      </div>
    </form>

    <template #footer>
      <Button icon="pi pi-times" label="Скасувати" plain text @click="visible = false" />
      <Button icon="pi pi-check" label="Зберегти" plain text @click="onSaveRecord" />
    </template>
  </Dialog>
</template>
