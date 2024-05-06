<template>
  <v-navigation-drawer
    temporary
    location="right"
    :width="380"
    class="rounded-s-lg sidebar py-6 px-4"
    :scrim="false"
    :model-value="modelValue"
    @update:model-value="handleChange"
  >
    <template #prepend>
      <div class="d-flex align-center justify-space-between mb-6">
        <p class="text-h4 text-gray-800">Contribuições destacadas</p>
        <alex-custom-button
          icon="mdi-close"
          variant="text"
          @click="handleChange(false)"
        />
      </div>
    </template>
    <template #default>
      <div class="w-100 fill-height bg-gray-blue rounded pa-3">
        <div
          class="w-100 height-16 bg-white rounded px-4 py-3 d-flex justify-space-between align-center"
        >
          <!-- <div class="w-100 py-3 bg-blue d-flex justify-space-between"> -->
          <div class="d-flex flex-column">
            <span class="text-gray-600 text-body-5">
              19/02/2023 - 22:00
              <!-- {{ timeStampToDate(contribution.contribution.time) }} -->
            </span>
            <span class="text-gray-700 text-body-2"
              ><!-- {{
                contribution.title
              }} -->Novas features VUE 3.4</span
            >
          </div>

          <alex-custom-dropdown
            v-if="isProfessor"
            :items="dropDownItems(13)"
            variant="text"
            icon="mdi-dots-vertical"
          ></alex-custom-dropdown>
        </div>
      </div>
      <!--       </div>
 -->
    </template>
  </v-navigation-drawer>
</template>
<script setup lang="ts">
const isProfessor = ref(true);
const { t } = useI18n();

const props = defineProps({
  modelValue: Boolean,
});

const emits = defineEmits(['update:modelValue', 'removeHighlight']);
const handleChange = (value: boolean) => {
  emits('update:modelValue', value);
};

const timeStampToDate = (timeStamp: number) => {
  const dateTime = new Date(timeStamp);
  return `${dateTime.toLocaleDateString()} - ${dateTime.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })}`;
};

const dropDownItems = (contributionId: number) => {
  return [
    {
      text: t('components.trails.contributions.card.removeHighlight'),
      icon: 'mdi-star-remove-outline',
      onClick: () => emits('removeHighlight', contributionId),
    },
  ];
};
</script>

<style scoped>
.sidebar {
  margin-top: 1px;
}
</style>
