<script setup>
import { useMutation, useQuery } from '@vue/apollo-composable';
import { useToast } from 'primevue/usetoast';
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import AppLoading from '@/components/AppLoading.vue';
import { FIND_ONE_USER, UPDATE_ONE_USER } from '@/graphql/apollo.gql.js';
import { useScopeStore } from '@/stores/scopes.store';
import { decodeScopeToList } from '@/utils/ScopeMethods';

const router = useRouter();
const route = useRoute();
const toast = useToast();

const { getCustomScope } = useScopeStore();

const { result, loading } = useQuery(
  FIND_ONE_USER,
  { id: route.params.id },
  { fetchPolicy: 'no-cache' }
);

const initialValues = computed(() => {
  const user = result.value?.user;
  if (!user) return undefined;
  return {
    fullname: user.fullname,
    email: user.email,
    phone: user.phone,
    status: user.status,
    role: user.role,
    scope: getCustomScope(decodeScopeToList(user.scope))
  };
});

const {
  mutate: update,
  onDone: onDoneUpdate,
  onError: onErrorUpdate
} = useMutation(UPDATE_ONE_USER, {
  fetchPolicy: 'no-cache'
});

const handleSave = async data => {
  await update({ id: route.params.id, input: data });
};

const handleCancel = () => router.back();

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
      <div class="flex flex-wrap items-center gap-x-2">
        <AppIcon :path="$route.meta.icon" :size="42" />
        <div class="flex flex-col">
          <h3 class="text-2xl font-normal">
            {{ $route?.meta?.title }}
          </h3>
          <p class="text-muted-color text-base font-normal">
            {{ $route?.meta?.description }}
          </p>
        </div>
      </div>

      <Button icon="pi pi-arrow-left" label="Назад" variant="outlined" @click="handleCancel" />
    </div>

    <Divider />

    <AppLoading v-if="loading" />

    <UserForm
      v-if="!loading"
      :initialValues="initialValues"
      @cancel="handleCancel"
      @submit="handleSave"
    />
  </div>
</template>
