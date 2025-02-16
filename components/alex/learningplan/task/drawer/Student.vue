<template>
  <v-navigation-drawer
    :id="drawerId"
    v-model="model"
    location="right"
    temporary
    floating
    :width="640"
    scrim="transparent"
    sticky
    class="pa-6 pt-2 rounded-s-lg"
  >
    <template #prepend>
      <alex-custom-button icon="mdi-close" size="small" variant="text" @click="handleCloseModal" />
    </template>

    <template #default>
      <div v-if="student" class="user-info text-gray-800 mb-4">
        <v-avatar
          :size="80"
          :image="student.avatar || undefined"
          class="alex-avatar-group-border alex-avatar-group-margin"
          color="gray-100"
        >
          <template v-if="!student.avatar" #default>
            <p class="text-gray-300 text-h2">
              {{ initials }}
            </p>
          </template>
        </v-avatar>
        <h2 class="text-h2 ellipsis lines-1">{{ student.name }}</h2>
        <p class="text-subtitle-2 ellipsis lines-1">{{ studentClass }}</p>
      </div>
      <div v-if="group" class="tw-flex tw-flex-col tw-gap-2 text-gray-800 mb-6">
        <alex-custom-chip class="tw-w-fit" :text="studentClass" />
        <h2 class="text-h2 ellipsis lines-1">{{ group.title }}</h2>
        <div class="tw-flex tw-items-center tw-gap-2">
          <v-avatar
            :size="40"
            :image="inChargeMember?.student_member.user.avatar?.url || undefined"
            class="alex-avatar-group-border alex-avatar-group-margin"
            color="gray-100"
          >
            <template v-if="!inChargeMember?.student_member.user.avatar?.url" #default>
              <p class="text-gray-300 text-h4">
                {{ getInitials(inChargeMember?.student_member.user.fullname || '') }}
              </p>
            </template>
          </v-avatar>
          <p class="text-subtitle-2 ellipsis lines-1">
            {{ inChargeMember?.student_member.user.fullname }}
          </p>
        </div>
      </div>

      <div class="task-info">
        <div class="d-flex flex-column gap-2 tw-w-full">
          <p class="text-body-4">
            {{ $t('components.courses.tasks.submission.status') }}
          </p>
          <alex-custom-chip
            class="tw-w-fit"
            :status="statusColor"
            :text="$t(`components.courses.tasks.task.status.${status || 'draft'}`)"
          />
        </div>

        <div class="d-flex flex-column gap-2 tw-w-full">
          <p class="text-body-4 text-gray-800 mb-1">
            <span class="text-tag-orange-light">* </span>{{ $t('components.learningPlan.drawer.task.date.finalLabel') }}
          </p>

          <alex-learningplan-task-date v-model="finishAt" edit />
        </div>
      </div>
      <div class="task-submission my-6">
        <template v-if="submission">
          <h4 class="text-h4">
            {{ $t('components.courses.tasks.submission.submission') }}
          </h4>

          <div class="d-flex flex-column gap-2 tw-w-fit">
            <div class="d-flex gap-2">
              <alex-custom-switch
                v-model="canSubmitAfterDeadline"
                :label="$t('components.learningPlan.drawer.task.allowSendAfterSubmission')"
                :disabled="canSubmitAfterDeadlineTask"
              />
            </div>
            <p class="text-body-4">
              {{ $t('components.courses.tasks.submission.constraint') }}
            </p>
            <div class="d-flex gap-2">
              <alex-custom-chip
                v-if="!submission.constraints.length"
                status="secondary"
                :text="$t('components.learningPlan.drawer.task.freeEditor')"
              />
              <template v-else
                ><alex-custom-chip
                  v-for="(constraint, index) in submission.constraints"
                  :key="index"
                  status="secondary"
                  :text="config[constraint]"
              /></template>
            </div>
          </div>
          <div class="d-flex flex-column gap-2 w-100">
            <alex-learningplan-task-description
              v-if="submissionDesc"
              v-model="submissionDesc"
              :title="$t('components.learningPlan.drawer.task.description.submissionLabel')"
            />
          </div>
          <div class="d-flex flex-column gap-2 tw-w-fit">
            <template v-if="!pending">
              <p class="text-body-4">
                {{ $t('components.courses.tasks.submission.last_submission') }}
              </p>
              <alex-learningplan-task-submission
                v-if="mostRecentSubmission?.submitted_at"
                type="professor"
                :task-title="task.title"
                :task-id="task.id"
                :learning-plan-id="learningplanStore.learningPlan?.id"
                :status="submissionStatus || getSubmissionStatus(mostRecentSubmission)"
                :task-deadline="finishAt || undefined"
                :mark="mostRecentSubmission?.grade"
                :task-member-id="taskMemberId"
                :content="mostRecentSubmission"
                :task-status="status"
                :doc_name="docName"
                :student="student"
                :group="group"
                :class="studentClass"
                @update-task-status="handleChangeStatus"
              />
              <p v-else class="text-body-3 text-gray-400">
                {{ $t('components.learningPlan.drawer.task.submission.empty') }}
              </p>
            </template>
            <template v-else>
              <alex-custom-skeleton color="gray-blue" class="tw-w-[96px] tw-h-[19px]" />
              <alex-custom-skeleton color="gray-blue" class="tw-w-[256px] tw-h-[64px]"
            /></template>
          </div>
        </template>
        <template v-else>
          <div class="d-flex gap-2 flex-column tw-w-fit">
            <h4 class="text-h4">
              {{ $t('components.courses.tasks.submission.submission') }}
            </h4>
            <alex-custom-chip
              status="secondary"
              variant="outlined"
              :text="$t('components.courses.tasks.submission.no_submission')"
            />
          </div>
        </template>
      </div>

      <div v-if="contractAddress" class="d-flex flex-column gap-8 mt-1">
        <div v-if="disablePayment" class="d-flex flex-column gap-3">
          <span class="text-h5 text-gray-800">
            {{ $t('components.learningPlan.contract.reward.studentRewarded') }}
          </span>
          <alex-learningplan-task-drawer-contracts-balance
            :balance="contractBalance"
            :text="$t('components.learningPlan.contract.reward.remaining')"
          />
        </div>

        <div v-else class="d-flex flex-column gap-6">
          <alex-learningplan-task-drawer-contracts-balance
            :balance="contractBalance"
            :text="$t('components.learningPlan.contract.reward.remaining')"
          />

          <alex-learningplan-task-drawer-contracts-button
            v-if="student && isThereBalance"
            :tooltip-text="$t('components.learningPlan.contract.warning.tooltip.once')"
            :text="$t('components.learningPlan.contract.reward.rewardSingleStudent')"
            variant="warning"
            :loading="contractLoading"
            :disabled="status !== 'done'"
            @click="handleRewardSingleStudent"
          />
          <alex-learningplan-task-drawer-contracts-button
            v-else-if="group"
            :tooltip-text="$t('components.learningPlan.contract.warning.tooltip.once')"
            :text="$t('components.learningPlan.contract.reward.rewardStudents')"
            variant="warning"
            :loading="contractLoading"
            :disabled="status !== 'done'"
            @click="handleRewardGroup"
          />
        </div>
        <div v-if="isThereBalance" class="d-flex flex-column items-start gap-3">
          <p class="text-h5 text-gray-800">
            {{ $t('components.learningPlan.contract.warning.secondThoughts') }}
          </p>
          <p class="text-body-4 text-gray-500">
            {{ $t('components.learningPlan.contract.warning.abortConsequences') }}
          </p>

          <alex-learningplan-task-drawer-contracts-button
            :tooltip-text="$t('components.learningPlan.contract.warning.tooltip.fee')"
            :text="$t('components.learningPlan.contract.warning.finish')"
            variant="error"
            :loading="contractLoading"
            @click:button="handleCancelContract"
          />
        </div>
      </div>

      <alex-learningplan-task-tabs
        v-model="activePage"
        v-model:attached-message="attachedMessage"
        v-model:attached-submission="attachedSubmission"
        :is-sending-message="isSendingMessage"
        :task-member="{
          id: taskMemberId,
          status,
        }"
        :task="{
          id: task.id,
          title: task.title,
          finalDate: finishAt || undefined,
          restrictions: submission?.constraints || [],
        }"
        :show-member-tab="!!group"
        :message="{ isLoading: pendingMessages }"
        :event="{ events: events.data, isLoading: eventLoading }"
        :submission="!!submission"
        :selector-parent="`#${drawerId} .v-navigation-drawer__content`"
        :submissions="evaluatedSubmissions"
      >
        <template #members>
          <alex-learningplan-task-members-card
            v-for="member in group?.group_members"
            :key="`group-member${member.id}`"
            :member="{
              name: member.student_member.user.fullname,
              class: group?.learning_class?.name,
              avatarUrl: member.student_member.user?.avatar?.url,
              responsable: member.role === 'in_charge',
            }"
            :edit="false"
          />
        </template>
      </alex-learningplan-task-tabs>
    </template>

    <template v-if="activePage === '3'" #append>
      <alex-learningplan-task-chat-input
        v-model:attached-message="attachedMessage"
        v-model:attached-submission="attachedSubmission"
        class="border-top-1 border-gray-100 pt-3"
        :submissions="evaluatedSubmissions"
        @submit="
          (data) =>
            handleSubmitMessage(
              data.text,
              data.audio?.blob,
              data.audio?.duration,
              data.attachedMessage,
              data.attachedSubmission,
            )
        "
      />
    </template>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import type { TaskSubmissionSimple } from '~/models/simple/taskSubmissionSimples.model';
