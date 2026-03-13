# GraphQL-запити (повний список)

Всі операції клієнтської частини визначені у файлі `packages/app/src/graphql/apollo.gql.js`.

## Auth

| Операція  | Тип      | Опис                          |
| --------- | -------- | ----------------------------- |
| `Me`      | Query    | Профіль поточного користувача |
| `Signin`  | Mutation | Вхід (повертає access token)  |
| `Signup`  | Mutation | Реєстрація                    |
| `Signout` | Mutation | Вихід                         |
| `Refresh` | Mutation | Оновлення access token        |

## Users

| Операція                | Тип      | Опис                            |
| ----------------------- | -------- | ------------------------------- |
| `FindAllUsers`          | Query    | Список з пагінацією             |
| `FindAllUsersForNotice` | Query    | Список для сповіщень (по scope) |
| `FindOneUserById`       | Query    | Один користувач                 |
| `CreateOneUser`         | Mutation | Створення                       |
| `UpdateOneUserById`     | Mutation | Оновлення                       |
| `RemoveOneUserById`     | Mutation | Видалення                       |

## Events

| Операція             | Тип      | Параметри                      |
| -------------------- | -------- | ------------------------------ |
| `FindAllEvents`      | Query    | `startDateTime`, `endDateTime` |
| `FindOneEventById`   | Query    | `id`                           |
| `CreateOneEvent`     | Mutation | `CreateEventInput`             |
| `UpdateOneEventById` | Mutation | `id`, `UpdateEventInput`       |
| `RemoveOneEventById` | Mutation | `id`                           |

## Channels

| Операція               | Тип      | Параметри                            |
| ---------------------- | -------- | ------------------------------------ |
| `FindAllChannels`      | Query    | `limit`, `offset`, `sort`, `filters` |
| `FindOneChannelById`   | Query    | `id`                                 |
| `CreateOneChannel`     | Mutation | `CreateChannelInput`                 |
| `UpdateOneChannelById` | Mutation | `id`, `UpdateChannelInput`           |
| `RemoveOneChannelById` | Mutation | `id`                                 |

## IP Addresses

| Операція                 | Тип      | Параметри                            |
| ------------------------ | -------- | ------------------------------------ |
| `FindAllIpaddresses`     | Query    | `limit`, `offset`, `sort`, `filters` |
| `FindOneIpaddressById`   | Query    | `id`                                 |
| `CreateOneIpaddress`     | Mutation | `CreateIpaddressInput`               |
| `UpdateOneIpaddressById` | Mutation | `id`, `UpdateIpaddressInput`         |
| `RemoveOneIpaddressById` | Mutation | `id`                                 |

## Mailboxes

| Операція               | Тип      | Параметри                            |
| ---------------------- | -------- | ------------------------------------ |
| `FindAllMailboxes`     | Query    | `limit`, `offset`, `sort`, `filters` |
| `FindOneMailboxById`   | Query    | `id`                                 |
| `CreateOneMailbox`     | Mutation | `CreateMailboxInput`                 |
| `UpdateOneMailboxById` | Mutation | `id`, `UpdateMailboxInput`           |
| `RemoveOneMailboxById` | Mutation | `id`                                 |

## Requests

| Операція               | Тип      | Параметри                            |
| ---------------------- | -------- | ------------------------------------ |
| `FindAllRequests`      | Query    | `limit`, `offset`, `sort`, `filters` |
| `FindOneRequestById`   | Query    | `id`                                 |
| `CreateOneRequest`     | Mutation | `CreateRequestInput`                 |
| `UpdateOneRequestById` | Mutation | `id`, `UpdateRequestInput`           |
| `RemoveOneRequestById` | Mutation | `id`                                 |

## Inspectors (SysInspector)

| Операція                     | Тип      | Параметри                            |
| ---------------------------- | -------- | ------------------------------------ |
| `FindAllInspectors`          | Query    | `limit`, `offset`, `sort`, `filters` |
| `FindOneInspectorById`       | Query    | `id`                                 |
| `FindOneInspectorReportById` | Query    | `id`, `ip` (об'єднаний запит)        |
| `CreateOneInspector`         | Mutation | `CreateInspectorInput`               |
| `RemoveOneInspectorById`     | Mutation | `id`                                 |

## Довідники

| Модуль        | Query (всі)            | Query (один)              | Create | Update | Remove |
| ------------- | ---------------------- | ------------------------- | ------ | ------ | ------ |
| Organizations | `FindAllOrganizations` | `FindOneOrganizationById` | ✓      | ✓      | ✓      |
| Subdivisions  | `FindAllSubdivisions`  | `FindOneSubdivisionById`  | ✓      | ✓      | ✓      |
| Departments   | `FindAllDepartments`   | `FindOneDepartmentById`   | ✓      | ✓      | ✓      |
| Positions     | `FindAllPositions`     | `FindOnePositionById`     | ✓      | ✓      | ✓      |
| Locations     | `FindAllLocations`     | `FindOneLocationById`     | ✓      | ✓      | ✓      |
| Devices       | `FindAllDevices`       | `FindOneDeviceById`       | ✓      | ✓      | ✓      |

## Reports

| Операція              | Тип      |
| --------------------- | -------- |
| `FindAllReports`      | Query    |
| `FindOneReportById`   | Query    |
| `CreateOneReport`     | Mutation |
| `UpdateOneReportById` | Mutation |
| `RemoveOneReportById` | Mutation |

## Settings

| Операція               | Тип      |
| ---------------------- | -------- |
| `FindAllSettings`      | Query    |
| `FindOneSettingById`   | Query    |
| `CreateOneSetting`     | Mutation |
| `UpdateOneSettingById` | Mutation |
| `RemoveOneSettingById` | Mutation |

## Notices

| Операція              | Тип      | Параметри             |
| --------------------- | -------- | --------------------- |
| `FindAllNotices`      | Query    | `id` (ID користувача) |
| `CreateOneNotice`     | Mutation | `CreateNoticeInput`   |
| `RemoveOneNoticeById` | Mutation | `id`                  |

## Statistics

| Операція                   | Тип   | Опис                    |
| -------------------------- | ----- | ----------------------- |
| `GetStatistic` (network)   | Query | `getNetworkStatistic`   |
| `GetStatistic` (mailbox)   | Query | `getMailboxStatistic`   |
| `GetStatistic` (request)   | Query | `getRequestStatistic`   |
| `GetStatistic` (inspector) | Query | `getInspectorStatistic` |
| `GetDashboardStatistic`    | Query | Зведена статистика      |

## SysTools

| Операція      | Тип   | Параметри       |
| ------------- | ----- | --------------- |
| `GetLinkPing` | Query | `host: String!` |
| `GetLinkRDP`  | Query | `host: String!` |
| `GetLinkVNC`  | Query | `host: String!` |

## SysLogs

| Операція              | Тип      | Параметри                            |
| --------------------- | -------- | ------------------------------------ |
| `FindAllSysLogs`      | Query    | `limit`, `offset`, `sort`, `filters` |
| `FindOneSysLogById`   | Query    | `id`                                 |
| `RemoveOneSysLogById` | Mutation | `id`                                 |
| `RemoveAllSysLogs`    | Mutation | —                                    |

## Параметри пагінації

Всі пагіновані queries приймають:

```graphql
$limit: Int = 5       # Кількість записів на сторінку
$offset: Int = 0      # Зміщення
$sort: JSON           # Об'єкт сортування, наприклад: { fullname: 1 }
$filters: JSON        # Об'єкт фільтрації MongoDB
```
