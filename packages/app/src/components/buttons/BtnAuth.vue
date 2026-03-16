<script setup>
import { mdiLogin, mdiLogout } from '@mdi/js';
import { useRouter } from 'vue-router';

import { useAuthStore } from '@/stores/auth.store';

const router = useRouter();
const authStore = useAuthStore();

const handleBtnClick = () => {
  if (authStore.loggedIn) {
    authStore.signout();
  }

  router.push({ name: 'signin' });
};
</script>

<template>
  <Button
    v-tooltip.top="$helpdesk.loggedIn ? 'Вийти' : 'Увійти'"
    rounded
    severity="secondary"
    variant="text"
    @click="handleBtnClick"
  >
    <template #icon>
      <AppIcon :path="$helpdesk.loggedIn ? mdiLogout : mdiLogin" :size="22" />
    </template>
  </Button>
</template>
