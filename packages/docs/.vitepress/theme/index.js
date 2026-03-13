import DefaultTheme from 'vitepress/theme';
import { h } from 'vue';
import './style.css';

export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {});
  },
  enhanceApp({ app, router, siteData }) {
    console.log(app, router, siteData);
  }
};
