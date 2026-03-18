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

let refreshTokenPromise = null;
let apolloClient = null;

async function refreshAccessToken() {
  if (refreshTokenPromise) {
    return refreshTokenPromise;
  }

  refreshTokenPromise = (async () => {
    try {
      const authStore = useAuthStore();

      const { data } = await apolloClient.mutate({
        mutation: REFRESH,
        fetchPolicy: 'no-cache'
      });

      if (!data?.refresh) {
        throw new Error('Failed to refresh token');
      }

      authStore.setToken(data.refresh);

      return data.refresh;
    } finally {
      refreshTokenPromise = null;
    }
  })();

  return refreshTokenPromise;
}

const httpLink = new HttpLink({
  uri: import.meta.env.VITE_API_BASE_URL || '/api',
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

const errorLink = onError(({ graphQLErrors, operation, forward }) => {
  if (!graphQLErrors) return;

  for (const err of graphQLErrors) {
    if (operation.operationName === 'Refresh') return;

    if (err?.extensions?.code == 401 || err?.message === 'Unauthorized') {
      return new Observable(observer => {
        refreshAccessToken()
          .then(newToken => {
            const oldHeaders = operation?.getContext()?.headers || {};
            operation.setContext({
              headers: {
                ...oldHeaders,
                authorization: `Bearer ${newToken}`
              }
            });
            forward(operation).subscribe({
              next: observer.next.bind(observer),
              error: observer.error.bind(observer),
              complete: observer.complete.bind(observer)
            });
          })
          .catch(error => {
            const authStore = useAuthStore();

            authStore.clear();

            router.push({ name: 'signin' }).catch(() => {
              window.location.href = '/app/signin';
            });

            observer.error(error);
          });
      });
    }
  }
});

apolloClient = new ApolloClient({
  link: from([errorLink, authLink, httpLink]),
  cache: new InMemoryCache(),
  devtools: {
    enabled: import.meta.env.DEV
  }
});

export { apolloClient };
