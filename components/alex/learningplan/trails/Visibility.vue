<template>
  <div class="content-area course-visibility">
    <div class="card-title">
      <p>
        <span class="header-h4">
          {{ t('pages.courseSettings.config.courseVisibilityTitle') }}</span
        >
      </p>
    </div>
    <div class="content-body">
      <div class="container-radio">
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
      </div>
    </div>
    <div class="footer-content">
      <span class="action-content-two">
        <alex-custom-button
          class="button"
          :text="t('components.courses.settings.general.cancel')"
          variant="secondary"
        />
        <alex-custom-button
          class="button"
          :text="t('components.courses.settings.general.save')"
          variant="primary"
        />
      </span>
    </div>
  </div>
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
    label: t('pages.trails.settings.showtrailTitle'),
    hint: t('pages.trails.settings.showtrailHint'),
    value: '1',
  },
]);

const secondButton = ref([
  {
    label: t('pages.trails.settings.hideTrailTitle'),
    hint: t('pages.trails.settings.hideTrailHint'),
    value: '2',
  },
]);

const activeButton = ref('1');
</script>
<style lang="scss" scoped>
.content-area {
  display: flex;
  max-width: 850px;
  flex-direction: column;
  align-items: flex-start;
  align-self: stretch;
  border-radius: 8px !important;
  border: 1px solid var(--cinza-cinza-200, #d2d6da) !important;
  background: var(--principais-branco, #fff);
  margin-top: 24px;
}

.content-body {
  display: flex;
  padding: 24px;
  flex-direction: column;
  align-items: flex-start;
  gap: 24px;
  align-self: stretch;
}
.card-title {
  display: flex;
  height: 72px;
  padding: 16px 18px 16px 24px;
  justify-content: flex-start;
  align-items: center;
  gap: 8px;
  align-self: stretch;
  border-bottom: 1px solid var(--cinza-cinza-100, #ebedef);
}

.footer-content {
  display: flex;
  padding: 0px 24px;
  justify-content: flex-end;
  align-items: center !important;
  gap: 16px;
  align-self: stretch;
  border-top: 1px solid var(--cinza-cinza-100, #ebedef);
}
.action-content-two {
  display: flex;
  height: 76px;
  justify-content: flex-end;
  align-items: center;
  gap: 16px;
  align-self: stretch;
}
.radioButtons {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  flex: 1 0 0;
}
</style>
