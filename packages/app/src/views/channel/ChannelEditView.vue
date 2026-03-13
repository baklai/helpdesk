<script setup>
import { useMutation, useQuery } from '@vue/apollo-composable';
import { useToast } from 'primevue/usetoast';
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import AppLoading from '@/components/AppLoading.vue';
import { FIND_ONE_CHANNEL, UPDATE_ONE_CHANNEL } from '@/graphql/apollo.gql';

const router = useRouter();
const route = useRoute();
const toast = useToast();

const { result, loading } = useQuery(FIND_ONE_CHANNEL, {
  id: route.params.id
});

const initialValues = computed(() => result.value?.channel);

const {
  mutate: update,
  onDone: onDoneUpdate,
  onError: onErrorUpdate
} = useMutation(UPDATE_ONE_CHANNEL, {
  fetchPolicy: 'no-cache'
});

const handleSave = async data => {
  await update({ id: route.params.id, input: data });
};

const handleCancel = async () => {
  router.back();
};

onDoneUpdate(() => {
  toast.add({ severity: 'success', summary: 'Інформація', detail: 'Запис оновлено', life: 5000 });

  router.back();
});

onErrorUpdate(({ graphQLErrors }) => {
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

    <AppLoading v-if="loading" />

    <ChannelForm
      v-if="!loading"
      :initialValues="initialValues"
      @cancel="handleCancel"
      @submit="handleSave"
    />
  </div>
</template>
