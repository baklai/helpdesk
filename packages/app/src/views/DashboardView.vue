<script setup>
import {
  mdiAccountMultipleOutline,
  mdiAt,
  mdiBadgeAccountHorizontalOutline,
  mdiBookOpenOutline,
  mdiDevices,
  mdiIpNetworkOutline,
  mdiMapMarkerOutline,
  mdiMonitorDashboard,
  mdiOfficeBuildingOutline
} from '@mdi/js';
import { useQuery } from '@vue/apollo-composable';
import { computed, onMounted, ref } from 'vue';

import { GET_DASHBOARD_STATISTIC } from '@/graphql/apollo.gql';
import { dateToStr } from '@/utils/DateMethods';

const { result, loading } = useQuery(GET_DASHBOARD_STATISTIC);

const currentDate = ref();

const chartDataActivityOptions = ref({
  plugins: {
    legend: {
      display: false
    }
  }
});

const chartDataActivityUsersOptions = ref({
  maintainAspectRatio: false,
  aspectRatio: 0.8,
  plugins: {
    legend: {
      display: false
    }
  },
  scales: {
    x: {
      stacked: true
    },
    y: {
      stacked: true
    }
  }
});

const stats = computed(() => result.value?.dashboard || {});

const chartDataActivity = computed(() => {
  return {
    labels: stats.value?.activityAPI?.map(({ date }) => dateToStr(date)),
    datasets: [
      {
        label: 'API',
        fill: true,
        tension: 0.4,
        color: '#666',
        borderColor: 'rgb(34,197,94,0.5)',
        backgroundColor: 'rgba(34,197,94,0.2)',
        data: stats.value?.activityAPI?.map(({ count }) => count)
      }
    ]
  };
});

const chartDataActivityUsers = computed(() => {
  return {
    labels: stats.value?.activityUsers?.map(({ user }) => user),
    datasets: [
      {
        type: 'bar',
        label: 'METHOD',
        fill: true,
        tension: 0.4,
        color: '#666',
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgb(59, 130, 246, 0.5)',
        data: stats.value?.activityUsers?.map(({ count }) => count)
      }
    ]
  };
});

onMounted(async () => {
  currentDate.value = dateToStr(Date.now());
});
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

    <div v-else class="flex flex-wrap content-start overflow-y-auto">
      <div class="w-full p-4 xl:w-2/4">
        <div
          class="border-surface-300 bg-surface-50 dark:border-surface-600 dark:bg-surface-800 mb-0 rounded-lg border p-6"
        >
          <h5 class="text-center text-xl font-bold">Активність API за поточний місяць</h5>
          <Chart
            class="h-120"
            :data="chartDataActivity"
            :options="chartDataActivityOptions"
            type="line"
          />
        </div>
      </div>

      <div class="w-full p-4 xl:w-2/4">
        <div
          class="border-surface-300 bg-surface-50 dark:border-surface-600 dark:bg-surface-800 mb-0 rounded-lg border p-6"
        >
          <h5 class="text-center text-xl font-bold">Активність користувачів за поточний тиждень</h5>
          <Chart
            class="h-120"
            :data="chartDataActivityUsers"
            :options="chartDataActivityUsersOptions"
            type="bar"
          />
        </div>
      </div>

      <div class="w-full shrink-0 p-4 lg:w-2/4 xl:w-1/4">
        <StatCard
          :icon="mdiAccountMultipleOutline"
          label="Загальна кількість користувачів"
          :value="stats.users"
        />
      </div>

      <div class="w-full shrink-0 p-4 lg:w-2/4 xl:w-1/4">
        <StatCard
          :icon="mdiIpNetworkOutline"
          label="Загальна кількість IP-адрес"
          :value="stats.ipaddress"
        />
      </div>

      <div class="w-full shrink-0 p-4 lg:w-2/4 xl:w-1/4">
        <StatCard
          :icon="mdiAt"
          label="Загальна кількість поштових скриньок"
          :value="stats.mailboxes"
        />
      </div>

      <div class="w-full shrink-0 p-4 lg:w-2/4 xl:w-1/4">
        <StatCard
          :icon="mdiBookOpenOutline"
          label="Загальна кількість заявок"
          :value="stats.requests"
        />
      </div>

      <div class="w-full shrink-0 p-4 lg:w-2/4 xl:w-1/4">
        <StatCard
          :icon="mdiMonitorDashboard"
          label="Загальна кількість ПК SysInspector"
          :value="stats.inspectors"
        />
      </div>

      <div class="w-full shrink-0 p-4 lg:w-2/4 xl:w-1/4">
        <StatCard :icon="mdiDevices" label="Загальна кількість пристроїв" :value="stats.devices" />
      </div>

      <div class="w-full shrink-0 p-4 lg:w-2/4 xl:w-1/4">
        <StatCard
          :icon="mdiMapMarkerOutline"
          label="Загальна кількість локацій"
          :value="stats.locations"
        />
      </div>

      <div class="w-full shrink-0 p-4 lg:w-2/4 xl:w-1/4">
        <StatCard
          :icon="mdiBadgeAccountHorizontalOutline"
          label="Загальна кількість посад"
          :value="stats.positions"
        />
      </div>

      <div class="w-full shrink-0 p-4 lg:w-2/4 xl:w-1/4">
        <StatCard
          :icon="mdiOfficeBuildingOutline"
          label="Загальна кількість організацій"
          :value="stats.organizations"
        />
      </div>

      <div class="w-full shrink-0 p-4 lg:w-2/4 xl:w-1/4">
        <StatCard
          :icon="mdiOfficeBuildingOutline"
          label="Загальна кількість підрозділів"
          :value="stats.subdivisions"
        />
      </div>

      <div class="w-full shrink-0 p-4 lg:w-2/4 xl:w-1/4">
        <StatCard
          :icon="mdiOfficeBuildingOutline"
          label="Загальна кількість відділів"
          :value="stats.departments"
        />
      </div>
    </div>
  </div>
</template>
