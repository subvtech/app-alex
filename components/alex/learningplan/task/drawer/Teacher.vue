<template>
  <v-navigation-drawer
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
      <div class="d-flex align-center justify-end">
        <alex-custom-button
          v-if="kanbanButton"
          icon="alex:Kanban"
          size="small"
          variant="text"
          @click="$emit('kanban-click')"
        />
        <alex-custom-button
          icon="mdi-close"
          size="small"
          variant="text"
          @click="handleCloseModal"
        />
      </div>
    </template>

    <div>
      <!-- Tags -->
      <alex-learningplan-task-tags
        v-model="tags"
        :edit="editable"
        :task-id="taskId"
      />

      <!-- Informações -->
      <alex-inputs-editable-text
        v-model="title"
        tag="h1"
        class="mt-4 text-h2 ellipsis lines-2"
        :cant-edit="editable"
        :placeholder="
          '(' + $t('components.learningPlan.drawer.missing.title') + ')'
        "
      ></alex-inputs-editable-text>

      <v-row class="my-5">
        <v-col cols="6">
          <alex-learningplan-task-state v-model="status" :edit="editable" />
        </v-col>
        <v-col cols="6"
          ><p class="text-body-4 text-gray-800 mb-1">
            <span v-if="editable" class="text-tag-orange-light">* </span
            >{{ $t('components.learningPlan.drawer.task.type.label') }}
          </p>
          <alex-learningplan-task-options
            v-model="type"
            :items="types"
            :edit="editable"
            :config="{
              group: $t('components.learningPlan.drawer.task.type.collective'),
              individual: $t(
                'components.learningPlan.drawer.task.type.individual',
              ),
            }"
            :placeholder="
              $t(
                `components.learningPlan.drawer.${
                  editable ? 'task.type.select' : 'missing.type'
                }`,
              )
            "
          />
        </v-col>
        <v-col cols="6"
          ><p class="text-body-4 text-gray-800 mb-1">
            <span v-if="editable" class="text-tag-orange-light">* </span
            >{{ $t('components.learningPlan.drawer.task.date.startLabel') }}
          </p>

          <alex-learningplan-task-date
            ref="startDateComp"
            v-model="startDate"
            :edit="editable"
          />
        </v-col>
        <v-col cols="6"
          ><p class="text-body-4 text-gray-800 mb-1">
            <span v-if="editable" class="text-tag-orange-light">* </span
            >{{ $t('components.learningPlan.drawer.task.date.finalLabel') }}
          </p>

          <alex-learningplan-task-date
            ref="endDateComp"
            v-model="endDate"
            :edit="editable"
            :can-set-value="checkEndDate(startDate, endDate)"
          />
        </v-col>
      </v-row>
      <alex-learningplan-task-description
        :doc-name="`task-${props.taskId}`"
        :mention-users="mentionUsers"
        :edit="editable"
      />

      <!-- Objetivos de aprendizagem -->
      <alex-learningplan-task-goals v-model="goals" :edit="editable" />

      <!-- Entregas-->
      <p class="text-h3 mt-6">
        {{ $t('components.learningPlan.drawer.task.submission.label') }}
      </p>
      <v-row class="mx-0 mt-3 mb-4">
        <v-col class="pa-0 d-flex align-center" cols="6">
          <alex-custom-switch
            v-model="hasSubmission"
            :label="
              $t('components.learningPlan.drawer.task.submission.reqSubmission')
            "
            :disabled="hasAtLeastSubmission"
          />
        </v-col>
        <v-col v-if="hasSubmission" class="pa-0 d-flex align-center" cols="6">
          <alex-custom-switch
            v-model="sendAfterDeadline"
            :label="
              $t('components.learningPlan.drawer.task.submission.aftrDeadline')
            "
          />
        </v-col>
        <v-col v-if="hasSubmission" class="mt-4 pa-0" cols="12">
          <alex-learningplan-task-restrictions
            v-model="restrictionsValue"
            :edit="editable"
          />
        </v-col>
      </v-row>

      <alex-learningplan-task-description
        v-if="hasSubmission"
        v-model="submissionDescription"
        name="submissionDescription"
        :edit="editable"
        :doc-name="`task-submission-${props.taskId}`"
        :mention-users="mentionUsers"
        :title="
          $t('components.learningPlan.drawer.task.submission.description.label')
        "
      />

      <!-- Recursos de aprendizagem -->
      <div class="my-6">
        <alex-learningplan-task-resources
          v-model="openResources"
          :edit="editable"
          :task-id="taskId"
          :trail-id="trail?.id"
          :blocks="blocks"
        />
      </div>

      <!-- Eventos e atribuições -->
      <alex-custom-tabs
        v-model="activePage"
        :tabs="tabs"
        class="border-bottom-1 border-gray-100"
      />
      <v-window v-model="activePage">
        <v-window-item value="1">
          <alex-learningplan-task-events v-model="taskEvents"
        /></v-window-item>
        <v-window-item value="2">
          <alex-learningplan-task-members
            :learningplan-id="learningplanId"
            :task-id="taskId"
            :type="type"
            :start-at="startDate"
            :finish-at="endDate"
            :submit-after-deadline="sendAfterDeadline"
            :block-delete="hasAtLeastSubmission"
            @change-members="$emit('change-members')"
            @set-type="(value: TaskType) => (type = value)"
        /></v-window-item>
      </v-window>
    </div>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import { isAfter, isBefore } from 'date-fns';
