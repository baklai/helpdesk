# Модулі API

Огляд усіх функціональних модулів серверної частини.

## Requests (Заявки)

Основний модуль системи — реєстрація та обробка заявок на технічну підтримку.

**Права доступу:** `request:create/read/update/delete`

**Поля запису:**

| Поле           | Тип                  | Опис                     |
| -------------- | -------------------- | ------------------------ |
| `fullname`     | `String`             | ПІБ клієнта              |
| `phone`        | `String`             | Телефон клієнта          |
| `ipaddress`    | `String`             | IP-адреса клієнта        |
| `reqnum`       | `String`             | Номер заявки             |
| `request`      | `String`             | Опис проблеми            |
| `comment`      | `String`             | Коментар                 |
| `conclusion`   | `String`             | Висновок після виконання |
| `workerOpen`   | `UserEntity`         | Хто відкрив заявку       |
| `workerClose`  | `UserEntity`         | Хто закрив заявку        |
| `status`       | `Status`             | Статус заявки            |
| `location`     | `LocationEntity`     | Локація                  |
| `organization` | `OrganizationEntity` | Організація              |
| `subdivision`  | `SubdivisionEntity`  | Підрозділ                |
| `department`   | `DepartmentEntity`   | Відділ                   |
| `position`     | `PositionEntity`     | Посада                   |

---

## IP Addresses (IP-адреси)

Облік та управління мережевими адресами.

**Права доступу:** `ipaddress:create/read/update/delete`

**Поля запису:**

| Поле         | Тип              | Опис                           |
| ------------ | ---------------- | ------------------------------ |
| `ipaddress`  | `String`         | IP-адреса                      |
| `mask`       | `String`         | Маска підмережі                |
| `gateway`    | `String`         | Шлюз                           |
| `indexip`    | `Number`         | Числовий індекс IP             |
| `cidr`       | `Object`         | CIDR-нотація (`value`, `mask`) |
| `reqnum`     | `String`         | Номер заявки на підключення    |
| `fullname`   | `String`         | ПІБ власника                   |
| `phone`      | `String`         | Телефон                        |
| `autoanswer` | `String`         | Автовідповідач                 |
| `internet`   | `Object`         | Дані про інтернет-підключення  |
| `device`     | `DeviceEntity`   | Мережевий пристрій             |
| `location`   | `LocationEntity` | Локація                        |

---

## Mailboxes (Поштові скриньки)

Управління корпоративними email-обліковими записами.

**Права доступу:** `mailbox:create/read/update/delete`

**Поля запису:**

| Поле           | Тип                  | Опис            |
| -------------- | -------------------- | --------------- |
| `reqnum`       | `String`             | Номер заявки    |
| `email`        | `String`             | Email-адреса    |
| `fullname`     | `String`             | ПІБ власника    |
| `phone`        | `String`             | Телефон         |
| `status`       | `Status`             | Статус скриньки |
| `comment`      | `String`             | Коментар        |
| `location`     | `LocationEntity`     | Локація         |
| `organization` | `OrganizationEntity` | Організація     |

---

## Channels (Мережеві канали)

Моніторинг та облік мережевих каналів між локаціями.

**Права доступу:** `channel:create/read/update/delete`

**Поля запису:**

| Поле           | Тип      | Опис                 |
| -------------- | -------- | -------------------- |
| `locationFrom` | `String` | Локація-джерело      |
| `deviceFrom`   | `String` | Пристрій-джерело     |
| `locationTo`   | `String` | Локація-призначення  |
| `deviceTo`     | `String` | Пристрій-призначення |
| `level`        | `String` | Рівень каналу        |
| `channelType`  | `String` | Тип каналу           |
| `speed`        | `String` | Швидкість            |
| `status`       | `Status` | Статус               |
| `operator`     | `String` | Оператор зв'язку     |
| `composition`  | `String` | Склад                |

---

## Inspectors (SysInspector)

Збір та зберігання інформації про ПК з агента SysInspector.

**Права доступу:** `inspector:read/delete`

**Поля запису:**

| Поле            | Тип        | Опис                          |
| --------------- | ---------- | ----------------------------- |
| `ipaddress`     | `String`   | IP-адреса ПК                  |
| `baseboard`     | `JSON`     | Материнська плата (сирі дані) |
| `cpu`           | `JSON`     | Процесор                      |
| `memorychip`    | `JSON`     | Оперативна пам'ять            |
| `diskdrive`     | `JSON`     | Диски                         |
| `os`            | `JSON`     | Операційна система            |
| `netadapter`    | `JSON`     | Мережеві адаптери             |
| `printer`       | `JSON`     | Принтери                      |
| `product`       | `JSON`     | Встановлене ПЗ                |
| `useraccount`   | `JSON`     | Облікові записи ОС            |
| `baseboardName` | `String`   | Назва материнської плати      |
| `cpuName`       | `String`   | Назва процесора               |
| `system`        | `String`   | Назва системи                 |
| `hddSize`       | `Number`   | Розмір диска (ГБ)             |
| `ramSize`       | `Number`   | Розмір ОЗП (ГБ)               |
| `expiresAt`     | `DateTime` | Термін дії запису             |

