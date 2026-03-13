# Компоненти

## Layouts

### PrivateLayout.vue

Основний лейаут для авторизованих користувачів. Містить сайдбар, топбар та основну контентну область.

### PublicLayout.vue

Лейаут для публічних сторінок (вхід, реєстрація). Мінімалістичний, без навігації.

---

## Глобальні компоненти

### AppSidebar.vue

Бічна навігаційна панель із підтримкою згортання. Відображає пункти меню відповідно до прав доступу користувача.

### AppTopbar.vue

Верхня панель з кнопками: профіль, сповіщення, повноекранний режим, конфігурація, перемикач теми.

### AppProfile.vue

Картка профілю поточного користувача.

### AppLoading.vue

Глобальний індикатор завантаження.

### AppIcon.vue

Обгортка для MDI іконок.

### AppLogo.vue

Логотип застосунку.

### AppConfig.vue

Панель налаштувань теми та конфігурації UI.

---

## Buttons (Кнопки)

| Компонент              | Опис                                 |
| ---------------------- | ------------------------------------ |
| `BtnAuth.vue`          | Кнопка авторизації/виходу            |
| `BtnConfig.vue`        | Кнопка відкриття панелі конфігурації |
| `BtnDBTable.vue`       | Кнопка дії з таблицею (один запис)   |
| `BtnDBTables.vue`      | Кнопки дій з таблицею (групові)      |
| `BtnFullMenu.vue`      | Кнопка розгортання меню              |
| `BtnFullScreen.vue`    | Кнопка повноекранного режиму         |
| `BtnInfoProfile.vue`   | Кнопка інформації профілю            |
| `BtnNotifications.vue` | Кнопка сповіщень з лічильником       |
| `BtnStorageClient.vue` | Кнопка клієнтського сховища          |
| `BtnToggleTheme.vue`   | Перемикач світлої/темної теми        |

---

## Fields (Поля форм)

Базові поля форм на основі PrimeVue компонентів з єдиним інтерфейсом.

| Компонент               | Базовий PrimeVue | Опис                             |
| ----------------------- | ---------------- | -------------------------------- |
| `BaseField.vue`         | —                | Базовий клас для всіх полів      |
| `InputTextField.vue`    | `InputText`      | Текстове поле                    |
| `TextareaField.vue`     | `Textarea`       | Багаторядкове поле               |
| `DatePickerField.vue`   | `DatePicker`     | Вибір дати                       |
| `SelectLoadField.vue`   | `Select`         | Вибір з динамічним завантаженням |
| `SelectButtonField.vue` | `SelectButton`   | Кнопки вибору (toggle)           |
| `IPAddressField.vue`    | `InputMask`      | Поле для IP-адреси з маскою      |
| `CIDRFiled.vue`         | —                | Поле для CIDR-нотації            |

---

## Forms (Форми)

Повні форми для створення/редагування записів.

| Компонент           | Модуль           |
| ------------------- | ---------------- |
| `UserForm.vue`      | Користувачі      |
| `IPAddressForm.vue` | IP-адреси        |
| `MailboxForm.vue`   | Поштові скриньки |
| `RequestForm.vue`   | Заявки           |
| `ReportForm.vue`    | Звіти            |

---

## Modals (Модальні вікна)

Модальні вікна для CRUD-операцій з довідниками.

| Компонент               | Довідник        |
| ----------------------- | --------------- |
| `ChannelModal.vue`      | Мережеві канали |
| `DepartmentModal.vue`   | Відділи         |
| `DeviceModal.vue`       | Пристрої        |
| `EventModal.vue`        | Події           |
| `LocationModal.vue`     | Локації         |
| `NoticeModal.vue`       | Сповіщення      |
| `OrganizationModal.vue` | Організації     |
| `PositionModal.vue`     | Посади          |
| `ReportModal.vue`       | Звіти           |
| `SubdivisionModal.vue`  | Підрозділи      |
| `UserModal.vue`         | Користувачі     |

---

## Tables (Таблиці)

### CRUDDataTable.vue

Універсальна таблиця даних з підтримкою:

- Серверної пагінації
- Сортування
- Фільтрації
- Inline-дій (редагування, видалення)

### ScopeDataTable.vue

Спеціалізована таблиця для управління правами доступу користувача (матриця scope).

---

## Partials (Часткові представлення)

Компоненти для відображення деталей запису.

| Компонент                 | Опис                        |
| ------------------------- | --------------------------- |
| `ChannelPartial.vue`      | Деталі мережевого каналу    |
| `InternetPartial.vue`     | Деталі інтернет-підключення |
| `IPAddressPartial.vue`    | Деталі IP-адреси            |
| `MailboxPartial.vue`      | Деталі поштової скриньки    |
| `RequestPartial.vue`      | Деталі заявки               |
| `SysInspectorPartial.vue` | Деталі SysInspector звіту   |
| `UserPartial.vue`         | Деталі профілю користувача  |

---

## Menus (Меню)

| Компонент          | Опис                    |
| ------------------ | ----------------------- |
| `SidebarMenu.vue`  | Десктопне меню сайдбару |
| `SidebarMMenu.vue` | Мобільне меню сайдбару  |
| `OptionsMenu.vue`  | Контекстне меню опцій   |

---

## Cards (Картки)

| Компонент      | Опис                           |
| -------------- | ------------------------------ |
| `StatCard.vue` | Картка з показником статистики |
| `StatList.vue` | Список показників статистики   |

---

## Helpdesk Plugin

Файл: `src/plugins/helpdesk.plugin.js`

Глобальний плагін, що надає доступ до auth-стану та системних функцій через `$helpdesk` та `inject('helpdesk')`.

```javascript
// У компоненті
const helpdesk = inject('helpdesk');

// Або через Options API
this.$helpdesk.isAdmin;
this.$helpdesk.scope('request:create');
this.$helpdesk.notImplemented();
```

### Властивості

| Властивість   | Тип       | Опис                  |
| ------------- | --------- | --------------------- |
| `version`     | `String`  | Версія застосунку     |
| `copyright`   | `String`  | Текст копірайту       |
| `user`        | `Object`  | Профіль користувача   |
| `loggedIn`    | `Boolean` | Статус авторизації    |
| `isAdmin`     | `Boolean` | Чи є адміністратором  |
| `isManager`   | `Boolean` | Чи є менеджером       |
| `isSupport`   | `Boolean` | Чи є підтримкою       |
| `isClient`    | `Boolean` | Чи є клієнтом         |
| `isActivated` | `Boolean` | Чи активований акаунт |

### Методи

#### `scope(scopeKey: string): boolean`

Перевіряє наявність конкретного права доступу. Для адміністратора завжди повертає `true`.

```javascript
if (helpdesk.scope('ipaddress:create')) {
  // Показати кнопку "Додати"
}
```

#### `notImplemented()`

Показує toast-сповіщення "Функціонал ще не реалізований".
