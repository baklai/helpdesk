import { defineConfig } from 'vitepress';

export default defineConfig({
  base: '/docs/',

  title: 'Helpdesk',
  description: 'Документація системи сервісної підтримки',
  lang: 'uk-UA',

  themeConfig: {
    logo: '/logo.svg',
    siteTitle: 'Helpdesk Docs',

    nav: [
      { text: 'Головна', link: '/' },
      { text: 'Застосунок', link: '/app/overview' },
      { text: 'API', link: '/guide/api/overview' }
    ],

    sidebar: [
      {
        text: 'Початок роботи',
        items: [
          { text: 'Огляд системи', link: '/' },
          { text: 'Встановлення', link: '/installation' },
          { text: 'Авторизація', link: '/auth' }
        ]
      },
      {
        text: 'API — Серверна частина',
        items: [
          { text: 'Огляд API', link: '/api/overview' },
          { text: 'Автентифікація', link: '/api/auth' },
          { text: 'Користувачі', link: '/api/users' },
          { text: 'Контроль доступу', link: '/api/access-control' },
          { text: 'Модулі', link: '/api/modules' },
          { text: 'GraphQL-запити', link: '/api/graphql' },
          { text: 'BaseCrudService', link: '/api/base-service' }
        ]
      },
      {
        text: 'App — Клієнтська частина',
        items: [
          { text: 'Огляд застосунку', link: '/app/overview' },
          { text: 'Маршрутизація', link: '/app/routing' },
          { text: 'Стани (Stores)', link: '/app/stores' },
          { text: 'Компоненти', link: '/app/components' },
          { text: 'Apollo Client', link: '/app/apollo' }
        ]
      }
    ],

    socialLinks: [{ icon: 'github', link: 'https://github.com/baklai/helpdesk' }],

    footer: {
      message: 'Опубліковано за ліцензією MIT.',
      copyright: '© 2026 Helpdesk. Всі права захищені.'
    },

    outline: {
      label: 'На цій сторінці'
    },

    docFooter: {
      prev: 'Попередня',
      next: 'Наступна'
    },

    darkModeSwitchLabel: 'Тема',
    lightModeSwitchTitle: 'Світла тема',
    darkModeSwitchTitle: 'Темна тема',
    sidebarMenuLabel: 'Меню',
    returnToTopLabel: 'Вгору'
  }
});
