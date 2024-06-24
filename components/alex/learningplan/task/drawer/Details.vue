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
    class="task-details-drawer pa-6 pt-2 rounded-s-lg"
  >
    <template #prepend>
      <div class="d-flex align-center justify-end">
        <alex-custom-button
          icon="mdi-close"
          size="small"
          variant="text"
          @click="model = false"
        />
      </div>
    </template>

    <alex-learningplan-task-tags v-model="tags" :task-id="taskId" />

    <p class="mt-4 text-h2 ellipsis lines-2" :class="title || 'text-gray-400'">
      {{ title || $t('components.learningPlan.drawer.missing.title') }}
    </p>

    <v-row class="mt-4 flex-0-0">
      <v-col cols="6" class="pb-1">
        <alex-learningplan-task-state v-model="status" mode="student" />
      </v-col>
      <v-col cols="6" class="pb-1"
        ><p class="text-body-4 text-gray-800 mb-1">
          {{ $t('components.learningPlan.drawer.task.type.label') }}
        </p>

        <alex-learningplan-task-options
          v-model="type"
          :config="{
            group: $t('components.learningPlan.drawer.task.type.collective'),
            individual: $t(
              'components.learningPlan.drawer.task.type.individual',
            ),
          }"
          :placeholder="$t('components.learningPlan.drawer.missing.type')"
        />
      </v-col>
      <v-col cols="6"
        ><p class="text-body-4 text-gray-800 mb-1">
          {{ $t('components.learningPlan.drawer.task.date.startLabel') }}
        </p>

        <alex-learningplan-task-date v-model="startDate" />
      </v-col>
      <v-col cols="6"
        ><p class="text-body-4 text-gray-800 mb-1">
          {{ $t('components.learningPlan.drawer.task.date.finalLabel') }}
        </p>

        <alex-learningplan-task-date v-model="finalDate" />
      </v-col>
    </v-row>

    <alex-learningplan-task-description v-model="description" class="mt-4" />

    <div class="my-6">
      <p class="text-h4 text-gray-800">
        {{ $t('components.learningPlan.drawer.task.submission.label') }}
      </p>

      <template v-if="submission">
        <alex-learningplan-task-restrictions
          v-model="restrictionsValue"
          class="mt-4"
        />

        <alex-learningplan-task-description
          v-if="submissionDescription"
          v-model="submissionDescription"
          class="mt-4"
          :title="
            $t(
              'components.learningPlan.drawer.task.description.submissionLabel',
            )
          "
        />

        <div class="mt-4">
          <p class="text-body-4 mb-2">
            {{ $t('components.courses.tasks.submission.last_submission') }}
          </p>
          <alex-learningplan-task-submission
            type="student"
            :status="getSubmissionStatus(mostRecentSubmission)"
            :mark="mostRecentSubmission?.grade"
            :max-mark="mostRecentSubmission?.grade"
          />
        </div>
      </template>
      <alex-custom-chip
        v-else
        class="mt-2"
        text="Sem entrega"
        variant="outlined"
        size="small"
      />
    </div>

    <alex-learningplan-task-resources
      v-model="resourcesOpen"
      class="mt-6"
      :edit="false"
    />

    <alex-learningplan-task-tabs
      v-model="activeTab"
      v-model:attached-message="attachedMessage"
      v-model:attached-submission="attachedSubmission"
      class="mt-6"
      :task-member-id="taskMemberId"
      :is-sending-message="isSendingMessage"
      :message="{ isLoading: pendingMessages }"
      :event="{ events: events.data, isLoading: eventLoading }"
      :submission="!!submission"
      :selector-parent="`#${drawerId} .v-navigation-drawer__content`"
      :submissions="evaluatedSubmissions"
    />
    <template v-if="activeTab === '3'" #append>
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
import { WritableComputedRef } from 'nuxt/dist/app/compat/capi';
import { RestrictionValue } from '../Restrictions.vue';
import { TaskStudent } from '../kanban/index.vue';
import { TaskMemberStatus } from '~/models/simple/taskSimple.model';

const model = defineModel<boolean>({ required: true });

interface Submission {
  description: string;
  constraints: string[];
}

