<script setup>
import { mdiCpu32Bit, mdiCpu64Bit, mdiHarddisk, mdiMemory } from '@mdi/js';

import { dateTimeToStr } from '@/utils/DateMethods';

defineOptions({
  inheritAttrs: false
});

const { data } = defineProps({
  data: {
    type: Object,
    default: null
  }
});

const memorySum = value => {
  const summa = value
    ? value?.reduce((accumulator, { Capacity }) => Number(accumulator) + Number(Capacity), 0)
    : 0;
  const index = Math.floor(Math.log(summa) / Math.log(1024));
  return (
    (summa / Math.pow(1024, index)).toFixed(2) * 1 + ' ' + ['B', 'kB', 'MB', 'GiB', 'TB'][index]
  );
};

const diskSum = value => {
  const summa = value
    ? value?.reduce((accumulator, { Size }) => Number(accumulator) + Number(Size), 0)
    : 0;
  const index = Math.floor(Math.log(summa) / Math.log(1024));
  return (
    (summa / Math.pow(1024, index)).toFixed(2) * 1 + ' ' + ['B', 'kB', 'MB', 'GiB', 'TB'][index]
  );
};
</script>

<template>
  <slot name="header" />

  <div class="flex justify-between py-6">
    <div class="flex w-1/3 justify-center">
      <div class="flex flex-col">
        <div class="flex items-center justify-center">
          <AppIcon :path="data?.cpu ? mdiCpu64Bit : mdiCpu32Bit" :size="42" />
        </div>
        <div class="flex items-center justify-center">
          <p>CPU</p>
        </div>
        <div class="flex items-center justify-center text-center">
          <span>
            {{ data?.cpu?.[data?.cpu?.length - 1].Name || '-' }}
          </span>
        </div>
      </div>
    </div>

    <div class="flex w-1/3 justify-center">
      <div class="flex flex-col">
        <div class="flex items-center justify-center">
          <AppIcon :path="mdiMemory" :size="42" />
        </div>
        <div class="flex items-center justify-center">
          <p>RAM</p>
        </div>
        <div class="flex items-center justify-center text-center">
          <span>
            {{ memorySum(data?.memorychip) }}
          </span>
        </div>
      </div>
    </div>

    <div class="flex w-1/3 justify-center">
      <div class="flex flex-col">
        <div class="flex items-center justify-center">
          <AppIcon :path="mdiHarddisk" :size="42" />
        </div>
        <div class="flex items-center justify-center">
          <p>HDD</p>
        </div>
        <div class="flex items-center justify-center text-center">
          <span>
            {{ diskSum(data?.diskdrive) }}
          </span>
        </div>
      </div>
    </div>
  </div>

  <table class="dark:text-surface-100 text-surface-700 text-md my-6 w-full font-normal">
    <tbody>
      <tr class="border-surface-200 dark:border-surface-800 border-b">
        <td class="py-0.5 font-normal" width="50%">Серійний номер плати</td>
        <td class="py-0.5">{{ data?.baseboard?.SerialNumber || '-' }}</td>
      </tr>
      <tr class="border-surface-200 dark:border-surface-800 border-b">
        <td class="py-0.5 font-medium" width="50%">Серійний номер біоса</td>
        <td class="py-0.5">{{ data?.bios?.SerialNumber || '-' }}</td>
      </tr>
      <tr class="border-none">
        <td class="py-0.5 font-medium" width="50%">Версія біоса</td>
        <td class="py-0.5">{{ data?.bios?.Version || '-' }}</td>
      </tr>
    </tbody>
  </table>

  <table class="dark:text-surface-100 text-surface-700 text-md my-6 w-full font-normal">
    <tbody>
      <tr class="border-surface-200 dark:border-surface-800 border-b">
        <td class="py-0.5 font-medium" width="50%">ОС Тип</td>
        <td class="py-0.5">Microsoft Windows</td>
      </tr>
      <tr class="border-surface-200 dark:border-surface-800 border-b">
        <td class="py-0.5 font-medium" width="50%">ОС Версія</td>
        <td class="py-0.5">{{ data?.os?.Version || '-' }}</td>
      </tr>
      <tr class="border-surface-200 dark:border-surface-800 border-b">
        <td class="py-0.5 font-medium" width="50%">ОС Назва</td>
        <td class="py-0.5">{{ data?.os?.Caption || '-' }}</td>
      </tr>
      <tr class="border-none">
        <td class="py-0.5 font-medium" width="50%">ОС Платформа</td>
        <td class="py-0.5">{{ data?.os?.OSArchitecture || '32-bit' }}</td>
      </tr>
    </tbody>
  </table>

  <table class="dark:text-surface-100 text-surface-700 text-md my-6 w-full font-normal">
    <tbody>
      <tr class="border-surface-200 dark:border-surface-800 border-b">
        <td class="py-0.5 font-medium" width="50%">Назва комп'ютера</td>
        <td class="py-0.5">{{ data?.os ? data?.os?.CSName : data?.ipaddress }}</td>
      </tr>
      <tr class="border-surface-200 dark:border-surface-800 border-b">
        <td class="py-0.5 font-medium" width="50%">IP-адресa</td>
        <td class="py-0.5">{{ data?.ipaddress || '-' }}</td>
      </tr>
      <tr class="border-none">
        <td class="py-0.5 font-medium" width="50%">Дата звіту</td>
        <td class="py-0.5">{{ dateTimeToStr(data?.updatedAt) || '-' }}</td>
      </tr>
    </tbody>
  </table>

  <slot name="footer" />
</template>
