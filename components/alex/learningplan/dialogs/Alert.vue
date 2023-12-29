<template>
  <alex-custom-dialog
    v-model="value"
    title=""
    :width="520"
    no-footer
    body-classes="rounded-t-lg pa-6"
  >
    <template #header></template>
    <template #default>
      <div
        class="d-flex flex-column w-100 align-center bg-white py-10 px-6 rounded-t-lg gap-4"
      >
        <v-img
          v-if="image"
          :src="image.src"
          :width="image.width"
          :height="image.height"
          :alt="image.alt"
        />

        <div class="d-flex flex-column gap-4 align-center text-center">
          <h4 class="text-h4 text-gray-800">{{ title }}</h4>
          <p class="text-body-1 text-gray-600">{{ subtitle }}</p>
        </div>

        <alex-inputs-text-field
          v-if="!noInputConfirmation"
          name="confirmation"
          :label="inputLabelConfirmation"
          :placeholder="inputPlaceholderConfirmation"
          :scheme="
            yup
              .string()
              .test(
                'equals-test',
                (value) => value === props.inputWordConfirmation,
              )
          "
        />
      </div>
      <alex-custom-dialog-footer class="ml-0" justify="center">
        <template #mainSlotButton
          ><alex-custom-button
            size="large"
            :text="submitButtonText"
            :variant="variant"
            @click="
              () => {
                $emit('submit');
                $emit('update:modelValue', false);
              }
            "
        /></template>
        <template #secondarySlotButton
          ><alex-custom-button
            size="large"
            :text="$t('components.courses.settings.meetings.delete.cancel')"
            variant="secondary"
            @click="$emit('update:modelValue', false)"
        /></template>
      </alex-custom-dialog-footer>
    </template>
  </alex-custom-dialog>
</template>
<script setup lang="ts">
import * as yup from 'yup';
const emit = defineEmits(['update:modelValue', 'submit']);
interface AlertDialogProps {
  modelValue: boolean;
  variant?: 'primary' | 'success' | 'error' | 'info';
  title: string;
  subtitle: string;
  image?: { src: string; width: number; height: number; alt?: string };
  submitButtonText: string;
  inputWordConfirmation?: string;
  inputLabelConfirmation?: string;
  inputPlaceholderConfirmation?: string;
  noInputConfirmation?: boolean;
}
const props = withDefaults(defineProps<AlertDialogProps>(), {
  noInputConfirmation: true,
  variant: 'primary',
  image: undefined,
  inputWordConfirmation: undefined,
  inputLabelConfirmation: undefined,
  inputPlaceholderConfirmation: undefined,
});
const value = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emit('update:modelValue', value);
  },
});
</script>
