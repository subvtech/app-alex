<template>
  <alex-custom-card
    :title="$t(`components.${namespace}.settings.delete.title`)"
    full-width
    show-footer-divider
    :show-icon="false"
  >
    <template #content>
      <p class="text">
        {{ $t(`components.${namespace}.settings.delete.warning`) }}
      </p>
    </template>
    <template #footer>
      <div class="d-flex justify-end w-100 pt-6">
        <alex-custom-confirm-dialog
          :title="$t(`components.${namespace}.settings.delete.confirmation`)"
          :subtitle="$t(`components.${namespace}.settings.delete.warning`)"
          :image="{ src: 'assets/svg/exclusionImage.svg' }"
          :submit-button-text="
            $t(`components.${namespace}.settings.delete.word`)
          "
          :cancel-button-text="
            $t(`components.${namespace}.settings.delete.cancel`)
          "
          :input-word-confirmation="
            $t(`components.${namespace}.settings.delete.word`)
          "
          :input-label-confirmation="
            $t(`components.${namespace}.settings.delete.label`)
          "
          :input-placeholder-confirmation="
            $t(`components.${namespace}.settings.delete.placeholder`)
          "
          :no-input-confirmation="false"
          variant="error"
          :word-confirmation="wordConfirmation"
          :inner-activator="{
            text: $t(`components.${namespace}.settings.delete.button`),
            variant: 'error',
            size: 'default',
            prependIcon: 'mdi-trash-can-outline',
          }"
          :error-message-text="
            $t(`components.${namespace}.settings.delete.matchError`)
          "
          @submit="emit('update')"
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
