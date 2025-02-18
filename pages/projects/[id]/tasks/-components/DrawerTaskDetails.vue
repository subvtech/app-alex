<template>
  <v-navigation-drawer
    v-model="open"
    class="task-details-drawer pa-6 pt-2 rounded-s-lg tw-flex tw-flex-col"
    location="right"
    temporary
    floating
    :width="640"
    scrim="transparent"
    sticky
  >
    <template #prepend>
      <div class="d-flex align-center justify-end">
        <alex-custom-button icon="mdi-close" size="small" variant="text" @click="open = false" />
      </div>
    </template>

    <div class="tw-flex-1">
      <!-- Tags -->
      <alex-learningplan-task-tags v-model="tags" class="mt-2 mb-4" :task-id="task?.id" :edit="canEdit" />

      <!-- Informações -->
      <alex-inputs-editable-text
        v-model="title"
        tag="h1"
        class="mt-4 text-h2 ellipsis lines-2"
        :placeholder="'(' + $t('components.learningPlan.drawer.missing.title') + ')'"
        cant-edit
        :disabled="!canEdit"
        @keydown.enter.prevent="(e) => e.target.blur()"
      ></alex-inputs-editable-text>

      <v-row class="my-4">
        <v-col cols="6">
          <p class="text-body-4 text-gray-800 mb-1">Status</p>
          <Options
            v-model="status"
            :placeholder="selectedSprint ? 'Selecionar status' : 'Não iniciado'"
            :items="statusOptions"
            item-title="title"
            :edit="selectedSprint && canEdit"
          />
        </v-col>
        <v-col v-if="task?.organization === 'standard' && !individualLearning" cols="6">
          <p class="text-body-4 text-gray-800 mb-1">Sprint</p>
          <Options
            v-model="selectedSprint"
            placeholder="Escolha uma sprint"
            :items="sprintOptions"
            item-title="title"
            empty-value="Backlog"
            :edit="canEdit"
          />
        </v-col>

        <v-col cols="6"
          ><p class="text-body-4 text-gray-800 mb-1">
            <span class="text-tag-orange-light">* </span>{{ $t('components.learningPlan.drawer.task.date.startLabel') }}
          </p>

          <alex-learningplan-task-date ref="startDateComp" v-model="startDate" :edit="canEdit" />
        </v-col>
        <v-col cols="6"
          ><p class="text-body-4 text-gray-800 mb-1">
            <span class="text-tag-orange-light">* </span>{{ $t('components.learningPlan.drawer.task.date.finalLabel') }}
          </p>

          <alex-learningplan-task-date
            ref="endDateComp"
            v-model="endDate"
            :can-set-value="checkEndDate(startDate, endDate)"
            :edit="canEdit"
          />
        </v-col>

        <v-col v-if="!individualLearning" cols="12">
          <p class="text-body-4 text-gray-800 mb-1">Épico ou história</p>
          <Options
            v-model="selectedParent"
            placeholder="Escolha um épico ou história"
            :items="groupOptions ?? []"
            item-title="title"
            :edit="canEdit"
          />
        </v-col>
      </v-row>

      <alex-learningplan-task-description
        v-model="description"
        class="my-4"
        :mention-users="mentionUsers"
        :edit="canEdit"
      />

      <!-- Entregas-->
      <p v-if="canEdit || submissionRequired" class="text-h3 mt-6">
        {{ $t('components.learningPlan.drawer.task.submission.label') }}
      </p>
      <v-row class="mx-0 mt-3 mb-4">
        <v-col v-if="canEdit" class="pa-0 d-flex align-center" cols="6">
          <alex-custom-switch
            v-model="submissionRequired"
            :label="$t('components.learningPlan.drawer.task.submission.reqSubmission')"
            :disabled="hasAtLeastSubmission"
          />
        </v-col>
        <template v-if="submissionRequired"
          ><v-col v-if="canEdit" class="pa-0 d-flex align-center" cols="6">
            <alex-custom-switch
              v-model="canSubmitAfterDeadline"
              :label="$t('components.learningPlan.drawer.task.submission.aftrDeadline')"
            />
          </v-col>
          <v-col class="mt-4 pa-0" cols="12">
            <alex-learningplan-task-restrictions v-model="restrictionsValue" :edit="canEdit" /> </v-col
        ></template>
      </v-row>

      <alex-learningplan-task-description
        v-if="submissionRequired"
        v-model="submissionDescription"
        class="mb-6"
        name="submissionDescription"
        :edit="canEdit"
        :mention-users="mentionUsers"
        :title="$t('components.learningPlan.drawer.task.submission.description.label')"
      />

      <!-- Recursos de aprendizagem -->
      <div class="my-6">
        <alex-learningplan-task-resources
          v-model="openResources"
          :task-id="props.task?.id ?? 0"
          :trail-id="props.task?.trail?.id"
          :blocks="blocks"
          teacher
          project
          :edit="canEdit"
        />

        <!-- Ver blocks -->
      </div>

      <alex-custom-tabs v-model="activePage" :tabs="tabs" class="border-bottom-1 border-gray-100" />
      <v-window v-model="activePage">
        <v-window-item value="1">
          <alex-learningplan-task-events v-model="taskEvents" />
        </v-window-item>
        <v-window-item value="2">
          <Members
            :learningplan-id="learningplanId"
            :task-id="task?.id"
            :start-at="startDate"
            :finish-at="endDate"
            :edit="canEdit"
            @change-members="$emit('update-value')"
          />
        </v-window-item>
      </v-window>
    </div>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import Options from '@/pages/projects/[id]/tasks/-components/Options.vue';
