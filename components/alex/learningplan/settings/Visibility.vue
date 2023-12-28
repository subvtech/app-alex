<template>
  <alex-custom-card
    :title="$t('components.courses.settings.visibility.title')"
    :show-icon="false"
    show-footer-divider
  >
    <template #content>
      <div class="radioButtons">
        <alex-inputs-radio-button
          v-model="activeButton"
          :buttons="firstButton"
          :text="$t('components.courses.settings.visibility.showCourse.title')"
        />
        <alex-inputs-radio-button
          v-model="activeButton"
          :buttons="secondButton"
        />
      </div>
    </template>
    <template #footer>
      <div class="d-flex w-100 justify-end gap-4 pt-6">
        <alex-custom-button
          class="button"
          :text="$t('components.courses.settings.visibility.cancel')"
          variant="secondary"
          @click="onCancel"
        />
        <alex-custom-button
          class="button"
          :text="$t('components.courses.settings.visibility.save')"
          variant="primary"
          @click="onSave"
        />
      </div>
    </template>
  </alex-custom-card>
</template>
<script setup lang="ts">
const { t } = useI18n();
const { update } = useStrapi();
const { setMessage } = useMessageStore();

const props = defineProps({
  isHidden: {
    type: Boolean,
    required: true,
  },
});

const firstButton = ref([
  {
    label: t('components.courses.settings.visibility.showCourse.title'),
    hint: t('components.courses.settings.visibility.showCourse.hint'),
    value: '1',
  },
]);

const secondButton = ref([
  {
    label: t('components.courses.settings.visibility.hideCourse.title'),
    hint: t('components.courses.settings.visibility.hideCourse.hint'),
    value: '2',
  },
]);

const activeButton = ref(props.isHidden ? '2' : '1');

const onCancel = () => {
  activeButton.value = props.isHidden ? '2' : '1';
};

const onSave = async () => {
  await update('learningplan', { hidden: activeButton.value === '1' });
  setMessage(t('components.courses.settings.visibility.update'), 'green', true);
};
</script>
<style scoped lang="scss">
.radioButtons {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  flex: 1 0 0;
}
</style>
