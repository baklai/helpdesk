<script setup>
import { mdiCogOutline } from '@mdi/js';

import { PRIMARY_COLORS, SURFACE_COLORS } from '@/constants/theme.colors';
import { useConfigStore } from '@/stores/config.store';

defineProps({
  visible: Boolean
});

defineEmits(['update:visible']);

const $config = useConfigStore();

function updateColors(type, name) {
  if (type === 'primary') {
    $config.appThemePrimary = name;
  } else if (type === 'surface') {
    $config.appThemeSurface = name;
  }
}
</script>

<template>
  <Drawer
    class="w-120!"
    position="right"
    :visible="visible"
    @update:visible="$emit('update:visible', !visible)"
  >
    <template #header>
      <div class="text-surface-900 dark:text-surface-100 flex content-center font-semibold">
        <div class="mr-2 flex items-center justify-center">
          <i class="mr-2 inline-block">
            <AppIcon :path="mdiCogOutline" :size="20" />
          </i>
          <p class="inline-block text-2xl">HD Опції</p>
        </div>
      </div>
    </template>

    <Divider class="m-0! mb-8!" />

    <div class="px-4">
      <div class="my-3 flex">
        <div class="flex-1">
          <p class="flex h-full items-center text-lg font-semibold">Масштаб дисплея</p>
        </div>
        <div class="flex flex-1 flex-col items-center justify-center">
          <Knob v-model="$config.appThemeScale" :max="18" :min="10" :size="100" :step="1" />
        </div>
      </div>

      <Divider />

      <div class="my-3 flex">
        <div class="flex-1">
          <p class="flex h-full items-center text-lg font-semibold">Основні кольори</p>
        </div>
        <div class="flex flex-1 items-center justify-center">
          <div class="inline-flex flex-wrap items-center justify-center gap-2 self-stretch">
            <button
              v-for="primary of PRIMARY_COLORS"
              :key="primary.name"
              :class="[
                'h-4 w-4 cursor-pointer rounded-full border-none outline-offset-1 outline-none',
                'hover:ring-2 hover:ring-offset-2',
                {
                  'ring-2! ring-offset-2!': $config.appThemePrimary === primary.name
                }
              ]"
              :style="{
                backgroundColor: primary.palette['500'],
                '--tw-ring-color': primary.palette['500']
              }"
              :title="primary.name"
              type="button"
              @click="updateColors('primary', primary.name)"
            ></button>
          </div>
        </div>
      </div>

      <Divider />

      <div class="my-3 flex">
        <div class="flex-1">
          <p class="flex h-full items-center text-lg font-semibold">Кольори поверхні</p>
        </div>
        <div class="flex flex-1 items-center justify-center">
          <div class="inline-flex flex-wrap items-center justify-center gap-2 self-stretch">
            <button
              v-for="surface of SURFACE_COLORS"
              :key="surface.name"
              :class="[
                'h-4 w-4 cursor-pointer rounded-full border-none outline-offset-1 outline-none',
                'hover:ring-2 hover:ring-offset-2',
                {
                  'ring-2! ring-offset-2!': $config.appThemeSurface
                    ? $config.appThemeSurface === surface.name
                    : $config.isDarkAppTheme
                      ? surface.name === 'zinc'
                      : surface.name === 'slate'
                }
              ]"
              :style="{
                backgroundColor: surface.palette['500'],
                '--tw-ring-color': surface.palette['500']
              }"
              :title="surface.name"
              type="button"
              @click="updateColors('surface', surface.name)"
            ></button>
          </div>
        </div>
      </div>

      <Divider />

      <div class="my-3 flex">
        <div class="flex-1">
          <p class="flex h-full items-center text-lg font-semibold">Ефект хвилі</p>
        </div>
        <div class="flex-1">
          <ToggleSwitch v-model="$config.appThemeRipple" aria-labelledby="single" />
        </div>
      </div>

      <Divider />

      <div class="my-3 flex">
        <div class="flex-1">
          <p class="flex h-full items-center text-lg font-semibold">Варіант введення</p>
        </div>
        <div class="w-full flex-1 justify-center">
          <SelectButton
            v-model="$config.appThemeInputVariant"
            optionLabel="name"
            :options="[
              { name: 'окреслено', value: 'outlined' },
              { name: 'заповнено', value: 'filled' }
            ]"
            optionValue="value"
            :pt="{ root: { class: ['w-full'] }, pctogglebutton: { root: { class: ['w-1/2'] } } }"
          />
        </div>
      </div>

      <Divider />

      <div class="my-3 flex">
        <div class="flex-1">
          <p class="flex h-full items-center text-lg font-semibold">Тип меню</p>
        </div>
        <div class="w-full flex-1 justify-center">
          <SelectButton
            v-model="$config.appSideBarMode"
            optionLabel="name"
            :options="[
              { name: 'статичне', value: 'static' },
              { name: 'накладне', value: 'overlay' }
            ]"
            optionValue="value"
            :pt="{ root: { class: ['w-full'] }, pctogglebutton: { root: { class: ['w-1/2'] } } }"
          />
        </div>
      </div>

      <Divider />

      <div class="my-3 flex">
        <div class="flex-1">
          <p class="flex h-full items-center text-lg font-semibold">Стиль теми</p>
        </div>
        <div class="flex-1 justify-center">
          <SelectButton
            v-model="$config.appThemeMode"
            optionLabel="name"
            :options="[
              { name: 'світла', value: 'light' },
              { name: 'темна', value: 'dark' }
            ]"
            optionValue="value"
            :pt="{ root: { class: ['w-full'] }, pctogglebutton: { root: { class: ['w-1/2'] } } }"
          />
        </div>
      </div>

      <Divider />

      <Button
        class="my-6 w-full"
        label="Встановити параметри за замовчуванням"
        @click="$config.setDefaultConfigs"
      />
    </div>
  </Drawer>
</template>
