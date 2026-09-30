<template>
  <alex-custom-card :title="$t('components.projects.settings.delete.title')" full-width show-footer-divider outline>
    <template #content>
      <p class="text">
        {{ $t('components.projects.settings.delete.warning') }}
      </p>
    </template>
    <template #footer>
      <div class="d-flex justify-end w-100 pt-6">
        <alex-custom-confirm-dialog
          :title="$t('components.projects.settings.delete.confirmation')"
          :subtitle="$t('components.projects.settings.delete.warning')"
          :image="{ src: '/svg/exclusionImage.svg' }"
          :submit-button-text="$t('components.projects.settings.delete.word')"
          :cancel-button-text="$t('components.projects.settings.delete.cancel')"
          :input-word-confirmation="$t('components.projects.settings.delete.word')"
          :input-label-confirmation="$t('components.projects.settings.delete.label')"
          :input-placeholder-confirmation="$t('components.projects.settings.delete.placeholder')"
          :no-input-confirmation="false"
          variant="error"
          :word-confirmation="wordConfirmation"
          :inner-activator="{
            text: $t('components.projects.settings.delete.button'),
            variant: 'error',
            size: 'default',
            prependIcon: 'mdi-trash-can-outline',
          }"
          :error-message-text="$t('components.projects.settings.delete.matchError')"
          @submit="emit('update')"
          @cancel="emit('cancel')"
        />
      </div>
    </template>
  </alex-custom-card>
</template>

<script setup lang="ts">
const { t } = useI18n();
const emit = defineEmits(['update', 'cancel']);
const wordConfirmation = ref(t('components.projects.settings.delete.word'));
</script>

<style scoped lang="scss">
.text {
  color: var(--Cinza-Cinza-700, #5a636d);
  text-align: justify;
  font-family: Sen;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 135%;
  letter-spacing: 0.28px;
}
</style>
