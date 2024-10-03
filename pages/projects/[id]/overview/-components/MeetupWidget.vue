<script setup lang="ts">
const today = new Date();
const daysOfWeek = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab', 'Dom']; // TODO: I18n
const firstDayOfWeek = today.getDate() - today.getDay() + 1;

const currentWeek = Array.from({ length: daysOfWeek.length }, (_v, i) => {
  const date = new Date(today.getFullYear(), today.getMonth(), firstDayOfWeek + i);

  return {
    name: daysOfWeek[i],
    date: date.getDate(),
    value: date.toISOString().split('T')[0],
  };
});

const isCurrentDay = (date: string) => {
  return date === today.toISOString().split('T')[0];
};
</script>

<template>
  <alex-custom-card
    title="Encontros"
    full-width
    class="flex-1 tw-col-span-12 md:tw-col-span-6 lg:tw-col-span-4"
    content-class-name="justify-center align-center h-100"
    no-footer
  >
    <template #content>
      <div class="tw-flex tw-flex-col tw-gap-2 tw-w-full">
        <!-- TODO: Trocar isso aqui por tabs -->
        <div class="tw-flex tw-gap-1 ga-6 tw-items-center mb-4 tw-overflow-auto">
          <div v-for="day in currentWeek" :key="day.value">
            <div
              class="tw-h-[57px] tw-w-[41px] pa-2 rounded-lg"
              variant="text"
              :class="isCurrentDay(day.value) ? 'bg-secondary-0 tw-text-white' : 'tw-bg-white'"
            >
              <div class="tw-flex tw-flex-col text-center">
                <span class="text-body-3">{{ day.name }}</span>
                <span class="text-body-2" :class="isCurrentDay(day.value) ? 'tw-text-white' : ' text-secondary-0'">
                  {{ day.date }}
                </span>
              </div>
            </div>
          </div>
        </div>
        <alex-custom-empty-placeholder
          :empty-text-message="$t('pages.projects.overview.empty_meetings')"
          empty-text-image="/svg/OverviewEmptyMeetings.svg"
          grayscale
        />
      </div>
    </template>
  </alex-custom-card>
</template>
