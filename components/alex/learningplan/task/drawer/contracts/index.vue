<template>
  <div class="gap-3">
    <p class="text-h3 my-6">Smart Contract</p>
    <alex-custom-switch
      v-model="canEdit"
      label="
            Show experimental area
          "
      :disabled="isThereAContract"
    />

    <div v-if="canEdit">
      <div v-if="contractAddress" class="flex flex-column mt-6 gap-4">
        <div v-if="contractBalance > 0">
          <div class="flex flex-col">
            <p class="text-body-4 text-gray-800">Reward stored in the task</p>
            <p class="text-body-3 text-gray-800">$ {{ contractBalance }}</p>
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
                :disabled="itsNotFinished"
                @click="handleRewardStudents"
              />
            </template>
          </v-tooltip>

          <div class="flex flex-column mt-8 gap-4">
            <div class="flex flex-column gap-1">
              <p class="text-h4 text-gray-800">
                Second thoughts about the rewarding your students?
              </p>
              <p class="text-body-3 text-gray-500">
                Bear in mind that editing/cancelling the rewards has monetary
                costs
              </p>
            </div>
            <alex-learningplan-task-drawer-contracts-create-contract-form
              :is-draft="isDraft"
              :display-draft-warning="displayDraftWarning"
              :task-member-students="taskMemberStudents"
              :loading="loading"
              :contract-address="contractAddress"
              reward-label="Set the NEW value to be rewarded to each student (in USDT/dollar)"
              update-contract
              @create:contract-address="handleCreateTaskContract"
              @cancel:contract-draft="handleAbortContract"
              @delete:contract-address="handleCancelContract"
            />
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
      <alex-learningplan-task-drawer-contracts-create-contract-form
        v-else
        :is-draft="isDraft"
        :display-draft-warning="displayDraftWarning"
        :task-member-students="taskMemberStudents"
        reward-label="Set the value to be rewarded to each student (in USDT/dollar)"
        :loading="loading"
        @create:contract-address="handleCreateTaskContract"
        @cancel:contract-draft="handleAbortContract"
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

const isThereAContract = computed(() => !!contractAddress.value);

const canEdit = ref(isThereAContract.value);
// const editContract = computed(() => canEdit.value || !!contractAddress.value);

const displayDraftWarning = ref(false);
const isDraft = computed(() => status.value === 'draft');

const contractBalance = ref<number>(0);

const itsNotFinished = computed(() => status.value !== 'finished');

onMounted(async () => {
  console.log('onMounted');
  if (!contractAddress.value) return;
  const balance = await getContractBalance(contractAddress.value);

  if (!balance) return;
  contractBalance.value = weiToUsd(balance);
});

watch(isThereAContract, () => {
  canEdit.value = isThereAContract.value;
});

watch(contractAddress, async () => {
  console.log('watch');
  console.log({ contractAddress: contractAddress.value });
  if (!contractAddress.value) return;
  const balance = await getContractBalance(contractAddress.value);
  console.log({ balance });
  if (!balance) return;
  contractBalance.value = weiToUsd(balance);
});

const handleCancelContract = async (
  selectedContract: AvailableContracts = 'TaskOwnerReedemsContract',
) => {
  if (!selectedContract || !contractAddress.value) return;
  await cancelContract({
    chosenContract: selectedContract,
    contractAddress: contractAddress.value,
  });

  emit('delete:contract-address');
};

const handleCreateTaskContract = async (props: CreateContractProps) => {
  const { budget, chosenContract } = props;
  if (isDraft.value) {
    emit('deploy:contract-draft', async () => {
      return await createTaskContract({
        budget,
        chosenContract,
      });
    });
    displayDraftWarning.value = true;
    return;
  }

  const contractAddress = await createTaskContract({
    budget,
    chosenContract,
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
</script>
