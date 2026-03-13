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

import { vAutocompleteOff } from '@/directives/autocomplete-off.directive';
import { apolloClient } from '@/graphql/apollo.client';
import HelpdeskPlugin from '@/plugins/helpdesk.plugin';

import '@/assets/base.css';
import '@/assets/fonts.css';
import 'primeicons/primeicons.css';

const app = createApp(App);

app.use(router);
app.use(createPinia());

app.use(PrimeVue, {
  theme: {
    preset: definePreset(Aura, {
      semantic: {
        primary: {
          50: '{zinc.50}',
          100: '{zinc.100}',
          200: '{zinc.200}',
          300: '{zinc.300}',
          400: '{zinc.400}',
          500: '{zinc.500}',
          600: '{zinc.600}',
          700: '{zinc.700}',
          800: '{zinc.800}',
          900: '{zinc.900}',
          950: '{zinc.950}'
        },
        colorScheme: {
          light: {
            primary: {
              color: '{zinc.950}',
              inverseColor: '#ffffff',
              hoverColor: '{zinc.900}',
              activeColor: '{zinc.800}'
            },
            highlight: {
              background: '{zinc.950}',
              focusBackground: '{zinc.700}',
              color: '#ffffff',
              focusColor: '#ffffff'
            }
          },
          dark: {
            primary: {
              color: '{zinc.50}',
              inverseColor: '{zinc.950}',
              hoverColor: '{zinc.100}',
              activeColor: '{zinc.200}'
            },
            highlight: {
              background: 'rgba(250, 250, 250, .16)',
              focusBackground: 'rgba(250, 250, 250, .24)',
              color: 'rgba(255,255,255,.87)',
              focusColor: 'rgba(255,255,255,.87)'
            }
          }
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
  locale: {
    startsWith: 'Починається з',
    contains: 'Містить',
    notContains: 'Не містить',
    endsWith: 'Закінчується на',
    equals: 'Рівно',
    notEquals: 'Не рівно',
    noFilter: 'Без фільтра',
    lt: 'Менше ніж',
    lte: 'Менше або дорівнює',
    gt: 'Більше ніж',
    gte: 'Більше або дорівнює',
    dateIs: 'Дата є',
    dateIsNot: 'Дата не є',
    dateBefore: 'Дата до',
    dateAfter: 'Дата після',
    clear: 'Очистити',
    apply: 'Застосувати',
    matchAll: 'Співпадає з усіма',
    matchAny: 'Співпадає з будь-яким',
    addRule: 'Додати правило',
    removeRule: 'Видалити правило',
    accept: 'Так',
    reject: 'Ні',
    choose: 'Вибрати',
    upload: 'Завантажити',
    cancel: 'Скасувати',
    completed: 'Завершено',
    pending: 'В очікуванні',
    fileSizeTypes: ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
    dayNames: ['Неділя', 'Понеділок', 'Вівторок', 'Середа', 'Четвер', 'П’ятниця', 'Субота'],
    dayNamesShort: ['Нд', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
    dayNamesMin: ['Нд', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
    monthNames: [
      'Січень',
      'Лютий',
      'Березень',
      'Квітень',
      'Травень',
      'Червень',
      'Липень',
      'Серпень',
      'Вересень',
      'Жовтень',
      'Листопад',
      'Грудень'
    ],
    monthNamesShort: [
      'Січ',
      'Лют',
      'Бер',
      'Квіт',
      'Трав',
      'Чер',
      'Лип',
      'Сер',
      'Вер',
      'Жов',
      'Лис',
      'Груд'
    ],
    chooseYear: 'Вибрати рік',
    chooseMonth: 'Вибрати місяць',
    chooseDate: 'Вибрати дату',
    prevDecade: 'Попереднє десятиліття',
    nextDecade: 'Наступне десятиліття',
    prevYear: 'Попередній рік',
    nextYear: 'Наступний рік',
    prevMonth: 'Попередній місяць',
    nextMonth: 'Наступний місяць',
    prevHour: 'Попередня година',
    nextHour: 'Наступна година',
    prevMinute: 'Попередня хвилина',
    nextMinute: 'Наступна хвилина',
    prevSecond: 'Попередня секунда',
    nextSecond: 'Наступна секунда',
    am: 'дп',
    pm: 'пп',
    today: 'Сьогодні',
    weekHeader: 'Тиждень',
    firstDayOfWeek: 1,
    showMonthAfterYear: false,
    dateFormat: 'dd/mm/yy',
    weak: 'Слабкий',
    medium: 'Середній',
    strong: 'Сильний',
    passwordPrompt: 'Введіть пароль',
    searchMessage: 'Доступно {0} результатів',
    selectionMessage: 'Вибрано {0} елементів',
    emptySelectionMessage: 'Немає вибраних елементів',
    emptySearchMessage: 'Не знайдено результатів',
    fileChosenMessage: '{0} файлів',
    noFileChosenMessage: 'Файл не вибрано',
    emptyMessage: 'Немає доступних опцій',
    aria: {
      trueLabel: 'Так',
      falseLabel: 'Ні',
      nullLabel: 'Не вибрано',
      star: '1 зірка',
      stars: '{star} зірки',
      selectAll: 'Вибрано всі елементи',
      unselectAll: 'Вибрано всі елементи',
      close: 'Закрити',
      previous: 'Попередній',
      next: 'Наступний',
      navigation: 'Навігація',
      scrollTop: 'Прокрутка вгору',
      moveTop: 'Перемістити вгору',
      moveUp: 'Перемістити вгору',
      moveDown: 'Перемістити вниз',
      moveBottom: 'Перемістити вниз',
      moveToTarget: 'Перемістити до цілі',
      moveToSource: 'Перемістити до джерела',
      moveAllToTarget: 'Перемістити все до цілі',
      moveAllToSource: 'Перемістити все до джерела',
      pageLabel: 'Сторінка {page}',
      firstPageLabel: 'Перша сторінка',
      lastPageLabel: 'Остання сторінка',
      nextPageLabel: 'Наступна сторінка',
      prevPageLabel: 'Попередня сторінка',
      rowsPerPageLabel: 'Рядків на сторінку',
      jumpToPageDropdownLabel: 'Перейти до сторінки',
      jumpToPageInputLabel: 'Перейти до сторінки',
      selectRow: 'Рядок вибрано',
      unselectRow: 'Рядок не вибрано',
      expandRow: 'Рядок розгорнуто',
      collapseRow: 'Рядок згруповано',
      showFilterMenu: 'Показати меню фільтрації',
      hideFilterMenu: 'Сховати меню фільтрації',
      filterOperator: 'Оператор фільтра',
      filterConstraint: 'Умова фільтра',
      editRow: 'Редагувати рядок',
      saveEdit: 'Зберегти редагування',
      cancelEdit: 'Скасувати редагування',
      listView: 'Список',
      gridView: 'Сітка',
      slide: 'Слайд',
      slideNumber: '{slideNumber}',
      zoomImage: 'Збільшити зображення',
      zoomIn: 'Збільшити',
      zoomOut: 'Зменшити',
      rotateRight: 'Повернути вправо',
      rotateLeft: 'Повернути вліво'
    }
  }
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

app.mount('#app');
