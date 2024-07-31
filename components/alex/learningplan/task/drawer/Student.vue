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
      <alex-custom-button
        icon="mdi-close"
        size="small"
        variant="text"
        @click="handleCloseModal"
      />
    </template>

    <template #default>
      <div class="user-info text-gray-800">
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
        <p class="text-subtitle-2 ellipsis lines-1">
          {{ student.studentClass }}
        </p>
      </div>

      <div class="task-info">
        <div class="d-flex flex-column gap-2 tw-w-full">
          <p class="text-body-4">
            {{ $t('components.courses.tasks.submission.status') }}
          </p>
          <alex-custom-chip
            class="tw-w-fit"
            :status="statusColor"
            :text="
              $t(`components.courses.tasks.task.status.${status || 'draft'}`)
            "
          />
        </div>
        <div class="d-flex flex-column gap-2 tw-w-full">
          <p class="text-body-4 text-gray-800 mb-1">
            <span class="text-tag-orange-light">* </span
            >{{ $t('components.learningPlan.drawer.task.date.finalLabel') }}
          </p>

          <alex-learningplan-task-date v-model="finishAt" edit />
        </div>
      </div>
      <div class="task-submission">
        <template v-if="submission">
          <h4 class="text-h4">
            {{ $t('components.courses.tasks.submission.submission') }}
          </h4>

          <div class="d-flex flex-column gap-2 tw-w-fit">
            <div class="d-flex gap-2">
              <alex-custom-switch
                v-model="canSubmitAfterDeadline"
                :label="
                  $t(
                    'components.learningPlan.drawer.task.allowSendAfterSubmission',
                  )
                "
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
              v-model="submissionDesc"
              :doc-name="`task-submission-${taskId}`"
              :title="
                $t(
                  'components.learningPlan.drawer.task.description.submissionLabel',
                )
              "
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
                :task-title="student.name"
                :status="getSubmissionStatus(mostRecentSubmission)"
                :task-deadline="finishAt || undefined"
                :mark="mostRecentSubmission?.grade"
                :task-member-id="taskMemberId"
                :content="mostRecentSubmission"
                :task-status="status"
              />
              <p v-else class="text-body-3 text-gray-400">
                {{ $t('components.learningPlan.drawer.task.submission.empty') }}
              </p>
            </template>
            <template v-else>
              <alex-custom-skeleton
                color="gray-blue"
                class="tw-w-[96px] tw-h-[19px]" />
              <alex-custom-skeleton
                color="gray-blue"
                class="tw-w-[256px] tw-h-[64px]"
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

      <alex-learningplan-task-tabs
        v-model="activePage"
        v-model:attached-message="attachedMessage"
        v-model:attached-submission="attachedSubmission"
        :is-sending-message="isSendingMessage"
        :task-member-id="taskMemberId"
        :message="{ isLoading: pendingMessages }"
        :event="{ events: events.data, isLoading: eventLoading }"
        :submission="!!submission"
        :selector-parent="`#${drawerId} .v-navigation-drawer__content`"
        :submissions="evaluatedSubmissions"
      />
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
import { TaskSubmissionSimple } from '~/models/simple/taskSubmissionSimples.model';

interface Student {
  name: string;
  studentClass: string;
  avatar?: string | null;
}
interface Submission {
  description: string;
  constraints: string[];
}
interface TaskUserDrawerProps {
  student: Student;
  taskId: number;
  taskMemberId: number;
  status: TaskMemberStatus;
  finishAt?: string | null;
  submission?: Submission;
  canSubmitAfterDeadline: boolean;
  canSubmitAfterDeadlineTask?: boolean;
}
const props = withDefaults(defineProps<TaskUserDrawerProps>(), {
  submission: undefined,
  canSubmitAfterDeadlineTask: false,
  finishAt: null,
});
const { t } = useI18n();
const isSendingMessage = ref(false);
const submissionDesc = ref<any | undefined>(props.submission?.description);
const taskMemberId = toRef(props, 'taskMemberId');
const model = defineModel({ default: false });
type Emit = {
  'change-finish-at': [taskId: number, value: string];
  'change-submit-after-deadline': [taskId: number, value: boolean];
};
const emit = defineEmits<Emit>();
const canSubmitAfterDeadline = toRef(props.canSubmitAfterDeadline);
const finishAt = toRef(props.finishAt);
const activePage = ref('1');
const initials = computed(() => {
  return getInitials(props.student.name);
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
  return mapedColors[props.status] as 'secondary' | 'blue' | 'orange' | 'green';
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
    return '';
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
} = await useAsyncData(
  'task-submissions',
  () => getSubmissions(props.taskMemberId),
  {
    default: () => ({
      meta: { total: 0 },
      data: [] as TaskSubmissionSimple[],
    }),
    lazy: true,
  },
);

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
  submissions.value.data.flatMap((submission) => {
    return submission.evaluated_at
      ? [
          {
            id: submission.id,
            justification: {
              text: submission.justification,
            },
            mark: submission.grade,
            time: new Date(submission.evaluated_at || submission.createdAt),
            status: submission.evaluated_at ? 'reviewed' : 'in_review',
          } as AttachedSubmission,
        ]
      : [];
  }),
);

const mostRecentSubmission = computed(
  () =>
    submissions.value.data.filter((submission) => submission.submitted_at)[0],
);
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
    let learningMember = learningplanStore.activeMembers.find(
      (member) => member.user.id === user?.value?.id,
    );
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
    setMessage(
      t('components.learningPlan.drawer.task.errors.sendMessage'),
      'error',
      true,
    );
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
    emit(
      'change-finish-at',
      props.taskMemberId,
      (value as Date).toISOString().split('T')[0],
    );
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

watch(finishAt, changeDeadline);
watch(canSubmitAfterDeadline, changeSendAfterDeadline);
watch(model, (value) => {
  if (value) {
    finishAt.value = props.finishAt;
    canSubmitAfterDeadline.value = props.canSubmitAfterDeadline;
    setSubmissionDescription();
    executeSubmissions();
    executeEvents();
    executeMessages();
    return;
  }
  submissions.value = { data: [], meta: { total: 0 } };
  events.value = { data: [], meta: { total: 0 } };
  activePage.value = '1';
  messages.value.data = [];
});
watch(activePage, (value) => {
  if (value === '3') {
    executeMessages();
  }
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
