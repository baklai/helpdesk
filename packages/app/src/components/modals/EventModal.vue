<script setup>
import { useConfirm } from 'primevue/useconfirm';
import { useToast } from 'primevue/usetoast';
import { useForm } from 'vee-validate';
import { computed, ref } from 'vue';
import * as yup from 'yup';

import { EVENT_ENUM, EVENT_SCHEMA } from '@/constants/ui.const';
import { apolloClient } from '@/graphql/apollo.client';
import {
  CREATE_ONE_EVENT,
  FIND_ONE_EVENT,
  REMOVE_ONE_EVENT,
  UPDATE_ONE_EVENT
} from '@/graphql/apollo.gql';

const toast = useToast();
const confirm = useConfirm();

const visible = ref(false);
const refMenu = ref();

const options = computed(() => [
  {
    label: 'Створити запис',
    icon: 'pi pi-plus-circle',
    command: onCreateRecord
  },
  {
    label: 'Зберегти запис',
    icon: 'pi pi-save',
    command: onSaveRecord
  },
  {
    label: 'Видалити запис',
    icon: 'pi pi-trash',
    command: onRemoveRecord
  }
]);

const emits = defineEmits(['close']);

const { values, errors, handleSubmit, controlledValues, setValues, resetForm, defineField } =
  useForm({
    validationSchema: yup.object({
      title: yup.string().required('Потрібно вказати значення'),
      startDateTime: yup.string().required('Потрібно вказати значення'),
      endDateTime: yup.string().required('Потрібно вказати значення')
    }),
    initialValues: {}
  });

const [title, titleAttrs] = defineField('title');
const [description, descriptionAttrs] = defineField('description');
const [startDateTime, startDateTimeAttrs] = defineField('startDateTime');
const [endDateTime, endDateTimeAttrs] = defineField('endDateTime');
const [location, locationAttrs] = defineField('location');
const [eventType, eventTypeAttrs] = defineField('eventType');
const [participants, participantsAttrs] = defineField('participants');

defineExpose({
  toggle: async id => {
    resetForm({ values: {} }, { force: true });

    try {
      if (id) {
        const { data } = await apolloClient.query({
          query: FIND_ONE_EVENT,
          fetchPolicy: 'no-cache',
          variables: { id }
        });

        const event = data?.event;

        if (event) {
          setValues({
            ...event,
            startDateTime: new Date(event.startDateTime),
            endDateTime: new Date(event.endDateTime)
          });
          visible.value = true;
        }
      }
      visible.value = true;
    } catch {
      toast.add({
        severity: 'warn',
        summary: 'Попередження',
        detail: 'Не вдалося отримати запис',
        life: 5000
      });
    }
  }
});

const onCreateRecord = () => {
  resetForm({ values: {} }, { force: true });
  toast.add({
    severity: 'success',
    summary: 'Інформація',
    detail: 'Введіть новий запис',
    life: 5000
  });
};

