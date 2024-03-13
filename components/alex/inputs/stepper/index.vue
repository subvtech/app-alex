<template>
  <v-form role="stepper" @submit="onSubmit">
    <div
      v-if="!noHeader"
      class="d-flex gap-4 py-3 px-1 align-center justify-center"
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
        <div
          v-if="index == activeStep - 1"
          class="alex-scrollbar-white"
          :class="stepClass"
        >
          <slot :name="`step${index + 1}`" :errors="errors" :values="values" />
        </div>
      </v-slide-x-transition>
    </template>
    <div
      v-if="!showControls && !noControls"
      class="w-100 d-flex justify-center align-end"
    >
      <alex-custom-button
        v-if="activeStep > 1"
        variant="secondary"
        text="Voltar"
        title="previous-step-button"
        size="large"
        @click="onPrevStep"
      />

      <alex-custom-button
        class="ml-auto"
        size="large"
        title="next-step-button"
        type="submit"
        :disabled="!isValid"
        :loading="loading"
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
      :loading="loading"
    />
  </v-form>
</template>

<script setup lang="ts">
import { useForm } from 'vee-validate';
import * as yup from 'yup';

interface Validate {
  name: string;
  callback: (value: string) => Promise<
    | {
        status: boolean;
        message: string;
      }
    | undefined
    | any
  >;
}
export interface StepsConfig {
  title: string;
  subtitle: string;
  icon?: string;
  scheme?: yup.Schema;
  completed?: boolean;
  validate?: Validate[];
}

export type StepType<T extends string[], U> = Record<ElementType<T>, U>;

// Props/events
const props = withDefaults(
  defineProps<{
    noHeader?: boolean;
    noControls?: boolean;
    stepsConfig?: Record<string, Partial<StepsConfig>>;
    loading?: boolean;
    stepClass?: string | unknown[];
    stepperIndicatorClass?: string;
  }>(),
  {
    loading: false,
    noHeader: false,
    noControls: false,
    stepClass: undefined,
    stepperIndicatorClass: undefined,
    stepsConfig: undefined,
  },
);
const emit = defineEmits(['onSuccess', 'updateLoading']);
// Slots
const slots = useSlots();
const showControls = computed(() => !!slots.controls);

// Steps Logic
const slotsList = computed(() =>
  literalArray(
    ...Object.entries(slots)
      .map((slot) => slot[0])
      .filter((slot) => slot.includes('step')),
  ),
);
const activeStep = ref(3);
const activeStepIndex = computed(() => activeStep.value - 1);
const numberSteps = computed(() => slotsList.value.length);
const lastStepIndex = computed(() => numberSteps.value - 1);
const stepsList = computed(() => {
  const steps = {} as StepType<typeof slotsList.value, StepsConfig>;
  slotsList.value.map(
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
  const configStep = stepsList.value[activeStepIndex.value];
  const emptyObject = yup.object({ empty: yup.string().optional().nullable() });
  return configStep && configStep.scheme ? configStep.scheme : emptyObject;
});

const {
  handleSubmit,
  errors,
  values,
  controlledValues,
  setFieldError,
  validate,
} = useForm({
  validationSchema,
  keepValuesOnUnmount: true,
});

const onAllValidated = () => {
  if (activeStepIndex.value !== lastStepIndex.value) {
    if (!props.noHeader) {
      stepsList.value[activeStepIndex.value].completed = true;
    }
    activeStep.value++;
    return;
  }
  emit('onSuccess', values);
};

const validateField = async (
  values: Record<string, string>,
  validate: Validate,
) => {
  const value = values[validate.name];
  if (value) {
    try {
      const res = await validate.callback(value);
      if (res && !res.status) {
        setFieldError(validate.name, res.message);
        return false;
      }
    } catch (error) {
      return false;
    }
  }
  return true;
};

const onSubmit = handleSubmit(async (values) => {
  const configStep = stepsList.value[activeStepIndex.value];
  let validated = false;
  if (configStep.validate) {
    const validationPromises = configStep.validate.map(async (validate) => {
      emit('updateLoading', true);
      return await validateField(values, validate);
    });
    const validationResults = await Promise.all(validationPromises);
    validated = !validationResults.includes(false);
    emit('updateLoading', false);
  }
  if (validated || !configStep.validate) {
    onAllValidated();
  }
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
      stepsList.value[activeStepIndex.value].completed = false;
    }
  }
};

const onSelectStep = async (step: number) => {
  const valid = await validate();
  if (!valid.valid) return;

  if (step > activeStep.value) {
    stepsList.value[activeStepIndex.value].completed = true;
  }
  activeStep.value = step;
};
</script>
