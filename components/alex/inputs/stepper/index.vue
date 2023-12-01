<template>
  <v-form @submit="onSubmit">
    <div
      v-if="!noHeader"
      class="d-flex gap-4 py-3 px-1"
      :class="stepperIndicatorClass"
    >
      <alex-inputs-stepper-indicator
        v-for="({ title, subtitle, icon, completed }, index) in stepsList"
        :key="index"
        :step-number="index + 1"
        :active="index == activeStep - 1"
        :checked="activeStep - 1 > index"
        :title="title"
        :subtitle="subtitle"
        :icon="icon"
        :completed="completed"
        :disabled="false"
        @on-select="() => onSelectStep(index + 1)"
      />
    </div>
    <template v-for="(_, index) in stepsList" :key="index">
      <v-slide-x-transition hide-on-leave>
        <div v-if="index == activeStep - 1" :class="stepClass">
          <slot :name="`step${index + 1}`" :errors="errors" :values="values" />
        </div>
      </v-slide-x-transition>
    </template>
    <div v-if="!showControls && !noControls" class="w-100 d-flex">
      <alex-custom-button
        v-if="activeStep > 1"
        variant="secondary"
        text="Voltar"
        size="large"
        :disabled="submitLoading"
        @click="onPrevStep"
      />

      <alex-custom-button
        class="ml-auto"
        size="large"
        type="submit"
        :disabled="!isValid"
        :loading="submitLoading"
        :text="activeStep == numberSteps ? 'Criar' : 'Avançar'"
      />
    </div>
    <slot
      v-if="!noControls"
      name="controls"
      :on-prev-step="onPrevStep"
      :is-valid="isValid"
      :is-last-step="activeStep == numberSteps"
      :is-first-step="activeStep == 1"
      :submit-loading="submitLoading"
    />
  </v-form>
</template>

<script setup lang="ts">
import { useForm } from 'vee-validate';
import * as yup from 'yup';

interface StepsConfig {
  title: string;
  subtitle: string;
  icon?: string;
  scheme?: yup.Schema;
  completed?: boolean;
}

type StepType<T extends string[], U> = Record<ElementType<T>, U>;

// Props/events
const props = withDefaults(
  defineProps<{
    noHeader?: boolean;
    noControls: boolean;
    stepsConfig?: Record<string, Partial<StepsConfig>>;
    submitLoading?: boolean;
    stepClass?: string;
    stepperIndicatorClass?: string;
  }>(),
  {
    submitLoading: false,
    noHeader: false,
    noControls: false,
    stepClass: undefined,
    stepperIndicatorClass: undefined,
    stepsConfig: undefined,
  },
);
const emit = defineEmits(['onSuccess']);
// Slots
const slots = useSlots();
const showControls = computed(() => !!slots.controls);

// Steps Logic
const stepsCounter = computed(() =>
  literalArray(
    ...Object.entries(slots)
      .map((slot) => slot[0])
      .filter((slot) => slot.includes('step')),
  ),
);

const activeStep = ref(1);
const numberSteps = computed(() => stepsCounter.value.length);
const stepsList = computed(() => {
  const steps = {} as StepType<typeof stepsCounter.value, StepsConfig>;
  stepsCounter.value.map(
    (step) =>
      (steps[step] = {
        title: 'Title',
        subtitle: 'Subtitle',
        completed: false,
      }),
  );
  if (props.stepsConfig) {
    for (const step in steps) {
      steps[step] = { ...steps[step], ...props.stepsConfig[step] };
    }
  }
  return Object.values(steps);
});
// Steps Logic Get Schema
const validationSchema = computed(() => {
  const configStep = stepsList.value[activeStep.value - 1];
  const emptyObject = yup.object({ empty: yup.string().optional().nullable() });
  return configStep && configStep.scheme ? configStep.scheme : emptyObject;
});

const { handleSubmit, errors, values, controlledValues } = useForm({
  validationSchema,
  keepValuesOnUnmount: true,
});

// Functions
const onSubmit = handleSubmit((values) => {
  if (activeStep.value - 1 !== numberSteps.value - 1) {
    if (!props.noHeader) {
      stepsList.value[activeStep.value - 1].completed = true;
    }
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
    if (!props.noHeader) {
      stepsList.value[activeStep.value - 1].completed = false;
    }
  }
};

const onSelectStep = (step: number) => {
  if (step > activeStep.value && !isValid.value) {
    return;
  }

  if (step > activeStep.value) {
    stepsList.value[activeStep.value - 1].completed = true;
  }

  activeStep.value = step;
};
</script>

<style scoped>
button[type='submit']:disabled {
  background-color: gray !important;
}
</style>
