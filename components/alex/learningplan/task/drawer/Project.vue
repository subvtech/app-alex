<template>
  <v-navigation-drawer
    :id="drawerId"
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
      <alex-learningplan-task-tags v-model="tags" class="mt-2 mb-4" :task-id="taskId" edit />

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
        <v-col cols="6"
          ><alex-learningplan-task-state v-model="status" :config="statusConfig" edit @change-kanban-col="console.log"
        /></v-col>
        <v-col v-if="task?.organization === 'standard'" cols="6">
          <p class="text-body-4 text-gray-800 mb-1">Sprint</p>
          <alex-learningplan-task-options
            v-model="selectedSprint"
            placeholder="Escolha uma sprint"
            :items="sprintOptions"
            :config="sprintConfig"
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

        <v-col cols="6"
          ><p class="text-body-4 text-gray-800 mb-1">Épico</p>
          <alex-project-select
            v-model="epicOpen"
            title="Selecione um épico"
            placeholder="Escolha um épico"
            :selected-val="selectedEpic"
            :disabled-message="!!selectedHistory && 'A tarefa já está em uma história'"
            :options="epics"
            @select="(epic) => (selectedEpic = epic)"
            @create="handleCreateEpic"
        /></v-col>

        <v-col cols="6"
          ><p class="text-body-4 text-gray-800 mb-1">História</p>
          <alex-project-select
            v-model="historyOpen"
            title="Selecione uma história"
            placeholder="Escolha uma história"
            :selected-val="selectedHistory"
            :options="histories"
            @select="(history) => (selectedHistory = history)"
            @create="handleCreateStory"
        /></v-col>
      </v-row>

      <div>
        <p class="text-body-4 text-gray-800">Responsáveis</p>
        <alex-custom-avatar-group v-if="responsibles.length" class="mt-2" :size="36" :avatar-items="responsibles" />
        <p v-else class="text-body-3 text-gray-400">Sem responsáveis</p>
      </div>

      <alex-learningplan-task-description v-model="description" class="my-4" :mention-users="mentionUsers" edit />
    </div>

    <!-- Recursos de aprendizagem -->
    <div class="my-6">
      <alex-learningplan-task-resources
        v-model="openResources"
        :task-id="taskId"
        :trail-id="trailId"
        :blocks="blocks"
        edit
        teacher
      />
    </div>

    <alex-custom-tabs v-model="activePage" :tabs="tabs" class="border-bottom-1 border-gray-100" />
    <v-window v-model="activePage">
      <v-window-item value="1">
        <alex-learningplan-task-events v-model="taskEvents" />
      </v-window-item>
    </v-window>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import { isBefore } from 'date-fns';

interface DrawerProjectProps {
  taskId: number;
  task?: TaskSimple;
  sprints?: any;
}

const props = defineProps<DrawerProjectProps>();

// General
const drawerId = computed(() => `project-drawer-${crypto.randomUUID()}`);

const { t } = useI18n();
const { setMessage } = useMessageStore();
const { create, update } = useStrapi();
const { find } = useStrapiUtils();
const learningPlanStore = useLearningPlanStore();

const open = defineModel<boolean>({ required: true });

const isFirstTimeOpened = ref(true);

const emit = defineEmits(['kanban-click', 'change-description', 'update-value', 'moved']);

const notifyFieldError = (field: string) => {
  setMessage(
    t('components.learningPlan.drawer.task.errors.save', {
      field: t(`components.learningPlan.drawer.task.${field}.label`),
    }),
    'error',
    true,
  );
};

watch(open, (open) => {
  // Update data when kanban is opened | closed
  setTimeout(() => (isFirstTimeOpened.value = !open), open ? 200 : 0);

  // Task data
  tags.value = props.task?.tags ?? [];
  title.value = props.task?.title ?? '';
  description.value = props.task?.description ?? '';

  startDate.value = props.task?.start_at ?? null;
  endDate.value = props.task?.finish_at ?? null;

  trailId.value = props.task?.trail?.id ?? null;
  blocks.value = props.task?.blocks ?? [];

  // Sprint, epic and story data
  selectedSprint.value = props.task?.sprint?.title ?? 'Backlog';

  setTimeout(() => {
    if (props.task?.parent_task?.organization === 'epic') {
      selectedEpic.value = props.task?.parent_task?.title ?? null;
    } else if (props.task?.parent_task?.organization === 'story') {
      selectedHistory.value = props.task?.parent_task?.title ?? null;

      histories.value?.forEach((story) => {
        if (story?.parent_task?.organization === 'epic') {
          selectedEpic.value = story?.parent_task?.title ?? null;
        }
      });
    } else {
      selectedEpic.value = null;
      selectedHistory.value = null;
    }
  }, 100);
});

