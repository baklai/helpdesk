import { updatePreset, updateSurfacePalette } from '@primeuix/themes';
import { useStorage } from '@vueuse/core';
import { defineStore } from 'pinia';
import { usePrimeVue } from 'primevue/config';
import { computed, ref, watch } from 'vue';

import { PRIMARY_COLORS, SURFACE_COLORS } from '@/constants/theme.colors';

export const useConfigStore = defineStore('config', () => {
  const primevue = usePrimeVue();

  const appThemeMode = useStorage('app-theme-mode', 'light');
  const appThemePrimary = useStorage('app-theme-primary', 'noir');
  const appThemeSurface = useStorage('app-theme-surface', null);
  const appThemeScale = useStorage('app-theme-scale', 11);
  const appThemeRipple = useStorage('app-theme-ripple', false);
  const appThemeInputVariant = useStorage('app-theme-input-variant', 'outlined');
  const appSideBarMini = useStorage('app-sidebar-mini', false);
  const appSideBarMode = useStorage('app-sidebar-mode', 'static');

  const appSideBarVisible = ref(null);
  const activeMenuItem = ref(null);

  watch(appThemeMode, toggleAppThemeMode);
  watch(appThemePrimary, toggleAppThemePrimary);
  watch(appThemeSurface, toggleAppThemeSurface);
  watch(appThemeScale, toggleAppThemeScale);
  watch(appThemeRipple, toggleAppThemeRipple);
  watch(appThemeInputVariant, toggleAppThemeInputVariant);
  watch(appSideBarMode, toggleAppSideBarMode);

  const isDarkAppTheme = computed(() => appThemeMode.value === 'dark');

  function setAppThemeMode(mode) {
    appThemeMode.value = mode;
  }

  function toggleAppThemeMode() {
    if (appThemeMode.value === 'dark') {
      document.documentElement.classList.toggle('dark', true);
    } else {
      document.documentElement.classList.toggle('dark', false);
    }
  }

  function toggleAppThemePrimary() {
    const color = PRIMARY_COLORS.find(c => c.name === appThemePrimary.value);

    if (!color) {
      const preset = {
        semantic: {
          primary: {
            50: '{surface.50}',
            100: '{surface.100}',
            200: '{surface.200}',
            300: '{surface.300}',
            400: '{surface.400}',
            500: '{surface.500}',
            600: '{surface.600}',
            700: '{surface.700}',
            800: '{surface.800}',
            900: '{surface.900}',
            950: '{surface.950}'
          },
          colorScheme: {
            light: {
              primary: {
                color: '{primary.950}',
                contrastColor: '#ffffff',
                hoverColor: '{primary.800}',
                activeColor: '{primary.700}'
              },
              highlight: {
                background: '{primary.950}',
                focusBackground: '{primary.700}',
                color: '#ffffff',
                focusColor: '#ffffff'
              }
            },
            dark: {
              primary: {
                color: '{primary.50}',
                contrastColor: '{primary.950}',
                hoverColor: '{primary.200}',
                activeColor: '{primary.300}'
              },
              highlight: {
                background: '{primary.50}',
                focusBackground: '{primary.300}',
                color: '{primary.950}',
                focusColor: '{primary.950}'
              }
            }
          }
        }
      };
      updatePreset(preset);
    } else {
      const preset = {
        semantic: {
          primary: color.palette,
          colorScheme: {
            light: {
              primary: {
                color: '{primary.500}',
                contrastColor: '#ffffff',
                hoverColor: '{primary.600}',
                activeColor: '{primary.700}'
              },
              highlight: {
                background: '{primary.50}',
                focusBackground: '{primary.100}',
                color: '{primary.700}',
                focusColor: '{primary.800}'
              }
            },
            dark: {
              primary: {
                color: '{primary.400}',
                contrastColor: '{surface.900}',
                hoverColor: '{primary.300}',
                activeColor: '{primary.200}'
              },
              highlight: {
                background: 'color-mix(in srgb, {primary.400}, transparent 84%)',
                focusBackground: 'color-mix(in srgb, {primary.400}, transparent 76%)',
                color: 'rgba(255,255,255,.87)',
                focusColor: 'rgba(255,255,255,.87)'
              }
            }
          }
        }
      };

      updatePreset(preset);
    }
  }

  function toggleAppThemeSurface() {
    const color = SURFACE_COLORS.find(c => c.name === appThemeSurface.value);

    if (color && color.palette) {
      updateSurfacePalette(color.palette);
    } else {
      updateSurfacePalette(null);
    }
  }

  function toggleAppThemeInputVariant() {
    primevue.config.inputVariant = appThemeInputVariant.value;
  }

  function toggleAppThemeScale() {
    document.documentElement.style.fontSize = `${appThemeScale.value}px`;
  }

  function toggleAppThemeRipple() {
    primevue.config.ripple = appThemeRipple.value;
  }

  function toggleAppSideBarMode() {
    appSideBarVisible.value = true;
  }

  function toggleAppSideBar() {
    appSideBarVisible.value = !appSideBarVisible.value;
  }

  function setActiveMenuItem(item) {
    activeMenuItem.value = item.value || item;
  }

  function initAppConfigs() {
    toggleAppThemeMode();
    toggleAppThemeScale();
    toggleAppThemeRipple();
    toggleAppThemePrimary();
    toggleAppThemeSurface();
    toggleAppThemeInputVariant();
    toggleAppSideBar();
  }

  function setDefaultConfigs() {
    appThemeScale.value = 11;
    appThemeRipple.value = false;
    appThemeMode.value = 'light';
    appThemeInputVariant.value = 'outlined';
    appThemePrimary.value = 'noir';
    appThemeSurface.value = null;
    appSideBarMode.value = 'static';
  }

  return {
    appThemeMode,
    appThemePrimary,
    appThemeSurface,
    appThemeScale,
    appThemeRipple,
    appThemeInputVariant,
    appSideBarMini,
    appSideBarMode,
    appSideBarVisible,
    activeMenuItem,
    isDarkAppTheme,
    setAppThemeMode,
    toggleAppThemeScale,
    toggleAppThemeMode,
    toggleAppThemeRipple,
    toggleAppThemeInputVariant,
    toggleAppSideBar,
    setActiveMenuItem,
    initAppConfigs,
    setDefaultConfigs
  };
});
