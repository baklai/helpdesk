# Apollo Client

## Конфігурація

Файл: `src/graphql/apollo.client.js`

Apollo Client налаштований з трьома ланками (links), з'єднаними через `from([errorLink, authLink, httpLink])`:

```
Request → errorLink → authLink → httpLink → Server
```

## HttpLink

Відправляє GraphQL запити на endpoint, налаштований через змінну середовища:

```javascript
const httpLink = new HttpLink({
  uri: import.meta.env.VITE_API_BASE_URL,
  credentials: 'include' // Включає cookies у запити
});
```

## AuthLink

Додає JWT access token до заголовка `Authorization` кожного запиту:

```javascript
const authLink = new ApolloLink((operation, forward) => {
  if (authStore.token) {
    operation.setContext({
      headers: { Authorization: `Bearer ${authStore.token}` }
    });
  }
  return forward(operation);
});
```

## ErrorLink

Обробляє помилки та реалізує автоматичне оновлення токену.

**Логіка:**

1. У dev-режимі виводить помилки в консоль
2. Якщо помилка `UNAUTHENTICATED` — запускає оновлення токену
3. Операції `Refresh` та `Signout` не ретраються (уникнення циклів)
4. Дедупліює паралельні refresh-запити через `refreshPromise`
5. Після отримання нового токену повторює оригінальний запит

```javascript
const errorLink = onError(({ graphQLErrors, operation, forward }) => {
  const unauth = graphQLErrors?.some(e => e.extensions?.code === 'UNAUTHENTICATED');

  if (!unauth) return;

  // Один refresh на всі паралельні запити
  if (!refreshPromise) {
    refreshPromise = refreshAccessToken().finally(() => (refreshPromise = null));
  }

  return new Observable(observer => {
    refreshPromise
      .catch(() => {
        authStore.profile = null;
        authStore.token = null;
      })
      .then(token => {
        if (!token) {
          observer.complete();
          return;
        }
        // Повторити запит з новим токеном
        operation.setContext({ headers: { Authorization: `Bearer ${token}` } });
        forward(operation).subscribe(observer);
      });
  });
});
```

## GQL файл

Файл: `src/graphql/apollo.gql.js`

Містить усі GraphQL операції застосунку у вигляді іменованих констант:

```javascript
import { ME, SIGN_IN, FIND_ALL_REQUESTS, ... } from '@/graphql/apollo.gql';
```

Всі операції задокументовані у розділі [GraphQL-запити](/api/graphql).

## Використання у компонентах

```javascript
import { useQuery, useMutation } from '@vue/apollo-composable';
import { FIND_ALL_REQUESTS, CREATE_ONE_REQUEST } from '@/graphql/apollo.gql';

// Query
const { result, loading, error } = useQuery(FIND_ALL_REQUESTS, {
  limit: 10,
  offset: 0,
  sort: { createdAt: -1 }
});

// Mutation
const { mutate: createRequest } = useMutation(CREATE_ONE_REQUEST);
await createRequest({ input: { ... } });
```

## Змінні середовища

```env
# packages/app/.env
VITE_API_BASE_URL=http://localhost:3000/api
```