import type { TaskStudent } from '../kanban/index.vue';

export interface Student {
  name: string;
  avatar?: string | null;
  user_wallet?: { address: string };
  email?: string;
}
interface Submission {
  description: string;
  constraints: string[];
}
interface TaskUserDrawerProps {
  learningplanId: number;
  task: {
    id: number;
    title: string;
    startDate?: string | null;
    endDate?: string | null;
    sendAfterDeadline?: boolean;
  };
  docName: string;
  taskMemberId: number;
  student?: Student;
  group?: LearningPlanGroupSimple;
  status: TaskMemberStatus;
  finishAt?: string | null;
  submission?: Submission;
  studentClass: string;
  contractAddress: string | null;
  canSubmitAfterDeadline: boolean;
  canSubmitAfterDeadlineTask?: boolean;
}
const props = withDefaults(defineProps<TaskUserDrawerProps>(), {
  submission: undefined,
  student: undefined,
  canSubmitAfterDeadlineTask: false,
  finishAt: null,
  group: undefined,
});
const { t } = useI18n();

const { contractAddress } = toRefs(props);

const {
  rewardSingleStudent,
  rewardStudents,
  hasTheStudentBeenPaid,
  cancelContract,
  isThereAContract,
  fetchContractReward,
  fetchContractBalance,
  contractBalance,
  loading: contractLoading,
} = useContracts(contractAddress);

