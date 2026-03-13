<script setup>
import {
  mdiAccountMultipleOutline,
  mdiApps,
  mdiBugOutline,
  mdiCastAudio,
  mdiCpu32Bit,
  mdiCpu64Bit,
  mdiExpansionCardVariant,
  mdiFolderAccountOutline,
  mdiHarddisk,
  mdiHdmiPort,
  mdiIpOutline,
  mdiMemory,
  mdiMonitor,
  mdiPrinterOutline
} from '@mdi/js';
import { useApolloClient } from '@vue/apollo-composable';
import html2canvas from 'html2canvas-pro';
import { jsPDF } from 'jspdf';
import { useToast } from 'primevue/usetoast';
import { ref } from 'vue';

import { FIND_INSPECTOR_REPORT } from '@/graphql/apollo.gql';
import { dateTimeToStr, dateToStr, strToDate } from '@/utils/DateMethods';
import { byteToStr } from '@/utils/UtilityMethods';

const toast = useToast();

const { resolveClient } = useApolloClient();
const client = resolveClient();

const emit = defineEmits(['close']);

defineExpose({
  toggle: async ({ id, ipaddress: ip }) => {
    if (!id || !ip) return;

    try {
      const { data } = await client.query({
        query: FIND_INSPECTOR_REPORT,
        variables: { id, ip },
        fetchPolicy: 'no-cache'
      });

      inspector.value = data?.inspector || null;
      ipaddress.value = data?.ipaddress || null;

      visible.value = true;
    } catch {
      visible.value = false;
      toast.add({
        severity: 'error',
        summary: 'Помилка завантаження',
        detail: 'Не вдялося отримати звіт',
        life: 3000
      });
    }
  }
});

const visible = ref(false);
const loading = ref(false);
const inspector = ref();
const ipaddress = ref();

const onSave = async () => {
  try {
    loading.value = true;

    await new Promise(resolve => setTimeout(resolve, 50));

    const element = document.querySelector('#report');

    const fileName = `SYSINSPECTOR_${inspector.value.ipaddress} (${new Date(
      inspector.value.updatedAt
    ).toLocaleDateString()}).pdf`;

    html2canvas(element, {
      scale: 1.5,
      useCORS: true,
      backgroundColor: '#ffffff',
      logging: false,
      imageTimeout: 30000,
      onclone: clonedDoc => {
        const container = clonedDoc.getElementById('report');
        if (container) {
          container.style.backgroundColor = '#ffffff';
          container.style.color = '#000000';
        }

        const text = clonedDoc.querySelectorAll('*');
        text.forEach(h => {
          h.style.color = '#000000';
        });

        const svgs = clonedDoc.querySelectorAll('svg');
        svgs.forEach(svg => {
          svg.querySelectorAll('*').forEach(el => {
            // если у элемента есть fill или stroke, заменяем
            if (el.hasAttribute('fill') || el.tagName !== 'svg') {
              el.style.fill = '#000000';
            }
            if (el.hasAttribute('stroke')) {
              el.style.stroke = '#000000';
            }
          });
        });
      }
    })
      .then(canvas => {
        const imgData = canvas.toDataURL('image/png');

        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();

        const imgWidth = pdfWidth;
        const imgHeight = (canvas.height * pdfWidth) / canvas.width;

        let heightLeft = imgHeight;
        let position = 0;

        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pdfHeight;

        while (heightLeft > 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
          heightLeft -= pdfHeight;
        }

        pdf.save(fileName);
      })
      .finally(() => (loading.value = false));

    toast.add({
      severity: 'success',
      summary: 'Інформація',
      detail: 'Звіт успішно створено',
      life: 3000
    });
  } catch {
    toast.add({
      severity: 'warn',
      summary: 'Попередження',
      detail: 'Виникла непередбачувана помилка',
      life: 3000
    });
  }
};

const onClose = () => {
  inspector.value = null;
  ipaddress.value = null;
  emit('close');
};
</script>

