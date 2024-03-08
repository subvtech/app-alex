<template>
  <alex-custom-card
    :title="$t(`components.${namespace}.settings.delete.courseTitle`)"
    full-width
    show-footer-divider
    :show-icon="false"
  >
    <template #content>
      <p class="text">
        {{ $t(`components.${namespace}.settings.delete.courseDescription`) }}
      </p>
    </template>
    <template #footer>
      <div class="d-flex justify-end w-100 pt-6">
        <alex-learningplan-dialogs-alert
          :model-value="openDialog"
          :title="$t('components.trails.settings.delete.deleteConfirmation')"
          :subtitle="$t('components.trails.settings.delete.deleteDescription')"
          :image="imageProp"
          :submit-button-text="
            $t('components.trails.settings.delete.deleteWord')
          "
          :input-word-confirmation="
            $t('components.trails.settings.delete.deleteWord')
          "
          :input-label-confirmation="
            $t('components.trails.settings.delete.deleteLabel')
          "
          :input-placeholder-confirmation="
            $t('components.trails.settings.delete.deletePlaceholder')
          "
          :no-input-confirmation="false"
          variant="error"
          :word-confirmation="wordConfirmation"
          :error-message-text="
            $t('components.trails.settings.delete.matchError')
          "
          @submit="emit('update')"
          @cancel="openDialog = false"
        />
      </div>
    </template>
  </alex-custom-card>
</template>
<script setup lang="ts">
const emit = defineEmits(['update']);
defineProps({
  namespace: {
    type: String as PropType<'courses' | 'trails'>,
    default: 'courses',
  },
});

const openDialog = ref(false);
const wordConfirmation = ref('Excluir');
</script>

<style scoped lang="scss">
.text {
  color: var(--Cinza-Cinza-700, #5a636d);
  text-align: justify;

  /* Body/P3 */
  font-family: Sen;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 135%; /* 18.9px */
  letter-spacing: 0.28px;
}
</style>
