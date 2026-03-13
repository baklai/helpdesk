<script setup>
import { useToast } from 'primevue/usetoast';
import { useForm } from 'vee-validate';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import * as yup from 'yup';

const toast = useToast();
const router = useRouter();

const submitted = ref(false);

const { errors, handleSubmit, defineField } = useForm({
  validationSchema: yup.object({
    email: yup
      .string()
      .email('Електронна адреса має бути дійсною')
      .required('Потрібно вказати значення')
  })
});

const [email, emailAttrs] = defineField('email');

const onSubmit = handleSubmit(async () => {
  // TODO: підключити мутацію скидання пароля, коли буде реалізовано на бекенді
  submitted.value = true;
  toast.add({
    severity: 'info',
    summary: 'Перевірте пошту',
    detail: 'Якщо акаунт існує — інструкції надіслано на вказану адресу',
    life: 6000
  });
});

const onBack = () => router.push({ name: 'signin' });
</script>

<template>
  <div class="flex w-full max-w-100 flex-col">
    <div class="mb-8 flex flex-col items-center text-center">
      <p class="text-surface-900 dark:text-surface-0 mb-2 text-3xl font-semibold">
        Відновлення пароля
      </p>
      <p class="text-surface-500 text-sm">
        Введіть вашу електронну адресу — ми надішлемо інструкції для скидання пароля
      </p>
    </div>

    <div v-if="submitted" class="flex flex-col items-center gap-4 text-center">
      <i class="pi pi-envelope-open text-primary-500 text-6xl" />
      <p class="text-surface-700 dark:text-surface-200 text-lg font-medium">Інструкції надіслано</p>
      <p class="text-surface-500 text-sm">
        Перевірте вашу поштову скриньку та перейдіть за посиланням у листі.
      </p>
      <Button
        class="mt-4 w-full"
        icon="pi pi-arrow-left"
        label="Повернутися до входу"
        variant="outlined"
        @click="onBack"
      />
    </div>

    <form
      v-else
      v-autocomplete-off
      class="flex flex-col justify-center gap-6"
      @submit.prevent="onSubmit"
    >
      <div class="flex flex-col gap-2">
        <label class="text-xl font-medium" for="forgot-email"> Електронна адреса </label>
        <IconField>
          <InputIcon class="pi pi-at" />
          <InputText
            id="forgot-email"
            v-model="email"
            v-bind="emailAttrs"
            aria-describedby="forgot-email-help"
            class="w-full"
            :invalid="!!errors?.email"
            placeholder="Електронна адреса"
          />
        </IconField>
        <small v-if="errors?.email" id="forgot-email-help" class="text-red-500">
          {{ errors.email }}
        </small>
      </div>

      <Button icon="pi pi-send" label="Надіслати інструкції" type="submit" />

      <RouterLink
        class="text-primary-600 hover:text-primary-500 cursor-pointer text-center font-semibold"
        :to="{ name: 'signin' }"
      >
        Повернутися до входу
      </RouterLink>
    </form>
  </div>
</template>
