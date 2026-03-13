<script setup>
import { useToast } from 'primevue/usetoast';
import { useForm } from 'vee-validate';
import { ref } from 'vue';
import * as yup from 'yup';

import { apolloClient } from '@/graphql/apollo.client';
import { CREATE_ONE_NOTICE, FIND_ALL_USERS_FOR_NOTICE } from '@/graphql/apollo.gql';

const toast = useToast();

const emits = defineEmits(['close']);

const { values, errors, handleSubmit, resetForm, defineField } = useForm({
  validationSchema: yup.object({
    title: yup.string().required('Потрібно вказати значення'),
    message: yup.string().required('Потрібно вказати значення'),
    status: yup.string().required('Потрібно вказати значення'),
    users: yup.array().min(1, 'Потрібно вказати значення').required('Потрібно вказати значення')
  }),
  initialValues: {}
});

const visible = ref(false);
const records = ref([]);
const severities = ref(['success', 'info', 'warn', 'error', 'secondary']);

const [title, titleAttrs] = defineField('title');
const [message, messageAttrs] = defineField('message');
const [status, statusAttrs] = defineField('status');
const [users, usersAttrs] = defineField('users');

defineExpose({
  toggle: async () => {
    visible.value = true;
  }
});

const onShowModal = async () => {
  try {
    const { data } = await apolloClient.query({
      query: FIND_ALL_USERS_FOR_NOTICE,
      fetchPolicy: 'no-cache',
      variables: { scope: 'all' }
    });
    records.value = data?.users || [];
  } catch {
    toast.add({
      severity: 'warn',
      summary: 'Попередження',
      detail: 'Не вдалося завантажити список користувачів',
      life: 3000
    });
  }
};

const onSendNotice = handleSubmit(async () => {
  try {
    await apolloClient.mutate({
      mutation: CREATE_ONE_NOTICE,
      fetchPolicy: 'no-cache',
      variables: {
        input: {
          title: values.title,
          message: values.message,
          status: values.status,
          users: values.users.map(({ id }) => id)
        }
      }
    });
    toast.add({
      severity: 'success',
      summary: 'Інформація',
      detail: 'Всі повідомлення відправлено',
      life: 3000
    });
    visible.value = false;
  } catch (err) {
    toast.add({
      severity: 'warn',
      summary: 'Попередження',
      detail: err?.message,
      life: 3000
    });
  }
});

const onCloseModal = () => {
  resetForm({ values: {} }, { force: true });
  emits('close', {});
};
</script>

<template>
  <Dialog
    v-model:visible="visible"
    class="mx-auto w-[90vw] md:w-[60vw] lg:w-[50vw] xl:w-[35vw] 2xl:w-[25vw]"
    closable
    draggable
    @hide="onCloseModal"
    @show="onShowModal"
  >
    <template #header>
      <div class="flex w-full justify-between">
        <div class="flex items-center justify-center">
          <i class="pi pi-bell mr-4 text-4xl!"></i>
          <div>
            <p class="line-height-2 text-lg font-bold">HD Сповіщення</p>
            <p class="line-height-2 text-surface-500 text-base font-normal">
              Сповіщення системи служби сервісної підтримки
            </p>
          </div>
        </div>
      </div>
    </template>

    <form v-autocomplete-off class="flex flex-col gap-y-4" @submit.prevent="onSendNotice">
      <div class="flex flex-col gap-2">
        <label class="font-bold" for="users">Користувачі сповіщень</label>
        <MultiSelect
          id="users"
          v-model="users"
          v-bind="usersAttrs"
          aria-describedby="users-help"
          filter
          :invalid="!!errors?.users"
          :maxSelectedLabels="3"
          optionLabel="fullname"
          :options="records"
          placeholder="Користувачі сповіщень"
        >
          <template #option="slotProps">
            <div class="flex items-center">
              <Avatar class="mr-2" icon="pi pi-user" shape="circle" />
              <p class="font-semibold">{{ slotProps.option.fullname }}</p>
            </div>
          </template>
        </MultiSelect>
        <small v-if="errors?.users" id="users-help" class="text-red-500">
          {{ errors.users }}
        </small>
      </div>

      <div class="flex flex-col gap-2">
        <label class="font-bold" for="status">Статус сповіщення</label>
        <Select
          id="status"
          v-model="status"
          v-bind="statusAttrs"
          aria-describedby="status-help"
          :invalid="!!errors?.status"
          :options="severities"
          placeholder="Статус сповіщення"
        >
          <template #option="slotProps">
            <Message :severity="slotProps.option">
              Статус сповіщення: {{ slotProps.option }}
            </Message>
          </template>
        </Select>
        <small v-if="errors?.status" id="status-help" class="text-red-500">
          {{ errors.status }}
        </small>
      </div>

      <div class="flex flex-col gap-2">
        <label class="font-bold" for="title">Заголовок сповіщення</label>
        <InputText
          id="title"
          v-model="title"
          v-bind="titleAttrs"
          aria-describedby="title-help"
          :invalid="!!errors?.title"
          placeholder="Заголовок сповіщення"
        />
        <small v-if="errors?.title" id="title-help" class="text-red-500">
          {{ errors.title }}
        </small>
      </div>

      <div class="flex flex-col gap-2">
        <label class="font-bold" for="message">Текст сповіщення</label>
        <Textarea
          id="message"
          v-model="message"
          v-bind="messageAttrs"
          aria-describedby="message-help"
          :invalid="!!errors?.message"
          placeholder="Текст сповіщення"
          rows="10"
        />
        <small v-if="errors?.message" id="message-help" class="text-red-500">
          {{ errors.message }}
        </small>
      </div>
    </form>

    <template #footer>
      <Button icon="pi pi-times" label="Скасувати" plain text @click="visible = false" />
      <Button
        v-tooltip.bottom="'Надіслати сповіщення'"
        icon="pi pi-send"
        label="Відправити"
        plain
        text
        @click="onSendNotice"
      />
    </template>
  </Dialog>
</template>
