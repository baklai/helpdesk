import { DefaultApolloClient } from '@vue/apollo-composable';
import { createPinia } from 'pinia';
import { createApp } from 'vue';

import App from './App.vue';
import router from './router';

import { definePreset } from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';
import PrimeVue from 'primevue/config';
import ConfirmationService from 'primevue/confirmationservice';
import DialogService from 'primevue/dialogservice';
import ToastService from 'primevue/toastservice';
import Tooltip from 'primevue/tooltip';

import {
  PRIMEVUE_LOCALE_uk_UA,
  SEMANTIC_COLOR_SCHEMA_DARK,
  SEMANTIC_COLOR_SCHEMA_LIGHT,
  SEMANTIC_PRIMARY
} from '@/constants/theme.colors';
import { vAutocompleteOff } from '@/directives/autocomplete-off.directive';
import { apolloClient } from '@/graphql/apollo.client';
import HelpdeskPlugin from '@/plugins/helpdesk.plugin';
import { useAuthStore } from '@/stores/auth.store';
import { useConfigStore } from '@/stores/config.store';

import '@/assets/base.css';
import '@/assets/fonts.css';
import 'primeicons/primeicons.css';

async function bootstrap() {
  const configStore = useConfigStore();
  const authStore = useAuthStore();
  try {
    configStore.initAppConfigs();
    await authStore.me();
  } catch {
    authStore.clear();
  }
}

const app = createApp(App);

app.use(router);
app.use(createPinia());

app.use(PrimeVue, {
  theme: {
    preset: definePreset(Aura, {
      semantic: {
        primary: SEMANTIC_PRIMARY,
        colorScheme: {
          light: SEMANTIC_COLOR_SCHEMA_LIGHT,
          dark: SEMANTIC_COLOR_SCHEMA_DARK
        }
      }
    }),
    options: {
      prefix: 'p',
      darkModeSelector: '.dark',
      cssLayer: false
    }
  },
  ripple: false,
  inputVariant: 'outlined',
  locale: PRIMEVUE_LOCALE_uk_UA
});

app.use(ToastService);
app.use(DialogService);
app.use(ConfirmationService);

app.use(HelpdeskPlugin, {
  version: '1.0.0',
  copyright: 'Авторські права © 2026 Helpdesk. Всі права захищені.'
});

app.directive('tooltip', Tooltip);

app.directive('autocomplete-off', vAutocompleteOff);

app.provide(DefaultApolloClient, apolloClient);

app.config.errorHandler = function (err, vm, info) {
  if (import.meta.env.DEV) {
    console.error('errorHandler', err, vm, info);
  }
};

app.config.warnHandler = (msg, instance, trace) => {
  if (import.meta.env.DEV) {
    console.error('warnHandler', msg, instance, trace);
  }
};

bootstrap().finally(() => {
  app.mount('#app');
});