import { isBefore } from 'date-fns';
import { WritableComputedRef } from 'vue';
import { AlexDropdownItem } from '~/components/alex/custom/Dropdown.vue';
import { RestrictionValue } from '~/components/alex/learningplan/task/Restrictions.vue';
import { useGetKanban } from '../-composables/useKanban';
import { useGetSprintGroupings } from '../-composables/useSprints';
import { SprintTask } from '../-types';
import Members from './members/Index.vue';

interface DrawerProjectProps {
  task?: SprintTask;
  sprints?: SprintSimple[];
  canEdit?: boolean;
  individualLearning?: boolean;
  contractAddress?: string | null;
}

const props = withDefaults(defineProps<DrawerProjectProps>(), {
  task: undefined,
  sprints: () => [],
  canEdit: true,
  individualLearning: false,
  contractAddress: null,
});

const open = defineModel<boolean>({ required: true });
const emit = defineEmits(['kanban-click', 'change-description', 'update-value', 'moved', 'update:contract']);
const { t } = useI18n();
const { setMessage } = useMessageStore();
const { update } = useStrapi();
const { find } = useStrapiUtils();

const { updateTaskContractAddress } = useTaskStore();

const isFirstTimeOpened = ref(true);
const title = ref<string>('');
const tags = ref<TagSimple[]>([]);
const status = ref<KanbanColumn | null>(null);
const startDate = ref<string | null>(null);
const endDate = ref<string | null>(null);

const submissionRequired = ref<boolean | null>(null);
const canSubmitAfterDeadline = ref<boolean | null>(null);
const submissionDescription = ref<string | null>(null);
const restrictions = ref<string | null>(null);
const openResources = ref<boolean>(false);

const activePage = ref<number>(1);
const taskEvents = ref<TaskEvent[]>([]);

const tabs = [
  { label: t('components.learningPlan.drawer.tabs.events.label'), value: '1' },
  { label: t('components.learningPlan.drawer.tabs.members.label'), value: '2' },
];

const selectedEpic = ref<TaskSimple | null>(null);
const selectedSprint = ref<SprintSimple>();
const selectedHistory = ref<TaskSimple | null>(null);
const selectedParent = ref<TaskSimple | null | undefined>(undefined);
const description = ref<string>('');
const mentionUsers = computed(() => {
  if (!props.task?.task_members?.[0]) return [];
  return (
    props.task.task_members[0].learning_plan_group?.group_members.map((member) => member.student_member.user) || []
  );
});
const hasAtLeastSubmission = computed(
  () => !!props.task?.task_members?.filter((member) => member.last_submission_at).length,
);
const restrictionsValue = computed({
  get() {
    return restrictions.value ? restrictions.value.split(',') : [];
  },
  set(newValue) {
    restrictions.value = newValue.join(',');
  },
}) as WritableComputedRef<RestrictionValue[]>;
const trailId = ref<number | null>(null);
const blocks = ref<BlockSimple[]>([]);
const route = useRoute();
const strapiClient = useStrapiClient();
const learningplanId = computed(() => parseInt(route.params.id.toString()));
// querys
const enabledKanban = computed(() => !!selectedSprint.value);
const { data: groupings } = useGetSprintGroupings(learningplanId);
const { data: kanban } = useGetKanban(learningplanId, selectedSprint, enabledKanban);
const allGroups = ref<any>([]);
const { contractAddress, task } = toRefs(props);
const { deployContract } = useContracts(contractAddress);

const { data: students } = useAsyncData(
  'students',
  async () =>
    await find('learning-plan-members', {
      filters: {
        id: task.value?.id || 0,
      },
    }),
  { transform: (value) => value.data, watch: [task] },
);

