# Авторизація

Система використовує JWT-автентифікацію з парою токенів: **access token** (короткочасний) та **refresh token** (довготривалий). Токени зберігаються в HTTP-only cookies.

## Реєстрація

```graphql
mutation Signup($input: SignupAuthInput!) {
  signup(input: $input) {
    id
    fullname
    email
    status
    role
  }
}
```

**Вхідні дані (`SignupAuthInput`):**

| Поле       | Тип       | Опис             |
| ---------- | --------- | ---------------- |
| `email`    | `String!` | Електронна пошта |
| `fullname` | `String!` | Повне ім'я       |
| `phone`    | `String!` | Номер телефону   |
| `password` | `String!` | Пароль           |

Після реєстрації обліковий запис отримує статус `pending` та роль `client`. Адміністратор активує запис вручну.

## Вхід у систему

```graphql
mutation Signin($input: SigninAuthInput!) {
  signin(input: $input) # Повертає access token (String)
}
```

**Вхідні дані (`SigninAuthInput`):**

| Поле       | Тип       | Опис             |
| ---------- | --------- | ---------------- |
| `email`    | `String!` | Електронна пошта |
| `password` | `String!` | Пароль           |

У разі успіху повертається `accessToken` (рядок), а `refreshToken` встановлюється в HTTP-only cookie.

## Отримання профілю

```graphql
query Me {
  me {
    id
    fullname
    email
    phone
    status
    role
    scope
    createdAt
    updatedAt
  }
}
```

Вимагає валідного access token у заголовку `Authorization: Bearer <token>`.

## Оновлення токену

```graphql
mutation Refresh {
  refresh # Повертає новий access token
}
```

Використовує refresh token з cookie. Виконується автоматично клієнтом при отриманні помилки `UNAUTHENTICATED`.

## Вихід із системи

```graphql
mutation Signout {
  signout # Повертає Boolean
}
```

Видаляє refresh token із бази даних та очищає cookie.

## Статуси облікового запису

| Статус     | Опис                                  |
| ---------- | ------------------------------------- |
| `pending`  | Очікує активації адміністратором      |
| `active`   | Активний, доступ дозволено            |
| `blocked`  | Заблокований адміністратором          |
| `disabled` | Деактивований (наприклад, звільнення) |

## Помилки автентифікації

| Код            | Повідомлення                           | Причина           |
| -------------- | -------------------------------------- | ----------------- |
| `UNAUTHORIZED` | Користувача з такою поштою не знайдено | Невірний email    |
| `UNAUTHORIZED` | Обліковий запис ще не активовано       | Статус `pending`  |
| `UNAUTHORIZED` | Обліковий запис вимкнено               | Статус `disabled` |
| `UNAUTHORIZED` | Обліковий запис заблоковано            | Статус `blocked`  |
| `BAD_REQUEST`  | Неправильний пароль                    | Невірний пароль   |
