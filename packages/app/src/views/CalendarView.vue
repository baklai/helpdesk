<script setup>
import {
  createCalendar,
  createViewDay,
  createViewList,
  createViewMonthAgenda,
  createViewMonthGrid,
  createViewWeek,
  viewMonthGrid
} from '@schedule-x/calendar';
import { createCurrentTimePlugin } from '@schedule-x/current-time';
import { createEventModalPlugin } from '@schedule-x/event-modal';
import { createEventsServicePlugin } from '@schedule-x/events-service';
import { ScheduleXCalendar } from '@schedule-x/vue';
import { useQuery } from '@vue/apollo-composable';
import { Temporal } from 'temporal-polyfill';
import { computed, defineAsyncComponent, ref, watchEffect } from 'vue';

import '@schedule-x/theme-default/dist/index.css';
import 'temporal-polyfill/global';

import { EVENT_SCHEMA } from '@/constants/ui.const';
import { FIND_ALL_EVENTS } from '@/graphql/apollo.gql';
import { useConfigStore } from '@/stores/config.store';
import { dateTimeToEventStr } from '@/utils/DateMethods';

const EventModal = defineAsyncComponent(() => import('@/components/modals/EventModal.vue'));

const configStore = useConfigStore();

const refModal = ref();
const startDate = ref();
const endDate = ref();

const eventModal = createEventModalPlugin();
const calendarApp = createCalendar({
  locale: 'uk-UA',
  timezone: 'Europe/Kyiv',
  firstDayOfWeek: 1,
  defaultView: viewMonthGrid.name,
  selectedDate: Temporal.Now.plainDateISO(),
  isDark: configStore.isDarkAppTheme,
  dayBoundaries: {
    start: '00:00',
    end: '24:00'
  },
  weekOptions: {
    gridHeight: 2500,
    nDays: 7,
    eventWidth: 95,
    timeAxisFormatOptions: { hour: '2-digit', minute: '2-digit' },
    eventOverlap: true
  },
  monthGridOptions: {
    nEventsPerDay: 5
  },
  showWeekNumbers: false,
  isResponsive: true,
  skipValidation: true,
  views: [
    createViewDay(),
    createViewMonthAgenda(),
    createViewMonthGrid(),
    createViewWeek(),
    createViewList()
  ],
  calendars: EVENT_SCHEMA,
  events: [],
  callbacks: {
    async beforeRender($app) {
      const { start, end } = $app.calendarState.range.value;
      startDate.value = start.toPlainDateTime().toString();
      endDate.value = end.toPlainDateTime().toString();
    },
    async onRangeUpdate({ start, end }) {
      startDate.value = start.toPlainDateTime().toString();
      endDate.value = end.toPlainDateTime().toString();
    }
  },
  plugins: [
    eventModal,
    createEventsServicePlugin(),
    createCurrentTimePlugin({ fullWeekWidth: true })
  ]
});

const { result, refetch } = useQuery(
  FIND_ALL_EVENTS,
  () => ({ startDateTime: startDate.value, endDateTime: endDate.value }),
  () => ({ enabled: !!startDate.value && !!endDate.value, fetchPolicy: 'no-cache' })
);

const events = computed(() =>
  result.value?.events.map(event => ({
    id: event.id,
    title: event.title,
    description: event.description,
    location: event.location,
    people: event.participants,
    calendarId: event.eventType.toLowerCase(),
    start: Temporal.Instant.from(event.startDateTime).toZonedDateTimeISO('Europe/Kyiv'),
    end: Temporal.Instant.from(event.endDateTime).toZonedDateTimeISO('Europe/Kyiv')
  }))
);

const eventModalClick = id => {
  eventModal.close();
  refModal.value.toggle(id);
};

watchEffect(() => {
  calendarApp.setTheme(configStore.appThemeMode);
  calendarApp.eventsService.set(events.value ?? []);
});
</script>