const getParentOptions = () => {
  // const hasSprint = !!selectedSprint.value;

  const filters = {
    learningplan: learningplanId.value,
    parent_task: {
      $null: true,
    },
    organization: {
      $in: ['epic', 'story'],
    },
  };

  const populate = {
    tasks: {
      filters: {
        organization: 'story',
      },
    },
  };

  find('tasks', {
    filters,
    populate,
  }).then(({ data }) => {
    allGroups.value = data;
  });
};

const groupOptions = computed(() => {
  const options: AlexDropdownItem[] = [];

  allGroups.value.forEach((task) => {
    // First layer (Epics or Stories)
    if (selectedParent.value?.id !== task.id) {
      options.push({
        text: task.title,
        onClick: () => (selectedParent.value = task),
      });
    }

    // Second layer (Stories)
    task.tasks?.forEach((subTask) => {
      if (selectedParent.value?.id !== subTask.id) {
        options.push({
          text: subTask.title,
          onClick: () => (selectedParent.value = subTask),
          icon: 'mdi-circle-small',
          notBold: true,
        });
      }
    });
  });

  if (selectedParent.value) {
    options.push({
      text: 'Sem épico ou história',
      onClick: () => (selectedParent.value = null),
      icon: 'mdi-close',
      notBold: true,
    });
  }

  return options;
});

const handleUpdateContract = async (newAddress: string | null) => {
  if (!task.value) return;
  await updateTaskContractAddress(task.value.id, newAddress);
  emit('update:contract', newAddress);

  console.log('contract updated');
};

watch(selectedParent, (parent) => {
  if (parent === undefined || !props.task?.id || isFirstTimeOpened.value) {
    return;
  }

  update('tasks', props.task.id, {
    parent_task: parent?.id ?? null,
  })
    .then(() => {
      emit(
        'moved',
        parent !== null
          ? t('pages.projects.tasks.actions.moved', { item: parent.title })
          : t('pages.projects.tasks.actions.parent_removed'),
      );
    })
    .catch(console.log);
});

const statusOptions = computed(
  () =>
    kanban.value?.kanban_columns?.map((column) => ({
      id: column.id,
      text: column.title,
      onClick: () => {
        status.value = column;
        handleChangeColumn(selectedSprint.value, column);
      },
    })) ?? [],
);

watch(submissionRequired, async (required) => {
  if (required === null || !props.task?.id || isFirstTimeOpened.value) {
    return;
  }
  await update('tasks', props.task.id, {
    submission_required: required,
  });
  emit('update-value', 'submission-required', required);
});

watch(canSubmitAfterDeadline, async (canSubmit) => {
  if (canSubmit === null || !props.task?.id || isFirstTimeOpened.value) {
    return;
  }
  await update('tasks', props.task.id, {
    can_submit_after_deadline: canSubmit,
  });
  emit('update-value', 'can_submit_after_deadline', canSubmit);
});

watch(restrictions, async (restrictions) => {
  if (restrictions === null || !props.task?.id || isFirstTimeOpened.value) {
    return;
  }
  await update('tasks', props.task.id, {
    allowed_editor_plugins: restrictions,
  });
  emit('update-value', 'allowed_editor_plugins', restrictions);
});

const startDateComp = ref<{
  close: () => void;
} | null>(null);
const endDateComp = ref<{
  close: () => void;
} | null>(null);

// Computed
const sprintOptions = computed(() =>
  props.sprints.map((sprint) => ({ text: sprint.title, onClick: () => (selectedSprint.value = sprint) })),
);

// methods
const checkEndDate = (startDate?: string | null, endDate?: string | null) => {
  if (!startDate || !endDate) return true;
  if (isBefore(Date.parse(endDate), Date.parse(startDate))) {
    return false;
  }
  return true;
};
const notifyFieldError = (field: string) => {
  setMessage(
    t('components.learningPlan.drawer.task.errors.save', {
      field: t(`components.learningPlan.drawer.task.${field}.label`),
    }),
    'error',
    true,
  );
};

const handleChangeColumn = (sprint?: SprintSimple, column?: KanbanColumn) => {
  if (!sprint || !props.task || !column) {
    return;
  }
  strapiClient(`/tasks/${props.task.id}/update-kanban-task`, {
    method: 'PUT',
    body: {
      data: {
        sprint: sprint.id,
        kanban_column: column.id,
      },
    },
  });
};
// lifecycles

