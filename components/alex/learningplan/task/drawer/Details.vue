<template>
  <v-navigation-drawer
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

      <template v-if="mostRecentSubmission?.submitted_at">
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
            type="professor"
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

    <alex-learningplan-task-resources v-model="resourcesOpen" class="mt-6" />

    <alex-learningplan-task-tabs
      v-model="activeTab"
      v-model:attached-message="attachedMessage"
      v-model:attached-submission="attachedSubmission"
      class="mt-6"
      :task-member-id="taskMemberId"
      :events="events.data"
      :submission="!!submission"
      :selector-parent="`#${drawerId} .v-navigation-drawer__content`"
      :submissions="evaluatedSubmissions"
    />
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import { WritableComputedRef } from 'nuxt/dist/app/compat/capi';
import { RestrictionValue } from '../Restrictions.vue';
import { TaskStatus } from '~/models/simple/taskSimple.model';

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
  status?: TaskStatus;
  type?: string;
  startDate?: string;
  finalDate?: string;
  // Entregas
  restrictions?: string;
  submissionDescription?: string;
  // lastSubmission;
  // Tabs
  taskEvents: TaskEvent[];
  taskMemberId: number;
  submission: Submission;
}

const props = withDefaults(defineProps<DetailsDrawerProps>(), {
  tags: () => [],
  title: '',
  description: '',
  status: 'draft',
  type: undefined,
  startDate: undefined,
  finalDate: undefined,
  restrictions: '',
  submissionDescription: '',
  taskEvents: () => [],
  submission: undefined,
});

// Pegar esses dados
const tags = ref<TagSimple[]>(props.tags);
const status = ref<TaskStatus>(props.status);
const type = ref<string | undefined>(props.type);
const startDate = ref<string | undefined>(props.startDate);
const finalDate = ref<string | undefined>(props.finalDate);
const description = ref<string>(props.description);
const restrictions = ref<string>(props.restrictions);
const submissionDescription = ref<string>(props.submissionDescription);
const attachedMessage = ref<Message>();
const attachedSubmission = ref<AttachedSubmission>();

const activeTab = ref<Number>(1);
const resourcesOpen = ref<boolean>(false);

const drawerId = computed(() => `details-drawer-${crypto.randomUUID()}`);

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
  },
);

const { data: events, execute: executeEvents } = await useAsyncData(
  'task-events',
  () => getEvents(props.taskMemberId),
  {
    default: () => ({
      meta: { total: 0 },
      data: [] as TaskEvent[],
    }),
  },
);

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
  if (submission?.evaluated_at) {
    return 'reviewed';
  }
  return 'in_review';
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
    finalDate.value = props.finalDate;
    executeSubmissions();
    executeEvents();
    return;
  }
  submissions.value = { data: [], meta: { total: 0 } };
  events.value = { data: [], meta: { total: 0 } };
});
</script>

<style>
.task-details-drawer .v-navigation-drawer__content {
  display: block !important;
}
</style>