import { WritableComputedRef } from 'nuxt/dist/app/compat/capi';
import { RestrictionValue } from '../Restrictions.vue';
import {
  TaskSimple,
  TaskStatus,
  TaskType,
} from '~/models/simple/taskSimple.model';
import { AlexDropdownItem } from '~/components/alex/custom/Dropdown.vue';
import { orderEvents } from '~/utils';
import { MentionUserPropsArray } from '~/components/TipTap/index.vue';
const { t } = useI18n();
const isFirstTimeOpened = ref(true);

interface TaskTeacherDrawerProps {
  learningplanId: number;
  taskId?: number;
  trail?: TrailSimple;
  title?: string;
  status?: TaskStatus;
  blocks?: BlockSimple[];
  tags?: TagSimple[];
  type?: TaskType | null;
  goals?: LearningPlanGoalSimple[];
  events?: TaskEvent[];
  description?: string;
  submissionDescription?: string;
  restrictions?: string;
  editable?: boolean;
  hasSubmission?: boolean;
  sendAfterDeadline?: boolean;
  kanbanButton?: boolean;
  startDate?: string | null;
  endDate?: string | null;
  members?: TaskMember[];
}

const props = withDefaults(defineProps<TaskTeacherDrawerProps>(), {
  taskId: -1,
  title: '',
  status: 'draft',
  blocks: undefined,
  trail: undefined,
  editable: true,
  hasSubmission: false,
  sendAfterDeadline: false,
  kanbanButton: false,
  description: undefined,
  startDate: undefined,
  endDate: undefined,
  restrictions: '',
  goals: () => [],
  tags: () => [],
  events: () => [],
  type: null,
  submissionDescription: '',
  members: () => [],
});

const description = ref<string | any | undefined>(props.description);
const submissionDescription = ref(props.submissionDescription);
const hasSubmission = ref(props.hasSubmission);
const sendAfterDeadline = ref(props.sendAfterDeadline);
const goals = ref(props.goals);
const tags = ref(props.tags);
const title = ref(props.title);
const taskId = toRef(props, 'taskId');
const model = defineModel({ default: false });
const members = toRef(props, 'members');
const openResources = ref<boolean>(false);
const hasAtLeastSubmission = computed(
  () => !!members.value.filter((member) => member.last_submission_at).length,
);
const startDateComp = ref<{
  close: () => void;
} | null>(null);
const endDateComp = ref<{
  close: () => void;
} | null>(null);
const checkEndDate = (startDate?: string | null, endDate?: string | null) => {
  if (!startDate || !endDate) return true;
  if (isBefore(Date.parse(endDate), Date.parse(startDate))) {
    return false;
  }
  return true;
};
// TODO: Think about a better way to handle this
const setDescription = () => {
  if (!props.description) {
    return '';
  }

  if (typeof props.description === 'string') {
    try {
      const descriptionObj = JSON.parse(props.description);
      description.value = descriptionObj;
    } catch (e) {
      description.value = props.description;
    }
  } else {
    description.value = props.description;
  }
};

