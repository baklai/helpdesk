# Маршрутизація

Маршрутизатор побудований на **Vue Router 4** з history-режимом. Базовий URL: `/helpdesk`.

## Структура маршрутів

### Публічні маршрути (гостьові)

Доступні лише для неавторизованих користувачів (`meta.guestOnly: true`). Використовують `PublicLayout`.

| Ім'я              | Шлях               | Компонент    | Опис               |
| ----------------- | ------------------ | ------------ | ------------------ |
| `signin`          | `/signin`          | `SigninView` | Вхід у систему     |
| `signup`          | `/signup`          | `SignupView` | Реєстрація         |
| `forgot-password` | `/forgot-password` | `ForgotView` | Відновлення пароля |

### Приватні маршрути

Вимагають авторизації (`meta.requiresAuth: true`). Використовують `PrivateLayout`.

| Ім'я                  | Шлях                      | Права (`meta.permissions`) |
| --------------------- | ------------------------- | -------------------------- |
| `home`                | `/`                       | —                          |
| `events`              | `/events`                 | `event:read`               |
| `channels`            | `/channels`               | `channel:read`             |
| `channel-create`      | `/channels/create`        | `channel:create`           |
| `channel-update`      | `/channels/:id/update`    | `channel:update`           |
| `ipaddresses`         | `/ipaddresses`            | `ipaddress:read`           |
| `ipaddress-create`    | `/ipaddresses/create`     | `ipaddress:create`         |
| `ipaddress-update`    | `/ipaddresses/:id/update` | `ipaddress:update`         |
| `mailboxes`           | `/mailboxes`              | `mailbox:read`             |
| `mailbox-create`      | `/mailboxes/create`       | `mailbox:create`           |
| `mailbox-update`      | `/mailboxes/:id/update`   | `mailbox:update`           |
| `requests`            | `/requests`               | `request:read`             |
| `request-create`      | `/requests/create`        | `request:create`           |
| `request-update`      | `/requests/:id/update`    | `request:update`           |
| `inspectors`          | `/inspectors`             | —                          |
| `reports`             | `/reports`                | `report:read`              |
| `report-create`       | `/reports/create`         | `report:create`            |
| `report-update`       | `/reports/:id/update`     | `report:update`            |
| `users`               | `/users`                  | `user:read`                |
| `user-create`         | `/users/create`           | `user:create`              |
| `user-update`         | `/users/:id/update`       | `user:update`              |
| `network-statistic`   | `/statistic/network`      | —                          |
| `mailbox-statistic`   | `/statistic/mailbox`      | —                          |
| `request-statistic`   | `/statistic/request`      | —                          |
| `inspector-statistic` | `/statistic/inspector`    | —                          |

### Маршрути адміністратора

Вимагають ролі `admin` (`meta.requiresAdmin: true`).

| Ім'я        | Шлях         | Опис                 |
| ----------- | ------------ | -------------------- |
| `dashboard` | `/dashboard` | Панель статистики    |
| `settings`  | `/settings`  | Налаштування системи |
| `log-audit` | `/log-audit` | Журнал аудиту        |

### Службові маршрути

| Ім'я            | Шлях               | Опис                 |
| --------------- | ------------------ | -------------------- |
| `access-denied` | `/access-denied`   | Доступ заборонено    |
| `not-found`     | `/:pathMatch(.*)*` | Сторінку не знайдено |

## Navigation Guard

`router.beforeEach` виконує перед кожним переходом:

1. Встановлює заголовок вкладки браузера з `meta.title`
2. Оновлює мета-тег `description`
3. Якщо маршрут вимагає авторизації і користувач не залогінений — викликає `authStore.me()` (пробує відновити сесію через refresh token)
4. Якщо відновити сесію не вдалось — перенаправляє на `signin`

## Meta-поля маршрутів

| Поле            | Тип        | Опис                    |
| --------------- | ---------- | ----------------------- |
| `title`         | `String`   | Заголовок сторінки      |
| `description`   | `String`   | Мета-опис               |
| `icon`          | `String`   | MDI іконка для меню     |
| `requiresAuth`  | `Boolean`  | Вимагає авторизації     |
| `guestOnly`     | `Boolean`  | Тільки для гостей       |
| `requiresAdmin` | `Boolean`  | Тільки для адмінів      |
| `permissions`   | `String[]` | Необхідні права доступу |