const isRewarded = ref(false);

const handleRewardSingleStudent = async () => {
  if (!props.student?.user_wallet) return;
  if (!contractAddress.value) return;
  await rewardSingleStudent(props.student.user_wallet.address, 88);
  const result = await hasTheStudentBeenPaid(props.student.user_wallet.address);
  isRewarded.value = result;
  await fetchContractBalance();
};

const wallets = computed(
  () =>
    (props.group?.group_members.map((m) => m.student_member.user.user_wallet?.address).filter(Boolean) ||
      []) as string[],
);

const handleRewardGroup = async () => {
  if (!contractAddress.value) return;

  await rewardStudents(
    wallets.value,
    wallets.value.map(() => 88),
    false,
  );
  const result = await handleHasTheStudentBeenPaid();
  isRewarded.value = result;
  await fetchContractBalance();
};

const handleHasTheStudentBeenPaid = async () => {
  let temp = false;
  if (props.group) {
    temp = await Promise.all(
      props.group.group_members.map(async (member, index) => {
        const walletAddress = member.student_member.user.user_wallet?.address;
        if (!walletAddress) {
          return false;
        }
        const hasBeenPaid = await hasTheStudentBeenPaid(walletAddress);
        return hasBeenPaid;
      }),
    ).then((results) => results.some((result) => result));
  } else {
    const walletAddress = props.student?.user_wallet?.address;
    if (!walletAddress) {
      return false;
    }
    temp = await hasTheStudentBeenPaid(walletAddress);
  }

  return temp;
};

if (contractAddress.value) isRewarded.value = await handleHasTheStudentBeenPaid();

const isThereBalance = computed(() => contractBalance.value > 0);

const handleCancelContract = async () => {
  if (!contractAddress.value) return;
  const result = await cancelContract();
  if (!result) return;

  contractAddress.value = null;
  await fetchContractBalance();
  emit('update:contract-address', null);
};

const disablePayment = computed(() => isRewarded.value && props.status === 'done');

const isSendingMessage = ref(false);
const submissionDesc = ref<any | undefined>(props.submission?.description);
const taskMemberId = toRef(props, 'taskMemberId');
const model = defineModel({ default: false });
type Emit = {
  'change-finish-at': [taskId: number, value: string];
  'change-submit-after-deadline': [taskId: number, value: boolean];
  'update:contract-address': [value: string | null];
  'update-status': [newIndex: number, value: TaskStudent, newStatus: string];
};