const setSubmissionDescription = () => {
  if (!props.submissionDescription) {
    return '';
  }

  if (typeof props.submissionDescription === 'string') {
    try {
      const descriptionObj = JSON.parse(props.submissionDescription);
      submissionDescription.value = descriptionObj;
    } catch (e) {
      submissionDescription.value = props.submissionDescription;
    }
  } else {
    submissionDescription.value = props.submissionDescription;
  }
};

watch(model, (value) => {
  if (value) {
    setDescription();
    setSubmissionDescription();
    hasSubmission.value = props.hasSubmission;
    sendAfterDeadline.value = props.sendAfterDeadline;
    goals.value = props.goals;
    title.value = props.title;
    tags.value = props.tags;
    status.value = props.status;
    type.value = props.type || null;
    startDate.value = props.startDate;
    endDate.value = props.endDate;
    restrictions.value = props.restrictions;
    isFirstTimeOpened.value = true;
    setTimeout(() => {
      isFirstTimeOpened.value = false;
    }, 1100);
  }
});

type Emits = {
  'kanban-click': [];
  'attached-trail-click': [];
  'change-values': [values: Partial<TaskSimple>];
  'change-description': [value: string];
  'change-submission-description': [value: string];
  'change-title': [value: string];
  'change-tags': [value: TagSimple[]];
  'change-goals': [value: LearningPlanGoalSimple[]];
  'change-members': [];
};
const emit = defineEmits<Emits>();

const { setMessage } = useMessageStore();
// Status
const status = ref<TaskStatus | TaskMemberStatus>(props.status);

// Date picker
const startDate = ref(props.startDate);
const endDate = ref(props.endDate);

// Restrições
const restrictions = ref(props.restrictions);
const restrictionsValue = computed({
  get() {
    return restrictions.value ? restrictions.value.split(',') : [];
  },
  set(newValue) {
    restrictions.value = newValue.join(',');
  },
}) as WritableComputedRef<RestrictionValue[]>;

const mentionUsers = computed<MentionUserPropsArray>(() => {
  if (!props.members) {
    return [];
  }

  const users: (UserSimple | undefined)[] = [];

  props.members.forEach((member) => {
    if (member.learning_plan_member?.user) {
      users.push(member.learning_plan_member?.user);
    } else if (member.learning_plan_group?.group_members) {
      member.learning_plan_group?.group_members.forEach((member) =>
        users.push(member.student_member.user),
      );
    }
  });

  return [...new Set(users)]
    .filter((user) => user !== undefined)
    .map(({ fullname, username, avatar }) => ({
      fullname,
      username,
      avatarUrl: avatar?.url || '',
    }));
});

// Tipos
const type = ref<TaskType | null>(props.type);
const types = ref<AlexDropdownItem[]>([
  {
    text: t('components.learningPlan.drawer.task.type.individual'),
    onClick: () => {
      if (members.value.length) {
        setMessage(
          t('components.learningPlan.drawer.task.errors.cantChangeType'),
          'warning',
          true,
        );
        return;
      }
      type.value = 'individual';
    },
  },
  {
    text: t('components.learningPlan.drawer.task.type.collective'),
    onClick: () => {
      if (members.value.length) {
        setMessage(
          t('components.learningPlan.drawer.task.errors.cantChangeType'),
          'warning',
          true,
        );
        return;
      }
      type.value = 'group';
    },
  },
]);

// Tabs
const activePage = ref('1');
const tabs = [
  { label: t('components.learningPlan.drawer.tabs.events.label'), value: '1' },
  { label: t('components.learningPlan.drawer.tabs.members.label'), value: '2' },
];

// Events
const taskEvents = computed(() => orderEvents(props.events));

