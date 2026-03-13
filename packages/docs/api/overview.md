# Огляд API

API побудоване на базі **NestJS 11** та використовує **GraphQL** як єдиний транспортний протокол. Всі операції доступні через єдиний endpoint.

## Endpoint

```
POST http://localhost:3000/api
WS   ws://localhost:3000/api  (для підписок)
```

## Технічні характеристики

| Параметр          | Значення                                    |
| ----------------- | ------------------------------------------- |
| Фреймворк         | NestJS 11                                   |
| GraphQL сервер    | Apollo Server 5                             |
| Підхід            | Code-first (схема генерується з TypeScript) |
| База даних        | MongoDB 6+ (Mongoose 9)                     |
| Автентифікація    | JWT (access + refresh)                      |
| Rate limiting     | 50 запитів / 60 секунд                      |
| Підписки          | GraphQL WS (`graphql-ws`)                   |
| Ліміт тіла запиту | 10 MB                                       |

## Глобальні плагіни Mongoose

При старті сервер підключає до всіх схем наступні плагіни:

- **mongoose-autopopulate** — автоматичне заповнення посилань
- **mongoose-paginate-v2** — пагінація
- **mongoose-aggregate-paginate-v2** — пагінація через агрегацію
- **timestamps** — автоматичні поля `createdAt` / `updatedAt`
- **virtual id** — поле `id` як аліас для `_id`

## Безпека

Сервер захищений наступними механізмами:

- **Helmet** — HTTP security headers
- **CORS** — дозволений лише `http://localhost:5173`
- **ThrottlerModule** — rate limiting
- **ValidationPipe** — валідація вхідних даних (`class-validator`)
- **CSRF** захист
- **Compression** — стиснення відповідей

## Структура модуля

Кожен функціональний модуль містить однакову структуру:

```
module-name/
├── module-name.module.ts     # NestJS модуль
├── module-name.resolver.ts   # GraphQL резолвер
├── module-name.service.ts    # Бізнес-логіка
├── dto/
│   ├── create-*.input.ts     # DTO для створення
│   └── update-*.input.ts     # DTO для оновлення
├── entities/
│   └── *.entity.ts           # GraphQL-тип (ObjectType)
└── models/
    └── *.schema.ts           # Mongoose схема
```

## Список модулів

| Модуль          | Опис                              |
| --------------- | --------------------------------- |
| `auth`          | Автентифікація та сесії           |
| `users`         | Управління користувачами          |
| `requests`      | Заявки на технічну підтримку      |
| `ipaddresses`   | IP-адреси мережі                  |
| `mailboxes`     | Поштові скриньки                  |
| `channels`      | Мережеві канали                   |
| `inspectors`    | SysInspector (дані про ПК)        |
| `reports`       | Конфігуровані звіти               |
| `events`        | Календар подій                    |
| `notices`       | Сповіщення                        |
| `organizations` | Організації                       |
| `subdivisions`  | Підрозділи                        |
| `departments`   | Відділи                           |
| `positions`     | Посади                            |
| `locations`     | Локації                           |
| `devices`       | Пристрої                          |
| `settings`      | Налаштування системи              |
| `statistics`    | Статистика та аналітика           |
| `syslogs`       | Системний журнал аудиту           |
| `systools`      | Системні утиліти (ping, RDP, VNC) |
