import { useAuthStore } from '@/stores/auth.store';
import {
  mdiAccountMultipleOutline,
  mdiAt,
  mdiBookOpenOutline,
  mdiCalendarMonthOutline,
  mdiChartBarStacked,
  mdiCogOutline,
  mdiFinance,
  mdiHome,
  mdiIpNetworkOutline,
  mdiIpOutline,
  mdiLanConnect,
  mdiMathLog,
  mdiMonitorDashboard,
  mdiViewDashboardOutline,
  mdiWebCancel,
  mdiWebRemove
} from '@mdi/js';
import { createRouter, createWebHashHistory, RouterView } from 'vue-router';

import { useScopeStore } from '@/stores/scopes.store';

const router = createRouter({
  history: createWebHashHistory('/app'),
  routes: [
    {
      path: '/',
      component: () => import('@/layouts/PublicLayout.vue'),
      meta: { guestOnly: true },
      redirect: { name: 'home' },
      children: [
        {
          path: 'signin',
          name: 'signin',
          component: () => import('@/views/auth/SigninView.vue'),
          meta: { title: 'Вхід у додаток' }
        },
        {
          path: 'signup',
          name: 'signup',
          component: () => import('@/views/auth/SignupView.vue'),
          meta: { title: 'Реєстрація у додатку' }
        },
        {
          path: 'forgot-password',
          name: 'forgot-password',
          component: () => import('@/views/auth/ForgotView.vue'),
          meta: { title: 'Відновлення пароля' }
        }
      ]
    },

    {
      path: '/',
      component: () => import('@/layouts/PrivateLayout.vue'),
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          name: 'home',
          component: () => import('@/views/HomeView.vue'),
          meta: {
            icon: mdiHome,
            title: 'Сервісна підтримка',
            description: 'Веб-додаток сервісної підтримки'
          }
        },
        {
          path: 'events',
          name: 'events',
          component: () => import('@/views/CalendarView.vue'),
          meta: {
            icon: mdiCalendarMonthOutline,
            title: 'Календар подій',
            description: 'Календар подій сервісної підтримки',
            permissions: ['event:read']
          }
        },
        {
          path: 'channels',
          component: RouterView,
          children: [
            {
              path: '',
              name: 'channels',
              component: () => import('@/views/channel/ChannelView.vue'),
              meta: {
                icon: mdiLanConnect,
                title: 'Мережеві канали',
                description: 'Мережеві канали сервісної підтримки',
                permissions: ['channel:read']
              }
            },
            {
              path: 'new',
              name: 'channel-new',
              component: () => import('@/views/channel/ChannelCreateView.vue'),
              meta: {
                icon: mdiLanConnect,
                title: 'Новий мережевий канал',
                description: 'Мережеві канали сервісної підтримки',
                permissions: ['channel:create']
              }
            },
            {
              path: ':id',
              name: 'channel-detail',
              props: true,
              component: () => import('@/views/channel/ChannelDetailView.vue'),
              meta: {
                icon: mdiLanConnect,
                title: 'Мережевий канал',
                description: 'Деталі мережевого каналу',
                permissions: ['channel:read']
              }
            },
            {
              path: ':id/edit',
              name: 'channel-edit',
              props: true,
              component: () => import('@/views/channel/ChannelEditView.vue'),
              meta: {
                icon: mdiLanConnect,
                title: 'Оновлення мережевого каналу',
                description: 'Мережеві канали сервісної підтримки',
                permissions: ['channel:update']
              }
            }
          ]
        },
        {
          path: 'ipaddresses',
          component: RouterView,
          children: [
            {
              path: '',
              name: 'ipaddresses',
              component: () => import('@/views/ipaddress/IPAddressView.vue'),
              meta: {
                icon: mdiIpNetworkOutline,
                title: 'IP-адреси мережі',
                description: 'Мережеві IP-адреси сервісної підтримки',
                permissions: ['ipaddress:read']
              }
            },
            {
              path: 'new',
              name: 'ipaddress-new',
              component: () => import('@/views/ipaddress/IPAddressCreateView.vue'),
              meta: {
                icon: mdiIpOutline,
                title: 'Нова IP-адреса мережі',
                description: 'Створення нового запису IP-адреси',
                permissions: ['ipaddress:create']
              }
            },
            {
              path: ':id',
              name: 'ipaddress-detail',
              props: true,
              component: () => import('@/views/ipaddress/IPAddressDetailView.vue'),
              meta: {
                icon: mdiIpOutline,
                title: 'IP-адреса мережі',
                description: 'Деталі IP-адреси мережі',
                permissions: ['ipaddress:read']
              }
            },
            {
              path: ':id/edit',
              name: 'ipaddress-edit',
              props: true,
              component: () => import('@/views/ipaddress/IPAddressEditView.vue'),
              meta: {
                icon: mdiIpOutline,
                title: 'Оновлення IP-адреси мережі',
                description: 'Мережеві IP-адреси сервісної підтримки',
                permissions: ['ipaddress:update']
              }
            }
          ]
        },
        {
          path: 'mailboxes',
          component: RouterView,
          children: [
            {
              path: '',
              name: 'mailboxes',
              component: () => import('@/views/mailbox/MailboxView.vue'),
              meta: {
                icon: mdiAt,
                title: 'Поштові скриньки',
                description: 'Електронні скриньки сервісної підтримки',
                permissions: ['mailbox:read']
              }
            },
            {
              path: 'new',
              name: 'mailbox-new',
              component: () => import('@/views/mailbox/MailboxCreateView.vue'),
              meta: {
                icon: mdiAt,
                title: 'Поштові скриньки',
                description: 'Електронні скриньки сервісної підтримки',
                permissions: ['mailbox:create']
              }
            },
            {
              path: ':id',
              name: 'mailbox-detail',
              props: true,
              component: () => import('@/views/mailbox/MailboxDetailView.vue'),
              meta: {
                icon: mdiAt,
                title: 'Поштова скринька',
                description: 'Деталі поштової скриньки',
                permissions: ['mailbox:read']
              }
            },
            {
              path: ':id/edit',
              name: 'mailbox-edit',
              props: true,
              component: () => import('@/views/mailbox/MailboxEditView.vue'),
              meta: {
                icon: mdiAt,
                title: 'Поштові скриньки',
                description: 'Електронні скриньки сервісної підтримки',
                permissions: ['mailbox:update']
              }
            }
          ]
        },
        {
          path: 'requests',
          component: RouterView,
          children: [
            {
              path: '',
              name: 'requests',
              component: () => import('@/views/request/RequestView.vue'),
              meta: {
                icon: mdiBookOpenOutline,
                title: 'Сервісна підтримка',
                description: 'Журнал сервісної підтримки клієнтів',
                permissions: ['request:read']
              }
            },
            {
              path: 'new',
              name: 'request-new',
              component: () => import('@/views/request/RequestCreateView.vue'),
              meta: {
                icon: mdiBookOpenOutline,
                title: 'Сервісна підтримка',
                description: 'Створення нового запиту',
                permissions: ['request:create']
              }
            },
            {
              path: ':id',
              name: 'request-detail',
              props: true,
              component: () => import('@/views/request/RequestDetailView.vue'),
              meta: {
                icon: mdiBookOpenOutline,
                title: 'Сервісна підтримка',
                description: 'Деталі запиту сервісної підтримки',
                permissions: ['request:read']
              }
            },
            {
              path: ':id/edit',
              name: 'request-edit',
              props: true,
              component: () => import('@/views/request/RequestEditView.vue'),
              meta: {
                icon: mdiBookOpenOutline,
                title: 'Сервісна підтримка',
                description: 'Журнал сервісної підтримки клієнтів',
                permissions: ['request:update']
              }
            }
          ]
        },
        {
          path: 'inspectors',
          name: 'inspectors',
          component: () => import('@/views/inspector/InspectorView.vue'),
          meta: {
            icon: mdiMonitorDashboard,
            title: 'ПК SysInspector',
            description: 'ПК SysInspector сервіс сервісної підтримки'
          }
        },
        {
          path: 'reports',
          component: RouterView,
          children: [
            {
              path: '',
              name: 'reports',
              component: () => import('@/views/report/ReportView.vue'),
              meta: {
                icon: mdiFinance,
                title: 'Сервісні звіти',
                description: 'Звіти сервісної підтримки',
                permissions: ['report:read']
              }
            },
            {
              path: 'new',
              name: 'report-new',
              component: () => import('@/views/report/ReportCreateView.vue'),
              meta: {
                icon: mdiFinance,
                title: 'Сервісні звіти',
                description: 'Звіти сервісної підтримки',
                permissions: ['report:create']
              }
            },
            {
              path: ':id',
              name: 'report-detail',
              props: true,
              component: () => import('@/views/report/ReportDetailView.vue'),
              meta: {
                icon: mdiFinance,
                title: 'Сервісний звіт',
                description: 'Деталі шаблону звіту',
                permissions: ['report:read']
              }
            },
            {
              path: ':id/edit',
              name: 'report-edit',
              props: true,
              component: () => import('@/views/report/ReportEditView.vue'),
              meta: {
                title: 'Сервісні звіти',
                description: 'Звіти сервісної підтримки',
                permissions: ['report:update']
              }
            }
          ]
        },
        {
          path: 'statistic',
          component: RouterView,
          children: [
            {
              path: 'network',
              name: 'network-statistic',
              component: () => import('@/views/statistic/NetworkStatisticView.vue'),
              meta: {
                icon: mdiChartBarStacked,
                title: 'Статистика мережі',
                description: 'Статистика мережі сервісної підтримки'
              }
            },
            {
              path: 'mailbox',
              name: 'mailbox-statistic',
              component: () => import('@/views/statistic/MailboxStatisticView.vue'),
              meta: {
                icon: mdiChartBarStacked,
                title: 'Статистика сервісу',
                description: 'Статистика серверу електронної пошти сервісної підтримки'
              }
            },
            {
              path: 'request',
              name: 'request-statistic',
              component: () => import('@/views/statistic/RequestStatisticView.vue'),
              meta: {
                icon: mdiChartBarStacked,
                title: 'Статистика сервісу',
                description: 'Статистика журналу заявок сервісної підтримки'
              }
            },
            {
              path: 'inspector',
              name: 'inspector-statistic',
              component: () => import('@/views/statistic/InspectorStatisticView.vue'),
              meta: {
                icon: mdiChartBarStacked,
                title: 'Статистика сервісу',
                description: 'Статистика ПК SysInspector сервісної підтримки'
              }
            }
          ]
        },
        {
          path: 'users',
          component: RouterView,
          children: [
            {
              path: '',
              name: 'users',
              component: () => import('@/views/user/UserView.vue'),
              meta: {
                icon: mdiAccountMultipleOutline,
                title: 'Користувачі',
                description: 'Управління акаунтами системи',
                permissions: ['user:read']
              }
            },
            {
              path: 'new',
              name: 'user-new',
              component: () => import('@/views/user/UserCreateView.vue'),
              meta: {
                icon: mdiAccountMultipleOutline,
                title: 'Користувачі',
                description: 'Профільні акаунти сервісної підтримки',
                permissions: ['user:create']
              }
            },
            {
              path: ':id',
              name: 'user-detail',
              props: true,
              component: () => import('@/views/user/UserDetailView.vue'),
              meta: {
                icon: mdiAccountMultipleOutline,
                title: 'Користувач',
                description: 'Деталі облікового запису користувача',
                permissions: ['user:read']
              }
            },
            {
              path: ':id/edit',
              name: 'user-edit',
              props: true,
              component: () => import('@/views/user/UserEditView.vue'),
              meta: {
                icon: mdiAccountMultipleOutline,
                title: 'Користувачі',
                description: 'Профільні акаунти сервісної підтримки',
                permissions: ['user:update']
              }
            }
          ]
        },
        {
          path: '/',
          component: RouterView,
          meta: { requiresAdmin: true },
          children: [
            {
              path: 'dashboard',
              name: 'dashboard',
              component: () => import('@/views/DashboardView.vue'),
              meta: {
                icon: mdiViewDashboardOutline,
                title: 'Панель статистики',
                description: 'Інформаційна панель статистики'
              }
            },
            {
              path: 'settings',
              name: 'settings',
              component: () => import('@/views/SettingsView.vue'),
              meta: {
                icon: mdiCogOutline,
                title: 'Налаштування',
                description: 'Налаштування системи'
              }
            },
            {
              path: 'log-audit',
              name: 'log-audit',
              component: () => import('@/views/LogAuditView.vue'),
              meta: {
                icon: mdiMathLog,
                title: 'Аудит активності',
                description: 'Журнал аудиту сервісної підтримки'
              }
            }
          ]
        },

        {
          path: 'access-denied',
          name: 'access-denied',
          component: () => import('@/views/error/AccessDeniedView.vue'),
          meta: {
            icon: mdiWebCancel,
            title: 'Доступ заборонено',
            description: 'Веб-додаток сервісної підтримки'
          }
        },

        {
          path: ':pathMatch(.*)*',
          name: 'not-found',
          component: () => import('@/views/error/NotFoundView.vue'),
          meta: {
            icon: mdiWebRemove,
            title: 'Сторінку не знайдено',
            description: 'Веб-додаток сервісної підтримки'
          }
        }
      ]
    }
  ]
});

router.beforeEach(async (to, _from) => {
  const authStore = useAuthStore();
  const { hasScope } = useScopeStore();

  const baseTitle = 'HD';
  const pageTitle = to.meta.title || 'Сервісна підтримка';
  document.title = `${baseTitle} • ${pageTitle}`;

  const description = to.meta.description;
  if (description) {
    const metaTag = document.querySelector('meta[name="description"]');
    if (metaTag) metaTag.setAttribute('content', description);
  }

  if (!authStore.loggedIn && to.meta.requiresAuth) {
    try {
      await authStore.me();
    } catch {
      return { name: 'signin' };
    }
  }

  if (to.meta.requiresAuth && !authStore.loggedIn) {
    return { name: 'signin' };
  }

  if (to.meta.requiresAdmin && !authStore.isAdmin) {
    return { name: 'access-denied' };
  }

  if (to.meta.permissions?.length && !authStore.isAdmin) {
    if (!hasScope(authStore.user?.scope, to.meta.permissions)) {
      return { name: 'access-denied' };
    }
  }

  return true;
});

export default router;
