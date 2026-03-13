<script setup>
import { mdiLogin, mdiLogout } from '@mdi/js';

import { useAuthStore } from '@/stores/auth.store';

const authStore = useAuthStore();
</script>

<template>
  <Button
    v-tooltip.top="$helpdesk.loggedIn ? 'Вийти' : 'Увійти'"
    rounded
    severity="secondary"
    variant="text"
    @click="$helpdesk?.loggedIn ? authStore.signout() : $router.push({ name: 'signin' })"
  >
    <template #icon>
      <AppIcon :path="$helpdesk.loggedIn ? mdiLogout : mdiLogin" :size="22" />
    </template>
  </Button>
</template>
