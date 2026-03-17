<script setup>
import { mdiShieldAccountOutline } from '@mdi/js';
import { computed } from 'vue';

import { USER_ROLES } from '@/constants/ui.const';
import { useAuthStore } from '@/stores/auth.store';
import { useScopeStore } from '@/stores/scopes.store';

defineProps({
  visible: Boolean
});

defineEmits(['update:visible']);

const authStore = useAuthStore();
const { getScopeLength } = useScopeStore();

const user = computed(() => authStore?.user);
const userRole = computed(() => USER_ROLES.find(role => role.key === authStore?.user?.role));
const userScopeLength = computed(() =>
  authStore?.user?.scope ? getScopeLength(authStore.user.scope) : 0
);
</script>

<template>
  <Dialog
    class="w-full max-w-200"
    closable
    dismissableMask
    :draggable="false"
    modal
    position="top"
    :visible="visible"
    @update:visible="$emit('update:visible', !visible)"
  >
    <template #header>
      <div class="flex items-center">
        <div class="flex items-center">
          <Avatar class="mr-4" icon="pi pi-user" size="large" />
          <div>
            <p class="m-0 font-bold">
              {{ user?.fullname }}
            </p>
            <p class="line-height-3 text-surface-500 m-0">
              {{ user?.email }}
            </p>
          </div>
        </div>
      </div>
    </template>

    <div class="flex flex-1 flex-col gap-4 px-2 py-6">
      <div class="flex flex-col gap-4">
        <div class="flex flex-col gap-y-1">
          <p class="text-muted-color text-xs font-medium tracking-wide uppercase">
            Прізвище та ім'я
          </p>
          <p class="text-primary-500 text-xl font-bold">{{ user.fullname || '-' }}</p>
        </div>

        <div class="flex flex-row flex-wrap gap-4">
          <div class="flex min-w-[calc(50%-0.5rem)] flex-1 flex-col gap-y-1">
            <p class="text-muted-color text-xs font-medium tracking-wide uppercase">
              Електронна пошта
            </p>
            <p class="text-base">{{ user.email || '-' }}</p>
          </div>

          <div class="flex min-w-[calc(50%-0.5rem)] flex-1 flex-col gap-y-1">
            <p class="text-muted-color text-xs font-medium tracking-wide uppercase">
              Номер телефону
            </p>
            <p class="text-base">{{ user.phone || '-' }}</p>
          </div>
        </div>
      </div>

      <Divider type="dashed" />

      <div class="flex flex-col gap-3">
        <div class="flex items-center justify-between">
          <div class="flex flex-col gap-y-1">
            <p class="text-muted-color text-xs font-medium tracking-wide uppercase">Поточна роль</p>
            <p class="text-base font-medium">{{ userRole.key }}</p>
          </div>
          <Tag :value="userRole.label" />
        </div>

        <div class="flex flex-col gap-y-1">
          <p class="text-muted-color text-xs font-medium tracking-wide uppercase">Опис ролі</p>
          <p class="text-base">
            {{ userRole.comment }}
          </p>
        </div>
      </div>

      <Divider type="dashed" />

      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <AppIcon :path="mdiShieldAccountOutline" :size="20" />
          <span class="text-lg font-medium uppercase">Права доступу</span>
        </div>
        <Tag :value="`Надано ${userScopeLength} дозволів`" />
      </div>
    </div>
  </Dialog>
</template>
