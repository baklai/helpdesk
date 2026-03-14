export const EVENT_ENUM = [
  {
    key: 'event',
    name: 'Стандартна подія без конкретної категорії'
  },
  {
    key: 'meeting',
    name: 'Зустріч або робоче засідання з учасниками'
  },
  {
    key: 'webinar',
    name: 'Онлайн-вебінар або віртуальне навчання'
  },
  {
    key: 'conference',
    name: 'Конференція з кількома сесіями, спікерами та учасниками'
  },
  {
    key: 'workshop',
    name: 'Семінар, тренінг або навчальний захід'
  },
  {
    key: 'holiday',
    name: 'Свято та національні свята'
  },
  {
    key: 'entertainment',
    name: 'Культурна або розважальна подія'
  },
  {
    key: 'lecture',
    name: 'Публічна лекція, відкритий виступ або презентація'
  },
  {
    key: 'other',
    name: 'Будь-яка інша подія, що не потрапила під попередні категорії'
  }
];

export const EVENT_SCHEMA = {
  event: {
    colorName: 'event',
    lightColors: {
      main: '#9e9e9e',
      container: '#f5f5f5',
      onContainer: '#212121'
    },
    darkColors: {
      main: '#bdbdbd',
      container: '#424242',
      onContainer: '#f5f5f5'
    }
  },
  meeting: {
    colorName: 'meeting',
    lightColors: {
      main: '#ff7043',
      container: '#ffe0d6',
      onContainer: '#5d1f00'
    },
    darkColors: {
      main: '#ff8a65',
      container: '#6d2b00',
      onContainer: '#ffe0d6'
    }
  },
  webinar: {
    colorName: 'webinar',
    lightColors: {
      main: '#29b6f6',
      container: '#d0f0ff',
      onContainer: '#003f57'
    },
    darkColors: {
      main: '#4fc3f7',
      container: '#015374',
      onContainer: '#d0f0ff'
    }
  },
  conference: {
    colorName: 'conference',
    lightColors: {
      main: '#ab47bc',
      container: '#f3d7f5',
      onContainer: '#4a004d'
    },
    darkColors: {
      main: '#ba68c8',
      container: '#6d1b7b',
      onContainer: '#f3d7f5'
    }
  },
  workshop: {
    colorName: 'workshop',
    lightColors: {
      main: '#66bb6a',
      container: '#dcf8dc',
      onContainer: '#003300'
    },
    darkColors: {
      main: '#81c784',
      container: '#1b5e20',
      onContainer: '#dcf8dc'
    }
  },
  holiday: {
    colorName: 'holiday',
    lightColors: {
      main: '#ef5350',
      container: '#ffd7d6',
      onContainer: '#5d0000'
    },
    darkColors: {
      main: '#e57373',
      container: '#7b0000',
      onContainer: '#ffd7d6'
    }
  },
  entertainment: {
    colorName: 'entertainment',
    lightColors: {
      main: '#ffca28',
      container: '#fff7d1',
      onContainer: '#594800'
    },
    darkColors: {
      main: '#ffd54f',
      container: '#a67c00',
      onContainer: '#fff7d1'
    }
  },
  lecture: {
    colorName: 'lecture',
    lightColors: {
      main: '#26c6da',
      container: '#d1f5f8',
      onContainer: '#00333f'
    },
    darkColors: {
      main: '#4dd0e1',
      container: '#004d5a',
      onContainer: '#d1f5f8'
    }
  },
  other: {
    colorName: 'other',
    lightColors: {
      main: '#8d6e63',
      container: '#f0e6e2',
      onContainer: '#3b1f18'
    },
    darkColors: {
      main: '#a1887f',
      container: '#4e342e',
      onContainer: '#f0e6e2'
    }
  }
};

export const NOTICE_STATUS = [
  {
    key: 'SUCCESS',
    label: 'Успіх',
    comment: 'Повідомлення про успішне завершення операції'
  },
  {
    key: 'INFO',
    label: 'Інформація',
    comment: 'Інформаційне повідомлення або системна зміна'
  },
  {
    key: 'WARN',
    label: 'Попередження',
    comment: 'Попередження про потенційну проблему або видалення'
  },
  {
    key: 'ERROR',
    label: 'Помилка',
    comment: 'Повідомлення про помилку виконання або критичну подію'
  },
  {
    key: 'SECONDARY',
    label: 'Додатково',
    comment: 'Допоміжна або нейтральна інформація'
  }
];

export const INTERNET_STATUS = [
  {
    key: 'NONE',
    label: 'Відсутній',
    comment: 'Доступ до мережі Інтернет не надавався'
  },
  {
    key: 'ACTIVE',
    label: 'Активний',
    comment: 'Доступ надано та діє на даний момент'
  },
  {
    key: 'BLOCKED',
    label: 'Заблоковано',
    comment: 'Доступ тимчасово обмежено (через порушення або технічні причини)'
  },
  {
    key: 'CLOSED',
    label: 'Закрито',
    comment: 'Доступ було анульовано або термін дії заявки вичерпано'
  }
];

