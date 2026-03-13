<script setup>
import { useMutation } from '@vue/apollo-composable';
import { useToast } from 'primevue/usetoast';
import { useRouter } from 'vue-router';

import { CREATE_ONE_CHANNEL } from '@/graphql/apollo.gql';

const router = useRouter();
const toast = useToast();

const {
  mutate: create,
  onDone: onDoneCreate,
  onError: onErrorCreate
} = useMutation(CREATE_ONE_CHANNEL, {
  fetchPolicy: 'no-cache'
});

const handleSave = async data => {
  await create({ input: data });
};

const handleCancel = async () => {
  router.back();
};

onDoneCreate(() => {
  toast.add({ severity: 'success', summary: 'Інформація', detail: 'Запис створено', life: 5000 });

  router.back();
});

onErrorCreate(({ graphQLErrors }) => {
  graphQLErrors.forEach(error => {
    toast.add({ severity: 'warn', summary: 'Попередження', detail: error.message, life: 5000 });
  });
});
</script>

<template>
  <div class="flex w-full flex-col" style="height: calc(100vh - 5rem)">
    <div class="flex flex-row items-center justify-between">
      <div class="flex flex-wrap items-center gap-1">
        <i class="mr-2">
          <AppIcon :path="$route.meta.icon" :size="40" />
        </i>
        <div class="flex flex-col">
          <h3 class="text-surface-900 dark:text-surface-50 text-2xl font-normal">
            {{ $route?.meta?.title }}
          </h3>
          <p class="text-surface-500 text-base font-normal">
            {{ $route?.meta?.description }}
          </p>
        </div>
      </div>

      <Button icon="pi pi-arrow-left" label="Назад" variant="outlined" @click="handleCancel" />
    </div>

    <Divider />

    <ChannelForm @cancel="handleCancel" @submit="handleSave" />
  </div>
</template>
