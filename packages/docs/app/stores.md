# Стани (Pinia Stores)

## auth.store.js

Основний стор для управління автентифікацією та профілем користувача.

### Стан

| Властивість | Тип                 | Опис                          |
| ----------- | ------------------- | ----------------------------- |
| `user`      | `Ref<Object\|null>` | Профіль поточного користувача |
| `token`     | `Ref<String\|null>` | JWT access token              |

### Обчислювальні властивості

| Властивість   | Тип        | Опис                                     |
| ------------- | ---------- | ---------------------------------------- |
| `loggedIn`    | `Boolean`  | `true` якщо є і токен, і профіль         |
| `scope`       | `String[]` | Масив прав доступу поточного користувача |
| `isActivated` | `Boolean`  | Статус `active`                          |
| `isAdmin`     | `Boolean`  | Роль `admin`                             |
| `isManager`   | `Boolean`  | Роль `manager`                           |
| `isSupport`   | `Boolean`  | Роль `support`                           |
| `isClient`    | `Boolean`  | Роль `client`                            |

### Методи

#### `me()`

Завантажує профіль поточного користувача через GraphQL query `Me`. Використовується в navigation guard для відновлення сесії.

```javascript
await authStore.me();
```

#### `signin({ email, password })`

Авторизація користувача. Після успіху: зберігає токен, завантажує профіль, перенаправляє на `home`.

```javascript
await authStore.signin({ email: 'user@example.com', password: '...' });
```

#### `signup({ email, fullname, phone, password })`

Реєстрація нового користувача. Після успіху перенаправляє на `signin`.

#### `signout()`

Вихід із системи. Незалежно від результату запиту очищає `user` та `token` і перенаправляє на `signin`.

### Використання у компонентах

```javascript
import { useAuthStore } from '@/stores/auth.store';

const authStore = useAuthStore();

// Перевірка прав
if (authStore.isAdmin) { ... }
if (authStore.scope.includes('request:create')) { ... }
```

---

## scopes.store.js

Стор для роботи з матрицею прав доступу при управлінні користувачами.

### Методи

#### `getDefaultScope()`

Повертає масив об'єктів з усіма ресурсами та всіма правами встановленими в `false`.

```javascript
[
  { scope: 'request', comment: 'Сервісна підтримка', create: false, read: true, update: false, delete: false, notice: false },
  ...
]
```

#### `getSelectScope(select: boolean)`

Повертає матрицю з усіма правами встановленими в `select`.

```javascript
// Вибрати всі права
const allSelected = scopeStore.getSelectScope(true);

// Зняти всі права
const allDeselected = scopeStore.getSelectScope(false);
```

#### `getCustomScope(scopeKeyList: string[])`

Перетворює масив рядків прав (`['request:read', 'user:read']`) у матрицю об'єктів для відображення у UI.

```javascript
const matrix = scopeStore.getCustomScope(['request:read', 'mailbox:create']);
```

#### `getScopeKeyList(scopes: object[])`

Зворотна операція — перетворює матрицю об'єктів у масив рядків прав (для збереження в БД).

```javascript
const keyList = scopeStore.getScopeKeyList(matrix);
// ['request:read', 'mailbox:create']
```

#### `scopeLength()`

Повертає загальну кількість булевих прав у матриці (для прогрес-бару або лічильника).

---

## config.store.js

Стор для зберігання системних налаштувань. Деталі залежать від реалізації.
