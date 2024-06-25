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
      <p class="mt-4 text-h2 ellipsis lines-2">
        {{
          title ||
          '(' + $t('components.learningPlan.drawer.missing.title') + ')'
        }}
      </p>

      <v-row class="my-5">
        <v-col cols="6"
          ><p class="text-body-4 text-gray-800 mb-2">
            {{ $t('components.learningPlan.drawer.task.status.label') }}
          </p>
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
            placeholder="Selecione um tipo"
          />
        </v-col>
        <v-col cols="6"
          ><p class="text-body-4 text-gray-800 mb-1">
            <span v-if="editable" class="text-tag-orange-light">* </span
            >{{ $t('components.learningPlan.drawer.task.date.startLabel') }}
          </p>

          <alex-learningplan-task-date v-model="startDate" :edit="editable" />
        </v-col>
        <v-col cols="6"
          ><p class="text-body-4 text-gray-800 mb-1">
            <span v-if="editable" class="text-tag-orange-light">* </span
            >{{ $t('components.learningPlan.drawer.task.date.finalLabel') }}
          </p>

          <alex-learningplan-task-date v-model="endDate" :edit="editable" />
        </v-col>
      </v-row>

      <alex-learningplan-task-description
        v-model="description"
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
            edit
          />
        </v-col>
      </v-row>

      <p v-if="hasSubmission" class="text-body-4 text-gray-800 mb-2">
        {{
          $t('components.learningPlan.drawer.task.submission.description.label')
        }}
      </p>

      <alex-inputs-text-area
        v-if="hasSubmission"
        v-model="submissionDescription"
        name="submissionDescription"
        :placeholder="
          $t(
            'components.learningPlan.drawer.task.submission.description.placeHolder',
          )
        "
        variant="outlined"
        density="comfortable"
        hide-details
      />
      <!-- Recursos de aprendizagem -->
      <div class="my-6">
        <p class="text-h3 mb-4">
          {{
            $t('components.learningPlan.drawer.task.learningResources.label')
          }}
        </p>
        <alex-custom-button
          size="large"
          prepend-icon="alex:trail"
          append-icon="mdi-chevron-right"
          :text="
            $t(
              'components.learningPlan.drawer.task.learningResources.noneSelected',
            )
          "
          variant="secondary"
          @click="$emit('attached-trail-click')"
        />
      </div>

      <alex-learningplan-task-drawer-contracts
        v-model:status="status"
        :contract-address="contractAddress"
        :edit="editable"
        :task-members="taskMembers"
        @deploy:contract-draft="(cb) => (deployContract = cb)"
        @cancel:contract-draft="deployContract = null"
        @update:contract-address="
          async (newAddress) =>
            await addTaskContractAddress(props.taskId, newAddress as string)
        "
      />

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
            :start-at="startDate"
            :finish-at="endDate"
            :submit-after-deadline="sendAfterDeadline"
            @change-members="$emit('change-members')"
        /></v-window-item>
      </v-window>
    </div>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import { WritableComputedRef } from 'nuxt/dist/app/compat/capi';
import { RestrictionValue } from '../Restrictions.vue';
import { TaskStatus, TaskType } from '~/models/simple/taskSimple.model';
import { AlexDropdownItem } from '~/components/alex/custom/Dropdown.vue';
import { orderEvents } from '~/utils';

const strapi = useStrapi();
const { t } = useI18n();
const { addTaskContractAddress } = useTaskStore();
const isFirstTimeOpened = ref(true);

interface TaskTeacherDrawerProps {
  learningplanId: number;
  taskId?: number;
  title?: string;
  status?: TaskStatus;
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
  contractAddress: string | null;
  taskMembers: any[];
}
const props = withDefaults(defineProps<TaskTeacherDrawerProps>(), {
  taskId: -1,
  title: '',
  status: 'draft',
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
  taskMembers: () => [],
  type: undefined,
  submissionDescription: '',
  contractAddress: null,
});

const description = ref(props.description);
const submissionDescription = ref(props.submissionDescription);
const hasSubmission = ref(props.hasSubmission);
const sendAfterDeadline = ref(props.sendAfterDeadline);
const goals = ref(props.goals);
const tags = ref(props.tags);
const model = defineModel({ default: false });

// TODO: Think about a better way to handle this

watch(model, (value) => {
  if (value) {
    description.value = props.description;
    submissionDescription.value = props.submissionDescription;
    hasSubmission.value = props.hasSubmission;
    sendAfterDeadline.value = props.sendAfterDeadline;
    goals.value = props.goals;
    tags.value = props.tags;
    status.value = props.status;
    type.value = props.type || '';
    startDate.value = props.startDate;
    endDate.value = props.endDate;
    restrictions.value = props.restrictions;
    isFirstTimeOpened.value = true;
  }
});

type ChangeValues = {
  type: TaskType | null;
  status: TaskStatus;
  start_at?: string | null;
  finish_at?: string | null;
  can_submit_after_deadline: boolean;
  submission_required: boolean;
};
type Emits = {
  'kanban-click': [];
  'attached-trail-click': [];
  'change-values': [values: ChangeValues];
  'change-description': [value: string];
  'change-submission-description': [value: string];
  'change-tags': [value: TagSimple[]];
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

// Tipos
const type = ref<string>(props.type || '');
const types = ref<AlexDropdownItem[]>([
  {
    text: t('components.learningPlan.drawer.task.type.individual'),
    onClick: () => {
      type.value = 'individual';
    },
  },
  {
    text: t('components.learningPlan.drawer.task.type.collective'),
    onClick: () => {
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

const deployContract = ref<(() => Promise<string | undefined>) | null>(null);

useOnStopTyping(
  description,
  async () => {
    try {
      await strapi.update('tasks', props.taskId, {
        description: description.value,
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
      await strapi.update('tasks', props.taskId, {
        submission_description: submissionDescription.value,
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
watch(
  () => [
    hasSubmission.value,
    sendAfterDeadline.value,
    startDate.value,
    endDate.value,
    type.value,
    status.value,
    goals.value,
    restrictions.value,
  ],
  async () => {
    if (isFirstTimeOpened.value) {
      isFirstTimeOpened.value = false;
      return;
    }
    const values = {
      type: type.value,
      status: status.value,
      start_at: startDate.value,
      finish_at: endDate.value,
      can_submit_after_deadline: sendAfterDeadline.value,
      submission_required: hasSubmission.value,
      learning_goals: goals.value,
      allowed_editor_plugins: restrictions.value,
    };
    const goalsId = goals.value.map((goal) => goal.id);
    try {
      await strapi.update('tasks', props.taskId, {
        ...(type.value && { type: type.value }),
        ...(goalsId.length && {
          learning_goals: {
            set: goalsId,
          },
        }),
        ...(restrictions.value && {
          allowed_editor_plugins: restrictions.value,
        }),
        status: status.value,
        start_at: startDate.value,
        finish_at: endDate.value,
        can_submit_after_deadline: sendAfterDeadline.value,
        submission_required: hasSubmission.value,
        learning_goals: {
          set: goalsId,
        },
      });
      if (deployContract.value) {
        const newContractAddress = await deployContract.value();
        if (!newContractAddress) return;
        await addTaskContractAddress(
          props.taskId,
          newContractAddress as string,
        );
      }
      emit('change-values', values as ChangeValues);
    } catch (error) {
      notifyError();
    }
  },
);
watch(tags, (value) => emit('change-tags', value));
// Close drawer
function handleCloseModal() {
  model.value = false;
}
</script>

<style scoped></style>

<style></style>
