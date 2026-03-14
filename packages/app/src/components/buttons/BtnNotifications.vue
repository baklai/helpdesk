<script setup>
import { mdiBellOutline } from '@mdi/js';
import { useMutation, useQuery } from '@vue/apollo-composable';
import { useToast } from 'primevue/usetoast';
import { computed, defineAsyncComponent, ref } from 'vue';

import { FIND_ALL_NOTICES, REMOVE_ONE_NOTICE } from '@/graphql/apollo.gql';
import { dateTimeToStr } from '@/utils/DateMethods';

const Modal = defineAsyncComponent(() => import('@/components/modals/NoticeModal.vue'));

const toast = useToast();

const { result, refetch } = useQuery(FIND_ALL_NOTICES);
const { mutate: deleteNotice } = useMutation(REMOVE_ONE_NOTICE);

const notices = computed(() => result.value?.notices || []);

const refMenu = ref();
const refModal = ref();

const onRemoveRecord = async id => {
  try {
    await deleteNotice({ id });
    toast.add({
      severity: 'success',
      summary: 'Інформація',
      detail: 'Запис видалено',
      life: 3000
    });
  } catch (err) {
    toast.add({
      severity: 'warn',
      summary: 'Попередження',
      detail: err.message,
      life: 3000
    });
  } finally {
    await refetch();
  }
};
</script>

<template>
  <div>
    <Modal ref="refModal" @close="refetch" />

    <Popover ref="refMenu" appendTo="body" class="w-140">
      <div class="flex w-full flex-col">
        <div class="flex justify-between px-2 pt-2">
          <div class="flex items-center justify-center">
            <Avatar class="mr-4" icon="pi pi-bell text-xl" size="large" />
            <div>
              <p class="line-height-2 text-lg font-bold">Сповіщення</p>
              <p class="line-height-2 text-surface-500 text-base font-normal">
                Системні сповіщення
              </p>
            </div>
          </div>
          <div class="flex items-center justify-center">
            <Button
              v-tooltip.bottom="'Створити сповіщення'"
              icon="pi pi-plus-circle text-xl!"
              rounded
              severity="secondary"
              variant="text"
              @click="
                () => {
                  refMenu.hide();
                  refModal.toggle({});
                }
              "
            />
          </div>
        </div>

        <Divider />

        <DataView v-if="notices?.length" class="max-h-120 overflow-auto" :value="notices">
          <template #list="{ items }">
            <div
              v-for="(item, index) in items"
              :key="index"
              class="w-full shrink-0 border-none p-4 py-2"
            >
              <Message
                :pt="{ text: { class: ['w-full'] } }"
                :severity="item?.status?.toLowerCase() || 'secondary'"
              >
                <div class="flex w-full flex-row justify-start gap-3">
                  <div class="align-items-start flex w-full flex-col overflow-auto">
                    <div class="flex w-full items-center">
                      <div class="flex w-full items-center">
                        <i class="pi pi-info-circle mr-2 text-2xl!"></i>
                        <div class="align my-2 flex flex-col">
                          <p class="text-base font-medium">{{ item?.title }}</p>
                          <p v-if="item.message" class="text-sm font-normal">{{ item?.message }}</p>
                          <p class="text-muted-color text-xs font-normal">
                            {{ dateTimeToStr(item?.createdAt) || '-' }}
                          </p>
                        </div>
                      </div>

                      <Button
                        v-tooltip.bottom="'Закрити сповіщення'"
                        icon="pi pi-times"
                        rounded
                        :severity="item.status?.toLowerCase() || 'secondary'"
                        variant="text"
                        @click="onRemoveRecord(item.id)"
                      />
                    </div>
                    <pre
                      class="text-md my-2 wrap-break-word whitespace-pre-wrap text-black dark:text-white"
                      >{{ item?.text?.trim() }}</pre
                    >
                  </div>
                </div>
              </Message>
            </div>
          </template>
        </DataView>

        <div v-else class="flex flex-col items-center justify-center p-2">
          <p class="text-md text-muted-color font-medium">Сповіщення не знайдені</p>
        </div>
      </div>
    </Popover>

    <OverlayBadge
      :pt="{ pcBadge: { root: ['text-sm!', { 'hidden!': !notices?.length }] } }"
      severity="success"
      :value="notices.length"
    >
      <Button
        v-tooltip.bottom="'Сповіщення'"
        rounded
        severity="secondary"
        variant="text"
        @click="event => refMenu.toggle(event)"
      >
        <template #icon>
          <AppIcon :path="mdiBellOutline" :size="20" />
        </template>
      </Button>
    </OverlayBadge>
  </div>
</template>