<template>
  <div>
    <EventModal ref="refModal" @close="async () => await refetch()" />

    <div class="mb-2 flex flex-wrap justify-between">
      <div class="flex flex-wrap items-center gap-2">
        <i class="mr-2 hidden sm:block">
          <AppIcon :path="$route.meta.icon" :size="42" />
        </i>
        <div>
          <h3 class="text-2xl">
            {{ $route?.meta?.title }}
          </h3>
          <p class="text-surface-500 text-base">
            {{ $route?.meta?.description }}
          </p>
        </div>
      </div>

      <div class="flex w-full flex-wrap items-center justify-between gap-2 sm:w-max">
        <div class="flex w-full justify-between gap-2 sm:w-max">
          <Button
            v-tooltip.bottom="'Створити запис'"
            icon="pi pi-plus-circle"
            iconClass="text-2xl!"
            rounded
            severity="secondary"
            variant="text"
            @click="refModal.toggle()"
          />

          <Button
            v-tooltip.bottom="'Оновити записи'"
            icon="pi pi-sync"
            iconClass="text-2xl!"
            rounded
            severity="secondary"
            variant="text"
            @click="refetch()"
          />

          <Button
            v-tooltip.bottom="'Опції'"
            icon="pi pi-cog"
            iconClass="text-2xl!"
            rounded
            severity="secondary"
            variant="text"
          />
        </div>
      </div>
    </div>

    <div class="flex w-full">
      <ScheduleXCalendar :calendar-app="calendarApp">
        <template #eventModal="{ calendarEvent }">
          <div
            class="text-md flex w-full cursor-pointer flex-col gap-y-2 rounded-lg p-6"
            :data-calendar="calendarEvent.calendarId"
            @click="eventModalClick(calendarEvent.id)"
          >
            <div class="mb-4 ml-8 flex items-center gap-2 text-lg font-medium">
              <span>{{ calendarEvent.title }}</span>
            </div>

            <div class="flex items-center gap-4">
              <i class="pi pi-clock"></i>
              <span>
                {{ dateTimeToEventStr(calendarEvent?.start.toPlainDateTime().toString()) }} –
                {{ dateTimeToEventStr(calendarEvent?.end?.toPlainDateTime().toString()) }}
              </span>
            </div>

            <div v-if="calendarEvent.people" class="flex items-center gap-4">
              <i class="pi pi-users"></i>
              <span>{{ calendarEvent.people.join(', ') }}</span>
            </div>

            <div v-if="calendarEvent.location" class="flex items-center gap-4">
              <i class="pi pi-map-marker"></i>
              <span>{{ calendarEvent.location }}</span>
            </div>

            <div v-if="calendarEvent.description" class="flex items-center gap-4">
              <i class="pi pi-comment"></i>
              <span> {{ calendarEvent.description }} </span>
            </div>
          </div>
        </template>
      </ScheduleXCalendar>
    </div>
  </div>
</template>

