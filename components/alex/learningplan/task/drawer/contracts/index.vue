<template>
  <div class="gap-3">
    <p class="text-h3 my-6">Smart Contract {{ contractAddress }}</p>
    <alex-custom-switch
      v-model="canEdit"
      label="
            Show experimental area
          "
      :disabled="isThereAContract"
    />
    <span
      >isUpdatingContract: {{ isUpdatingContract }} contractBalance:
      {{ contractBalance }}</span
    >
    <div v-if="canEdit">
      <div v-if="contractAddress" class="flex flex-column mt-6 gap-4">
        <div v-if="isThereBalance">
          <div class="flex flex-col">
            <p class="text-body-4 text-gray-800">Reward stored in the task</p>
            <p class="text-body-3 text-gray-800">
              $ {{ contractBalance.toFixed(2) }}
            </p>
          </div>
          <div v-if="itsNotFinished">
            <span class="text-red-500"
              >You can only reward your students after the task is
              finished</span
            >
          </div>

          <v-tooltip text="Warning, you're about to spend real money">
            <template #activator="{ props: tooltipProps }">
              <alex-custom-button
                text="Reward students"
                variant="warning"
                v-bind="tooltipProps"
                :loading="loading"
                :disabled="itsNotFinished || isRewardCompleted"
                @click="handleRewardStudents"
              />
            </template>
          </v-tooltip>
          <div class="flex flex-column gap-1 mt-6">
            <p class="text-h4 text-gray-800">
              Second thoughts about the rewarding your students?
            </p>
            <p class="text-body-3 text-gray-500">
              Bear in mind that editing/cancelling the rewards has monetary
              costs
            </p>
          </div>
        </div>

        <div v-else>
          <div class="flex flex-col">
            <p class="text-body-4 text-gray-800">
              Reward left in the task: $ {{ contractBalance }}
            </p>
          </div>
          <span class="text-red-500">
            This contract was redeemed and the students were rewarded.
          </span>
        </div>
      </div>
      <div class="mt-6" />
      <alex-learningplan-task-drawer-contracts-create-contract-form
        v-if="(isThereAContract && isThereBalance) || !isThereAContract"
        :is-draft="isDraft"
        :display-draft-warning="displayDraftWarning"
        :task-member-students="taskMemberStudents"
        :loading="loading"
        :contract-address="contractAddress"
        :reward-label="`Set the ${
          isUpdatingContract ? 'NEW ' : ''
        }value to be rewarded to each student (in USDT/dollar)`"
        :update-contract="isUpdatingContract"
        @create:contract-address="handleCreateTaskContract"
        @cancel:contract-draft="handleAbortContract"
        @delete:contract-address="handleCancelContract"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { TaskStatus } from '~/models/simple/taskSimple.model';
interface ContractsProps {
  edit?: boolean;
  taskMembers?: any[];
}

const props = withDefaults(defineProps<ContractsProps>(), {
  taskMembers: () => [],
  edit: false,
});

const {
  createTaskContract,
  rewardStudents,
  getContractBalance,
  cancelContract,
  weiToUsd,
  loading,
} = useContracts();

const emit = defineEmits([
  'deploy:contract-draft',
  'cancel:contract-draft',
  'update:contract-address',
  'delete:contract-address',
]);

const status = defineModel<TaskStatus | TaskMemberStatus>('status');
const contractAddress = defineModel<string | null>('contractAddress', {
  default: null,
});
const isRewardCompleted = ref(false);
const isUpdatingContract = ref(false);
const displayDraftWarning = ref(false);
const contractBalance = ref<number>(0);

// const editContract = computed(() => canEdit.value || !!contractAddress.value);

const itsNotFinished = computed(() => status.value !== 'finished');
const isThereAContract = computed(() => !!contractAddress.value);
const isThereBalance = computed(() => contractBalance.value > 0);
const isDraft = computed(() => status.value === 'draft');

const canEdit = ref(isThereAContract.value || isUpdatingContract.value);

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

onMounted(async () => {
  console.log('onMounted');
  await fetchContractBalance();
});

watch(isThereAContract, async () => {
  canEdit.value = isThereAContract.value || isUpdatingContract.value;
  console.log('is there a contract', isThereAContract.value);
  await fetchContractBalance();
});

watch(isThereBalance, () => {
  isUpdatingContract.value = isThereBalance.value;
  console.log('is there Balance', isThereBalance.value);
});

watch(contractAddress, async () => {
  console.log('contractAddress has changed');
  console.log({ contractAddress: contractAddress.value });
  await fetchContractBalance();
});

const fetchContractBalance = async () => {
  if (!contractAddress.value) return;
  const balance = await getContractBalance(contractAddress.value);
  console.log('fetchedBalance', { balance });
  if (!Number(balance)) {
    console.log('0n is false', balance);
    return;
  }

  contractBalance.value = weiToUsd(balance);
  console.log('newBalance', { newBalance: weiToUsd(balance) });
};

const handleCancelContract = async (
  selectedContract: AvailableContracts = 'TaskOwnerReedemsContract',
  isUpdating = false,
) => {
  if (!selectedContract || !contractAddress.value) return;
  const result = await cancelContract({
    chosenContract: selectedContract,
    contractAddress: contractAddress.value,
  });
  if (!result) return;

  if (isUpdating) isUpdatingContract.value = true;
  contractAddress.value = null;
  await fetchContractBalance();
  console.log({ result, contractAddress: contractAddress.value });
  emit('update:contract-address', null);
};

const handleCreateTaskContract = async (props: CreateContractProps) => {
  const { budget, chosenContract } = props;
  if (isDraft.value) {
    emit('deploy:contract-draft', async () => {
      const result = await createTaskContract({
        budget,
        chosenContract,
      });
      await fetchContractBalance();
      return result;
    });
    displayDraftWarning.value = true;
    return;
  }

  const newContractAddress = await createTaskContract({
    budget,
    chosenContract,
  });

  if (!newContractAddress) return;
  isUpdatingContract.value = true;
  console.log({ newContractAddress });
  contractAddress.value = newContractAddress as string;
  await fetchContractBalance();
  emit('update:contract-address', newContractAddress as string);
};

const handleAbortContract = async () => {
  emit('cancel:contract-draft');
  displayDraftWarning.value = false;
  canEdit.value = false || isUpdatingContract.value;
  await fetchContractBalance();
};

const handleRewardStudents = async () => {
  if (!contractAddress.value) return;
  const result = await rewardStudents(
    contractAddress.value,
    taskWallets.value,
    taskGrades.value,
  );
  isRewardCompleted.value = result;
  isUpdatingContract.value = false;
  await fetchContractBalance();
};
</script>
