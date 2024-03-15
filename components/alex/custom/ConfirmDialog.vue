<template>
  <alex-custom-dialog
    v-model="openDialog"
    title=""
    :max-width="520"
    no-footer
    no-header
    body-classes="rounded-t-lg"
  >
    <template #default>
      <div
        class="d-flex flex-column w-100 align-center bg-white py-10 px-6 rounded-t-lg gap-4"
      >
        <span>
          <img
            v-if="image"
            :src="image.src"
            :alt="image.alt"
            :width="image.width"
            :height="image.height"
            :class="imageClass"
          />
        </span>
        <div class="align-center text-center" style="max-width: 310px">
          <h4 class="text-h4 text-gray-800 mb-4">{{ title }}</h4>
          <p
            class="text-body-1 text-gray-600"
            style="overflow-wrap: break-word"
          >
            {{ subtitle }}
            <slot name="subtitle"></slot>
          </p>
        </div>
        <div class="d-flex flex-start w-100">
          <label for="exclusionLabel" class="text-body-1 text-gray-600">
            {{ inputLabelConfirmation }}
            <strong> {{ inputWordConfirmation }}</strong>
          </label>
        </div>
        <alex-inputs-text-field
          v-if="!noInputConfirmation"
          v-model="inputValue"
          class="w-100"
          name="confirmation"
          :placeholder="inputPlaceholderConfirmation"
          :error-messages="errorMessage"
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
            :loading="loading"
            :disabled="
              inputWordConfirmation
                ? inputValue !== inputWordConfirmation
                : false
            "
            @click="
              () => {
                emit('submit');
              }
            "
        /></template>
        <template #secondarySlotButton
          ><alex-custom-button
            v-if="!hideCancelButton"
            size="large"
            :text="cancelButtonText"
            variant="secondary"
            @click="emit('cancel')"
        /></template>
      </alex-custom-dialog-footer>
    </template>
    <template v-if="innerActivator" #activator>
      <alex-custom-button
        v-bind="props"
        :prepend-icon="innerActivator.prependIcon"
        :variant="innerActivator.variant"
        :size="innerActivator.size"
        @click="openDialog = true"
        >{{ innerActivator.text }}</alex-custom-button
      >
    </template>
  </alex-custom-dialog>
</template>
<script setup lang="ts">
import * as yup from 'yup';
import { ButtonSizeType, VariantType } from './Button.vue';

const emit = defineEmits(['submit', 'cancel']);
interface AlertDialogProps {
  modelValue?: boolean;
  variant?: 'primary' | 'success' | 'error' | 'info';
  title: string;
  subtitle?: string;
  image?: { src: string; width?: number; height?: number; alt?: string };
  submitButtonText: string;
  cancelButtonText: string;
  inputWordConfirmation?: string;
  inputLabelConfirmation?: string;
  inputPlaceholderConfirmation?: string;
  hideCancelButton?: boolean;
  noInputConfirmation?: boolean;
  loading?: boolean;
  errorMessageText?: string;
  imageClass?: string;
  innerActivator?: {
    text: string;
    prependIcon?: string;
    variant: VariantType;
    size?: ButtonSizeType;
  };
}
const props = withDefaults(defineProps<AlertDialogProps>(), {
  noInputConfirmation: true,
  modelValue: false,
  variant: 'primary',
  innerActivator: undefined,
  image: undefined,
  inputWordConfirmation: undefined,
  inputLabelConfirmation: undefined,
  inputPlaceholderConfirmation: undefined,
  loading: false,
  errorMessageText: undefined,
  hideCancelButton: false,
  subtitle: '',
  imageClass: '',
});
const inputValue = ref('');

const { modelValue } = toRefs(props);

const openDialog = ref(props.modelValue);

const errorMessage = computed(() => {
  if (
    inputValue.value.length !== 0 &&
    inputValue.value !== props.inputWordConfirmation
  ) {
    return props.errorMessageText;
  }
  return '';
});

watch(modelValue, () => {
  openDialog.value = modelValue.value;
});
</script>
