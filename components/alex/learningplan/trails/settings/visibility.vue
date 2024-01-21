<template>
  <div class="content-area course-visibility">
    <div class="card-title">
      <p>
        <span class="header-h4">
          {{ t('components.trails.settings.visibilityTitle') }}</span
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
          :text="t('components.trails.settings.general.cancel')"
          variant="secondary"
          @click="onCancel"
        />
        <alex-custom-button
          class="button"
          :text="t('components.trails.settings.general.save')"
          variant="primary"
          @click="updateVisibility()"
        />
      </span>
    </div>
  </div>
</template>
<script setup lang="ts">
const { t } = useI18n();
const { update } = useStrapi();
const { setMessage } = useMessageStore();
const route = useRoute();
const { courseId, trailId } = route.params;
const trailStore = useTrailStore();

definePageMeta({
  middleware: ['load-trail'],
});

const activeButton = ref(trailStore.trail.hidden ? 'true' : 'false');

const updateVisibility = async () => {
  await update('trails', parseInt(trailId.toString()), {
    hidden: activeButton.value,
  });
  setMessage(t('components.trails.settings.visibilityUpdate'), 'green', true);
};

const onCancel = () => {
  activeButton.value = trailStore.trail.hidden ? 'true' : 'false';
};
const firstButton = ref([
  {
    label: t('components.trails.settings.showtrailTitle'),
    hint: t('components.trails.settings.showtrailHint'),
    value: 'false',
  },
]);

const secondButton = ref([
  {
    label: t('components.trails.settings.hidetrailTitle'),
    hint: t('components.trails.settings.hidetrailHint'),
    value: 'true',
  },
]);

const getTrailData = async () => {
  await trailStore.loadTrailData(parseInt(trailId.toString()));
};

onMounted(() => {
  getTrailData();
});
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

.header-h4 {
  color: var(--cinza-cinza-800, #454d54);
  font-size: 20px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  letter-spacing: 0.2px;
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
