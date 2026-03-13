# Автентифікація API

## Огляд

Серверна частина реалізує JWT-автентифікацію з двома токенами:

- **Access Token** — короткочасний (15 хвилин за замовчуванням), передається у заголовку `Authorization`
- **Refresh Token** — довготривалий (7 днів), зберігається у HTTP-only cookie та у зашифрованому вигляді в MongoDB

## Стратегії Passport

### AccessTokenStrategy

Файл: `src/auth/strategies/access-token.strategy.ts`

Валідує JWT access token із заголовка `Authorization: Bearer <token>`. Перевіряє підпис за допомогою `JWT_ACCESS_SECRET`.

### RefreshTokenStrategy

Файл: `src/auth/strategies/refresh-token.strategy.ts`

Зчитує refresh token із HTTP-only cookie та валідує його за `JWT_REFRESH_SECRET`.

## Схема токенів

Access token містить у payload:

```typescript
{
  id: string        // ID користувача
  email: string     // Email
  fullname: string  // Повне ім'я
  status: UserStatus
  role: UserRole
  scope: UserScope[]
}
```

## Зберігання refresh токенів

Refresh токени зберігаються у колекції `tokens` у MongoDB у вигляді bcrypt-хешу. При кожному оновленні токену старий замінюється новим.

## GraphQL операції

### `signin(input: SigninAuthInput): String`

Авторизація користувача. Повертає access token. Refresh token встановлюється в cookie.

**Вхідні дані:**

```graphql
input SigninAuthInput {
  email: String!
  password: String!
}
```

### `signup(input: SignupAuthInput): UserEntity`

Реєстрація нового користувача. Новий акаунт отримує роль `client` та статус `pending`.

**Вхідні дані:**

```graphql
input SignupAuthInput {
  email: String!
  fullname: String!
  phone: String!
  password: String!
}
```

### `me: UserEntity`

Отримання профілю поточного авторизованого користувача. Вимагає valid access token.

### `refresh: String`

Оновлення access token за допомогою refresh token з cookie. Повертає новий access token.

### `signout: Boolean`

Вихід із системи. Видаляє refresh token з бази даних.

## Захист резолверів

```typescript
// Тільки автентифікація
@UseGuards(AccessTokenGuard)

// Автентифікація + перевірка ролі
@UseGuards(AccessTokenGuard, UserRoleGuard)
@Role(UserRole.ADMIN)

// Автентифікація + перевірка права доступу
@UseGuards(AccessTokenGuard, UserScopeGuard)
@Scope(UserScope.REQUEST_READ)
```
