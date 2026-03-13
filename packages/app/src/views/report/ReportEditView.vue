<script setup>
import { useMutation, useQuery } from '@vue/apollo-composable';
import { useToast } from 'primevue/usetoast';
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { FIND_ONE_REPORT, GET_REPORT_COLLECTIONS, UPDATE_ONE_REPORT } from '@/graphql/apollo.gql';

const router = useRouter();
const route = useRoute();
const toast = useToast();

const { result: reportResult, loading: reportLoading } = useQuery(
  FIND_ONE_REPORT,
  { id: route.params.id },
  { fetchPolicy: 'no-cache' }
);

const { result: collectionsResult, loading: collectionsLoading } = useQuery(
  GET_REPORT_COLLECTIONS,
  null,
  { fetchPolicy: 'cache-first' }
);

const initialValues = computed(() => {
  const r = reportResult.value?.report;
  if (!r) return {};
  return {
    name: r.name,
    description: r.description,
    datacollection: r.datacollection,
    fields: r.fields,
    sorts: r.sorts,
    filters: r.filters
  };
});

const {
  mutate: update,
  onDone: onDoneUpdate,
  onError: onErrorUpdate
} = useMutation(UPDATE_ONE_REPORT, { fetchPolicy: 'no-cache' });

const handleSave = async data => {
  await update({ id: route.params.id, input: data });
};

const handleCancel = () => {
  router.back();
};

onDoneUpdate(() => {
  toast.add({
    severity: 'success',
    summary: 'Інформація',
    detail: 'Шаблон звіту оновлено',
    life: 5000
  });
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
          <h3 class="text-2xl font-normal">{{ $route?.meta?.title }}</h3>
          <p class="text-muted-color text-base font-normal">{{ $route?.meta?.description }}</p>
        </div>
      </div>
      <Button icon="pi pi-arrow-left" label="Назад" variant="outlined" @click="handleCancel" />
    </div>

    <Divider />

    <AppLoading v-if="reportLoading || collectionsLoading" />

    <ReportForm
      v-else
      :collections="collectionsResult?.collections || []"
      :initialValues="initialValues"
      :loading="reportLoading"
      @cancel="handleCancel"
      @submit="handleSave"
    />
  </div>
</template>
