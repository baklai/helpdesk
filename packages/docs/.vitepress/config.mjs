import { defineConfig } from 'vitepress';

export default defineConfig({
  title: 'Helpdesk',
  description: 'Документація системи сервісної підтримки',
  lang: 'uk-UA',

  themeConfig: {
    logo: '/logo.svg',
    siteTitle: 'Helpdesk Docs',

    nav: [
      { text: 'Головна', link: '/' },
      { text: 'Керівництво', link: '/guide/' },
      { text: 'API', link: '/api/overview' },
      { text: 'Застосунок', link: '/app/overview' }
    ],

    sidebar: [
      {
        text: 'Початок роботи',
        items: [
          { text: 'Огляд системи', link: '/guide/' },
          { text: 'Встановлення', link: '/guide/installation' },
          { text: 'Авторизація', link: '/guide/auth' }
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

    socialLinks: [],

    footer: {
      message: 'Авторські права © 2026 Helpdesk. Всі права захищені.'
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