<style scoped>
.sx-vue-calendar-wrapper {
  font-family: 'e-Ukraine', sans-serif;
  width: 100%;
  max-width: 100vw;
  height: 100vh;
  max-height: calc(100vh - 10rem);

  --sx-font-extra-small: 1.05rem;

  --sx-color-primary: var(--p-primary-color);
  --sx-color-on-primary: var(--p-primary-contrast-color);
  --sx-color-primary-container: var(--p-primary-100);
  --sx-color-on-primary-container: var(--p-primary-900);

  --sx-color-surface: var(--p-content-background);
  --sx-color-surface-dim: var(--p-surface-100);
  --sx-color-surface-bright: var(--p-content-background);
  --sx-color-on-surface: var(--p-content-color);

  --sx-color-background: var(--p-content-background);
  --sx-color-on-background: var(--p-content-color);

  --sx-color-outline: var(--p-content-border-color);
  --sx-color-outline-variant: var(--p-surface-200);

  --sx-internal-color-text: var(--p-content-color);
  --sx-internal-color-light-gray: var(--p-surface-50);

  [data-calendar='event'] {
    background-color: var(--sx-color-event-container);
    box-shadow: 0 0 20px 0 color-mix(in srgb, var(--sx-color-event-container) 60%, transparent);
    border-inline-start: 4px solid var(--sx-color-event);
    color: var(--sx-color-on-event-container);
  }
  [data-calendar='meeting'] {
    background-color: var(--sx-color-meeting-container);
    box-shadow: 0 0 20px 0 color-mix(in srgb, var(--sx-color-meeting-container) 60%, transparent);
    border-inline-start: 4px solid var(--sx-color-meeting);
    color: var(--sx-color-on-meeting-container);
  }
  [data-calendar='webinar'] {
    background-color: var(--sx-color-webinar-container);
    box-shadow: 0 0 20px 0 color-mix(in srgb, var(--sx-color-webinar-container) 60%, transparent);
    border-inline-start: 4px solid var(--sx-color-webinar);
    color: var(--sx-color-on-webinar-container);
  }
  [data-calendar='conference'] {
    background-color: var(--sx-color-conference-container);
    box-shadow: 0 0 20px 0 color-mix(in srgb, var(--sx-color-conference-container) 60%, transparent);
    border-inline-start: 4px solid var(--sx-color-conference);
    color: var(--sx-color-on-conference-container);
  }
  [data-calendar='workshop'] {
    background-color: var(--sx-color-workshop-container);
    box-shadow: 0 0 20px 0 color-mix(in srgb, var(--sx-color-workshop-container) 60%, transparent);
    border-inline-start: 4px solid var(--sx-color-workshop);
    color: var(--sx-color-on-workshop-container);
  }
  [data-calendar='holiday'] {
    background-color: var(--sx-color-holiday-container);
    box-shadow: 0 0 20px 0 color-mix(in srgb, var(--sx-color-holiday-container) 60%, transparent);
    border-inline-start: 4px solid var(--sx-color-holiday);
    color: var(--sx-color-on-holiday-container);
  }
  [data-calendar='entertainment'] {
    background-color: var(--sx-color-entertainment-container);
    box-shadow: 0 0 20px 0
      color-mix(in srgb, var(--sx-color-entertainment-container) 60%, transparent);
    border-inline-start: 4px solid var(--sx-color-entertainment);
    color: var(--sx-color-on-entertainment-container);
  }
  [data-calendar='lecture'] {
    background-color: var(--sx-color-lecture-container);
    box-shadow: 0 0 20px 0 color-mix(in srgb, var(--sx-color-lecture-container) 60%, transparent);
    border-inline-start: 4px solid var(--sx-color-lecture);
    color: var(--sx-color-on-lecture-container);
  }
  [data-calendar='other'] {
    background-color: var(--sx-color-other-container);
    box-shadow: 0 0 20px 0 color-mix(in srgb, var(--sx-color-other-container) 60%, transparent);
    border-inline-start: 4px solid var(--sx-color-other);
    color: var(--sx-color-on-other-container);
  }
}

:deep(.sx__event-modal) {
  background-color: transparent !important;
}

:deep(.sx__month-grid-day__events) {
  cursor: pointer;
}

:deep(.is-dark),
:deep(.sx-theme-dark) {
  --sx-color-primary: var(--p-primary-400);
  --sx-color-on-primary: var(--p-primary-950);
  --sx-color-primary-container: var(--p-primary-900);
  --sx-color-on-primary-container: var(--p-primary-100);

  --sx-color-surface: var(--p-surface-900);
  --sx-color-surface-dim: var(--p-surface-950);
  --sx-color-surface-bright: var(--p-surface-800);
  --sx-color-on-surface: var(--p-surface-0);

  --sx-color-surface-container: var(--p-surface-800);
  --sx-color-surface-container-low: var(--p-surface-900);
  --sx-color-surface-container-high: var(--p-surface-700);

  --sx-color-background: var(--p-surface-900);
  --sx-color-on-background: var(--p-surface-50);

  --sx-color-outline: var(--p-surface-600);
  --sx-color-outline-variant: var(--p-surface-700);
  --sx-border: 1px solid var(--p-surface-700);

  --sx-internal-color-text: var(--p-surface-50);
  --sx-internal-color-light-gray: var(--p-surface-800);
  --sx-internal-color-gray-ripple-background: var(--p-surface-700);
}
</style>
