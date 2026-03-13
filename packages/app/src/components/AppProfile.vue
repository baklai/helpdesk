<script setup>
import { inject, ref } from 'vue';

import { useScopeStore } from '@/stores/scopes.store';

defineProps({
  visible: Boolean
});

defineEmits(['update:visible']);

const $helpdesk = inject('helpdesk');

const { getCustomScope } = useScopeStore();

const columns = ref([
  { field: 'create', header: 'Створення' },
  { field: 'read', header: 'Читання' },
  { field: 'update', header: 'Оновлення' },
  { field: 'delete', header: 'Видалення' },
  { field: 'notice', header: 'Повідомлення' }
]);

const scopes = ref(getCustomScope($helpdesk.user.scope));
</script>

<template>
  <Dialog
    class="w-full max-w-240"
    closable
    dismissableMask
    :draggable="false"
    modal
    position="top"
    :visible="visible"
    @update:visible="$emit('update:visible', !visible)"
  >
    <template #header>
      <div class="flex items-center">
        <div class="flex items-center">
          <Avatar class="mr-4" icon="pi pi-user" size="large" />
          <div>
            <p class="m-0 font-bold">
              {{ $helpdesk?.user?.fullname }}
            </p>
            <p class="line-height-3 text-surface-500 m-0">
              {{ $helpdesk?.user?.email }}
            </p>
          </div>
        </div>
      </div>
    </template>

    <div class="flex items-center">
      <div class="flex flex-wrap">
        <div class="w-full shrink-0 p-4 text-center md:w-2/5">
          <Avatar
            v-if="$helpdesk?.user?.logo"
            class="h-16 w-16"
            image="/img/user-logo.png"
            shape="circle"
          />
          <div v-else class="flex flex-col items-center justify-center p-3">
            <i class="pi pi-cloud-upload text-surface-500 text-4xl!" />
            <p class="text-surface-500 mt-6 mb-0 text-sm">
              Щоб завантажити, перетягніть логотип сюди
            </p>
          </div>
        </div>

        <div class="w-full space-y-4 p-4 md:w-3/5">
          <p class="text-lg font-bold">
            Повне ім'я :
            <span class="">{{ $helpdesk?.user?.fullname }}</span>
          </p>
          <p class="text-lg font-bold">
            Електронна адреса :
            <span class="">{{ $helpdesk?.user?.email }}</span>
          </p>
          <p class="text-lg font-bold">
            Телефон :
            <span class="">{{ $helpdesk?.user?.phone }}</span>
          </p>
        </div>

        <div class="flex max-h-100 w-full">
          <DataTable
            v-model:value="scopes"
            class="w-full overflow-x-auto"
            responsiveLayout="scroll"
            rowHover
            scrollable
            scrollHeight="flex"
          >
            <template #empty>
              <div class="text-center">
                <h5>Набір дозволів не знайдено</h5>
              </div>
            </template>

            <Column class="font-bold" field="scope" frozen header="Дозволи">
              <template #body="slotProps">
                {{ slotProps.data.comment }}
              </template>
            </Column>

            <Column
              v-for="col of columns"
              :key="col.field"
              class="text-center!"
              :field="col.field"
              :header="col.header"
              headerClass="text-center!"
            >
              <template #body="{ data, field }">
                <i
                  v-if="data[field] !== undefined"
                  class="pi"
                  :class="
                    data[field]
                      ? 'pi-check-circle text-green-500'
                      : 'pi-minus-circle text-surface-500'
                  "
                />
                <span v-else class="text-surface-500">-</span>
              </template>
            </Column>
          </DataTable>
        </div>
      </div>
    </div>
  </Dialog>
</template>