const status = ref<TaskMemberStatus>(props.status);
const submissionStatus = ref();
const emit = defineEmits<Emit>();
const canSubmitAfterDeadline = toRef(props.canSubmitAfterDeadline || props.canSubmitAfterDeadlineTask);
const finishAt = toRef(props.finishAt);
const activePage = ref(props.group ? '0' : '1');
const initials = computed(() => {
  return getInitials(props.student?.name || '');
});
const handleCloseModal = () => {
  model.value = false;
};
const drawerId = computed(() => `student-drawer-${crypto.randomUUID()}`);
const attachedMessage = ref<Message>();
const attachedSubmission = ref<AttachedSubmission>();
const strapi = useStrapi();
const user = useStrapiUser();
const learningplanStore = useLearningPlanStore();
const strapiUtils = useStrapiUtils();
const client = useStrapiClient();
const { setMessage } = useMessageStore();
const statusColor = computed(() => {
  const mapedColors = {
    to_do: 'secondary',
    in_progress: 'blue',
    in_review: 'orange',
    done: 'green',
  };
  return mapedColors[status.value] as 'secondary' | 'blue' | 'orange' | 'green';
});
const config: Record<string, string> = {
  text: t('components.learningPlan.drawer.task.restrictions.text'),
  image: t('components.learningPlan.drawer.task.restrictions.image'),
  video: t('components.learningPlan.drawer.task.restrictions.video'),
  document: t('components.learningPlan.drawer.task.restrictions.document'),
  link: t('components.learningPlan.drawer.task.restrictions.link'),
  gallery: t('components.learningPlan.drawer.task.restrictions.gallery'),
};

const setSubmissionDescription = () => {
  if (!props.submission?.description) {
    submissionDesc.value = '';
    return;
  }

  if (typeof props.submission?.description === 'string') {
    try {
      const descriptionObj = JSON.parse(props.submission?.description);
      submissionDesc.value = descriptionObj;
    } catch (e) {
      submissionDesc.value = props.submission?.description;
    }
  } else {
    submissionDesc.value = props.submission?.description;
  }
};

await fetchContractReward();

// Get data
const getSubmissions = (memberID: number) =>
  strapiUtils.find<TaskSubmissionSimple>('task-submissions', {
    filters: {
      task_member: memberID,
    },
    sort: 'createdAt:desc',
  });
const getEvents = (memberID: number) =>
  strapiUtils.find<TaskEvent>('task-events', {
    filters: {
      task_member: memberID,
    },
    populate: {
      learning_plan_member: {
        populate: ['user.avatar'],
      },
    },
  });
const {
  data: submissions,
  execute: executeSubmissions,
  pending,
} = await useAsyncData('task-submissions', () => getSubmissions(props.taskMemberId), {
  default: () => ({
    meta: { total: 0 },
    data: [] as TaskSubmissionSimple[],
  }),
  lazy: true,
});

const {
  data: events,
  execute: executeEvents,
  pending: eventLoading,
} = await useAsyncData('task-events', () => getEvents(props.taskMemberId), {
  default: () => ({
    meta: { total: 0 },
    data: [] as TaskEvent[],
  }),
  lazy: true,
});

const evaluatedSubmissions = computed(() =>
  submissions.value.data.flatMap((submission) =>
    submission.submitted_at
      ? [
          {
            id: submission.id,
            justification: {
              text: submission.justification,
            },
            mark: submission.grade,
            time: new Date(submission.evaluated_at || submission.createdAt),
            status: submission.evaluated_at ? 'reviewed' : 'in_review',
            submission,
          } as AttachedSubmission,
        ]
      : [],
  ),
);

const mostRecentSubmission = computed(() => submissions.value.data.filter((submission) => submission.submitted_at)[0]);
const getSubmissionStatus = (submission?: TaskSubmissionSimple) => {
  if (submission?.evaluated_at) {
    return 'reviewed';
  }
  return 'in_review';
};
const {
  data: messages,
  pending: pendingMessages,
  execute: executeMessages,
} = await useAsyncMessage(taskMemberId, {
  lazy: true,
  watch: [taskMemberId],
  dedupe: 'cancel',
});

