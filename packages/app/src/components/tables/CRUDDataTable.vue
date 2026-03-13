<script setup lang="jsx">
import { FilterMatchMode, FilterOperator } from '@primevue/core/api';
import { useToast } from 'primevue/usetoast';
import { computed, getCurrentInstance, ref, watchEffect } from 'vue';

import { getObjField } from '@/utils/UtilityMethods';

const toast = useToast();
const instance = getCurrentInstance();

const props = defineProps({
  doc: { type: Object, default: null },
  docs: { type: Array, default: () => [] },
  limit: { type: Number, default: 10 },
  offset: { type: Number, default: 0 },
  totalDocs: { type: Number, default: 0 },
  columns: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false },
  globalFilter: { type: [Object, Boolean], default: false },
  storageKey: { type: String, default: 'datatable' }
});

const emit = defineEmits(['fetch', 'create', 'row-click', 'open-menu', 'close-sidebar']);

const cols = ref([]);

const sorts = ref(null);
const filters = ref({});
const limit = ref(props.limit);
const offset = ref(props.offset);

const refMenuActions = ref();
const refMenuColumns = ref();

const params = computed(() => {
  return {
    limit: limit.value,
    offset: offset.value,
    sort: sortConverter(sorts.value),
    filters: filterConverter(filters.value)
  };
});

const isEmitFetch = computed(() => !!instance?.vnode?.props?.onFetch);
const isEmitCreate = computed(() => !!instance?.vnode?.props?.onCreate);
const isEmitOpenMenu = computed(() => !!instance?.vnode?.props?.onOpenMenu);
const isEmitRowClick = computed(() => !!instance?.vnode?.props?.onRowClick);
const isEmitCloseSidebar = computed(() => !!instance?.vnode?.props?.onCloseSidebar);

const actions = computed(() => {
  const actions = [];

  if (isEmitCreate.value) {
    actions.push({
      label: 'Створити запис',
      icon: 'pi pi-plus-circle',
      command: () => emit('create', {})
    });
  }

  if (isEmitFetch.value) {
    actions.push({
      label: 'Оновити записи',
      icon: 'pi pi-sync',
      command: () => emit('fetch', params.value)
    });
  }

  actions.push(
    {
      label: 'Очистити фільтри',
      icon: 'pi pi-filter-slash',
      command: () => clearFilters()
    },
    {
      separator: true
    },
    {
      label: 'Скинути таблицю',
      icon: 'pi pi-trash',
      command: () => onStateClear()
    }
  );

  return actions;
});

const initColumns = () => {
  cols.value = props.columns
    .filter(({ column }) => column?.field)
    .map(col => {
      const {
        header = {},
        column = {},
        sorter = null,
        filter = null,
        selectable = true,
        frozen = false
      } = col;

      const hasFilter = !!(filter && (filter.field || column.field));
      const hasSorter = !!(sorter && (sorter.field || column.field));

      return {
        header: {
          text: header.text || column.field,
          icon: header.icon || null,
          width: header.width || '15rem'
        },
        column: {
          field: column.field,
          icon: column.icon || null,
          render: column.render || null,
          action: column.action || null
        },
        sorter: hasSorter
          ? {
              field: sorter.field || column.field
            }
          : null,
        filter: hasFilter
          ? {
              field: filter.field || column.field,
              value: filter.value || null,
              matchMode: filter.matchMode || FilterMatchMode.IN,
              showFilterMatchModes: filter.showFilterMatchModes ?? false,
              filterOperator: filter.filterOperator || FilterOperator.AND,
              options: filter.options
                ? {
                    key: filter.options.key || 'id',
                    value: filter.options.value || 'id',
                    label: filter.options.label || 'title',
                    grouped: filter.options.grouped || null,
                    records: filter.options.records || [],
                    onRecords:
                      typeof filter.options.onRecords === 'function'
                        ? filter.options.onRecords
                        : () => []
                  }
                : null
            }
          : null,
        filtrable: hasFilter,
        sortable: hasSorter,
        selectable,
        frozen
      };
    });
};

