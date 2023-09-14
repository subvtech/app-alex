<template>
  <v-form @submit="onSubmit">
    <div v-if="!noHeader" name="header" class="d-flex gap-4 py-3 px-1">
      <AlexInputsStepperIndicator
        v-for="config, index in stepsConfig"
        :key="index"
        :stepNumber="index + 1"
        :active="index == activeStep - 1"
        :checked="activeStep - 1 > index"
        :title="config.title"
        :subtitle="config.subtitle"
        :icon="config.icon"
        :disabled="false"
        @onSelect="() => onSelectStep(index + 1)"
      />
    </div>
    <template v-for="(_, index) in stepsCounter">
      <slot
        v-if="index == activeStep - 1"
        :key="index"
        :name="`step${index + 1}`"
        :errors="errors"
        :values="values"
      />
    </template>
    <div v-if="!showControls" class="step-controls">
      <v-btn
        v-if="activeStep > 1"
        :disabled="submitLoading"
        type="button"
        rounded="lg"
        color="secondary"
        variant="outlined"
        size="large"
        @click="onPrevStep"
        text="Voltar"
      />

      <v-btn
        type="submit"
        :disabled="!isValid"
        :loading="submitLoading"
        class="ml-auto"
        rounded="lg"
        color="accent"
        size="large"
        :text="activeStep == numberSteps ? 'Criar' : 'Avançar'"
      />
    </div>
    <slot
      name="controls"
      :onPrevStep="onPrevStep"
      :isValid="isValid"
      :isLastStep="activeStep == numberSteps"
      :isFirstStep="activeStep == 1"
      :submitLoading="submitLoading"
    />
  </v-form>
</template>

<script setup lang="ts">
import { useForm } from 'vee-validate';
import * as yup from 'yup';

interface StepsConfig {
  title: string;
  subtitle?: string;
  icon?: string;
  scheme?: yup.Schema;
}

// Props/events
const props = withDefaults(
  defineProps<{
    stepsConfig: StepsConfig[];
    submitLoading?: boolean;
    noHeader?: boolean;
  }>(),
  { submitLoading: false, noHeader: false },
);
const emit = defineEmits(['onSuccess']);

// Slots
const slots = useSlots();
const showControls = computed(() => !!slots.controls);
const stepsCounter = computed(() =>
  Object.entries(slots).map((slot) => slot[0]),
);

// Steps Logic
const activeStep = ref(1);
const numberSteps = computed(() => stepsCounter.value.length);
const validationSchema = computed(() => {
  const configStep = props.stepsConfig[activeStep.value - 1];
  const emptyObject = yup.object({ empty: yup.string().optional().nullable() });
  if (configStep && configStep.scheme) return configStep.scheme;
  else return emptyObject;
});
const { handleSubmit, errors, values, controlledValues, errorBag } = useForm({
  validationSchema: validationSchema,
  keepValuesOnUnmount: true,
});

// Functions
const onSubmit = handleSubmit((values) => {
  if (activeStep.value - 1 !== numberSteps.value - 1) {
    activeStep.value++;
    return;
  }
  emit('onSuccess', values);
});

const isValid = computed(() => {
  if ((validationSchema.value as yup.AnyObject).fields.empty) return true;
  else if (
    !Object.values(controlledValues.value).includes(undefined) &&
    !Object.values(errors.value).length
  ) {
    return true;
  }

  return false;
});

const onPrevStep = () => {
  if (activeStep.value > 1) {
    activeStep.value--;
  }
};

const onSelectStep = (step: number) => {
  if (step > activeStep.value && !isValid.value) {
    return
  }

   activeStep.value = step
}
</script>

<style scoped>
.step-controls {
  display: flex;
  width: 100%;
}

button[type='submit']:disabled {
  background-color: gray !important;
}
</style>
