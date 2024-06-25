<template>
  <div class="gap-3">
    <p class="text-h3 my-6">Smart Contract</p>
    <alex-custom-switch
      v-model="editContract"
      label="
            Show experimental area
          "
      :disabled="props.edit && contractAddress"
    />
    <pre>{{ taskWallets }}</pre>
    <div v-if="editContract">
      <div v-if="contractAddress" class="flex flex-column mt-6 gap-4">
        <div class="flex flex-col">
          <p class="text-body-4 text-gray-800">Reward stored in the task</p>
          <p class="text-body-3 text-gray-800">$ {{ contractBalance }}</p>
        </div>
        <div v-if="status !== 'finished'">
          <span class="text-red-500"
            >You can only reward your students after the task is finished</span
          >
        </div>

        <v-tooltip v-else text="Warning, you're about to spend real money">
          <template #activator="{ props: tooltipProps }">
            <alex-custom-button
              text="Reward students"
              variant="warning"
              v-bind="tooltipProps"
              :loading="loading"
              @click="handleRewardStudents"
            />
          </template>
        </v-tooltip>
      </div>
      <div v-else class="flex flex-column mt-6 gap-4">
        <div class="flex flex-column">
          <alex-inputs-text-field
            v-model="reward"
            label="Set the value to be rewarded to each student (in USDT/dollar)"
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
          <p
            v-if="taskMemberStudents.length === 0"
            class="text-body-3 text-gray-800"
          >
            Please add students to this task so we can calculate the total
            reward
          </p>

          <p
            v-else-if="reward && isNumber(reward) && reward !== ''"
            class="text-body-3 text-gray-800"
          >
            Total reward: $ {{ totalReward }}
          </p>
        </div>

        <alex-inputs-select
          v-model="selectedContract"
          name="Contract"
          :items="['TaskOwnerRedeemsContract', 'TaskOwnerRedeemsContract2']"
          placeholder="Select Contract"
          class="w-100"
          required
          hint="Escolha entre os contratos disponíveis"
          persistent-hint
          clearable
          info="Insira o nome de um contrato"
          label="Qual contrato será usado?"
        />

        <div
          v-if="displayDraftWarning && isDraft"
          class="flex flex-column w-full gap-4 text-orange-800"
        >
          <span>Your contract will be created when you publish this task</span>
          <v-tooltip text="Click here to give up on creating a smart contract">
            <template #activator="{ props: tooltipProps }">
              <alex-custom-button
                text="I've changed my mind"
                variant="error"
                v-bind="tooltipProps"
                :disabled="theresError"
                :loading="loading"
                @click="handleAbortContract"
              />
            </template>
          </v-tooltip>
        </div>

        <v-tooltip v-else text="Warning, you're about to spend real money">
          <template #activator="{ props: tooltipProps }">
            <alex-custom-button
              text="Deploy contract"
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
import { BigNumberish } from 'ethers';
import { useForm } from 'vee-validate';
import * as yup from 'yup';
import { TaskStatus } from '~/models/simple/taskSimple.model';
interface ContractsProps {
  edit?: boolean;
  taskMembers?: any[];
}

const props = withDefaults(defineProps<ContractsProps>(), {
  taskMembers: () => [],
});

const {
  createTaskContract,
  rewardStudents,
  getContractBalance,
  weiToUsd,
  loading,
} = useContracts();

const emit = defineEmits([
  'deploy:contract-draft',
  'cancel:contract-draft',
  'update:contract-address',
]);

const status = defineModel<TaskStatus | TaskMemberStatus>('status');
const contractAddress = defineModel<string | null>('contractAddress', {
  default: null,
});
const canEdit = ref(props.edit);
console.log({ contractAddress: contractAddress.value });
const selectedContract = ref<string | null>(null);
const displayDraftWarning = ref(false);
const isDraft = computed(() => status.value === 'draft');

const editContract = computed(
  () => canEdit.value && contractAddress.value !== null,
);

const contractBalance = ref<BigNumberish>(0);

watch(contractAddress, async () => {
  const balance = await getContractBalance(contractAddress.value);
  if (!balance) return;
  contractBalance.value = weiToUsd(balance);
});

const createTaskContractSchema2 = yup.object({
  reward: yup
    .string()
    .matches(/^[0-9]{1,}([,-.][0-9]{1,2}){0,1}$/, 'Must be a number')
    .matches(/^[0-9]{2,}([,-.][0-9]{1,2}){0,1}$/, 'Must be a at least 10')
    .required(),
});

const handleCreateTaskContract = async () => {
  if (isDraft.value) {
    emit('deploy:contract-draft', async () => {
      return await createTaskContract({
        budget: totalReward.value,
        chosenContract: selectedContract.value as AvailableContracts,
      });
    });
    displayDraftWarning.value = true;
    return;
  }
  if (!selectedContract.value) return;
  const contractAddress = await createTaskContract({
    budget: totalReward.value,
    chosenContract: selectedContract.value as AvailableContracts,
  });
  console.log({ contractAddress });
  if (!contractAddress) return;
  emit('update:contract-address', contractAddress as string);
};

const handleAbortContract = () => {
  emit('cancel:contract-draft');
  displayDraftWarning.value = false;
  canEdit.value = false;
};

const handleRewardStudents = async () => {
  if (!contractAddress.value) return;
  await rewardStudents(
    contractAddress.value,
    taskWallets.value,
    taskGrades.value,
  );
};

const taskMemberStudents = computed(() => {
  return props.taskMembers.flatMap(
    (member) => member.task_member_students?.map((m) => m.student_member) || [],
  );
});

const taskWallets = computed(() => {
  return taskMemberStudents.value
    .map((m) => m.user?.wallet?.address)
    .filter(Boolean); // Check for null or undefined values
});

const taskGrades = computed(() => {
  return taskWallets.value.map(() => Math.floor(Math.random() * 11));
});

const totalReward = computed(
  () => parseFloat(reward.value) * taskMemberStudents.value.length,
);

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
const theresError = computed(() => {
  emit('cancel:contract-draft');

  return (
    Object.keys(errors.value).length !== 0 ||
    !reward.value ||
    !editContract.value ||
    !selectedContract.value ||
    taskMemberStudents.value.length === 0
  );
});

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
