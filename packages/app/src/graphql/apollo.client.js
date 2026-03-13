import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  InMemoryCache,
  Observable,
  from
} from '@apollo/client/core';
import { onError } from '@apollo/client/link/error';

import { REFRESH } from '@/graphql/apollo.gql';
import router from '@/router';
import { useAuthStore } from '@/stores/auth.store';

let refreshPromise = null;

/**
 * Оголошуємо як `let` щоб refreshAccessToken міг посилатися на змінну
 * до присвоєння — виклик відбувається лише після ініціалізації клієнта,
 * але явна форма усуває залежність від порядку оголошення.
 *
 * @type {ApolloClient}
 */
let apolloClient;

const httpLink = new HttpLink({
  uri: import.meta.env.VITE_API_BASE_URL,
  credentials: 'include'
});

const authLink = new ApolloLink((operation, forward) => {
  const authStore = useAuthStore();

  if (authStore.token) {
    operation.setContext(({ headers = {} }) => ({
      headers: {
        ...headers,
        Authorization: `Bearer ${authStore.token}`
      }
    }));
  }

  return forward(operation);
});

async function refreshAccessToken() {
  const authStore = useAuthStore();

  const { data } = await apolloClient.mutate({
    mutation: REFRESH,
    fetchPolicy: 'no-cache'
  });

  authStore.setToken(data.refresh);
  return data.refresh;
}

const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
  if (import.meta.env.DEV) {
    if (graphQLErrors) {
      graphQLErrors.forEach(({ message, path }) =>
        console.error(`[GraphQL error]: Message: ${message}, Path: ${path}`)
      );
    }

    if (networkError) console.error(`[Network error]: ${networkError}`);
  }

  const unauth = graphQLErrors?.some(error => error.extensions?.code === 'UNAUTHENTICATED');

  if (!unauth) return;

  if (operation.operationName === 'Refresh' || operation.operationName === 'Signout') {
    return;
  }

  if (!forward) return;

  if (!refreshPromise) {
    refreshPromise = refreshAccessToken().finally(() => (refreshPromise = null));
  }

  return new Observable(observer => {
    let innerSub;
    let active = true;

    refreshPromise
      .catch(() => {
        const authStore = useAuthStore();
        authStore.clearSession();
        router.push({ name: 'signin' }).catch(() => {
          window.location.href = '/signin';
        });
        return null;
      })
      .then(token => {
        if (!active || !token) {
          observer.complete();
          return;
        }
        operation.setContext({
          headers: { Authorization: `Bearer ${token}` }
        });
        innerSub = forward(operation).subscribe({
          next: value => observer.next(value),
          error: err => observer.error(err),
          complete: () => observer.complete()
        });
      })
      .catch(err => observer.error(err));

    return () => {
      active = false;
      if (innerSub) innerSub.unsubscribe();
    };
  });
});

apolloClient = new ApolloClient({
  link: from([errorLink, authLink, httpLink]),
  cache: new InMemoryCache(),
  devtools: {
    enabled: import.meta.env.DEV
  }
});

export { apolloClient };
