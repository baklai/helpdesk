# Користувачі API

## GraphQL-тип

```graphql
type UserEntity {
  id: ID!
  fullname: String!
  email: String!
  phone: String!
  status: UserStatus!
  role: UserRole!
  scope: [String!]!
  createdAt: DateTime!
  updatedAt: DateTime!
}
```

## Queries

### `findAllUsers`

Повертає пагінований список користувачів.

```graphql
query FindAllUsers($limit: Int = 5, $offset: Int = 0, $sort: JSON, $filters: JSON) {
  users: findAllUsers(limit: $limit, offset: $offset, sort: $sort, filters: $filters) {
    totalDocs
    limit
    offset
    totalPages
    page
    docs {
      id
      fullname
      email
      phone
      status
      role
      scope
    }
  }
}
```

**Права доступу:** `user:read`

---

### `findOneUserById`

```graphql
query FindOneUserById($id: ID!) {
  user: findOneUserById(id: $id) {
    id
    fullname
    email
    role
    scope
  }
}
```

**Права доступу:** `user:read`

## Mutations

### `createOneUser`

```graphql
mutation CreateOneUser($input: CreateUserInput!) {
  user: createOneUser(input: $input) {
    id
    fullname
    email
  }
}
```

**Вхідні дані `CreateUserInput`:**

| Поле       | Тип          | Опис                                |
| ---------- | ------------ | ----------------------------------- |
| `fullname` | `String!`    | Повне ім'я                          |
| `email`    | `String!`    | Електронна пошта (унікальне)        |
| `phone`    | `String!`    | Телефон                             |
| `password` | `String!`    | Пароль (хешується bcrypt)           |
| `status`   | `UserStatus` | Статус (за замовчуванням `pending`) |
| `role`     | `UserRole`   | Роль (за замовчуванням `client`)    |
| `scope`    | `[String!]`  | Права доступу                       |

**Права доступу:** `user:create`

---

### `updateOneUserById`

```graphql
mutation UpdateOneUserById($id: ID!, $input: UpdateUserInput!) {
  user: updateOneUserById(id: $id, input: $input) {
    id
    fullname
    status
    role
    scope
  }
}
```

**Права доступу:** `user:update`

---

### `removeOneUserById`

```graphql
mutation RemoveOneUserById($id: ID!) {
  user: removeOneUserById(id: $id) {
    id
    fullname
  }
}
```

**Права доступу:** `user:delete`

## Пагінація

Всі списки повертаються у форматі `mongoose-paginate-v2`:

```typescript
{
  totalDocs: number      // Загальна кількість записів
  limit: number          // Ліміт на сторінку
  offset: number         // Зміщення
  totalPages: number     // Кількість сторінок
  page: number           // Поточна сторінка
  pagingCounter: number
  hasPrevPage: boolean
  hasNextPage: boolean
  prevPage: number | null
  nextPage: number | null
  docs: TEntity[]        // Записи поточної сторінки
}
```
