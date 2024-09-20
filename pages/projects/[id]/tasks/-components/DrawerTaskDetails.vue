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
      <alex-learningplan-task-tags v-model="tags" class="mt-2 mb-4" :task-id="task?.id" edit />

      <!-- Informações -->
      <alex-inputs-editable-text
        v-model="title"
        tag="h1"
        class="mt-4 text-h2 ellipsis lines-2"
        :placeholder="'(' + $t('components.learningPlan.drawer.missing.title') + ')'"
        cant-edit
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
            :edit="!!selectedSprint"
          />
        </v-col>
        <v-col v-if="task?.organization === 'standard'" cols="6">
          <p class="text-body-4 text-gray-800 mb-1">Sprint</p>
          <Options
            v-model="selectedSprint"
            placeholder="Escolha uma sprint"
            :items="sprintOptions"
            item-title="title"
            empty-value="Backlog"
            edit
          />
        </v-col>

        <v-col cols="6"
          ><p class="text-body-4 text-gray-800 mb-1">
            <span class="text-tag-orange-light">* </span>{{ $t('components.learningPlan.drawer.task.date.startLabel') }}
          </p>

          <alex-learningplan-task-date ref="startDateComp" v-model="startDate" edit />
        </v-col>
        <v-col cols="6"
          ><p class="text-body-4 text-gray-800 mb-1">
            <span class="text-tag-orange-light">* </span>{{ $t('components.learningPlan.drawer.task.date.finalLabel') }}
          </p>

          <alex-learningplan-task-date
            ref="endDateComp"
            v-model="endDate"
            :can-set-value="checkEndDate(startDate, endDate)"
            edit
          />
        </v-col>

        <v-col cols="12">
          <p class="text-body-4 text-gray-800 mb-1">Épico ou história</p>
          <Options
            v-model="selectedParent"
            placeholder="Escolha um épico ou história"
            :items="groupOptions ?? []"
            item-title="title"
            edit
          />
        </v-col>
      </v-row>

      <alex-learningplan-task-description v-model="description" class="my-4" :mention-users="mentionUsers" edit />
      <alex-custom-tabs v-model="activePage" :tabs="tabs" class="border-bottom-1 border-gray-100" />
      <v-window v-model="activePage">
        <v-window-item value="1">
          <alex-learningplan-task-events v-model="taskEvents" />
        </v-window-item>
        <v-window-item value="2">
          <Members :learningplan-id="learningplanId" :task-id="task?.id" :start-at="startDate" :finish-at="endDate" />
        </v-window-item>
      </v-window>
    </div>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import Options from '@/pages/projects/[id]/tasks/-components/Options.vue';
import { isBefore } from 'date-fns';
import { AlexDropdownItem } from '~/components/alex/custom/Dropdown.vue';
import { useGetKanban } from '../-composables/useKanban';
import { useGetSprintGroupings } from '../-composables/useSprints';
import { SprintTask } from '../-types';
import Members from './members/Index.vue';

interface DrawerProjectProps {
  task?: SprintTask;
  sprints?: SprintSimple[];
}

const props = withDefaults(defineProps<DrawerProjectProps>(), { task: undefined, sprints: () => [] });
const open = defineModel<boolean>({ required: true });
const emit = defineEmits(['kanban-click', 'change-description', 'update-value', 'moved']);
const { t } = useI18n();
const { setMessage } = useMessageStore();
const { update } = useStrapi();
const { find } = useStrapiUtils();

const isFirstTimeOpened = ref(true);
const title = ref<string>('');
const tags = ref<TagSimple[]>([]);
const status = ref<KanbanColumn | null>(null);
const startDate = ref<string | null>(null);
const endDate = ref<string | null>(null);
const activePage = ref<number>(1);
const taskEvents = ref<TaskEvent[]>([]);

const tabs = [
  { label: t('components.learningPlan.drawer.tabs.events.label'), value: '1' },
  { label: t('components.learningPlan.drawer.tabs.members.label'), value: '2' },
];

const selectedEpic = ref<TaskSimple | null>(null);
const selectedSprint = ref<SprintSimple>();
const selectedHistory = ref<TaskSimple | null>(null);
const selectedParent = ref<TaskSimple | null>(null);
const description = ref<string>('');
const mentionUsers = computed(() => []);
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

const getParentOptions = () => {
  const hasSprint = !!selectedSprint.value;

  const filters = hasSprint
    ? {
        sprint: selectedSprint.value?.id ?? 0,
        organization: 'standard',
      }
    : {
        learningplan: learningplanId.value,
        sprint: {
          id: selectedSprint.value?.id ?? {
            $null: true,
          },
        },
        parent_task: {
          id: selectedSprint.value?.id ?? {
            $null: true,
          },
        },
        organization: {
          $in: ['epic', 'story'],
        },
      };

  const populate = hasSprint
    ? [
        'parent_task.tasks',
        'parent_task.tasks.sprint',
        'parent_task.parent_task.tasks',
        'parent_task.parent_task.tasks.sprint',
      ]
    : {
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
    if (!hasSprint) {
      allGroups.value = data ?? [];
      return;
    }

    const allEpics = data.reduce<TaskSimple[]>((acc, task) => {
      const epic =
        (task as TaskSimple)?.parent_task?.organization === 'epic'
          ? (task as TaskSimple)?.parent_task
          : (task as TaskSimple)?.parent_task?.parent_task;

      if (!epic || acc.some(({ id }) => id === epic.id)) {
        return acc;
      }

      return [...acc, epic];
    }, []);

    allGroups.value = allEpics;
  });
};

const groupOptions = computed(() => {
  const options: AlexDropdownItem[] = [];

  allGroups.value.forEach((task) => {
    // First layer (Epics)
    options.push({
      text: task.title,
      onClick: () => (selectedParent.value = task),
    });

    // Second layer (Stories)
    task.tasks?.forEach((subTask) => {
      //
      // if (!selectedSprint.value || subTask.tasks.some(({ sprint }) => sprint.id === selectedSprint.value?.id ?? 0)) {
      options.push({
        text: subTask.title,
        onClick: () => (selectedParent.value = subTask),
        icon: 'mdi-circle-small',
        notBold: true,
      });
      // }
    });
  });

  return options;
});

watch(selectedParent, (parent) => {
  if (!parent || !props.task?.id || isFirstTimeOpened.value) {
    return;
  }

  update('tasks', props.task.id, {
    parent_task: parent.id,
  }).then(() => {
    emit('moved', `Tarefa movida para ${parent.title}`);
  });
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
    .then(() => emit('moved', epic?.id ? `Tarefa movida para ${epic.title}` : ''))
    .catch(() => setMessage('Falha ao mover tarefa', 'error', true));
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
      emit('moved', `Tarefa movida de ${oldSprint?.title || 'backlog'} para ${sprint?.title}`);
      getParentOptions();
    })
    .catch(() => setMessage('Falha ao mover tarefa', 'error', true));
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
