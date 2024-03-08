<template>
  <alex-custom-card
    :title="$t(`components.${variant}.settings.visibility.title`)"
    :show-icon="false"
    show-footer-divider
  >
    <template #content>
      <div class="radioButtons">
        <alex-inputs-radio-button
          v-model="activeButton"
          :buttons="firstButton"
          :text="
            $t(`components.${variant}.settings.visibility.showCourse.title`)
          "
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
          :text="$t(`components.${variant}.settings.visibility.cancel`)"
          variant="secondary"
          @click="onCancel"
        />
        <alex-custom-button
          class="button"
          :text="$t(`components.${variant}.settings.visibility.save`)"
          variant="primary"
          @click="$emit('update', { hidden: activeButton === '2' })"
        />
      </div>
    </template>
  </alex-custom-card>
</template>
<script setup lang="ts">
const { t } = useI18n();
const emit = defineEmits(['update']);
const props = defineProps({
  isHidden: {
    type: Boolean,
    required: true,
  },
  variant: {
    type: String as PropType<'courses' | 'trails'>,
    default: 'courses',
  },
});

const firstButton = ref([
  {
    label: t(
      `components.${props.variant}.settings.visibility.showCourse.title`,
    ),
    hint: t(`components.${props.variant}.settings.visibility.showCourse.hint`),
    value: '1',
  },
]);

const secondButton = ref([
  {
    label: t(
      `components.${props.variant}.settings.visibility.hideCourse.title`,
    ),
    hint: t(`components.${props.variant}.settings.visibility.hideCourse.hint`),
    value: '2',
  },
]);

const activeButton = ref(props.isHidden ? '2' : '1');

const onCancel = () => {
  activeButton.value = props.isHidden ? '2' : '1';
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