// Title
const title = ref<string>('');

useOnStopTyping(
  title,
  () => {
    if (isFirstTimeOpened.value) {
      return;
    }

    update('tasks', props.taskId, {
      title: title.value,
    })
      .then(() => emit('update-value', 'title', title.value))
      .catch(() => notifyFieldError('title'));
  },
  1000,
  false,
  false,
);

// Tags
const tags = ref<TagSimple[]>([]);

watch(tags, (tags) => {
  if (!isFirstTimeOpened.value && open.value) {
    emit('update-value', 'tags', tags);
  }
});

// Status
const status = ref<string | number>(0);
const statusConfig = ref<any>(undefined);

// watch(status, (status) => {
//   // if (isFirstTimeOpened.value) {
//   //   return;
//   // }
//   // strapiClient(`/tasks/${props.taskId}/update-task-kanban-status`, {
//   //   body: {
//   //     data: {
//   //       sprint: currSprint.id,
//   //       kanban_column: status,
//   //     },
//   //   },
//   // });
// });

// Epic
const epicOpen = ref<boolean>(false);
const selectedEpic = ref<string | null>(null);
const epics = ref([]);

watch(selectedEpic, (epic) => {
  if (isFirstTimeOpened.value || !props.taskId) {
    return;
  }

  const currEpic = epics.value.find(({ title }) => title === epic);
  selectedHistory.value = null;

  update('tasks', props.taskId, {
    parent_task: currEpic?.id ?? null,
  })
    .then(() => emit('moved', currEpic?.id ? `Tarefa movida para ${epic}` : ''))
    .catch(() => setMessage('Falha ao mover tarefa', 'error', true));
});

// Sprint
const selectedSprint = ref<string | null>('');
const sprints = ref([{ title: 'Backlog' }, ...props.sprints]);

const sprintOptions = computed(() =>
  sprints.value.map(({ title }) => ({ text: title, onClick: () => (selectedSprint.value = title) })),
);

const sprintConfig = computed(() => {
  const config = {};

  sprints.value?.forEach(({ title }) => {
    config[title] = title;
  });

  return config;
});

watch(
  () => props.sprints,
  (value) => (sprints.value = [{ title: 'Backlog' }, ...value]),
);

watch(selectedSprint, (sprint, oldSprint) => {
  selectedHistory.value = null;
  selectedEpic.value = null;
  status.value = 0;

  const currSprint = sprints.value.find(({ title }) => sprint === title);

  if (!currSprint) {
    epics.value = [];
    histories.value = [];
    statusConfig.value = undefined;
    return;
  }

  const hasSprint = !!currSprint.id;

  // Get sprint epics and stories
  const filters = hasSprint
    ? {
        title: sprint,
        project: learningPlanStore.learningPlan?.id ?? 0,
      }
    : {
        learningplan: {
          id: learningPlanStore.learningPlan?.id ?? 0,
        },
        organization: {
          $in: ['epic', 'story'],
        },
        sprint: {
          id: {
            $null: true,
          },
        },
      };

  find(hasSprint ? 'sprints' : 'tasks', {
    filters,
    populate: {
      parent_task: true,
      tasks: {
        filters: {
          organization: { $in: ['story', 'epic'] },
        },

        populate: {
          parent_task: true,
          tasks: {
            populate: {
              parent_task: true,
            },
            organization: { $in: ['story', 'epic'] },
          },
        },
      },
    },
  })
    .then(({ data }) => {
      const newStories: TaskSimple[] = [];
      const newEpics: TaskSimple[] = [];

      const iterator = hasSprint ? data?.[0]?.tasks : data;

      iterator.forEach((task) => {
        (task.organization === 'story' ? newStories : newEpics).push(task);

        task?.tasks?.forEach((subTask) => {
          (subTask.organization === 'story' ? newStories : newEpics).push(subTask);
        });
      });

      epics.value = [...new Set(newEpics)];
      histories.value = [...new Set(newStories)];
    })
    .catch(console.log);

  statusConfig.value =
    currSprint.kanban?.kanban_columns.map((column) => ({
      id: column.id,
      title: column.title,
      status_type: column.status_type,
    })) ?? [];

  if (isFirstTimeOpened.value || !props.taskId) {
    return;
  }

  update('tasks', props.taskId, {
    sprint: currSprint.id ?? null,
    parent_task: null,
  })
    .then(() => emit('moved', `Tarefa movida de ${oldSprint} para ${sprint}`))
    .catch(() => setMessage('Falha ao mover tarefa', 'error', true));
});

