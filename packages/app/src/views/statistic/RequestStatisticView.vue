<script setup>
import {
  mdiBookOpenOutline,
  mdiChartBarStacked,
  mdiCheckCircleOutline,
  mdiFolderOpenOutline
} from '@mdi/js';
import { useQuery } from '@vue/apollo-composable';
import { computed, ref } from 'vue';

import { DAYS_OF_WEEK, MONTHS_OF_YEAR } from '@/constants/ui.const';
import { GET_STATISTIC_REQUEST } from '@/graphql/apollo.gql';

const { result, loading } = useQuery(GET_STATISTIC_REQUEST);

const chartOptions = ref({
  plugins: {
    legend: {
      display: false
    }
  }
});

const request = computed(() => result?.value?.request);

const yearChartData = computed(() => ({
  labels: MONTHS_OF_YEAR.map(month => month.label),
  datasets: [
    {
      label: 'Кількість запитів',
      data: MONTHS_OF_YEAR.map(
        month => result.value?.request?.yearchar?.find(item => item.month === month.key)?.count || 0
      )
    }
  ]
}));

const monthChartData = computed(() => ({
  labels: result.value?.request?.monthchar?.map(item => item.date),
  datasets: [
    {
      label: 'Кількість запитів',
      data: result.value?.request?.monthchar?.map(item => item.count)
    }
  ]
}));

const weekChartData = computed(() => ({
  labels: DAYS_OF_WEEK.map(week => week.label),
  datasets: [
    {
      label: 'Кількість запитів',
      data: DAYS_OF_WEEK.map(
        day => result.value?.request?.weekchar?.find(item => item.day - 1 === day.key)?.count || 0
      )
    }
  ]
}));
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
        <div v-if="request" class="flex h-full flex-wrap overflow-y-auto">
          <div class="flex w-full shrink-0 flex-col gap-y-4 p-4 lg:w-2/4 xl:w-1/3">
            <StatCard
              :icon="mdiBookOpenOutline"
              label="Загальна кількість запитів"
              :value="request?.requests"
            />

            <StatCard
              :icon="mdiCheckCircleOutline"
              label="Загальна кількість закритих запитів"
              :value="request?.closed"
            />

            <StatCard
              :icon="mdiFolderOpenOutline"
              label="Загальна кількість відкритих запитів"
              :value="request?.opened"
            />
          </div>

          <div class="w-full shrink-0 p-4 lg:w-2/4 xl:w-2/3">
            <div
              class="border-surface-300 bg-surface-50 dark:border-surface-600 dark:bg-surface-800 rounded-lg border p-6"
            >
              <div class="text-muted-color mb-6 flex items-center justify-start gap-2">
                <i class="mr-2">
                  <AppIcon :path="mdiChartBarStacked" :size="24" />
                </i>
                <h5 class="font-bold">Запити за поточний тиждень</h5>
              </div>
              <Chart class="w-full" :data="weekChartData" :options="chartOptions" type="bar" />
            </div>
          </div>

          <div class="w-full shrink-0 p-4">
            <div
              class="border-surface-300 bg-surface-50 dark:border-surface-600 dark:bg-surface-800 rounded-lg border p-6"
            >
              <div class="text-muted-color mb-6 flex items-center justify-start gap-2">
                <i class="mr-2">
                  <AppIcon :path="mdiChartBarStacked" :size="24" />
                </i>
                <h5 class="font-bold">Запити за поточний місяць</h5>
              </div>
              <Chart class="w-full" :data="monthChartData" :options="chartOptions" type="bar" />
            </div>
          </div>

          <div class="w-full shrink-0 p-4">
            <div
              class="border-surface-300 bg-surface-50 dark:border-surface-600 dark:bg-surface-800 rounded-lg border p-6"
            >
              <div class="text-muted-color mb-6 flex items-center justify-start gap-2">
                <i class="mr-2">
                  <AppIcon :path="mdiChartBarStacked" :size="24" />
                </i>
                <h5 class="font-bold">Запити за поточний рік</h5>
              </div>
              <Chart class="w-full" :data="yearChartData" :options="chartOptions" type="bar" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
