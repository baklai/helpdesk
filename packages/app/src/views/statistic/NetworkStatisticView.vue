<script setup>
import {
  mdiDevices,
  mdiIpNetworkOutline,
  mdiLanConnect,
  mdiMapMarkerOutline,
  mdiOfficeBuildingOutline,
  mdiSwapHorizontal,
  mdiWeb
} from '@mdi/js';
import { useQuery } from '@vue/apollo-composable';
import { computed } from 'vue';

import { GET_STATISTIC_NETWORK } from '@/graphql/apollo.gql';

const { result, loading } = useQuery(GET_STATISTIC_NETWORK);

const network = computed(() => result?.value?.network);
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
        <div v-if="network" class="h-full overflow-y-auto">
          <div class="flex flex-wrap content-start">
            <div class="w-full shrink-0 p-4 lg:w-2/4 xl:w-1/4">
              <StatCard
                :icon="mdiIpNetworkOutline"
                label="Загальна кількість IP-адрес"
                :value="network.ipaddresses"
              />
            </div>

            <div class="w-full shrink-0 p-4 lg:w-2/4 xl:w-1/4">
              <StatCard
                :icon="mdiLanConnect"
                label="Загальна мережевих каналів"
                :value="network.channels"
              />
            </div>

            <div class="w-full shrink-0 p-4 lg:w-2/4 xl:w-1/4">
              <StatCard
                :icon="mdiWeb"
                label="Загальна кількість Інтернетів"
                :value="network.internets"
              />
            </div>

            <div class="w-full shrink-0 p-4 lg:w-2/4 xl:w-1/4">
              <StatCard
                :icon="mdiSwapHorizontal"
                label="Загальна кількість автовідповідей"
                :value="network.autoanswers"
              />
            </div>
          </div>

          <div class="flex flex-wrap content-start">
            <div class="w-full shrink-0 p-4 lg:w-2/4 xl:w-1/2">
              <StatList
                v-if="network.IPByDevices"
                :icon="mdiDevices"
                :items="network.IPByDevices"
                label="Розподілення IP-адрес за пристроями"
                :totalCount="network.ipaddresses"
              />
            </div>

            <div class="w-full shrink-0 p-4 lg:w-2/4 xl:w-1/2">
              <StatList
                v-if="network.IPByLocations"
                :icon="mdiMapMarkerOutline"
                :items="network.IPByLocations"
                label="Розподілення IP-адрес за локаціями"
                :totalCount="network.ipaddresses"
              />
            </div>

            <div class="w-full shrink-0 p-4 lg:w-2/4 xl:w-1/2">
              <StatList
                v-if="network.IPByOrganizations"
                :icon="mdiOfficeBuildingOutline"
                :items="network.IPByOrganizations"
                label="Розподілення IP-адрес за організаціями"
                :totalCount="network.ipaddresses"
              />
            </div>

            <div class="w-full shrink-0 p-4 lg:w-2/4 xl:w-1/2">
              <StatList
                v-if="network.IPBySubdivisions"
                :icon="mdiOfficeBuildingOutline"
                :items="network.IPBySubdivisions"
                label="Розподілення IP-адрес за підрозділами"
                :totalCount="network.ipaddresses"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