// Date
const startDate = ref<Date | string | null>(null);
const endDate = ref<Date | string | null>(null);

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

watch(startDate, (date) => {
  if (isFirstTimeOpened.value || !date) {
    return;
  }

  update('tasks', props.taskId, {
    start_at: date,
  })
    .then(() => emit('update-value', 'start_at', date))
    .catch(() => notifyFieldError('date'));
});

watch(endDate, (date) => {
  if (isFirstTimeOpened.value || !date) {
    return;
  }

  update('tasks', props.taskId, {
    finish_at: date,
  })
    .then(() => emit('update-value', 'finish_at', date))
    .catch(() => notifyFieldError('date'));
});

// History
const historyOpen = ref<boolean>(false);
const selectedHistory = ref<string | null>(null);
const histories = ref<TaskSimple[]>([]);

watch(selectedHistory, (story) => {
  if (isFirstTimeOpened.value || !props.taskId) {
    return;
  }

  const currStory = histories.value.find(({ title }) => title === story);
  selectedEpic.value = currStory?.parent_task?.title ?? null;

  update('tasks', props.taskId, {
    parent_task: currStory?.id ?? null,
  })
    .then(() => emit('moved', currStory?.id ? `Tarefa movida para ${story}` : ''))
    .catch(() => setMessage('Falha ao mover tarefa', 'error', true));
});

// Description
const description = ref<string>('');
const mentionUsers = computed(() => []);

useOnStopTyping(
  description,
  async () => {
    try {
      if (isFirstTimeOpened.value) {
        return;
      }

      await update('tasks', props.taskId, {
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

// Learning Resources
const openResources = ref<boolean>(false);
const trailId = ref<number | null>(null);
const blocks = ref<BlockSimple[]>([]);

// Responsibles
const responsibles = [
  {
    name: 'Lucas Teste',
    image: {
      url: 'https://gru.ifsp.edu.br/images/phocagallery/galeria2/image03_grd.png',
    },
  },
  {
    name: 'Teste Lucas',
    image: {
      url: 'https://www.designi.com.br/images/preview/10073442.jpg',
    },
  },
];

// Tabs
const activePage = ref<number>(1);
const taskEvents = ref<TaskEvent[]>([]);

const tabs = [{ label: t('components.learningPlan.drawer.tabs.events.label'), value: '1' }];

// Events
onMounted(() => {
  // So backlog epics and stories list will be preloaded
  find('tasks', {
    filters: {
      learningplan: {
        id: learningPlanStore.learningPlan?.id ?? 0,
      },
      organization: {
        $in: ['epic', 'story'],
      },
      sprint: {
        id: {
          $null: true,
        },
      },
    },
    populate: {
      parent_task: true,
      tasks: {
        filters: {
          organization: { $in: ['story', 'epic'] },
        },

        populate: {
          parent_task: true,
          tasks: {
            populate: {
              parent_task: true,
            },
            organization: { $in: ['story', 'epic'] },
          },
        },
      },
    },
  })
    .then(({ data }) => {
      const newStories: TaskSimple[] = [];
      const newEpics: TaskSimple[] = [];

      data.forEach((task) => {
        (task.organization === 'story' ? newStories : newEpics).push(task);

        task?.tasks?.forEach((subTask) => {
          (subTask.organization === 'story' ? newStories : newEpics).push(subTask);
        });
      });

      epics.value = [...new Set(newEpics)];
      histories.value = [...new Set(newStories)];
    })
    .catch(console.log);
});
</script>
