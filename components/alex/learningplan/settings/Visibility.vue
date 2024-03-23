<template>
  <alex-custom-card
    :title="$t(`components.${variant}.settings.visibility.title`)"
    show-footer-divider
  >
    <template #content>
      <div class="radioButtons d-flex align-start gap-2">
        <alex-inputs-radio-button
          v-model="activeButton"
          :buttons="firstButton"
          :text="$t(`components.${variant}.settings.visibility.show.title`)"
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
          prepend-icon="mdi-check"
          :text="$t(`components.${variant}.settings.visibility.save`)"
          variant="primary"
          @click="emit('update', { hidden: activeButton === '2' })"
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
    label: t(`components.${props.variant}.settings.visibility.show.title`),
    hint: t(`components.${props.variant}.settings.visibility.show.hint`),
    value: '1',
  },
]);

const secondButton = ref([
  {
    label: t(`components.${props.variant}.settings.visibility.hide.title`),
    hint: t(`components.${props.variant}.settings.visibility.hide.hint`),
    value: '2',
  },
]);

const activeButton = ref(props.isHidden ? '2' : '1');
</script>
<style scoped lang="scss">
.radioButtons {
  flex: 1 0 0;
}

@media (max-width: 420px) {
  .radioButtons {
    flex-direction: column;
  }
}
</style>