const initFilters = async () => {
  filters.value = {
    global: {
      value: null,
      matchMode: props?.globalFilter?.matchMode || FilterMatchMode.CONTAINS
    },
    ...props.columns
      .filter(col => col.filter && (col.filter.field || col.column?.field))
      .reduce((acc, col) => {
        const field = col.filter.field || col.column.field;
        const isAdvanced = col.filter.showFilterMatchModes;

        acc[field] = isAdvanced
          ? {
              operator: col.filter.filterOperator || FilterOperator.AND,
              constraints: [
                {
                  value: col.filter.value || null,
                  matchMode: col.filter.matchMode || FilterMatchMode.CONTAINS
                }
              ]
            }
          : {
              value: col.filter.value || null,
              matchMode: col.filter.matchMode || FilterMatchMode.CONTAINS
            };
        return acc;
      }, {})
  };
};

const clearFilters = () => {
  initFilters();
};

const clearGlobalFilter = () => {
  if (filters?.value?.global) {
    filters.value['global'].value = null;
  }
};

const filterConverter = object => {
  const filterMode = (mode, value) => {
    switch (mode) {
      case 'startsWith':
        return { $regex: `^${value}`, $options: 'i' };
      case 'contains':
        return { $regex: value, $options: 'i' };
      case 'notContains':
        return { $not: { $regex: value, $options: 'i' } };
      case 'endsWith':
        return { $regex: `${value}$`, $options: 'i' };
      case 'equals':
        if (typeof value === 'boolean') return value;
        return { $regex: `^${value}$`, $options: 'i' };
      case 'notEquals':
        return { $ne: value };
      case 'in':
        return { $in: value };
      case 'lt':
        return { $lt: value };
      case 'lte':
        return { $lte: value };
      case 'gt':
        return { $gt: value };
      case 'gte':
        return { $gte: value };
      case 'between':
        return { $gte: value[0], $lte: value[1] };
      case 'dateIs': {
        if (!value || !value[0] || !value[1]) return null;
        let [startDate, endDate] = value;
        const s = new Date(startDate);
        const e = new Date(endDate);
        s.setHours(0, 0, 0, 0);
        e.setHours(23, 59, 59, 999);
        return {
          $gte: s.toISOString(),
          $lt: e.toISOString()
        };
      }
      case 'dateIsNot':
        return { $ne: value };
      case 'dateBefore':
        return { $lt: value };
      case 'dateAfter':
        return { $gt: value };
      default:
        console.error('Unknown filter mode: ' + mode);
        return null;
    }
  };

  const filterObject = {};
  const filterAND = [];
  const filterOR = [];

  for (const prop in object) {
    const currentFilter = object[prop];
    if (!currentFilter) continue;

    if (prop === 'global') {
      if (currentFilter.value !== null && props.globalFilter?.field) {
        filterObject[props.globalFilter.field] = filterMode(
          currentFilter.matchMode,
          currentFilter.value
        );
      }
      continue;
    }

    if (currentFilter.value !== undefined && currentFilter.value !== null) {
      filterObject[prop] = filterMode(currentFilter.matchMode, currentFilter.value);
    }

    const operator = currentFilter.operator?.toLowerCase();
    if (operator === 'and' || operator === 'or') {
      const constraints = (currentFilter.constraints ?? [])
        .filter(item => item?.value != null)
        .map(item => ({
          [prop]: filterMode(item.matchMode, item.value)
        }));

      if (operator === 'and') filterAND.push(...constraints);
      else if (operator === 'or') filterOR.push(...constraints);
    }
  }

  if (filterAND.length) filterObject['$and'] = filterAND;
  if (filterOR.length) filterObject['$or'] = filterOR;

  return Object.keys(filterObject).length > 0 ? filterObject : undefined;
};

const sortConverter = value => {
  if (!value || value.length === 0) return undefined;

  const sortObject = {};
  value.forEach(({ field, order }) => {
    sortObject[field] = parseInt(order, 10);
  });

  return Object.keys(sortObject).length > 0 ? sortObject : undefined;
};

