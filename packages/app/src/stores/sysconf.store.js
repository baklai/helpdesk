import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

import { apolloClient } from '@/graphql/apollo.client';
import { FIND_ALL_SYSCONFS, UPSERT_ONE_SYSCONF } from '@/graphql/apollo.gql';

export const useSysConfStore = defineStore('sysconf', () => {
  const sysconflist = ref();

  const options = computed(() => {
    if (!sysconflist.value) return {};
    return Object.fromEntries(sysconflist.value.map(({ key, value }) => [key, value]));
  });

  async function find() {
    try {
      const { data } = await apolloClient.query({
        query: FIND_ALL_SYSCONFS,
        fetchPolicy: 'no-cache'
      });
      sysconflist.value = data.sysconfs;
    } catch {
      sysconflist.value = [];
    }
  }

  async function upsert({ key, value }) {
    try {
      await apolloClient.mutate({
        mutation: UPSERT_ONE_SYSCONF,
        fetchPolicy: 'no-cache',
        variables: { input: { key, value } }
      });

      await find();
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async function initSysConf() {
    await find();
  }

  return {
    options,
    upsert,
    initSysConf
  };
});
