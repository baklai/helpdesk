import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';

import { USER_ROLE, USER_STATUS } from '@/constants/enums.const';
import { apolloClient } from '@/graphql/apollo.client';
import { ME, REFRESH, SIGN_IN, SIGN_OUT, SIGN_UP } from '@/graphql/apollo.gql';
import { useScopeStore } from '@/stores/scopes.store';

export const useAuthStore = defineStore('auth', () => {
  const router = useRouter();
  const { toList } = useScopeStore();

  const user = ref(null);
  const token = ref(null);

  const scopeMask = computed(() => user?.value?.scope ?? null);
  const scopeList = computed(() => toList(user?.value?.scope));

  const loggedIn = computed(() => !!token.value && !!user.value);
  const isActivated = computed(() => user?.value?.status === USER_STATUS.ACTIVE);
  const isAdmin = computed(() => user?.value?.role === USER_ROLE.ADMIN);
  const isManager = computed(() => user?.value?.role === USER_ROLE.MANAGER);
  const isSupport = computed(() => user?.value?.role === USER_ROLE.SUPPORT);
  const isClient = computed(() => user?.value?.role === USER_ROLE.CLIENT);

  async function me() {
    try {
      const { data: refreshData } = await apolloClient.mutate({
        mutation: REFRESH,
        fetchPolicy: 'no-cache'
      });

      token.value = refreshData.refresh;

      const { data } = await apolloClient.query({
        query: ME,
        fetchPolicy: 'no-cache'
      });

      user.value = data.me;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async function signin({ email, password }) {
    try {
      const { data } = await apolloClient.mutate({
        mutation: SIGN_IN,
        fetchPolicy: 'no-cache',
        variables: { input: { email, password } }
      });

      token.value = data.signin;

      await me();
      await router.push({ name: 'home' });
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async function signup({ email, fullname, phone, password }) {
    try {
      await apolloClient.mutate({
        mutation: SIGN_UP,
        fetchPolicy: 'no-cache',
        variables: { input: { email, fullname, phone, password } }
      });
      await router.push({ name: 'signin' });
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async function signout() {
    try {
      await apolloClient.mutate({
        mutation: SIGN_OUT,
        fetchPolicy: 'no-cache'
      });
    } catch (err) {
      throw new Error(err.message);
    } finally {
      clearSession();
      router.push({ name: 'signin' });
    }
  }

  /**
   * Скидає стан сесії без виклику API.
   * Використовується apollo.client при невдалому refresh-токені,
   * щоб не залежати від Vue-контексту (useRouter недоступний поза setup()).
   */
  function clearSession() {
    user.value = null;
    token.value = null;
  }

  /**
   * Встановлює новий access-токен.
   * Використовується apollo.client після успішного оновлення refresh-токена.
   */
  function setToken(newToken) {
    token.value = newToken;
  }

  return {
    user,
    token,
    scopeMask,
    scopeList,
    loggedIn,
    isActivated,
    isAdmin,
    isManager,
    isSupport,
    isClient,
    me,
    signin,
    signup,
    signout,
    clearSession,
    setToken
  };
});
