<script setup>
import { useToast } from 'primevue/usetoast';
import { useForm } from 'vee-validate';
import { ref } from 'vue';
import * as yup from 'yup';

import { useAuthStore } from '@/stores/auth.store';

const toast = useToast();

const auth = useAuthStore();

const isSubmitSingup = ref(false);

const { errors, handleSubmit, defineField } = useForm({
  validationSchema: yup.object({
    email: yup
      .string()
      .email('Електронна адреса має бути дійсною')
      .required('Потрібно вказати значення'),
    fullname: yup.string().required('Потрібно вказати значення'),
    password: yup
      .string()
      .min(8, 'Пароль має бути не менше 8 символів')
      .required('Потрібно вказати значення'),
    phone: yup.string().required('Потрібно вказати значення')
  }),
  initialValues: {}
});

const [email, emailAttrs] = defineField('email');
const [fullname, fullnameAttrs] = defineField('fullname');
const [password, passwordAttrs] = defineField('password');
const [phone, phoneAttrs] = defineField('phone');

const onSignup = handleSubmit(async values => {
  try {
    await auth.signup(values);
    isSubmitSingup.value = true;
    toast.add({
      severity: 'success',
      summary: 'Інформація',
      detail: 'Ваш обліковий запис зареєстровано',
      life: 5000
    });
  } catch (err) {
    isSubmitSingup.value = false;
    toast.add({
      severity: 'warn',
      summary: 'Попередження',
      detail: err.message,
      life: 5000
    });
  }
});
</script>

<template>
  <div class="flex w-full max-w-100 flex-col">
    <div class="mb-8 flex flex-col items-center text-center">
      <p class="text-surface-900 dark:text-surface-0 mb-2 text-3xl font-semibold">Реєстрація</p>
      <p class="text-surface-500 text-sm">Зареєструватися у додатоку, щоб продовжити</p>
    </div>

    <form
      v-if="!isSubmitSingup"
      v-autocomplete-off
      class="flex w-100 flex-col justify-center gap-4"
      @submit.prevent="onSignup"
    >
      <div class="flex flex-col gap-2">
        <label class="text-lg font-medium" for="fullname"> Прізвище та ім'я </label>
        <IconField>
          <InputIcon class="pi pi-user" />
          <InputText
            id="fullname"
            v-model="fullname"
            v-bind="fullnameAttrs"
            aria-describedby="fullname-help"
            class="w-full pl-10 text-xl"
            :invalid="!!errors?.fullname"
            placeholder="Прізвище та ім'я"
          />
        </IconField>
        <small v-if="errors?.fullname" id="fullname-help" class="text-red-500">
          {{ errors.fullname }}
        </small>
      </div>

      <div class="flex flex-col gap-2">
        <label class="text-lg font-medium" for="email"> Електронна адреса </label>
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
        <label class="block font-medium" for="password"> Пароль користувача </label>
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
        <label class="text-lg font-medium" for="phone"> Номер телефону </label>
        <IconField>
          <InputIcon class="pi pi-phone" />
          <InputMask
            id="phone"
            v-model="phone"
            v-bind="phoneAttrs"
            aria-describedby="phone-help"
            class="w-full pl-10"
            date="phone"
            :invalid="!!errors?.phone"
            mask="+99(999)999-99-99"
            placeholder="Номер телефону"
          />
        </IconField>
        <small v-if="errors?.phone" id="phone-help" class="text-red-500">
          {{ errors.phone }}
        </small>
      </div>

      <Button icon="pi pi-user-plus" label="Зареєструватися" type="submit" />

      <p class="text-surface-500 text-center text-sm">Зареєструйтесь, або війдіть у додаток</p>

      <RouterLink
        class="text-primary-600 hover:text-primary-500 cursor-pointer text-center font-semibold"
        :to="{ name: 'signin' }"
      >
        Увійти в додаток
      </RouterLink>
    </form>
  </div>
</template>