interface DetailsDrawerProps {
  taskId: number;
  tags?: TagSimple[];
  title?: string;
  description?: string;
  status?: TaskMemberStatus;
  type?: string;
  startDate?: string;
  finalDate?: string;
  // Entregas
  restrictions?: string;
  // lastSubmission;
  // Tabs
  taskEvents?: TaskEvent[];
  taskMemberId: number;
  submission: Submission;
}

const props = withDefaults(defineProps<DetailsDrawerProps>(), {
  tags: () => [],
  title: '',
  description: '',
  status: 'to_do',
  type: undefined,
  startDate: undefined,
  finalDate: undefined,
  restrictions: '',
  taskEvents: () => [],
  submission: undefined,
});

// Pegar esses dados
const tags = ref<TagSimple[]>(props.tags);
const status = ref<TaskMemberStatus>(props.status);
const type = ref<string | undefined>(props.type);
const startDate = ref<string | undefined>(props.startDate);
const finalDate = ref<string | undefined>(props.finalDate);
const description = ref<string>(props.description);
const restrictions = ref<string>(props.restrictions);
const submissionDescription = ref<string>(props.submission.description);
const attachedMessage = ref<Message>();
const attachedSubmission = ref<AttachedSubmission>();
const isFirstTimeOpened = ref(true);
const activeTab = ref('1');
const resourcesOpen = ref<boolean>(false);
const taskMemberId = toRef(props, 'taskMemberId');
const drawerId = computed(() => `details-drawer-${crypto.randomUUID()}`);
const user = useStrapiUser();
const learningplanStore = useLearningPlanStore();
const { setMessage } = useMessageStore();
const isSendingMessage = ref(false);
const client = useStrapiClient();
const { t } = useI18n();

type Emits = {
  (e: 'update-status', newIndex: number, value: TaskStudent, newStatus: string);
};

const emit = defineEmits<Emits>();

// Get submissions
const strapiUtils = useStrapiUtils();

const getSubmissions = (memberID: number) =>
  strapiUtils.find<TaskSubmissionSimple>('task-submissions', {
    filters: {
      task_member: memberID,
      evaluated_at: {
        $notNull: true,
      },
    },
    sort: 'createdAt:desc',
  });

const getEvents = (memberID: number) =>
  strapiUtils.find<TaskEvent>('task-events', {
    filters: {
      task_member: memberID,
    },
  });

const {
  data: submissions,
  execute: executeSubmissions,
  // pending,
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
            maxMark: submission.grade,
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
  if (!submission) {
    return 'not_started';
  }
  if (submission?.evaluated_at) {
    return 'reviewed';
  }
  if (submission?.submitted_at) {
    return 'in_review';
  }
  return 'started';
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

const restrictionsValue = computed({
  get() {
    return restrictions.value ? restrictions.value.split(',') : [];
  },
  set(newValue) {
    restrictions.value = newValue.join(',');
  },
}) as WritableComputedRef<RestrictionValue[]>;

watch(model, (value) => {
  if (value) {
    executeSubmissions();
    executeEvents();
    executeMessages();
    return;
  }
  submissions.value = { data: [], meta: { total: 0 } };
  events.value = { data: [], meta: { total: 0 } };
  activeTab.value = '1';
  messages.value.data = [];
});
watch(activeTab, (value) => {
  if (value === '3') {
    executeMessages();
  }
});
watch(model, (value) => {
  if (value) {
    description.value = props.description;
    submissionDescription.value = props.submission.description;
    tags.value = props.tags;
    status.value = props.status;
    startDate.value = props.startDate;
    finalDate.value = props.finalDate;
    restrictions.value = props.restrictions;
    isFirstTimeOpened.value = true;
    setTimeout(() => {
      isFirstTimeOpened.value = false;
    }, 1100);
  }
});

watch(status, (newStatus, oldStatus) => {
  emit(
    'update-status',
    0,
    {
      id: props.taskMemberId,
      status: oldStatus,
      title: props.title,
      date: new Date(),
    },
    newStatus,
  );
});
</script>

<style>
.task-details-drawer .v-navigation-drawer__content {
  display: block !important;
}
</style>