const onSaveRecord = handleSubmit(async values => {
  try {
    const input = controlledValues.value;

    if (values?.id) {
      await apolloClient.mutate({
        mutation: UPDATE_ONE_EVENT,
        fetchPolicy: 'no-cache',
        variables: { id: values.id, input }
      });
    } else {
      await apolloClient.mutate({
        mutation: CREATE_ONE_EVENT,
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
          mutation: REMOVE_ONE_EVENT,
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

const onCloseModal = () => {
  resetForm({ values: {} }, { force: true });
  emits('close');
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
    modal
    @hide="onCloseModal"
  >
    <template #header>
      <div class="flex w-full justify-between">
        <div class="flex items-center justify-center">
          <i class="mr-4">
            <AppIcon :path="$route.meta.icon" :size="40" />
          </i>

          <div>
            <p class="line-height-2 text-lg font-bold">Подія календаря</p>
            <p class="line-height-2 text-surface-500 mb-0 text-base font-normal">
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

    <form v-autocomplete-off class="flex flex-col gap-y-4">
      <div class="flex flex-col gap-2">
        <label class="font-bold" for="title">Назва події</label>
        <InputText
          id="title"
          v-model="title"
          v-bind="titleAttrs"
          aria-describedby="title-help"
          :invalid="!!errors?.title"
          placeholder="Назва події"
        />
        <small v-if="errors?.title" id="title-help" class="text-red-500">
          {{ errors.title }}
        </small>
      </div>

      <div class="flex flex-row justify-between gap-2">
        <div class="flex w-1/2 flex-col gap-2">
          <label class="font-bold" for="start-date-time">Дата та час початку події</label>
          <DatePicker
            v-model="startDateTime"
            v-bind="startDateTimeAttrs"
            aria-describedby="start-date-time-help"
            dateFormat="dd.mm.yy"
            hideOnDateTimeSelect
            hourFormat="24"
            iconDisplay="input"
            inputId="start-date-time"
            :invalid="!!errors?.startDateTime"
            placeholder="Дата та час початку події"
            showButtonBar
            showClear
            showIcon
            showTime
          />
          <small v-if="errors?.startDateTime" id="start-date-time-help" class="text-red-500">
            {{ errors.startDateTime }}
          </small>
        </div>

        <div class="flex w-1/2 flex-col gap-2">
          <label class="font-bold" for="end-date-time">Дата та час закінчення події</label>
          <DatePicker
            v-model="endDateTime"
            v-bind="endDateTimeAttrs"
            aria-describedby="endDateTime-help"
            dateFormat="dd.mm.yy"
            hideOnDateTimeSelect
            hourFormat="24"
            iconDisplay="input"
            inputId="end-date-time"
            :invalid="!!errors?.endDateTime"
            placeholder="Дата та час закінчення події"
            showButtonBar
            showClear
            showIcon
            showTime
          />
          <small v-if="errors?.endDateTime" id="end-date-time-help" class="text-red-500">
            {{ errors.endDateTime }}
          </small>
        </div>
      </div>

      <div class="flex flex-col gap-2">
        <label class="font-bold" for="location">Місце проведення події</label>
        <InputText
          id="location"
          v-model="location"
          v-bind="locationAttrs"
          aria-describedby="location-help"
          :invalid="!!errors?.location"
          placeholder="Місце проведення події"
        />
        <small v-if="errors?.location" id="location-help" class="text-red-500">
          {{ errors.location }}
        </small>
      </div>

      <div class="flex flex-col gap-2">
        <label class="font-bold" for="event-type">Тип події</label>
        <Select
          id="event-type"
          v-model="eventType"
          v-bind="eventTypeAttrs"
          aria-describedby="event-type-help"
          :invalid="!!errors?.eventType"
          :maxSelectedLabels="3"
          :optionValue="({ key }) => key.toUpperCase()"
          optionLabel="name"
          :options="EVENT_ENUM"
          placeholder="Тип події"
        >
          <template #option="slotProps">
            <Message :style="{ color: [EVENT_SCHEMA[slotProps.option.key].lightColors.main] }">
              {{ slotProps.option.name }}
            </Message>
          </template>
        </Select>
        <small v-if="errors?.eventType" id="event-type-help" class="text-red-500">
          {{ errors.eventType }}
        </small>
      </div>

      <div class="flex flex-col gap-2">
        <label class="font-bold" for="participants">Учасники події</label>
        <AutoComplete
          id="participants"
          v-model="participants"
          v-bind="participantsAttrs"
          aria-describedby="participants-help"
          filter
          fluid
          :invalid="!!errors?.participants"
          multiple
          placeholder="Учасники події"
          :typeahead="false"
        />
        <small v-if="errors?.participants" id="participants-help" class="text-red-500">
          {{ errors.participants }}
        </small>
      </div>

      <div class="flex flex-col gap-2">
        <label class="font-bold" for="description">Опис події</label>
        <Textarea
          id="description"
          v-model="description"
          cols="12"
          v-bind="descriptionAttrs"
          placeholder="Опис події"
          rows="5"
        />
      </div>
    </form>

    <template #footer>
      <Button icon="pi pi-times" label="Скасувати" plain text @click="visible = !visible" />
      <Button icon="pi pi-check" label="Зберегти" plain text @click="onSaveRecord" />
    </template>
  </Dialog>
</template>