const handleSubmitMessage = async (
  text: string,
  audio?: Blob | null,
  duration?: number,
  attachedMessage?: Message,
  attachedSubmission?: AttachedSubmission,
) => {
  try {
    if ((!text && !audio) || !user.value) return;
    let learningMember = learningplanStore.activeMembers.find((member) => member.user.id === user?.value?.id);
    if (learningplanStore.facilitator?.user.id === user.value.id) {
      learningMember = learningplanStore.facilitator;
    }
    if (!learningMember) {
      return;
    }
    isSendingMessage.value = true;
    const formData = new FormData();
    const newMessage = {
      learning_plan_member: learningMember.id,
      task_member: props.taskMemberId,
      message: text,
      sent_at: new Date().toISOString(),
      ...(attachedMessage && { response_to_message: attachedMessage.id }),
      ...(attachedSubmission && { task_submission: attachedSubmission.id }),
    };
    for (const key in newMessage) {
      if (Object.prototype.hasOwnProperty.call(newMessage, key)) {
        const value = newMessage[key];
        formData.append(key, value);
      }
    }
    if (audio) {
      formData.append('files', audio);
      formData.append('audio_duration', String(duration));
    }
    const message = await client<TaskMemberMessage>(`/task-member-messages`, {
      method: 'POST',
      body: formData,
      params: {
        populate: {
          learning_plan_member: {
            populate: ['user.avatar'],
          },
          response_to_message: {
            populate: {
              learning_plan_member: {
                populate: ['user.avatar'],
              },
            },
          },
          task_submission: true,
        },
      },
    });
    messages.value.data = [...messages.value.data, message];
  } catch (error) {
    setMessage(t('components.learningPlan.drawer.task.errors.sendMessage'), 'error', true);
  } finally {
    isSendingMessage.value = false;
  }
};

const changeDeadline = async (value?: string | null) => {
  try {
    if (!value) return;
    if (value === props.finishAt) return;
    await strapi.update<TaskMember>('task-members', props.taskMemberId, {
      finished_at: value,
    });
    if (typeof value === 'string') {
      emit('change-finish-at', props.taskMemberId, value);
      return;
    }
    emit('change-finish-at', props.taskMemberId, (value as Date).toISOString().split('T')[0]);
  } catch (error) {
    setMessage(t('pages.tasks.errors.updateDeadlineMember'), 'error', true);
  }
};

const changeSendAfterDeadline = async (value: boolean) => {
  try {
    if (value === props.canSubmitAfterDeadline) return;
    await strapi.update<TaskMember>('task-members', props.taskMemberId, {
      can_submit_after_deadline: value,
    });
    emit('change-submit-after-deadline', props.taskMemberId, value);
  } catch (error) {
    setMessage(t('pages.tasks.errors.updateSendAfterDeadline'), 'error', true);
  }
};

const getInChargeMember = (group?: LearningPlanGroupSimple) =>
  group?.group_members.find((member) => member.role === 'in_charge');
const inChargeMember = computed(() => getInChargeMember(props.group));
const handleChangeStatus = async (statusValue: TaskMemberStatus) => {
  emit(
    'update-status',
    0,
    {
      id: props.taskMemberId,
      title: props.task.title,
      status: statusValue,
      date: new Date(),
    },
    statusValue,
  );
  status.value = statusValue;
  submissionStatus.value = statusValue === 'done' ? 'reviewed' : 'in_review';
};
watch(finishAt, changeDeadline);
watch(canSubmitAfterDeadline, changeSendAfterDeadline);
watch(model, (value) => {
  if (value) {
    finishAt.value = props.finishAt;
    canSubmitAfterDeadline.value = props.canSubmitAfterDeadline || props.canSubmitAfterDeadlineTask;
    setSubmissionDescription();
    executeSubmissions();
    executeEvents();
    executeMessages();
    return;
  }
  submissions.value.data = [];
  events.value.data = [];
  messages.value.data = [];
  activePage.value = props.group ? '0' : '1';
});
watch(activePage, (value) => {
  if (value === '3') {
    executeMessages();
  }
});
watch([contractAddress, isThereAContract], async () => {
  await fetchContractReward();
});
</script>

<style scoped lang="scss">
:deep(.v-navigation-drawer__prepend) {
  display: flex;
  justify-content: flex-end;
}

.w-fit {
  width: fit-content;
}
.user-info {
  display: grid;
  grid-template-columns: auto 1fr;
  grid-template-rows: auto auto;
  column-gap: 16px;
}
.user-info .v-avatar {
  grid-row: span 2;
}
.task-info {
  display: flex;
  gap: 2em;
}
.task-submission {
  display: flex;
  gap: 16px;
  flex-direction: column;
}
</style>