---

## Events (Календар подій)

**Права доступу:** `event:create/read/update/delete`

| Поле            | Тип        | Опис                |
| --------------- | ---------- | ------------------- |
| `title`         | `String`   | Назва події         |
| `description`   | `String`   | Опис                |
| `startDateTime` | `DateTime` | Дата/час початку    |
| `endDateTime`   | `DateTime` | Дата/час завершення |
| `location`      | `String`   | Місце проведення    |
| `eventType`     | `String`   | Тип події           |
| `participants`  | `[String]` | Учасники            |
| `expiresAt`     | `DateTime` | Термін дії          |

---

## Довідники

Прості CRUD-модулі без пагінації (повертають весь список).

| Модуль            | Поля                                                     |
| ----------------- | -------------------------------------------------------- |
| **Organizations** | `name`, `address`, `description`                         |
| **Subdivisions**  | `code`, `name`, `address`, `description`, `organization` |
| **Departments**   | `name`, `description`                                    |
| **Positions**     | `name`                                                   |
| **Locations**     | `name`, `region`                                         |
| **Devices**       | `name`, `description`                                    |

---

## Reports (Звіти)

Конфігуровані звіти із налаштовуваними полями, фільтрами та сортуванням.

**Права доступу:** `report:create/read/update/delete`

| Поле             | Тип      | Опис                    |
| ---------------- | -------- | ----------------------- |
| `creator`        | `String` | Автор звіту             |
| `name`           | `String` | Назва                   |
| `description`    | `String` | Опис                    |
| `datacollection` | `String` | Джерело даних           |
| `fields`         | `JSON`   | Поля для відображення   |
| `sorts`          | `JSON`   | Налаштування сортування |
| `filters`        | `JSON`   | Фільтри                 |

---

## Settings (Налаштування)

Системні налаштування у форматі ключ-значення.

**Права доступу:** тільки `admin`

| Поле    | Тип      | Опис              |
| ------- | -------- | ----------------- |
| `key`   | `String` | Ключ (унікальний) |
| `value` | `JSON`   | Значення          |

---

## Statistics (Статистика)

Агрегаційні запити без параметрів, що повертають JSON зі статистикою.

| Query                   | Опис                            |
| ----------------------- | ------------------------------- |
| `getNetworkStatistic`   | Статистика мережі (IP, канали)  |
| `getMailboxStatistic`   | Статистика поштових скриньок    |
| `getRequestStatistic`   | Статистика заявок               |
| `getInspectorStatistic` | Статистика SysInspector         |
| `getDashboardStatistic` | Зведена статистика для дашборду |

---

## SysTools (Системні утиліти)

Генерація посилань для підключення до ПК.

| Query                         | Опис                          |
| ----------------------------- | ----------------------------- |
| `getLinkPing($host: String!)` | Посилання для ping            |
| `getLinkRDP($host: String!)`  | Посилання для RDP-підключення |
| `getLinkVNC($host: String!)`  | Посилання для VNC-підключення |

---

## SysLogs (Журнал аудиту)

Автоматичне логування дій користувачів. Записи створюються через `GraphqlLoggerInterceptor`.

| Поле         | Тип          | Опис                          |
| ------------ | ------------ | ----------------------------- |
| `ipaddress`  | `String`     | IP-адреса клієнта             |
| `user`       | `UserEntity` | Користувач                    |
| `method`     | `String`     | Тип операції (query/mutation) |
| `methodName` | `String`     | Назва операції                |
| `status`     | `Number`     | HTTP статус                   |
| `userAgent`  | `String`     | User-Agent браузера           |
| `error`      | `String`     | Текст помилки (якщо є)        |
| `expiresAt`  | `DateTime`   | Час автовидалення             |

---

## Notices (Сповіщення)

Персональні сповіщення для користувачів.

| Поле        | Тип        | Опис                             |
| ----------- | ---------- | -------------------------------- |
| `title`     | `String`   | Заголовок                        |
| `message`   | `String`   | Текст                            |
| `severity`  | `String`   | Рівень (`info`, `warn`, `error`) |
| `user`      | `String`   | ID отримувача                    |
| `expiresAt` | `DateTime` | Термін дії                       |
