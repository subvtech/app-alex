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
            v-if="!loadingSubmission"
            type="student"
            :status="getSubmissionStatus(submissions.data[0], status)"
            :mark="mostRecentSubmission?.grade"
            :max-mark="mostRecentSubmission?.grade"
            :task-title="title"
            :task-deadline="finalDate"
            :restrictions="restrictionsValue"
            :task-member-id="taskMemberId"
            :content="submissions.data[0]"
            :task-status="status"
            @update-task-status="handleChangeStatus"
            @update-submission="$emit('update-submission')"
          />
          <div v-if="loadingSubmission">
            <alex-custom-skeleton
              color="gray-blue"
              class="tw-w-full tw-h-[61px]"
            />
          </div>
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
      v-if="blocks && blocks.length > 0 && trail"
      v-model="resourcesOpen"
      class="mt-6"
      :edit="false"
      :task-id="taskId"
      :trail-id="trail?.id"
      :blocks="blocks"
      :task-member-id="taskMemberId"
    />

    <alex-learningplan-task-tabs
      v-model="activeTab"
      v-model:attached-message="attachedMessage"
      v-model:attached-submission="attachedSubmission"
      class="mt-6"
      :task-member="{
        id: taskMemberId,
        status,
      }"
      :task="{
        id: taskId,
        title,
        finalDate,
        restrictions: submission?.constraints || [],
      }"
      :show-member-tab="!!group"
      :is-sending-message="isSendingMessage"
      :message="{ isLoading: pendingMessages }"
      :event="{ events: events.data, isLoading: eventLoading }"
      :submission="!!submission"
      :selector-parent="`#${drawerId} .v-navigation-drawer__content`"
      :submissions="evaluatedSubmissions"
    >
      <template v-if="learningplanStore.learningPlan" #members>
        <alex-learningplan-task-members-card
          v-for="member in group?.participants"
          :key="`group-member${member.name}`"
          :member="{
            name: member.name,
            class: group?.name,
            avatarUrl: member.image?.url,
            responsable: member.role === 'in_charge',
          }"
          :edit="false"
        />
      </template>
    </alex-learningplan-task-tabs>
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
import { learningPlanGroupMemberRoles } from '#imports';

const model = defineModel<boolean>({ required: true });

interface Submission {
  description: string;
  constraints: string[];
}

interface DetailsDrawerProps {
  taskId: number;
  taskMemberId: number;
  submission?: Submission;
  tags?: TagSimple[];
  group?: {
    name: string;
    participants: {
      image?:
        | {
            url: string;
          }
        | undefined;
      name: string;
      learning_class?: string;
      role?: learningPlanGroupMemberRoles;
    }[];
  };
  title?: string;
  description?: string;
  status?: TaskMemberStatus;
  type?: string;
  startDate?: string;
  finalDate?: string;
  blocks?: BlockSimple[];
  trail?: TrailSimple;
  restrictions?: string;
  taskEvents?: TaskEvent[];
}

const props = withDefaults(defineProps<DetailsDrawerProps>(), {
  tags: () => [],
  title: '',
  description: '',
  status: 'to_do',
  type: undefined,
  startDate: undefined,
  finalDate: undefined,
  blocks: undefined,
  trail: undefined,
  group: undefined,
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
const isGroup = toRef(props, 'group');
const submissionDescription = ref<string>(props?.submission?.description || '');
const attachedMessage = ref<Message>();
const attachedSubmission = ref<AttachedSubmission>();
const isFirstTimeOpened = ref(true);
const loadingSubmission = ref(true);
const activeTab = ref(isGroup.value ? '0' : '1');
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
  (e: 'update-submission');
};

const emit = defineEmits<Emits>();

// Get submissions
const strapiUtils = useStrapiUtils();

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

const { data: submissions, execute: executeSubmissions } =
  await useTaskSubmission(taskMemberId, {
    lazy: true,
    watch: [taskMemberId],
    dedupe: 'cancel',
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
const mostRecentSubmission = computed(
  () =>
    submissions.value.data.filter((submission) => submission.evaluated_at)[0],
);
const getSubmissionStatus = (
  submission?: TaskSubmissionSimple,
  status?: TaskMemberStatus,
) => {
  if (!submission) {
    return 'not_started';
  }
  if (submission?.evaluated_at) {
    return 'reviewed';
  }
  if (status === 'in_review') {
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

onMounted(() => {
  executeSubmissions().then(() => (loadingSubmission.value = false));
  executeEvents();
  executeMessages();
});

watch(model, (value) => {
  activeTab.value = isGroup.value ? '0' : '1';
  if (value) {
    executeSubmissions().then(() => (loadingSubmission.value = false));
    executeEvents();
    executeMessages();
    return;
  }
  submissions.value = { data: [], meta: { total: 0 } };
  events.value = { data: [], meta: { total: 0 } };
  messages.value.data = [];
});

watch(
  model,
  (value) => {
    if (value) {
      description.value = props.description;
      submissionDescription.value = props?.submission?.description || '';
      tags.value = props.tags;
      status.value = props.status;
      startDate.value = props.startDate;
      finalDate.value = props.finalDate;
      restrictions.value = props.restrictions;
      isFirstTimeOpened.value = false;
      return;
    }
    isFirstTimeOpened.value = true;
    loadingSubmission.value = true;
  },
  { immediate: true },
);

watch(activeTab, (value) => {
  if (value === '3') {
    executeMessages();
  }
});

const handleChangeStatus = (statusValue: TaskMemberStatus) => {
  emit(
    'update-status',
    0,
    {
      id: props.taskMemberId,
      title: props.title,
      status: statusValue,
      date: new Date(),
    },
    statusValue,
  );
  status.value = statusValue;
};

watch(status, (newStatus, oldStatus) => {
  if (!isFirstTimeOpened.value) {
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
  }
});
</script>

<style>
.task-details-drawer .v-navigation-drawer__content {
  display: block !important;
}
</style>
