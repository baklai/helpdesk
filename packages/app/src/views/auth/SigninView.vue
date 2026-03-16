<script setup>
import { useToast } from 'primevue/usetoast';
import { useForm } from 'vee-validate';
import { useRouter } from 'vue-router';
import * as yup from 'yup';

import { useAuthStore } from '@/stores/auth.store';

const SUBMIT_COUNT = 3;

const toast = useToast();
const router = useRouter();
const auth = useAuthStore();

const { values, errors, submitCount, handleSubmit, defineField } = useForm({
  validationSchema: yup.object({
    email: yup
      .string()
      .email('Електронна адреса має бути дійсною')
      .required('Потрібно вказати значення'),
    password: yup
      .string()
      .min(8, 'Пароль має бути не менше 8 символів')
      .required('Потрібно вказати значення')
  }),
  initialValues: {
    remember: JSON.parse(localStorage.getItem('app-auth-remember')) || false
  }
});

const [email, emailAttrs] = defineField('email');
const [password, passwordAttrs] = defineField('password');
const [remember, rememberAttrs] = defineField('remember');

const onSignin = handleSubmit(async values => {
  try {
    await auth.signin(values);

    toast.add({
      severity: 'success',
      summary: 'Інформація',
      detail: 'Авторизація пройшла успішно',
      life: 3000
    });

    router.push({ name: 'home' });
  } catch (err) {
    toast.add({
      severity: 'warn',
      summary: 'Попередження',
      detail: err.message,
      life: 3000
    });
  }
});

const onChangeRemember = () => {
  localStorage.setItem('app-auth-remember', values.remember);
};
</script>

<template>
  <div class="flex w-full max-w-100 flex-col">
    <div class="mb-8 flex flex-col items-center text-center">
      <p class="text-surface-900 dark:text-surface-0 mb-2 text-3xl font-semibold">Вхід у додаток</p>
      <p class="text-surface-500 text-sm">Увійдіть у додаток, щоб продовжити</p>
    </div>

    <form v-autocomplete-off class="flex flex-col justify-center gap-6" @submit.prevent="onSignin">
      <div class="flex flex-col gap-2">
        <label class="text-xl font-medium" for="email"> Електронна адреса </label>
        <IconField>
          <InputIcon class="pi pi-at" />
          <InputText
            id="email"
            v-model="email"
            v-bind="emailAttrs"
            aria-describedby="email-help"
            class="w-full"
            :invalid="!!errors?.email"
            placeholder="Електронна адреса"
          />
        </IconField>
        <small v-if="errors?.email" id="email-help" class="text-red-500">
          {{ errors.email }}
        </small>
      </div>

      <div class="flex flex-col gap-2">
        <label class="text-xl font-medium" for="password"> Пароль користувача </label>
        <IconField>
          <InputIcon class="pi pi-lock z-10" />
          <Password
            v-model="password"
            v-bind="passwordAttrs"
            aria-describedby="password-help"
            fluid
            inputClass="pl-10!"
            inputId="password"
            :invalid="!!errors?.password"
            mediumLabel="Середня складність"
            placeholder="Пароль користувача"
            promptLabel="Оберіть пароль"
            strongLabel="Складний пароль"
            toggleMask
            weakLabel="Занадто простий"
          >
            <template #header>
              <h6>Поточний пароль</h6>
            </template>
            <template #footer>
              <Divider />
              <p class="mt-2">Рекомендації:</p>
              <ul class="mt-0 ml-2 list-disc pl-2 leading-normal">
                <li>Принаймні одна маленька літера</li>
                <li>Принаймні одна велика літера</li>
                <li>Принаймні одна цифра</li>
                <li>Мінімум 8 символів</li>
              </ul>
            </template>
          </Password>
        </IconField>
        <small v-if="errors?.password" id="password-help" class="text-red-500">
          {{ errors.password }}
        </small>
      </div>

      <div class="mb-4 flex flex-col gap-2">
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <Checkbox
              v-model="remember"
              binary
              v-bind="rememberAttrs"
              class="mr-2"
              inputId="remember"
              @change="onChangeRemember"
            />
            <label class="text-surface-950 dark:text-surface-50" for="remember">
              Запам'ятати мене
            </label>
          </div>

          <RouterLink
            class="text-primary-600 hover:text-primary-500 cursor-pointer font-semibold"
            :to="{ name: 'forgot-password' }"
          >
            Забули пароль?
          </RouterLink>
        </div>
      </div>

      <div class="flex flex-col gap-2">
        <Button
          :disabled="submitCount > SUBMIT_COUNT"
          icon="pi pi-sign-in"
          label="Увійти"
          type="submit"
        />
        <small
          v-if="submitCount > SUBMIT_COUNT"
          id="submit-help"
          class="block w-full text-center text-red-500"
        >
          Ви надсилали занадто багато разів
        </small>
      </div>

      <p class="text-surface-500 text-center text-sm">Увійдіть, або зареєструйтеся у додатоку</p>

      <RouterLink
        class="text-primary-600 hover:text-primary-500 cursor-pointer text-center font-semibold"
        :to="{ name: 'signup' }"
      >
        Зареєструватися
      </RouterLink>
    </form>
  </div>
</template>
