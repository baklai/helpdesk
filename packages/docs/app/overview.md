# Огляд застосунку

Клієнтська частина Helpdesk — це SPA (Single Page Application) на базі **Vue 3** з Composition API.

## Технологічний стек

| Технологія         | Версія | Призначення              |
| ------------------ | ------ | ------------------------ |
| Vue 3              | latest | UI фреймворк             |
| Vite               | latest | Збірка та dev-сервер     |
| Pinia              | latest | Управління станом        |
| Vue Router 4       | latest | Маршрутизація            |
| Apollo Client 3    | latest | GraphQL клієнт           |
| PrimeVue           | latest | UI компоненти            |
| `@primeuix/themes` | latest | Кастомізація теми        |
| MDI Icons          | latest | Іконки (Material Design) |

## Точка входу

`src/main.js` — ініціалізує застосунок:

1. Створює Vue App
2. Підключає Vue Router
3. Підключає Pinia
4. Налаштовує PrimeVue з темою (кольорова схема на базі zinc)
5. Підключає `HelpdeskPlugin` — глобальний плагін з доступом до auth та scope
6. Реєструє сервіси: `ToastService`, `DialogService`, `ConfirmationService`
7. Реєструє директиву `v-tooltip`
8. Надає Apollo Client через `provide`

## Структура src/

```
src/
├── App.vue              # Кореневий компонент
├── main.js              # Точка входу
├── assets/              # CSS та шрифти (e-Ukraine)
├── components/          # Компоненти
│   ├── buttons/         # Кнопки навігації та функцій
│   ├── cards/           # StatCard, StatList
│   ├── fields/          # Поля форм
│   ├── forms/           # Повні форми
│   ├── menus/           # Меню навігації
│   ├── modals/          # Модальні вікна CRUD
│   ├── partials/        # Часткові представлення
│   └── tables/          # Таблиці даних
├── composables/         # Composable функції
├── constants/           # Константи (enum, UI, CIDR)
├── graphql/             # Apollo Client та GQL запити
├── layouts/             # PrivateLayout, PublicLayout
├── plugins/             # helpdesk.plugin.js
├── router/              # Vue Router конфігурація
├── stores/              # Pinia stores
├── utils/               # Утилітарні функції
└── views/               # Сторінки застосунку
```

## Теми та шрифти

Застосунок використовує шрифт **e-Ukraine** у 6 варіантах (Thin, UltraLight, Light, Regular, Medium, Bold). Підтримуються світла та темна теми. Перемикання теми відбувається через додавання/видалення класу `.dark` на `<html>`.

## Локалізація

Весь інтерфейс, включаючи PrimeVue компоненти, повністю локалізований на **українську мову**.