export const MAILBOX_STATUS = [
  {
    key: 'OPENED',
    label: 'Активний',
    comment: 'Доступ надано та діє на даний момент'
  },
  {
    key: 'BLOCKED',
    label: 'Заблоковано',
    comment: 'Доступ тимчасово обмежено (через порушення або технічні причини)'
  },
  {
    key: 'CLOSED',
    label: 'Закрито',
    comment: 'Доступ було анульовано або термін дії заявки вичерпано'
  }
];

export const REQUEST_STATUS_SEVERITY = {
  OPENED: 'info',
  PENDING: 'secondary',
  PROCESSING: 'warn',
  RESOLVED: 'success',
  CLOSED: 'secondary',
  REJECTED: 'danger',
  CANCELLED: 'secondary'
};

export const REQUEST_STATUS = [
  {
    key: 'OPENED',
    label: 'Відкрита',
    comment:
      'Заявка щойно створена користувачем і зареєстрована в системі. Ще не була переглянута або прийнята в роботу.'
  },
  {
    key: 'PENDING',
    label: 'Очікує',
    comment: 'Заявка очікує розгляду або призначення відповідального спеціаліста.'
  },
  {
    key: 'PROCESSING',
    label: 'В роботі',
    comment: 'Заявка прийнята в роботу. Спеціаліст виконує дії для вирішення описаної проблеми.'
  },
  {
    key: 'RESOLVED',
    label: 'Вирішено',
    comment:
      'Проблему вирішено. Очікується підтвердження від користувача або перевірка результату. За потреби заявку ще можна відкрити повторно.'
  },
  {
    key: 'CLOSED',
    label: 'Закрита',
    comment:
      'Заявка остаточно закрита після підтвердження вирішення. Подальші зміни або повторне відкриття неможливі.'
  },
  {
    key: 'REJECTED',
    label: 'Відхилена',
    comment:
      'Заявку відхилено після перевірки (наприклад, через некоректні дані або невідповідність правилам).'
  },
  {
    key: 'CANCELLED',
    label: 'Скасована',
    comment: 'Заявку скасовано користувачем або адміністратором до завершення її обробки.'
  }
];

export const USER_STATUS = [
  {
    key: 'ACTIVE',
    label: 'Активний',
    comment: 'Обʼєкт повністю функціональний та доступний для використання.'
  },
  {
    key: 'BLOCKED',
    label: 'Заблоковано',
    comment: 'Доступ обмежено адміністратором або через порушення правил.'
  },
  {
    key: 'DISABLED',
    label: 'Вимкнено',
    comment: 'Обʼєкт вимкнений користувачем або деактивований за замовчуванням.'
  },
  {
    key: 'PENDING',
    label: 'В очікуванні',
    comment: 'Очікує підтвердження, перевірки або завершення процесу обробки.'
  }
];

export const USER_ROLES = [
  {
    key: 'ADMIN',
    label: 'Адміністратор',
    comment: 'Має повний доступ до всіх налаштувань системи та керування користувачами.'
  },
  {
    key: 'MANAGER',
    label: 'Менеджер',
    comment: 'Має доступ до управління контентом, замовленнями або клієнтами.'
  },
  {
    key: 'SUPPORT',
    label: 'Служба підтримки',
    comment: 'Має доступ до перегляду даних та допомоги користувачам у розвʼязанні проблем.'
  },
  {
    key: 'CLIENT',
    label: 'Клієнт',
    comment: 'Звичайний користувач із доступом лише до особистого кабінету та послуг.'
  }
];

export const MONTHS_OF_YEAR = [
  { key: 1, label: 'Січень' },
  { key: 2, label: 'Лютий' },
  { key: 3, label: 'Березень' },
  { key: 4, label: 'Квітень' },
  { key: 5, label: 'Травень' },
  { key: 6, label: 'Червень' },
  { key: 7, label: 'Липень' },
  { key: 8, label: 'Серпень' },
  { key: 9, label: 'Вересень' },
  { key: 10, label: 'Жовтень' },
  { key: 11, label: 'Листопад' },
  { key: 12, label: 'Грудень' }
];

export const DAYS_OF_WEEK = [
  { key: 1, label: 'Понеділок' },
  { key: 2, label: 'Вівторок' },
  { key: 3, label: 'Середа' },
  { key: 4, label: 'Четвер' },
  { key: 5, label: "П'ятниця" },
  { key: 6, label: 'Субота' },
  { key: 7, label: 'Неділя' }
];

export const monthOfNumber = value => {
  return MONTHS_OF_YEAR[value];
};

export const dayOfNumber = value => {
  return DAYS_OF_WEEK[value];
};
