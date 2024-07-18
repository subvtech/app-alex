<template>
  <div class="gap-3">
    <alex-custom-switch
      v-model="canEdit"
      :label="$t('components.learningPlan.contract.warning.experimental')"
      :disabled="isThereAContract"
    />
    <div v-if="canEdit">
      <div v-if="contractAddress" class="flex flex-column mt-6 gap-4">
        <div v-if="isThereBalance">
          <alex-learningplan-task-drawer-contracts-balance
            :balance="contractBalance"
            :text="$t('components.learningPlan.contract.reward.stored')"
          />

          <div class="flex my-6">
            <div v-if="itsNotFinished">
              <span class="text-body-2 text-error-0">{{
                $t('components.learningPlan.contract.warning.notFinished')
              }}</span>
            </div>

            <div v-else-if="taskWallets.length === 0">
              <span class="text-body-2 text-error-0">{{
                $t('components.learningPlan.contract.warning.noOneHasFinished')
              }}</span>
            </div>

            <div class="d-flex flex-column gap-1 my-2">
              <alex-learningplan-task-drawer-contracts-button
                :tooltip-text="
                  $t('components.learningPlan.contract.warning.tooltip.once')
                "
                :text="
                  $t('components.learningPlan.contract.reward.rewardStudents')
                "
                variant="warning"
                :loading="loading"
                :disabled="
                  itsNotFinished ||
                  isRewardCompleted ||
                  taskWallets.length === 0
                "
                show-hint
                :hint="
                  $t(
                    'components.learningPlan.contract.warning.elligibleStudents',
                  )
                "
                @click:button="handleRewardStudents"
              />
            </div>
          </div>

          <div class="flex flex-column gap-1 mt-6">
            <p class="text-h4 text-gray-800">
              {{
                $t('components.learningPlan.contract.warning.secondThoughts')
              }}
            </p>
            <p class="text-body-3 text-gray-500">
              {{ $t('components.learningPlan.contract.warning.editContract') }}
            </p>
          </div>
        </div>

        <div v-else class="d-flex flex-column gap-2">
          <alex-learningplan-task-drawer-contracts-balance
            :balance="contractBalance"
            :text="$t('components.learningPlan.contract.reward.remaining')"
          />
          <span class="text-body-2 text-gray-800">
            {{ $t('components.learningPlan.contract.reward.redeemed') }}
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
        :reward-label="$t('components.learningPlan.contract.reward.value')"
        :update-contract="isUpdatingContract"
        @create:contract-address="handleCreateTaskContract"
        @cancel:contract-draft="handleAbortContract"
        @delete:contract-address="handleCancelContract"
      />
      <div class="mt-6" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { TaskStatus } from '~/models/simple/taskSimple.model';
interface ContractsProps {
  edit?: boolean;
  taskMembers: TaskMember[];
}

const props = withDefaults(defineProps<ContractsProps>(), {
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
    (member) =>
      [
        {
          taskStatus: member.status,
          learning_plan_member: member.learning_plan_member,
        },
      ] || [],
  );
});

const taskWallets = computed(() => {
  return taskMemberStudents.value
    .filter((m) => m.taskStatus === 'done')
    .map((m) => m.learning_plan_member?.user?.wallet?.address)
    .filter(Boolean); // Check for null or undefined values
});

const taskGrades = computed(() => {
  return taskWallets.value.map(() => Math.floor(Math.random() * 11));
});

watch(isThereAContract, async () => {
  canEdit.value = isThereAContract.value || isUpdatingContract.value;
  console.log('is there a contract', isThereAContract.value);
  await fetchContractBalance();
});

watch(isThereBalance, () => {
  isUpdatingContract.value = isThereBalance.value;
});

const fetchContractBalance = async () => {
  if (!contractAddress.value) return;
  const balance = await getContractBalance(contractAddress.value);
  console.log('fetchedBalance', { balance, bool: !balance });
  if (balance === undefined) return;
  contractBalance.value = weiToUsd(balance);
  console.log('newBalance', { newBalance: weiToUsd(balance) });
};
await fetchContractBalance();
const handleCancelContract = async (isUpdating = false) => {
  if (!contractAddress.value) return;
  const result = await cancelContract({
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
  const { budget, totalNumberOfStudents } = props;
  if (isDraft.value) {
    emit('deploy:contract-draft', async () => {
      const result = await createTaskContract({
        budget,
        totalNumberOfStudents,
      });
      await fetchContractBalance();
      return result;
    });
    displayDraftWarning.value = true;
    return;
  }

  const newContractAddress = await createTaskContract({
    budget,
    totalNumberOfStudents,
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
  if (result) isUpdatingContract.value = false;
  await fetchContractBalance();
};

watch(status, async () => {
  await fetchContractBalance();
});
</script>
