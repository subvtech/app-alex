<template>
  <div class="flex flex-column gap-4">
    <div class="flex flex-column mb-2">
      <alex-inputs-text-field
        v-model="reward"
        :label="rewardLabel"
        :placeholder="$t('components.learningPlan.contract.reward.placeholder')"
        class="w-100"
        type="number"
        density="comfortable"
        name="reward"
        :error-messages="errors.reward"
        :disabled="false"
        :min="0"
        :step="0.01"
        required
        @keypress="isNumber($event)"
      />
      <p
        v-if="taskMemberStudents.length === 0"
        class="text-body-3 text-gray-800"
      >
        {{ $t('components.learningPlan.contract.warning.noStudents') }}
      </p>

      <p
        v-else-if="reward && isNumber(reward) && reward !== ''"
        class="text-body-3 text-gray-800"
      >
        {{ $t('components.learningPlan.contract.reward.total') }}
        {{ reward }} * {{ taskMemberStudents.length }} = $
        {{ totalReward }}
      </p>
    </div>

    <div
      v-if="displayDraftWarning && isDraft"
      class="flex flex-column w-full gap-4 text-orange-800"
    >
      <span>{{ $t('components.learningPlan.contract.warning.isDraft') }}</span>
      <v-tooltip
        :text="$t('components.learningPlan.contract.warning.tooltip.abort')"
      >
        <template #activator="{ props: tooltipProps }">
          <alex-custom-button
            :text="$t('components.learningPlan.contract.warning.abort')"
            variant="error"
            v-bind="tooltipProps"
            :disabled="theresError"
            :loading="loading"
            @click="emit('cancel:contract-draft')"
          />
        </template>
      </v-tooltip>
    </div>

    <div v-else-if="updateContract">
      <div v-if="contractAddress">
        <span v-if="!theresError">{{
          $t('components.learningPlan.contract.warning.update')
        }}</span>
        <v-tooltip
          :text="$t('components.learningPlan.contract.warning.tooltip.fee')"
        >
          <template #activator="{ props: tooltipProps }">
            <alex-custom-button
              :text="$t('components.learningPlan.contract.warning.cancel')"
              variant="error"
              v-bind="tooltipProps"
              :loading="loading"
              @click="
                emit(
                  'delete:contract-address',

                  true,
                )
              "
            />
          </template>
        </v-tooltip>
      </div>

      <v-tooltip
        v-else
        :text="$t('components.learningPlan.contract.warning.tooltip.spend')"
      >
        <template #activator="{ props: tooltipProps }">
          <alex-custom-button
            :text="$t('components.learningPlan.contract.reward.deploy')"
            variant="warning"
            v-bind="tooltipProps"
            :disabled="theresError"
            :loading="loading"
            @click="handleCreateTaskContract"
          />
        </template>
      </v-tooltip>
    </div>

    <v-tooltip
      v-else
      :text="$t('components.learningPlan.contract.warning.tooltip.spend')"
    >
      <template #activator="{ props: tooltipProps }">
        <alex-custom-button
          :text="$t('components.learningPlan.contract.reward.deploy')"
          variant="warning"
          v-bind="tooltipProps"
          :disabled="theresError"
          :loading="loading"
          @click="handleCreateTaskContract"
        />
      </template>
    </v-tooltip>
  </div>
</template>

<script setup lang="ts">
import { useForm } from 'vee-validate';
import * as yup from 'yup';
interface CreateContractFormProps {
  loading?: boolean;
  canEdit?: boolean;
  taskMemberStudents?: any[];
  displayDraftWarning?: boolean;
  isDraft?: boolean;
  rewardLabel: string;
  contractAddress: string | null;
  updateContract?: boolean;
}

const props = withDefaults(defineProps<CreateContractFormProps>(), {
  taskMemberStudents: () => [],
  contractAddress: null,
});

const emit = defineEmits([
  'deploy:contract-draft',
  'cancel:contract-draft',
  'create:contract-address',
  'update:contract-address',
  'delete:contract-address',
]);

const createTaskContractSchema2 = yup.object({
  reward: yup
    .string()
    .matches(/^[0-9]{1,}([,-.][0-9]{1,2}){0,1}$/, 'Must be a number')
    .matches(/^[0-9]{2,}([,-.][0-9]{1,2}){0,1}$/, 'Must be a at least 10')
    .required(),
});

const {
  handleSubmit,
  errors,
  values,
  controlledValues,
  setFieldError,
  validate,
  useFieldModel,
} = useForm({
  validationSchema: createTaskContractSchema2,
});

const handleCreateTaskContract = handleSubmit(() => {
  emit('create:contract-address', {
    budget: totalReward.value,
    totalNumberOfStudents: props.taskMemberStudents.length,
  } as CreateContractProps);
});

const reward = useFieldModel<string>('reward');
const theresError = computed(() => {
  return (
    Object.keys(errors.value).length !== 0 ||
    !reward.value ||
    props.canEdit ||
    props.taskMemberStudents.length === 0
  );
});

const totalReward = computed(
  () => parseFloat(reward.value) * props.taskMemberStudents.length,
);

function isNumber(evt) {
  evt = evt || window.event;
  const charCode = evt.which ? evt.which : evt.keyCode;
  const allowedSymbols = [44, 46];

  if (allowedSymbols.includes(charCode)) {
    if (
      reward.value.includes(',') ||
      reward.value.includes('.') ||
      reward.value === ''
    )
      evt.preventDefault();
    else return true;
  }

  if (charCode > 31 && (charCode < 48 || charCode > 57)) {
    evt.preventDefault();
  } else {
    return true;
  }
}
</script>
