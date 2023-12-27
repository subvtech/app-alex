<template>
  <alex-custom-card
    :is-trail="isTrail"
    :title="t('components.trails.settings.visibilityTitle')"
    :show-icon="false"
  >
    <template #content>
      <div class="radioButtons">
        <alex-inputs-radio-button
          v-model="activeButton"
          :buttons="firstButton"
        />
        <alex-inputs-radio-button
          v-model="activeButton"
          :buttons="secondButton"
        />
      </div>
    </template>
    <template #footer>
      <div class="d-flex w-100 justify-end gap-4">
        <alex-custom-button
          variant="secondary"
          prepend-icon="mdi-close"
          @click="onCancel"
          >{{
            t('components.courses.settings.general.cancel')
          }}</alex-custom-button
        >
        <alex-custom-button
          variant="primary"
          prepend-icon="mdi-check"
          @click="onSave"
          :disabled="theresError"
          >{{
            t('components.courses.settings.general.save')
          }}</alex-custom-button
        >
      </div>
    </template>
  </alex-custom-card>
</template>
<script setup lang="ts">
const { t } = useI18n();

const isTrail = ref();

const onCancel = () => {
  console.log('cancel');
};

const onSave = () => {
  console.log('save');
};

const firstButton = ref([
  {
    label: t('components.trails.settings.showTrailTitle'),
    hint: t('components.trails.settings.showTrailHint'),
    value: '1',
  },
]);

const secondButton = ref([
  {
    label: t('components.trails.settings.hideTrailTitle'),
    hint: t('components.trails.settings.hideTrailHint'),
    value: '2',
  },
]);

const activeButton = ref('1');
</script>
<style lang="scss" scoped>
.radioButtons {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  flex: 1 0 0;
}
</style>