<template>
  <Dialog
    v-model:visible="visible"
    class="mx-auto w-[90vw] md:w-[80vw] lg:w-[80vw] xl:w-[60vw] 2xl:w-[45vw]"
    closable
    dismissableMask
    draggable
    modal
    @hide="onClose"
  >
    <template #header>
      <div class="flex w-full justify-between">
        <div class="flex items-center justify-center">
          <i class="mr-4">
            <AppIcon :path="$route.meta.icon" :size="40" />
          </i>
          <div>
            <p class="line-height-2 mb-0 text-lg font-bold">
              {{ inspector?.os ? inspector?.os?.CSName : inspector?.host }}
            </p>
            <p class="line-height-2 text-surface-500 mb-0 text-base font-normal">
              IP-адреса: {{ inspector?.ipaddress || '-' }}
            </p>
            <p class="line-height-2 text-surface-500 mb-0 text-base font-normal">
              Дата звіту:
              {{ dateTimeToStr(inspector?.updatedAt) || '-' }}
            </p>
          </div>
        </div>
      </div>
    </template>

    <template #default>
      <AppLoading v-if="loading" class="absolute! z-100 h-full w-full" />

      <div id="report" class="flex flex-col gap-y-4 lg:flex-row lg:flex-wrap">
        <div class="flex w-full flex-wrap lg:flex-row lg:flex-nowrap">
          <div v-if="ipaddress" :class="['flex w-full flex-col', inspector && 'p-4 lg:w-1/2']">
            <div class="my-6 flex w-full flex-row items-center">
              <i class="mr-2">
                <AppIcon :path="mdiIpOutline" :size="42" />
              </i>
              <div class="flex flex-col">
                <p class="text-lg">IP {{ ipaddress?.ipaddress || '-' }}</p>
                <p class="text-base font-normal">
                  Дата: {{ ipaddress?.createdAt ? dateToStr(ipaddress.createdAt) : '-' }}
                </p>
              </div>
            </div>
            <IPAddressPartial v-if="ipaddress" :data="ipaddress" />
          </div>

          <Divider v-if="ipaddress && inspector" class="hidden lg:flex" layout="vertical" />

          <div v-if="inspector" :class="['flex w-full flex-col', ipaddress && 'p-4 lg:w-1/2']">
            <SysInspectorPartial v-if="inspector" :data="inspector" />
          </div>
        </div>

        <div v-if="inspector?.cpu" class="mx-2 my-2 w-full">
          <div class="mb-2 flex items-center">
            <AppIcon :path="inspector?.cpu ? mdiCpu64Bit : mdiCpu32Bit" :size="42" />
            <div>
              <p class="mb-0 text-base font-bold">CPU</p>
              <p class="mb-0 text-base font-normal">Центральний процесор</p>
            </div>
          </div>
          <table v-for="(cpu, index) in inspector?.cpu || []" :key="`cpu_${index}`">
            <tbody>
              <tr class="border-surface-200 dark:border-surface-600 border">
                <td class="font-bold" width="30%">Опис</td>
                <td>{{ cpu?.Name || '-' }}</td>
              </tr>
              <tr class="border-surface-200 dark:border-surface-600 border">
                <td class="font-bold" width="30%">Частота процесора</td>
                <td>{{ cpu?.CurrentClockSpeed || '-' }} MHz</td>
              </tr>
              <tr class="border-surface-200 dark:border-surface-600 border">
                <td class="font-bold" width="30%">Кількість ядер</td>
                <td>{{ cpu?.NumberOfCores || '-' }}</td>
              </tr>
              <tr class="border-surface-200 dark:border-surface-600 border">
                <td class="font-bold" width="30%">Кількість логічних ядер</td>
                <td>{{ cpu?.NumberOfLogicalProcessors || '-' }}</td>
              </tr>
              <tr class="border-surface-200 dark:border-surface-600 border">
                <td class="font-bold" width="30%">Тип архітектури</td>
                <td>{{ cpu?.Architecture || '-' }}</td>
              </tr>
              <tr class="border-surface-200 dark:border-surface-600 border">
                <td class="font-bold" width="30%">Виробник</td>
                <td>{{ cpu?.Manufacturer || '-' }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-if="inspector?.memorychip?.length" class="mx-2 my-2 w-full">
          <div class="mb-2 flex items-center">
            <AppIcon :path="mdiMemory" :size="42" />
            <div>
              <p class="mb-0 text-base font-bold">RAM</p>
              <p class="mb-0 text-base font-normal">Оперативна пам'ять</p>
            </div>
          </div>
          <table
            v-for="(memorychip, index) in inspector?.memorychip || []"
            :key="`memorychip_${index}`"
          >
            <tbody>
              <tr class="border-surface-200 dark:border-surface-600 border">
                <td class="font-bold" width="30%">Ємність</td>
                <td>{{ byteToStr(memorychip?.Capacity) }}</td>
              </tr>
              <tr class="border-surface-200 dark:border-surface-600 border">
                <td class="font-bold" width="30%">Частота процесора</td>
                <td>{{ memorychip?.Speed || '-' }} MHz</td>
              </tr>
              <tr class="border-surface-200 dark:border-surface-600 border">
                <td class="font-bold" width="30%">Виробник</td>
                <td>{{ memorychip?.Manufacturer || '-' }}</td>
              </tr>
              <tr class="border-surface-200 dark:border-surface-600 border">
                <td class="font-bold" width="30%">Опис</td>
                <td>{{ memorychip?.Description || '-' }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-if="inspector?.diskdrive?.length" class="mx-2 my-2 w-full">
          <div class="mb-2 flex items-center">
            <AppIcon :path="mdiHarddisk" :size="42" />
            <div>
              <p class="mb-0 text-base font-bold">HDD</p>
              <p class="mb-0 text-base font-normal">
                Кількість жорстких дисків :
                {{ inspector?.diskdrive?.length || '-' }}
              </p>
            </div>
          </div>
          <table
            v-for="(diskdrive, index) in inspector?.diskdrive || []"
            :key="`diskdrive_${index}`"
          >
            <tbody>
              <tr class="border-surface-200 dark:border-surface-600 border">
                <td class="font-bold" width="30%">Тип</td>
                <td>{{ diskdrive?.Description || '-' }}</td>
              </tr>
              <tr class="border-surface-200 dark:border-surface-600 border">
                <td class="font-bold" width="30%">Опис</td>
                <td>{{ diskdrive?.Caption || '-' }}</td>
              </tr>
              <tr class="border-surface-200 dark:border-surface-600 border">
                <td class="font-bold" width="30%">Ємність</td>
                <td>{{ byteToStr(diskdrive?.Size) }}</td>
              </tr>
              <tr class="border-surface-200 dark:border-surface-600 border">
                <td class="font-bold" width="30%">Серійний номер</td>
                <td>{{ diskdrive?.SerialNumber || '-' }}</td>
              </tr>
              <tr class="border-surface-200 dark:border-surface-600 border">
                <td class="font-bold" width="30%">Виробник</td>
                <td>{{ diskdrive?.Manufacturer || '-' }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-if="inspector?.netadapter?.length" class="mx-2 my-2 w-full">
          <div class="mb-2 flex items-center">
            <AppIcon :path="mdiExpansionCardVariant" :size="42" />

            <div>
              <p class="mb-0 text-base font-bold">Мережеві адаптери</p>
              <p class="mb-0 text-base font-normal">
                Кількість мережевих адаптерів :
                {{ inspector?.netadapter?.filter(item => item?.NetConnectionID)?.length || '-' }}
              </p>
            </div>
          </div>
          <table
            v-for="(netadapter, index) in inspector?.netadapter?.filter(
              item => item?.NetConnectionID
            ) || []"
            :key="`netadapter_${index}`"
          >
            <tbody>
              <tr class="border-surface-200 dark:border-surface-600 border">
                <td class="font-bold" width="30%">Назва підключення</td>
                <td>{{ netadapter?.NetConnectionID || '-' }}</td>
              </tr>
              <tr class="border-surface-200 dark:border-surface-600 border">
                <td class="font-bold" width="30%">Тип адаптера</td>
                <td>{{ netadapter?.AdapterType || '-' }}</td>
              </tr>
              <tr class="border-surface-200 dark:border-surface-600 border">
                <td class="font-bold" width="30%">Назва</td>
                <td>{{ netadapter?.Name || '-' }}</td>
              </tr>
              <tr class="border-surface-200 dark:border-surface-600 border">
                <td class="font-bold" width="30%">Опис</td>
                <td>{{ netadapter?.Description || '-' }}</td>
              </tr>
              <tr class="border-surface-200 dark:border-surface-600 border">
                <td class="font-bold" width="30%">Виробник</td>
                <td>{{ netadapter?.Manufacturer || '-' }}</td>
              </tr>
              <tr class="border-surface-200 dark:border-surface-600 border">
                <td class="font-bold" width="30%">MAC</td>
                <td>{{ netadapter?.MACAddress || '-' }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-if="inspector?.display?.length" class="mx-2 my-2 w-full">
          <div class="mb-2 flex items-center">
            <AppIcon :path="mdiMonitor" :size="42" />
            <div>
              <p class="mb-0 text-base font-bold">Дисплей</p>
              <p class="mb-0 text-base font-normal">
                Кількість дисплеїв :
                {{ inspector?.display?.length || '-' }}
              </p>
            </div>
          </div>

          <table v-for="(display, index) in inspector?.display || []" :key="`display_${index}`">
            <tbody>
              <tr class="border-surface-200 dark:border-surface-600 border">
                <td class="font-bold" width="30%">Опис</td>
                <td>{{ display?.Description || '-' }}</td>
              </tr>
              <tr class="border-surface-200 dark:border-surface-600 border">
                <td class="font-bold" width="30%">Виробник</td>
                <td>{{ display?.MonitorManufacturer || '-' }}</td>
              </tr>
              <tr class="border-surface-200 dark:border-surface-600 border">
                <td class="font-bold" width="30%">Тип</td>
                <td>{{ display?.MonitorType || '-' }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-if="inspector?.videoadapter?.length" class="mx-2 my-2 w-full">
          <div class="mb-2 flex items-center">
            <AppIcon :path="mdiHdmiPort" :size="42" />
            <div>
              <p class="mb-0 text-base font-bold">Відеоадаптер</p>
              <p class="mb-0 text-base font-normal">
                Кількість відеоадаптерів :
                {{ inspector?.videoadapter?.length || '-' }}
              </p>
            </div>
          </div>

          <table
            v-for="(videoadapter, index) in inspector?.videoadapter || []"
            :key="`videoadapter_${index}`"
          >
            <tbody>
              <tr class="border-surface-200 dark:border-surface-600 border">
                <td class="font-bold" width="30%">Опис</td>
                <td>{{ videoadapter?.Description || '-' }}</td>
              </tr>
              <tr class="border-surface-200 dark:border-surface-600 border">
                <td class="font-bold" width="30%">Пам'ять</td>
                <td>{{ byteToStr(videoadapter?.AdapterRAM) || '-' }}</td>
              </tr>
              <tr class="border-surface-200 dark:border-surface-600 border">
                <td class="font-bold" width="30%">Частота оновлення</td>
                <td>{{ videoadapter?.CurrentRefreshRate || '-' }} Hz</td>
              </tr>
              <tr class="border-surface-200 dark:border-surface-600 border">
                <td class="font-bold" width="30%">Відеопроцесор</td>
                <td>{{ videoadapter?.VideoProcessor || '-' }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-if="inspector?.sound?.length" class="mx-2 my-2 w-full">
          <div class="mb-2 flex items-center">
            <AppIcon :path="mdiCastAudio" :size="42" />
            <div>
              <p class="mb-0 text-base font-bold">Аудіопристрій</p>
              <p class="mb-0 text-base font-normal">
                Кількість аудіопристроїв :
                {{ inspector?.sound?.length || '-' }}
              </p>
            </div>
          </div>

          <table v-for="(sound, index) in inspector?.sound || []" :key="`sound_${index}`">
            <tbody>
              <tr class="border-surface-200 dark:border-surface-600 border">
                <td class="font-bold" width="30%">Опис</td>
                <td>{{ sound?.Description || '-' }}</td>
              </tr>
              <tr class="border-surface-200 dark:border-surface-600 border">
                <td class="font-bold" width="30%">Виробник</td>
                <td>{{ sound?.Manufacturer || '-' }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-if="inspector?.printer?.length" class="mx-2 my-2 w-full">
          <div class="mb-2 flex items-center">
            <AppIcon :path="mdiPrinterOutline" :size="42" />
            <div>
              <p class="mb-0 text-base font-bold">Принтери</p>
              <p class="mb-0 text-base font-normal">
                Кількість принтерів :
                {{ inspector?.printer?.length || '-' }}
              </p>
            </div>
          </div>

          <table>
            <tbody>
              <tr
                v-for="(printer, index) in inspector?.printer || []"
                :key="`printer_${index}`"
                class="border-surface-200 dark:border-surface-600 border"
              >
                <td class="font-bold" width="30%">Назва</td>
                <td>{{ printer?.Name || '-' }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-if="inspector?.useraccount?.length" class="mx-2 my-2 w-full">
          <div class="mb-2 flex items-center">
            <AppIcon :path="mdiAccountMultipleOutline" :size="42" />
            <div>
              <p class="mb-0 text-base font-bold">Локальні користувачі</p>
              <p class="mb-0 text-base font-normal">
                Кількість користувачів :
                {{ inspector?.useraccount?.length || '-' }}
              </p>
            </div>
          </div>
          <table>
            <tbody>
              <tr class="border-surface-200 dark:border-surface-600 border">
                <th>Назва</th>
                <th>Опис</th>
                <th>Статус</th>
              </tr>
              <tr
                v-for="(user, index) in inspector?.useraccount || []"
                :key="`user_${index}`"
                class="border-surface-200 dark:border-surface-600 border"
              >
                <td>{{ user?.Name || '-' }}</td>
                <td width="50%">{{ user?.Description || '-' }}</td>
                <td>
                  <Tag
                    :class="[
                      'bg-transparent!',
                      'border!',
                      'text-sm!',
                      'w-20!',
                      user?.Disabled
                        ? 'border-surface-600/80! text-surface-600/80!'
                        : 'border-green-500! text-green-500!'
                    ]"
                    :value="user?.Disabled ? 'Вимк.' : 'Увімк.'"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-if="inspector?.product?.length" class="mx-2 my-2 w-full">
          <div class="mb-2 flex items-center">
            <AppIcon :path="mdiApps" :size="42" />
            <div>
              <p class="mb-0 text-base font-bold">Встановлені програми</p>
              <p class="mb-0 text-base font-normal">
                Кількість програм :
                {{ inspector?.product?.length || '-' }}
              </p>
            </div>
          </div>
          <table>
            <tbody>
              <tr class="border-surface-200 dark:border-surface-600 border">
                <th class="uppercase">Назва</th>
                <th class="uppercase">Видавець</th>
                <th class="uppercase">Версія</th>
                <th class="uppercase">Дата встановлення</th>
              </tr>
              <tr
                v-for="(product, index) in inspector?.product || []"
                :key="`product_${index}`"
                class="border-surface-200 dark:border-surface-600 border"
              >
                <td width="45%">{{ product?.Name || '-' }}</td>
                <td>{{ product?.Vendor || '-' }}</td>
                <td>{{ product?.Version || '-' }}</td>
                <td>{{ strToDate(product?.InstallDate) }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-if="inspector?.share?.length" class="mx-2 my-2 w-full">
          <div class="mb-2 flex items-center">
            <AppIcon :path="mdiFolderAccountOutline" :size="42" />
            <div>
              <p class="mb-0 text-base font-bold">Спільні ресурси</p>
              <p class="mb-0 text-base font-normal">
                Кількість ресурсів :
                {{ inspector?.share?.length || '-' }}
              </p>
            </div>
          </div>
          <table>
            <tbody>
              <tr class="border-surface-200 dark:border-surface-600 border">
                <th></th>
                <th>Назва</th>
                <th>Шлях</th>
                <th>Опис</th>
              </tr>
              <tr
                v-for="(share, index) in inspector?.share || []"
                :key="`share_${index}`"
                class="border-surface-200 dark:border-surface-600 border"
              >
                <td class="text-center">
                  <i v-if="share?.Type === 0" class="pi pi-bookmark-fill text-orange-500" />
                </td>
                <td>{{ share?.Name || '-' }}</td>
                <td width="50%">{{ share?.Path || '-' }}</td>
                <td>{{ share?.Description || '-' }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-if="inspector?.fixupdate?.length" class="mx-2 my-2 w-full">
          <div class="mb-2 flex items-center">
            <AppIcon :path="mdiBugOutline" :size="42" />
            <div>
              <p class="mb-0 text-base font-bold">Виправлення та оновлення</p>
              <p class="mb-0 text-base font-normal">
                Кількість оновлень :
                {{ inspector?.fixupdate?.length || '-' }}
              </p>
            </div>
          </div>
          <table>
            <tbody>
              <tr class="border-surface-200 dark:border-surface-600 border">
                <th></th>
                <th class="uppercase">Виправлення</th>
                <th class="uppercase">Опис</th>
                <th class="uppercase">Дата встановлення</th>
              </tr>
              <tr
                v-for="(fixupdate, index) in inspector?.fixupdate || []"
                :key="`fixupdate_${index}`"
                class="border-surface-200 dark:border-surface-600 border"
              >
                <td width="3%"></td>
                <td width="35%">{{ fixupdate?.HotFixID }} {{ fixupdate?.ServicePackInEffect }}</td>
                <td>{{ fixupdate?.Description || '-' }}</td>
                <td>{{ fixupdate?.InstalledOn || '-' }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <ScrollTop behavior="smooth" target="parent" :threshold="400" />
    </template>

    <template #footer>
      <Button icon="pi pi-save" label="Зберегти" :loading="loading" plain text @click="onSave" />
      <Button icon="pi pi-times" label="Закрити" plain text @click="visible = false" />
    </template>
  </Dialog>
</template>

<style scoped>
table {
  width: 100%;
  border: 15px solid transparent;
  border-top: 5px solid transparent;
  border-collapse: collapse;
}

th {
  font-size: 14px;
  font-weight: bold;
  padding: 5px;
  border: none;
  text-align: left;
  background: transparent;
  text-transform: uppercase;
}

td {
  font-size: 12px;
  padding: 3px;
  border: none;
}

td,
th {
  border-bottom: 1px solid var(--surface-200);
}
</style>
