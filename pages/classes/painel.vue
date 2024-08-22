<template>
  <div>
    <div class="tw-flex tw-space-x-4 tw-mb-5">
      <alex-custom-card
        align-content="align-start"
        full-width
        no-header
        class="tw-py-4 tw-px-0 flex-1"
        title="Uso Completo"
      >
        <template #content>
          <div class="tw-flex tw-items-center tw-mb-1 tw-gap-1">
            <div
              class="tw-bg-slate-200 tw-p-3 tw-rounded tw-h-4 tw-w-4 tw-flex tw-items-center tw-justify-center"
            >
              <v-icon icon="mdi-camera-timer" size="14px" />
            </div>
            <span class="tw-font-bold tw-text-gray-600">Total de sprints</span>
          </div>
          <span class="tw-text-4xl tw-font-bold tw-mb-1">02</span>
          <div class="tw-flex tw-items-center tw-gap-1">
            <alex-custom-chip
              size="small"
              variant="flat"
              text="33%"
              :status="'blue'"
            />
            <span class="tw-text-sm tw-text-gray-500">Finalizados</span>
          </div>
        </template>
      </alex-custom-card>
      <alex-custom-card
        align-content="align-start"
        full-width
        no-header
        class="tw-py-4 tw-px-0 flex-1"
        title="Uso Completo"
      >
        <template #content>
          <div class="tw-flex tw-items-center tw-mb-1 tw-gap-1">
            <div
              class="tw-bg-slate-200 tw-p-3 tw-rounded tw-h-4 tw-w-4 tw-flex tw-items-center tw-justify-center"
            >
              <v-icon icon="mdi-camera-timer" size="14px" />
            </div>
            <span class="tw-font-bold tw-text-gray-600">Total de sprints</span>
          </div>
          <span class="tw-text-4xl tw-font-bold tw-mb-1">02</span>
          <div class="tw-flex tw-items-center tw-gap-1">
            <alex-custom-chip
              size="small"
              variant="flat"
              text="33%"
              :status="'blue'"
            />
            <span class="tw-text-sm tw-text-gray-500">Finalizados</span>
          </div>
        </template>
      </alex-custom-card>
      <alex-custom-card
        align-content="align-start"
        full-width
        no-header
        class="tw-py-4 tw-px-0 flex-1"
        title="Uso Completo"
      >
        <template #content>
          <div class="tw-flex tw-items-center tw-mb-1 tw-gap-1">
            <div
              class="tw-bg-slate-200 tw-p-3 tw-rounded tw-h-4 tw-w-4 tw-flex tw-items-center tw-justify-center"
            >
              <v-icon icon="mdi-camera-timer" size="14px" />
            </div>
            <span class="tw-font-bold tw-text-gray-600">Total de sprints</span>
          </div>
          <span class="tw-text-4xl tw-font-bold tw-mb-1">02</span>
          <div class="tw-flex tw-items-center tw-gap-1">
            <alex-custom-chip
              size="small"
              variant="flat"
              text="33%"
              :status="'blue'"
            />
            <span class="tw-text-sm tw-text-gray-500">Finalizados</span>
          </div>
        </template>
      </alex-custom-card>
      <alex-custom-card
        align-content="align-start"
        full-width
        no-header
        class="tw-py-4 tw-px-0 flex-1"
        title="Uso Completo"
      >
        <template #content>
          <div class="tw-flex tw-items-center tw-mb-1 tw-gap-1">
            <div
              class="tw-bg-slate-200 tw-p-3 tw-rounded tw-h-4 tw-w-4 tw-flex tw-items-center tw-justify-center"
            >
              <v-icon icon="mdi-camera-timer" size="14px" />
            </div>
            <span class="tw-font-bold tw-text-gray-600">Total de sprints</span>
          </div>
          <span class="tw-text-4xl tw-font-bold tw-mb-1">02</span>
          <div class="tw-flex tw-items-center tw-gap-1">
            <alex-custom-chip
              size="small"
              variant="flat"
              text="33%"
              :status="'blue'"
            />
            <span class="tw-text-sm tw-text-gray-500">Finalizados</span>
          </div>
        </template>
      </alex-custom-card>
    </div>

    <div class="tw-flex tw-space-x-4">
      <alex-custom-card title="Encontros" full-width class="flex-1">
      </alex-custom-card>
      <alex-custom-card full-width class="flex-1" itle="Instituições Parceiras">
        <template #content>
          <div class="tw-flex tw-flex-col tw-gap-2 tw-w-full">
            <alex-profile-institution-item
              v-for="institution in institution"
              class="tw-cursor-pointer"
              :key="institution.id"
              :id="institution.id"
              :name="institution.name"
              :acronym="institution.acronym"
              :sector="institution.sector"
              :url="institution.url"
            />
          </div>
        </template>
      </alex-custom-card>
    </div>
  </div>
</template>

<script setup lang="ts">
const institution = [
  {
    id: 1,
    name: 'Google',
    acronym: 'GOO',
    sector: 'Tecnologia',
    url: 'https://t.ctcdn.com.br/lvns56iaSMyHvyTur4JeYS_NYeY=/i606944.png',
  },
  {
    id: 2,
    name: 'Apple',
    acronym: 'APP',
    sector: 'Tecnologia',
    url: 'https://yt3.googleusercontent.com/M6YRDTT4TuycM6WeCoAC3UBre6Yu_i7RnK6bIs8ysWM1PBJFBvA9uOryoK_kF_4UeHKvTpPdLCY=s900-c-k-c0x00ffffff-no-rj',
  },
  {
    id: 3,
    name: 'Microsoft',
    acronym: 'MIC',
    sector: 'Tecnologia',
    url: 'https://www.microsoft.com/pt-br/microsoft-365/blog/wp-content/uploads/sites/51/2022/06/cropped-microsoft_logo_element.png',
  },
  {
    id: 4,
    name: 'Amazon',
    acronym: 'AMA',
    sector: 'Tecnologia',
    url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRlPDSwpFv74Hl0mW1F-dhYg1Q6zFUARDJFJw&s',
  },
];
</script>

<style lang="scss" scoped></style>