const notifyFieldError = (field: string) => {
  setMessage(
    t('components.learningPlan.drawer.task.errors.save', {
      field: t(`components.learningPlan.drawer.task.${field}.label`),
    }),
    'error',
    true,
  );
};
const notifyError = () => {
  setMessage(
    t('components.learningPlan.drawer.task.errors.genericSave'),
    'error',
    true,
  );
};
const strapi = useStrapi();
const updateTaskValues = async (
  taskId: number,
  values: Partial<
    Record<
      keyof TaskSimple,
      string | number | boolean | null | undefined | Object
    >
  >,
) => {
  try {
    if (isFirstTimeOpened.value) {
      return;
    }
    const valuesEmit = {
      type: type.value,
      title: title.value,
      status: status.value,
      start_at: startDate.value,
      finish_at: endDate.value,
      can_submit_after_deadline: sendAfterDeadline.value,
      submission_required: hasSubmission.value,
      learning_goals: goals.value,
      allowed_editor_plugins: restrictions.value,
    } as Partial<TaskSimple>;
    await strapi.update('tasks', taskId, values);
    emit('change-values', valuesEmit);
  } catch (error) {
    notifyError();
  }
};
useOnStopTyping(
  description,
  async () => {
    try {
      if (isFirstTimeOpened.value) {
        return;
      }

      const value =
        typeof description.value === 'object'
          ? JSON.stringify(description.value)
          : description.value;

      await strapi.update('tasks', props.taskId, {
        description: value || '',
      });
      emit('change-description', description.value || '');
    } catch (error) {
      notifyFieldError('description');
    }
  },
  1000,
  false,
  false,
);
useOnStopTyping(
  submissionDescription,
  async () => {
    try {
      if (isFirstTimeOpened.value) {
        return;
      }

      const value =
        typeof submissionDescription.value === 'object'
          ? JSON.stringify(submissionDescription.value)
          : submissionDescription.value;

      await strapi.update('tasks', props.taskId, {
        submission_description: value || '',
      });
      emit('change-submission-description', submissionDescription.value || '');
    } catch (error) {
      notifyFieldError('submissionDescription');
    }
  },
  1000,
  false,
  false,
);
useOnStopTyping(
  title,
  async (value) => {
    try {
      if (isFirstTimeOpened.value) {
        return;
      }
      await strapi.update('tasks', props.taskId, {
        title: value || '',
      });
      emit('change-title', value || '');
    } catch (error) {
      notifyFieldError('submissionDescription');
    }
  },
  1000,
  false,
  false,
);
watch(endDate, async (value) => {
  if (!value) return;
  if (
    startDate.value &&
    isBefore(Date.parse(value), Date.parse(startDate.value))
  ) {
    setMessage(
      t('components.learningPlan.drawer.task.errors.endDateBeforeStartDate'),
      'warning',
      true,
    );
    return;
  }

  endDateComp.value?.close();
  await updateTaskValues(taskId.value, {
    finish_at: value,
  });
});
watch(startDate, async (value) => {
  if (!value) return;
  if (endDate.value && isAfter(Date.parse(value), Date.parse(endDate.value))) {
    setMessage(
      t('components.learningPlan.drawer.task.errors.startDateAfterEndDate'),
      'warning',
      true,
    );
    return;
  }

  startDateComp.value?.close();
  await updateTaskValues(taskId.value, {
    start_at: value,
  });
});
watch(restrictions, async (value) => {
  // if (!value) return;
  await updateTaskValues(taskId.value, {
    allowed_editor_plugins: value,
  });
});
watch(type, async (value) => {
  if (!value) return;
  await updateTaskValues(taskId.value, {
    type: value,
  });
});
watch(status, async (value) => {
  if (!value) return;
  await updateTaskValues(taskId.value, {
    status: value,
  });
});
watch(goals, async (value) => {
  if (!value) return;
  const goalsId = goals.value.map((goal) => goal.id);
  // if (!goalsId.length) return;
  await updateTaskValues(taskId.value, {
    learning_goals: {
      set: goalsId,
    },
  });
  emit('change-goals', value);
});
watch(sendAfterDeadline, async (value) => {
  await updateTaskValues(taskId.value, {
    can_submit_after_deadline: value,
  });
});
watch(hasSubmission, async (value) => {
  await updateTaskValues(taskId.value, {
    submission_required: value,
  });
});
watch(tags, (value) => emit('change-tags', value));
// Close drawer
function handleCloseModal() {
  model.value = false;
}
</script>
