import dotenv from 'dotenv';
import path from 'path';

import { name, version, config } from './package.json';

dotenv.config({
  path:
    process.env.NODE_ENV === 'production'
      ? path.join(__dirname, '.env.prod')
      : path.join(__dirname, '.env.dev')
});

export default {
  telemetry: false,
  ssr: false,

  target: 'static',

  generate: {
    dir: 'client'
  },

  cli: {
    badgeMessages: [`Application: ${name.toUpperCase()}`, `Version:     ${version}`],
    bannerColor: 'blue'
  },

  loading: false,

  loadingIndicator: {
    name: 'cube-grid',
    color: '#F5F5F5',
    background: '#FFFFFF'
  },

  router: {
    prefetchLinks: false
  },

  head: {
    titleTemplate: `${config.app.short_name} • %s`,
    title: config.app.name,
    meta: [
      { charset: 'utf-8' },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1, user-scalable=no'
      },
      {
        hid: 'description',
        name: 'description',
        content: config.app.description
      },
      { name: 'google', content: 'notranslate' }
    ],
    link: [
      { rel: 'stylesheet', href: '/css/loading.css' },
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  components: true,

  css: [
    '@mdi/font/css/materialdesignicons.min.css',
    '~/assets/variables.css',
    '~/assets/vuetify.css'
  ],

  plugins: [
    '~/plugins/clipboard.client',
    '~/plugins/theme.client',
    '~/plugins/helpdesk.client',
    '~/plugins/has-scope.client'
  ],

  buildModules: ['@nuxtjs/vuetify'],

  modules: ['nuxt-route-meta', 'nuxt-socket-io', '@nuxt/content', '@nuxtjs/i18n', '@nuxtjs/toast'],

  io: {
    warnings: false,
    sockets: [
      {
        name: 'helpdesk',
        default: true,
        url:
          process.env.NODE_ENV === 'production'
            ? '/'
            : `http://${process.env.HOST}:${process.env.PORT}`
      }
    ]
  },

  content: {
    apiPrefix: 'content',
    useCache: false
  },

  i18n: {
    lazy: true,
    langDir: 'lang/',
    strategy: 'no_prefix',
    locales: [
      {
        code: 'en',
        iso: 'en-US',
        file: 'en-US.json',
        name: 'English'
      },
      {
        code: 'ru',
        iso: 'ru-RU',
        file: 'ru-RU.json',
        name: 'Русский'
      },
      {
        code: 'uk',
        iso: 'uk-UA',
        file: 'uk-UA.json',
        name: 'Українська'
      }
    ],
    defaultLocale: 'en',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'app.lang',
      redirectOn: 'root'
    },
    vueI18n: {
      fallbackLocale: 'en'
    }
  },

  toast: {
    type: 'default',
    theme: 'toasted-primary',
    position: 'bottom-right',
    icon: 'alert-circle-outline',
    duration: 3000,
    iconPack: 'mdi',
    register: [
      {
        name: 'error',
        message: 'Oops... Something went wrong!',
        options: {
          type: 'error',
          duration: 5000
        }
      }
    ]
  },

  vuetify: {
    font: {
      family:
        '-apple-system, BlinkMacSystemFont, avenir next, avenir, segoe ui, helvetica neue, helvetica, Cantarell, Ubuntu, roboto, noto, arial, sans-serif'
    },
    icons: {
      iconfont: 'mdi'
    },
    defaultAssets: false,
    customVariables: ['~/assets/variables.scss'],
    treeShake: true,
    theme: {
      dark: false,
      options: {
        customProperties: true
      },
      themes: {
        light: {
          background: '#FFFFFF',
          themecolor: '#FFFFFF',
          scrollbar: '#FFFFFF',
          primary: '#1976D2',
          secondary: '#424242',
          accent: '#82B1FF',
          error: '#FF5252',
          info: '#2196F3',
          success: '#4CAF50',
          warning: '#FB8C00',
          thover: '#FAFAFA'
        },
        dark: {
          background: '#333333',
          themecolor: '#333333',
          scrollbar: '#333333',
          primary: '#2196F3',
          secondary: '#424242',
          accent: '#FF4081',
          error: '#FF5252',
          info: '#2196F3',
          success: '#4CAF50',
          warning: '#FB8C00',
          thover: '#424242'
        }
      }
    }
  },

  build: {
    publicPath: 'cdn/',
    transpile: ['vuetify', 'vuetify/lib']
  }
};
