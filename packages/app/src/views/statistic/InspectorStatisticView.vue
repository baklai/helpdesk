<script setup>
import { mdiMonitorDashboard } from '@mdi/js';
import { useQuery } from '@vue/apollo-composable';
import { computed } from 'vue';

import { GET_STATISTIC_INSPECTOR } from '@/graphql/apollo.gql';

const { result, loading } = useQuery(GET_STATISTIC_INSPECTOR);

const inspector = computed(() => result?.value?.inspector);
</script>

<template>
  <div class="flex h-full w-full flex-col overflow-hidden">
    <div class="mb-6 flex items-center">
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

    <AppLoading v-if="loading" />

    <div v-else class="flex min-h-0 flex-1 flex-col">
      <div class="flex h-full flex-col overflow-y-auto px-0!">
        <div v-if="inspector" class="h-full overflow-y-auto">
          <div class="flex flex-wrap">
            <div class="w-full p-4 lg:w-1/2">
              <div class="mb-6 flex w-full flex-row gap-4">
                <StatCard
                  class="w-full lg:w-1/2"
                  :icon="mdiMonitorDashboard"
                  label="Загальна кількість звітів"
                  :value="inspector.count"
                />

                <StatCard
                  class="w-full lg:w-1/2"
                  :icon="mdiMonitorDashboard"
                  label="Загальна кількість звітів"
                  :value="inspector.count"
                />
              </div>

              <StatList
                v-if="inspector.inspectorByDays"
                class="h-140"
                :icon="mdiMonitorDashboard"
                :items="
                  inspector.inspectorByDays.map(item => {
                    return { name: `${item.days} днів`, count: item.count };
                  })
                "
                label="Розподілення звітів за часом"
                :totalCount="inspector.count"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