watch(selectedEpic, (epic) => {
  if (isFirstTimeOpened.value || !props.task?.id) {
    return;
  }
  update('tasks', props.task?.id, {
    parent_task: epic?.id ?? null,
  })
    .then(() => emit('moved', epic?.id ? t('pages.projects.tasks.actions.moved', { item: epic.title }) : ''))
    .catch(() => setMessage('pages.projects.tasks.actions.moved_fail', 'error', true));
});
watch(open, () => {
  // Update data when drawer is opened | closed
  isFirstTimeOpened.value = true;
  // Task data
  tags.value = props.task?.tags ?? [];
  title.value = props.task?.title ?? '';
  description.value = props.task?.description ?? '';

  startDate.value = props.task?.start_at ?? null;
  endDate.value = props.task?.finish_at ?? null;
  status.value = props.task?.kanban_column_task?.kanban_column ?? null;
  trailId.value = props.task?.trail?.id ?? null;
  blocks.value = props.task?.blocks ?? [];

  selectedParent.value = props.task?.parent_task ?? null;

  // Entregas
  canSubmitAfterDeadline.value = props.task?.can_submit_after_deadline ?? null;
  submissionDescription.value = props.task?.submission_description ?? null;
  submissionRequired.value = props.task?.submission_required ?? null;
  restrictions.value = props.task?.allowed_editor_plugins ?? null;

  // Sprint, epic and story data
  selectedSprint.value = props.task?.sprint ?? undefined;
  switch (props.task?.parent_task?.organization) {
    case 'epic':
      selectedEpic.value = props.task?.parent_task ?? null;
      break;
    case 'story':
      selectedHistory.value = props.task?.parent_task ?? null;
      groupings.value.histories.forEach((story) => {
        if (story?.parent_task?.organization === 'epic') {
          selectedEpic.value = story?.parent_task ?? null;
        }
      });
      break;
    default:
      selectedEpic.value = null;
      selectedHistory.value = null;
      break;
  }
  setTimeout(() => {
    isFirstTimeOpened.value = false;
  }, 2000);

  if (open) {
    getParentOptions();
  }
});
watch(tags, (tags) => {
  if (!isFirstTimeOpened.value && open.value) {
    emit('update-value', 'tags', tags);
  }
});

watch(selectedSprint, (sprint, oldSprint) => {
  if (isFirstTimeOpened.value || !props.task?.id || !selectedSprint.value) {
    return;
  }
  status.value = props.task.kanban_column_task?.kanban_column ?? null;
  strapiClient(`/tasks/${props.task.id}/update-kanban-task`, {
    method: 'PUT',
    body: {
      data: {
        sprint: selectedSprint.value.id,
      },
    },
  })
    .then(() => {
      emit('moved', t('pages.projects.tasks.actions.moved', { item: sprint?.title }));
      // getParentOptions();
    })
    .catch(() => setMessage(t('pages.projects.tasks.actions.moved_fail'), 'error', true));
});

watch(task, () => {
  contractAddress.value = task.value?.contract_address || null;
});

watch(startDate, (date) => {
  if (isFirstTimeOpened.value || !date || !props.task?.id) {
    return;
  }
  update('tasks', props.task?.id, {
    start_at: date,
  })
    .then(() => emit('update-value', 'start_at', date))
    .catch(() => notifyFieldError('date'));
});

watch(endDate, (date) => {
  if (isFirstTimeOpened.value || !date || !props.task?.id) {
    return;
  }
  update('tasks', props.task?.id, {
    finish_at: date,
  })
    .then(() => emit('update-value', 'finish_at', date))
    .catch(() => notifyFieldError('date'));
});

watch(selectedHistory, (story) => {
  if (isFirstTimeOpened.value || !props.task?.id) {
    return;
  }

  update('tasks', props.task?.id, {
    parent_task: story?.id,
  })
    .then(() => emit('moved', story?.id ? `Tarefa movida para ${story.title}` : ''))
    .catch(() => setMessage('Falha ao mover tarefa', 'error', true));
});
useOnStopTyping(
  description,
  async () => {
    try {
      if (isFirstTimeOpened.value || !props.task?.id) {
        return;
      }
      await update('tasks', props.task?.id, {
        description: description.value,
      });
      emit('update-value', 'description', description.value);
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
      if (isFirstTimeOpened.value || !props.task) {
        return;
      }

      await update('tasks', props.task.id, {
        submission_description: submissionDescription.value,
      });
      emit('update-value', 'submission-description', submissionDescription.value);
      // emit('change-submission-description', submissionDescription.value);
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
  () => {
    if (isFirstTimeOpened.value || !props.task?.id) {
      return;
    }
    update('tasks', props.task?.id, {
      title: title.value,
    })
      .then(() => emit('update-value', 'title', title.value))
      .catch(() => notifyFieldError('title'));
  },
  1000,
  false,
  false,
);
</script>
