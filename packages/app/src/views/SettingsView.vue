<script setup>
import { useToast } from 'primevue/usetoast';
import { useForm } from 'vee-validate';
import { ref } from 'vue';
import * as yup from 'yup';

import { useSysConfStore } from '@/stores/sysconf.store';

const toast = useToast();
const sysConfStore = useSysConfStore();

const loading = ref(false);

const { values } = useForm({
  validationSchema: yup.object({
    enterprise: yup.string(),
    department: yup.string(),
    copyright: yup.string(),
    filestorage: yup.string(),
    systemadmin: yup.string(),
    systemphone: yup.string(),
    systememail: yup.string().email('Електронна адреса має бути дійсною')
  }),
  initialValues: {
    enterprise: sysConfStore?.options?.enterprise || '',
    department: sysConfStore?.options?.department || '',
    copyright:
      sysConfStore?.options?.copyright ||
      `Авторські права © ${new Date().getFullYear()}. Всі права захищені.`,
    filestorage: sysConfStore?.options?.filestorage || '',
    systemadmin: sysConfStore?.options?.systemadmin || '',
    systemphone: sysConfStore?.options?.systemphone || '',
    systememail: sysConfStore?.options?.systememail || ''
  }
});

const handleUpdate = async key => {
  try {
    loading.value = true;

    await sysConfStore.upsert({ key, value: values[key] });

    toast.add({
      severity: 'success',
      summary: 'Інформація',
      detail: 'Конфінурацію оновлено',
      life: 5000
    });
  } catch {
    toast.add({
      severity: 'warn',
      summary: 'Попередження',
      detail: 'Конфінурацію не оновлено',
      life: 5000
    });
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="h-full w-full">
    <div class="mb-6 flex content-center">
      <div class="mr-2 flex items-center justify-center">
        <AppIcon :path="$route.meta.icon" :size="40" />
      </div>
      <div>
        <h3 class="text-2xl">
          {{ $route?.meta?.title }}
        </h3>
        <p class="text-surface-500 text-base">
          {{ $route?.meta?.description }}
        </p>
      </div>
    </div>

    <div class="flex w-full flex-col justify-between">
      <Accordion class="w-full">
        <AccordionPanel class="my-4" value="0">
          <AccordionHeader class="bg-surface-100 dark:bg-surface-800">
            <div class="flex w-full items-center">
              <Avatar class="mr-4" icon="pi pi-home" size="large" />
              <div>
                <p class="font-bold whitespace-nowrap uppercase">Загальні параметри</p>
                <p class="text-muted-color text-sm font-light">
                  Персоналізація сервісу, дані які будуть відображатися у візуальній частині додатку
                </p>
              </div>
            </div>
          </AccordionHeader>

          <AccordionContent>
            <div class="flex w-full flex-col gap-y-4 p-4">
              <SysConfField
                description="Назва підприємства"
                label="Назва підприємства"
                :loading="loading"
                name="enterprise"
                placeholder="Вкажіть назву підприємства"
                @save="handleUpdate"
              />

              <SysConfField
                description="Назва відділу"
                label="Назва відділу"
                :loading="loading"
                name="department"
                placeholder="Вкажіть назву відділу"
                @save="handleUpdate"
              />

              <SysConfField
                description="Авторські права"
                label="Авторські права"
                :loading="loading"
                name="copyright"
                placeholder="Вкажіть aвторські права"
                @save="handleUpdate"
              />
            </div>
          </AccordionContent>
        </AccordionPanel>

        <AccordionPanel class="my-4" value="1">
          <AccordionHeader class="bg-surface-100 dark:bg-surface-800">
            <div class="flex w-full items-center">
              <Avatar class="mr-4" icon="pi pi-user" size="large" />
              <div>
                <p class="font-bold whitespace-nowrap uppercase">Адміністратор системи</p>
                <p class="text-muted-color text-sm font-light">
                  Адміністратор системи, дані які будуть відображатися у візуальній частині додатку
                </p>
              </div>
            </div>
          </AccordionHeader>

          <AccordionContent>
            <div class="flex w-full flex-col gap-y-4 p-4">
              <SysConfField
                description="Прізвище та ім'я адміністратора системи"
                label="Прізвище та ім'я"
                :loading="loading"
                name="systemadmin"
                placeholder="Вкажіть прізвище та ім'я"
                @save="handleUpdate"
              />

              <SysConfField
                description="Контактний номер телефону адміністратора системи"
                label="Номер телефону"
                :loading="loading"
                name="systemphone"
                placeholder="Вкажіть номер телефону"
                @save="handleUpdate"
              />

              <SysConfField
                description="Контактна електронна пошта адміністратора системи"
                label="Електронна пошта"
                :loading="loading"
                name="systememail"
                placeholder="Вкажіть електронну пошту"
                @save="handleUpdate"
              />
            </div>
          </AccordionContent>
        </AccordionPanel>

        <AccordionPanel class="my-4" value="2">
          <AccordionHeader class="bg-surface-100 dark:bg-surface-800">
            <div class="flex w-full items-center">
              <Avatar class="mr-4" icon="pi pi-arrow-right-arrow-left" size="large" />
              <div>
                <p class="font-bold whitespace-nowrap uppercase">Пов'язані ресурси</p>
                <p class="text-muted-color text-sm font-light">
                  Пов'язані ресурси, які будуть відображатися у візуальній частині додатку
                </p>
              </div>
            </div>
          </AccordionHeader>

          <AccordionContent>
            <div class="flex w-full flex-col gap-y-4 p-4">
              <SysConfField
                description="Посилання на файлове сховище системи"
                label="Файлове сховище"
                :loading="loading"
                name="filestorage"
                placeholder="Вкажіть адресу посилання"
                @save="handleUpdate"
              />
            </div>
          </AccordionContent>
        </AccordionPanel>
      </Accordion>
    </div>
  </div>
</template>