const selectAllColumns = () => {
  cols.value.filter(col => !col.selectable).forEach(col => (col.selectable = true));
  refMenuColumns.value.hide();
};

const onRowClick = event => {
  if (isEmitRowClick.value) {
    emit('row-click', event.data);
  }
};

const onStateClear = async () => {
  try {
    localStorage.removeItem(props.storageKey);
    refMenuColumns.value.hide();
    toast.add({
      severity: 'success',
      summary: 'Інформація',
      detail: 'Таблиця скинута за замовчуванням',
      life: 3000
    });
  } catch {
    toast.add({
      severity: 'warn',
      summary: 'Попередження',
      detail: 'Таблиця не скинута за замовчуванням',
      life: 3000
    });
  }
};

watchEffect(() => {
  emit('fetch', params.value);
});

try {
  initColumns();
  initFilters();
} catch {
  toast.add({
    severity: 'warn',
    summary: 'Попередження',
    detail: 'Помилка ініціалізації',
    life: 3000
  });
}
</script>

<template>
  <Menu ref="refMenuColumns" class="w-80 p-2" popup>
    <template #start>
      <Listbox
        class="w-full"
        dataKey="selectable"
        filter
        filterPlaceholder="Пошук у списку"
        listStyle="height: 21rem"
        multiple
        optionLabel="header.text"
        :options="cols"
        optionValue="selectable"
      >
        <template #option="{ index, option }">
          <div class="flex items-center">
            <Checkbox
              v-model="option.selectable"
              binary
              class="mr-2"
              :inputId="`${option.column.field}${index}`"
            />
            <label :for="`${option.column.field}${index}`">
              {{ option.header.text }}
            </label>
          </div>
        </template>
      </Listbox>
    </template>

    <template #item="{ label, item, itemProps }">
      <a :href="item.url" v-bind="itemProps.action">
        <span v-bind="itemProps.icon" />
        <span v-bind="itemProps.label">{{ label }}</span>
      </a>
    </template>

    <template #end>
      <div class="flex w-full justify-between gap-3 pt-2">
        <Button
          class="text-surface-500 w-full"
          icon="pi pi-check-square"
          label="Вибрати все"
          outlined
          size="small"
          @click="selectAllColumns"
        />
      </div>
    </template>
  </Menu>

  <div class="min-w-0 flex-1 transition-all duration-300">
    <DataTable
      v-model:filters="filters"
      v-model:first="offset"
      v-model:multiSortMeta="sorts"
      v-model:rows="limit"
      alwaysShowPaginator
      class="min-w-full overflow-x-auto text-base"
      columnResizeMode="expand"
      currentPageReportTemplate="Показано з {first} по {last} з {totalRecords} записів"
      dataKey="id"
      filterDisplay="menu"
      lazy
      :loading="loading"
      :pageLinkSize="1"
      paginator
      :paginatorTemplate="'CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown'"
      :pt="{
        root: { class: { 'pointer-events-none': loading } },
        mask: { class: 'bg-transparent!' },
        emptyMessage: { class: 'bg-transparent!' },
        emptyMessageCell: { class: 'border-none!' },
        header: { class: 'flex min-h-20 items-center py-2' },
        pcPaginator: { paginatorcontainer: { class: 'border-t!' } }
      }"
      removableSort
      reorderableColumns
      resizableColumns
      responsiveLayout="scroll"
      rowHover
      :rowsPerPageOptions="[5, 10, 15, 20, 25, 50]"
      scrollable
      scrollHeight="flex"
      size="small"
      sortMode="multiple"
      :stateKey="storageKey"
      stateStorage="local"
      style="height: calc(100vh - 5rem)"
      :totalRecords="totalDocs"
      :value="docs"
      @row-click="onRowClick"
    >
      <template #header>
        <div class="flex w-full flex-wrap items-center justify-between gap-4">
          <div class="flex flex-wrap items-center gap-1">
            <i class="mr-2 hidden sm:block">
              <slot name="header-icon" />
            </i>
            <div class="flex flex-col">
              <h3 class="text-surface-900 dark:text-surface-50 text-2xl font-normal">
                <slot name="header-title" />
              </h3>
              <p class="text-muted-color text-base font-normal">
                <slot name="header-subtitle" />
              </p>
            </div>
          </div>
          <div class="flex w-full flex-wrap items-center justify-between gap-2 md:w-max">
            <IconField v-if="globalFilter && filters['global']" class="relative w-full sm:w-max">
              <InputIcon class="pi pi-search" />
              <InputText
                v-model="filters['global'].value"
                class="w-full sm:w-max"
                :placeholder="globalFilter?.placeholder"
              />
              <InputIcon
                v-if="filters['global'].value"
                v-tooltip.bottom="'Очистити фільтр'"
                class="pi pi-times cursor-pointer"
                @click="clearGlobalFilter"
              />
            </IconField>

            <div class="flex w-full justify-between gap-2 sm:w-max">
              <Button
                v-tooltip.bottom="'Очистити фільтри'"
                :class="[
                  { 'text-primary-500!': params?.filters && Object.keys(params.filters).length }
                ]"
                icon="pi pi-filter-slash"
                iconClass="text-2xl!"
                rounded
                severity="secondary"
                variant="text"
                @click="clearFilters"
              />

              <Button
                v-if="isEmitCreate"
                v-tooltip.bottom="'Створити запис'"
                icon="pi pi-plus-circle"
                iconClass="text-2xl!"
                rounded
                severity="secondary"
                variant="text"
                @click="emit('create')"
              />

              <Button
                v-if="isEmitFetch"
                v-tooltip.bottom="'Оновити записи'"
                icon="pi pi-sync"
                iconClass="text-2xl!"
                rounded
                severity="secondary"
                variant="text"
                @click="emit('fetch', params)"
              />

              <slot name="header-actions" />

              <Button
                v-tooltip.bottom="'Опції стовпців'"
                icon="pi pi-cog"
                iconClass="text-2xl!"
                rounded
                severity="secondary"
                variant="text"
                @click="refMenuColumns.toggle($event)"
              />
            </div>
          </div>
        </div>

        <slot name="header-subheader" />
      </template>

      <template #loading>
        <div class="flex items-center justify-center">
          <AppLoading />
        </div>
      </template>

      <template #empty>
        <div
          v-if="!loading && !docs?.length"
          class="absolute left-0 z-20 flex h-full w-full items-stretch justify-center bg-none text-center"
          style="height: calc(100vh - 24rem)"
        >
          <div class="m-auto flex flex-col gap-2">
            <i class="pi pi-filter-slash text-surface-500 text-7xl!"></i>
            <h5 class="text-2xl font-semibold">Записів не знайдено</h5>
            <p class="text-surface-500 text-base">Спробуйте змінити пошукові запити у фільтрі</p>
            <Button
              class="m-auto my-4 w-max"
              icon="pi pi-filter-slash text-sm"
              label="Очистити фільтри"
              @click="clearFilters"
            />
          </div>
        </div>
      </template>

      <template #paginatorstart>
        <div class="mr-10 flex">
          <Menu ref="refMenuActions" :model="actions" popup>
            <template #submenulabel="{ item }">
              <span class="text-primary font-bold">{{ item.label }}</span>
            </template>
            <template #item="{ item, props: itemProps }">
              <a class="flex items-center" v-bind="itemProps.action">
                <span :class="item.icon" />
                <span>{{ item.label }}</span>
              </a>
            </template>
          </Menu>

          <Button
            class="hover:text-surface-800! dark:hover:text-surface-100! h-10 w-full sm:w-max"
            label="Дії"
            outlined
            plain
            text
            @click="event => refMenuActions.toggle(event)"
          >
            <template #default>
              <i class="pi pi-sliders-h" />
              <span class="mx-2"> Опційні дії </span>
              <i class="pi pi-chevron-down" />
            </template>
          </Button>
        </div>
      </template>

      <Column class="max-w-12!" field="options" frozen :reorderableColumn="false">
        <template #header>
          <Button
            v-tooltip.bottom="'Опції стовпців'"
            icon="pi pi-cog"
            rounded
            severity="secondary"
            size="small"
            variant="text"
            @click="refMenuColumns.toggle($event)"
          />
        </template>
        <template #body="{ data }">
          <Button
            v-if="isEmitOpenMenu"
            v-tooltip.bottom="'Меню запису'"
            icon="pi pi-ellipsis-v"
            rounded
            severity="secondary"
            size="small"
            variant="text"
            @click="emit('open-menu', $event, data)"
          />
        </template>
      </Column>

      <Column
        v-for="(col, index) of cols"
        :key="`${col.column.field}-${index}`"
        :field="col.column.field"
        :filterField="col?.filter?.field"
        :frozen="col.frozen"
        :hidden="!col?.selectable"
        :maxConstraints="3"
        :pt="{
          columnHeaderContent: { class: 'font-medium uppercase' },
          headerCell: { class: 'w-auto! max-w-xl!' }
        }"
        :reorderableColumn="!col.frozen"
        :showFilterMatchModes="col?.filter?.showFilterMatchModes"
        :showFilterMenu="col.filtrable"
        :sortable="col.sortable"
        :style="{ minWidth: col.header.width }"
      >
        <template #header>
          <span class="mx-2">
            <i v-if="col?.header?.icon">
              <app-icon :path="col.header.icon" :size="16" />
            </i>
            {{ col.header.text }}
          </span>
        </template>

        <template #body="{ data, field }">
          <div class="overflow-hidden px-2 text-ellipsis whitespace-nowrap">
            <component
              :is="col?.column?.render(getObjField(data, field))"
              v-if="col?.column?.render"
              @click="col?.column?.action ? col?.column?.action(data) : false"
            />
            <span v-else>
              <i v-if="col?.column?.icon">
                <app-icon :path="col.column.icon" :size="16" />
              </i>

              {{ getObjField(data, field) || '-' }}
            </span>
          </div>
        </template>

        <template #filter="{ filterModel, applyFilter, filterCallback }">
          <div class="flex flex-col gap-2">
            <div
              v-if="
                col?.filter?.matchMode === FilterMatchMode.IN ||
                col?.filter?.matchMode === FilterMatchMode.EQUALS
              "
              class="flex items-center justify-between"
            >
              <label class="font-bold">
                <span class="uppercase">{{ col.header.text }}</span>
              </label>

              <Button
                class="h-8 w-8 font-bold"
                icon="pi pi-times"
                plain
                rounded
                text
                @click="applyFilter"
              />
            </div>

            <MultiSelect
              v-if="col?.filter?.matchMode === FilterMatchMode.IN"
              v-model="filterModel.value"
              autoFilterFocus
              class="my-4 w-96"
              :dataKey="col?.filter?.options?.key || 'id'"
              display="chip"
              filter
              filterMatchMode="contains"
              filterPlaceholder="Пошук у списку"
              :maxSelectedLabels="3"
              :optionGroupChildren="col?.filter?.options?.grouped ? 'records' : null"
              :optionGroupLabel="col?.filter?.options?.grouped ? 'group' : null"
              :optionLabel="col?.filter?.options?.label || 'label'"
              :optionValue="col?.filter?.options?.value || 'id'"
              :options="col?.filter?.options?.records || []"
              placeholder="Пошук у базі даних"
              :pt="{
                itemgroup: {
                  class: [
                    'font-bold m-0 py-3 px-5 cursor-auto',
                    'text-surface-800 dark:text-white/80',
                    'bg-surface-200 dark:bg-surface-900/80'
                  ]
                }
              }"
              resetFilterOnHide
              :selectionLimit="10"
              :virtualScrollerOptions="{ itemSize: 32 }"
              @before-show="
                async () => {
                  if (col?.filter?.options?.records?.length) return;
                  const response = await col.filter.options.onRecords();

                  col.filter.options.records = [
                    {
                      group: 'Порожні значення',
                      records: [
                        {
                          [col?.filter?.options?.value || 'id']: null,
                          [col?.filter?.options?.label || 'label']: '-'
                        }
                      ]
                    },
                    ...response
                  ];
                }
              "
            >
              <template #optiongroup="{ option }">
                <div class="flex h-full items-center justify-center text-base uppercase">
                  {{ option.group }}
                </div>
              </template>

              <template #option="{ option }">
                <div class="flex h-full items-center text-base">
                  {{ option[col?.filter?.options?.label] }}
                </div>
              </template>
            </MultiSelect>

            <Select
              v-else-if="col?.filter?.matchMode === FilterMatchMode.EQUALS && col?.filter?.options"
              v-model="filterModel.value"
              :optionLabel="col?.filter?.options?.label || 'id'"
              :optionValue="col?.filter?.options?.value || 'id'"
              :options="col?.filter?.options?.records || []"
              placeholder="Виберіть один запис"
              showClear
              style="min-width: 12rem"
              @before-show="
                async () => {
                  if (col?.filter?.options?.records?.length) return;
                  col.filter.options.records = await col.filter.options.onRecords();
                }
              "
            >
              <template #option="slotProps">
                <Chip :label="slotProps.option[col?.filter?.options?.label]" />
              </template>
            </Select>

            <DatePicker
              v-else-if="col?.filter?.matchMode === FilterMatchMode.DATE_IS"
              v-model="filterModel.value"
              class="w-full"
              dateFormat="dd.mm.yy"
              inline
              placeholder="Виберіть дату"
              selectionMode="range"
            />

            <InputText
              v-else-if="col?.filter?.matchMode === FilterMatchMode.CONTAINS"
              v-model="filterModel.value"
              placeholder="Пошук за стовпцем"
              type="text"
              @keydown.enter="filterCallback()"
            />

            <div
              v-else-if="col?.filter?.matchMode === FilterMatchMode.EQUALS"
              class="flex flex-col items-center gap-3"
            >
              <Checkbox
                v-model="filterModel.value"
                inputId="verified-filter"
                @change="filterCallback"
              />
              <label class="font-bold" for="verified-filter">
                {{ col.header.text }} {{ filterModel.value == null ? '' : filterModel.value }}
              </label>
            </div>
          </div>
        </template>
      </Column>
    </DataTable>
  </div>

  <Transition name="slide-fade">
    <aside
      v-if="doc"
      class="bg-surface-0 dark:bg-surface-900 border-surface-200 dark:border-surface-800 sticky top-0 z-10 flex h-full w-full flex-col overflow-hidden lg:w-lg lg:border-l"
    >
      <div
        class="border-surface-200 dark:border-surface-800 flex h-20 shrink-0 items-center justify-between border-b px-4"
      >
        <div class="flex items-center gap-3 overflow-hidden">
          <slot name="sidebar-icon" />
          <div class="overflow-hidden">
            <h3 class="truncate text-lg font-medium whitespace-nowrap">
              <slot name="sidebar-title" />
            </h3>
            <p class="text-muted-color truncate text-sm">
              <slot name="sidebar-subtitle" />
            </p>
          </div>
        </div>

        <div class="flex items-center gap-1">
          <slot name="sidebar-actions" />
          <Button
            v-if="isEmitOpenMenu"
            v-tooltip.bottom="'Меню'"
            class="h-12 w-12"
            icon="pi pi-ellipsis-v"
            rounded
            severity="secondary"
            variant="text"
            @click="emit('open-menu', $event, doc)"
          />

          <Button
            v-if="isEmitCloseSidebar"
            v-tooltip.bottom="'Закрити'"
            class="h-12 w-12"
            icon="pi pi-times"
            rounded
            severity="secondary"
            variant="text"
            @click="emit('close-sidebar')"
          />
        </div>
      </div>

      <div class="custom-scrollbar flex-1 overflow-y-auto p-4">
        <slot name="sidebar-content" />
      </div>
    </aside>
  </Transition>
</template>

<style scoped>
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.5s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(20px);
  opacity: 0;
}
</style>
