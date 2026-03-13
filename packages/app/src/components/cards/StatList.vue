<script setup>
defineProps({
  icon: { type: String, required: true },
  label: { type: String, required: true },
  items: { type: Array, default: () => [] },
  totalCount: { type: Number, default: 0 }
});

const onCountPercent = (count, allCount) => {
  if (!count || !allCount) return 0;
  return ((count * 100) / allCount).toFixed(2);
};

const getLogarithmicWidth = (count, allCount) => {
  if (!count || !allCount || count <= 0) return 0;
  const logCurrent = Math.log(count + 1);
  const logMax = Math.log(allCount + 1);
  const width = (logCurrent / logMax) * 100;
  return Math.max(width, 2);
};
</script>

<template>
  <div
    class="border-surface-300 bg-surface-50 dark:border-surface-600 dark:bg-surface-800 h-120 w-full rounded-lg border p-6"
  >
    <div class="text-muted-color mb-4 flex items-center">
      <i class="mr-2">
        <AppIcon :path="icon" :size="22" />
      </i>
      <span class="text-lg font-semibold">{{ label }}</span>
    </div>

    <ul class="h-[90%] list-none overflow-auto">
      <li
        v-for="(item, index) of items"
        :key="`list-${index}`"
        class="mb-3 flex flex-col md:flex-row md:items-center md:justify-between"
      >
        <div class="w-4/5 text-base">
          <p class="font-medium">{{ item?.name || '-' }}</p>
          <p class="text-muted-color text-sm">Кількість {{ item?.count }} / {{ totalCount }}</p>
        </div>

        <div class="flex w-full items-center">
          <ProgressBar
            class="mr-6 h-6 w-4/5"
            :pt="{ value: { class: 'bg-surface-400! dark:bg-surface-200!' } }"
            :showValue="false"
            :value="getLogarithmicWidth(item.count, totalCount)"
          />
          <span class="text-primary-500 w-1/5 font-bold">
            {{ onCountPercent(item.count, totalCount) }} %
          </span>
        </div>
      </li>
    </ul>
  </div>
</template>
