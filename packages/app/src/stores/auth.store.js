import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

import { USER_ROLE, USER_STATUS } from '@/constants/enums.const';
import { apolloClient } from '@/graphql/apollo.client';
import { ME, SIGN_IN, SIGN_OUT, SIGN_UP } from '@/graphql/apollo.gql';

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null);
  const token = ref(null);

  const loggedIn = computed(() => !!token.value && !!user.value);
  const isActivated = computed(() => user?.value?.status === USER_STATUS.ACTIVE);
  const isAdmin = computed(() => user?.value?.role === USER_ROLE.ADMIN);
  const isManager = computed(() => user?.value?.role === USER_ROLE.MANAGER);
  const isSupport = computed(() => user?.value?.role === USER_ROLE.SUPPORT);
  const isClient = computed(() => user?.value?.role === USER_ROLE.CLIENT);

  async function me() {
    const { data } = await apolloClient.query({
      query: ME,
      fetchPolicy: 'no-cache'
    });

    user.value = data.me;
  }

  async function signin({ email, password }) {
    const { data } = await apolloClient.mutate({
      mutation: SIGN_IN,
      fetchPolicy: 'no-cache',
      variables: { input: { email, password } }
    });

    token.value = data.signin;

    await me();
  }

  async function signup({ email, fullname, phone, password }) {
    try {
      await apolloClient.mutate({
        mutation: SIGN_UP,
        fetchPolicy: 'no-cache',
        variables: { input: { email, fullname, phone, password } }
      });
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
      clear();
    }
  }

  function setToken(value) {
    token.value = value;
  }

  function clear() {
    user.value = null;
    token.value = null;
  }

  return {
    user,
    token,
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
    setToken,
    clear
  };
});
