import { useAuthStore } from '@/stores/auth.store';
import { useScopeStore } from '@/stores/scopes.store';
import { useSysConfStore } from '@/stores/sysconf.store';

export default {
  install: (app, options) => {
    const { $toast } = app.config.globalProperties;

    const authStore = useAuthStore();
    const sysConfStore = useSysConfStore();
    const scopeStore = useScopeStore();

    app.config.globalProperties.$helpdesk = {
      ...options,

      get user() {
        return authStore?.user;
      },

      get loggedIn() {
        return authStore?.loggedIn;
      },

      get isAdmin() {
        return authStore?.isAdmin;
      },

      get isManager() {
        return authStore?.isManager;
      },

      get isSupport() {
        return authStore?.isSupport;
      },

      get isClient() {
        return authStore?.isClient;
      },

      get isActivated() {
        return authStore?.isActivated;
      },

      get settings() {
        return sysConfStore?.options;
      },

      scope(permission) {
        if (authStore?.isAdmin) return true;
        return scopeStore.hasScope(authStore?.user?.scope, permission);
      },

      notImplemented() {
        $toast.add({
          severity: 'info',
          summary: 'Інформація',
          detail: 'Цей функціонал ще не реалізований',
          life: 5000
        });
      }
    };

    app.provide('helpdesk', app.config.globalProperties.$helpdesk);
  }
};
