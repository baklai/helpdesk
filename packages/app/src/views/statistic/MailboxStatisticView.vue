<script setup>
import {
  mdiAt,
  mdiEmailCheckOutline,
  mdiEmailLockOutline,
  mdiEmailRemoveOutline,
  mdiOfficeBuildingOutline
} from '@mdi/js';
import { useQuery } from '@vue/apollo-composable';
import { computed } from 'vue';

import { GET_STATISTIC_MAILBOX } from '@/graphql/apollo.gql';

const { result, loading } = useQuery(GET_STATISTIC_MAILBOX);

const mailbox = computed(() => result?.value?.mailbox);
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
        <div v-if="mailbox" class="h-full overflow-y-auto">
          <div class="flex flex-wrap content-start">
            <div class="w-full shrink-0 p-4 lg:w-2/4 xl:w-1/4">
              <StatCard
                :icon="mdiAt"
                label="Загальна кількість електронних скриньок"
                :value="mailbox.mailboxes"
              />
            </div>

            <div class="w-full shrink-0 p-4 lg:w-2/4 xl:w-1/4">
              <StatCard
                :icon="mdiEmailCheckOutline"
                label="Загальна кількість активних скриньок"
                :value="mailbox.mailboxesOpened"
              />
            </div>

            <div class="w-full shrink-0 p-4 lg:w-2/4 xl:w-1/4">
              <StatCard
                :icon="mdiEmailLockOutline"
                label="Загальна кількість заблокованих скриньок"
                :value="mailbox.mailboxesBlocked"
              />
            </div>

            <div class="w-full shrink-0 p-4 lg:w-2/4 xl:w-1/4">
              <StatCard
                :icon="mdiEmailRemoveOutline"
                label="Загальна кількість закритих скриньок"
                :value="mailbox.mailboxesClosed"
              />
            </div>
          </div>

          <div class="flex flex-wrap content-start">
            <div class="w-full shrink-0 p-4 lg:w-2/4 xl:w-1/2">
              <StatList
                v-if="mailbox.MailboxByOrganizations"
                :icon="mdiOfficeBuildingOutline"
                :items="mailbox.MailboxByOrganizations"
                label="Розподілення IP-адрес за організаціями"
                :totalCount="mailbox.mailboxes"
              />
            </div>

            <div class="w-full shrink-0 p-4 lg:w-2/4 xl:w-1/2">
              <StatList
                v-if="mailbox.MailboxBySubdivisions"
                :icon="mdiOfficeBuildingOutline"
                :items="mailbox.MailboxBySubdivisions"
                label="Розподілення IP-адрес за підрозділами"
                :totalCount="mailbox.mailboxes"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
