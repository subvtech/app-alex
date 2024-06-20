<template>
  <div class="gap-3">
    <p class="text-h3 my-6">Smart Contract</p>
    <alex-custom-switch
      v-model="configContract"
      label="
            Show experimental area
          "
      :disabled="props.edit && contractAddress"
    />
    <div v-if="configContract">
      <div v-if="contractAddress" class="flex flex-column mt-6 gap-4">
        <div class="flex flex-col">
          <p class="text-body-4 text-gray-800">Reward stored in the task</p>
          <p class="text-body-3 text-gray-800">$ {{ contractBalance }}</p>
        </div>
        <div v-if="model !== 'finished'">
          <span class="text-red-500"
            >You can only rewards your students after the task is finished</span
          >
        </div>

        <v-tooltip v-else text="Warning, you're about to spend real money">
          <template #activator="{ props: tooltipProps }">
            <alex-custom-button
              text="Reward students"
              variant="warning"
              v-bind="tooltipProps"
              :disabled="addresses.length === 0"
              :loading="loading"
              @click="handleRewardStudents"
            />
          </template>
        </v-tooltip>
      </div>
      <div v-else class="flex flex-column mt-6 gap-4">
        <alex-inputs-text-field
          v-model="reward"
          label="Set the total amount of reward (in USDT/dollar)"
          :placeholder="'Task Prize'"
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

        <alex-inputs-select
          v-model="selectedContract"
          name="Contract"
          :items="['TaskOwnerRedeemsContract', 'TaskStudentsRedeemsContract']"
          placeholder="Select Contract"
          class="w-100"
          required
          hint="Escolha entre os contratos disponíveis"
          persistent-hint
          clearable
          info="Insira o nome de um contrato"
          label="Qual contrato será usado?"
        />
        <v-tooltip text="Warning, you're about to spend real money">
          <template #activator="{ props: tooltipProps }">
            <alex-custom-button
              text="Finish"
              variant="warning"
              v-bind="tooltipProps"
              :disabled="theresError"
              :loading="loading"
              @click="handleCreateTaskContract"
            />
          </template>
        </v-tooltip>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useForm } from 'vee-validate';
import * as yup from 'yup';
import { TaskStatus } from '~/models/simple/taskSimple.model';
interface ContractsProps {
  edit?: boolean;
  contractAddress: string | null;
  addresses?: string[];
  taskId: number;
}

const props = withDefaults(defineProps<ContractsProps>(), {
  addresses: () => [],
});

const model = defineModel<TaskStatus>();
const contractBalance = ref<number | undefined>();

const {
  createTaskContract,
  rewardStudents,
  getContractBalance,
  weiToUsd,
  loading,
} = useContracts();
const { addTaskContractAddress } = useTaskStore();

onBeforeMount(async () => {
  if (!props.contractAddress) return;
  const value = await getContractBalance(props.contractAddress);
  if (!value) return;
  contractBalance.value = weiToUsd(value);
});

const configContract = ref(props.edit && !!props.contractAddress);
const selectedContract = ref<string | null>(null);

const createTaskContractSchema2 = yup.object({
  reward: yup
    .string()
    .matches(/^[0-9]{1,}([,-.][0-9]{1,2}){0,1}$/, 'Must be a number')
    .matches(/^[0-9]{2,}([,-.][0-9]{1,2}){0,1}$/, 'Must be a at least 10')
    .required(),
});

const handleCreateTaskContract = async () => {
  console.log({ propsContract: props.contractAddress });
  const contractAddress = await createTaskContract(parseFloat(reward.value));
  if (!contractAddress) return;
  await addTaskContractAddress(props.taskId, contractAddress as string);
};

const handleRewardStudents = async () => {
  if (!props.contractAddress) return;
  await rewardStudents(props.contractAddress, props.addresses);
};

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
  keepValuesOnUnmount: true,
});

const reward = useFieldModel<string>('reward');
const theresError = computed(
  () =>
    Object.keys(errors.value).length !== 0 ||
    !reward.value ||
    !configContract.value ||
    !selectedContract.value,
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

const temp = {
  contractAddress: props.contractAddress,
  configContract: configContract.value,
};
</script>
