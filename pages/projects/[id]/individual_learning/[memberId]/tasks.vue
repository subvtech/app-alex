<template>
  <div class="wrapper bg-white">
    <!-- Inputs -->
    <div class="d-flex tw-align-center px-6 py-4 tw-px-6 ga-3 border-bottom-1 border-gray-100">
      <alex-inputs-text-field
        v-model="filter"
        name="task"
        :placeholder="$t(`${i18Dir}.inputs.search`)"
        prepend-inner-icon="mdi-magnify"
        variant="outlined"
        hide-details
        class="tw-w-full tw-mr-auto tw-min-w-40 tw-max-w-80"
        density="comfortable"
      />

      <alex-custom-button
        :text="isKanban ? $t(`${i18Dir}.seeList`) : $t(`${i18Dir}.seeKanban`)"
        :prepend-icon="isKanban ? 'mdi-format-list-bulleted' : 'alex:Kanban'"
        :icon="!isMobile ? undefined : isKanban ? 'mdi-format-list-bulleted' : 'alex:Kanban'"
        variant="secondary"
        size="large"
        @click="isKanban = !isKanban"
      />

      <alex-custom-tooltip :text="$t(`${i18Dir}.inputs.filter`)">
        <template #content>
          <alex-custom-button
            icon="mdi-filter-variant"
            size="large"
            variant="secondary"
            @click="
              () => {
                if (isKanban && kanban) {
                  kanban.handleFilter();
                } else if (!isKanban) {
                  openFilterDrawer = true;
                }
              }
            "
          />
        </template>
      </alex-custom-tooltip>
    </div>
    <alex-learningplan-task-kanban
      v-if="isKanban"
      ref="kanban"
      :key="tasks.length"
      v-model="tasks"
      v-model:columns="columns"
      type="professor"
      :classes="taskMemberClasses"
      :filter="filter"
      no-header
      @create-task="(title, column) => handleCreateTask(title, column)"
      @card-click="(_, taskMember) => openDrawer(taskMember)"
      @card-insert="(newIndex, value, newStatus) => handleUpdateStatus(newIndex, value, newStatus)"
    />
    <div v-else class="px-6 py-4">
      <Transition name="slide">
        <div v-if="filters" class="tw-flex gap-2 tw-pt-4">
          <template v-for="(filter, key) in filters" :key="filter.title">
            <alex-custom-chip
              v-if="filter.value"
              :text="filter.title"
              status="secondary"
              clickable
              closable
              @click:close="
                () => {
                  filters =
                    filters?.map((selected) => {
                      if (selected.field === filter.field) {
                        selected.value = undefined;
                      }

                      return selected;
                    }) ?? [];
                }
              "
            />
          </template>
        </div>
      </Transition>

      <Transition name="slide">
        <v-expansion-panels v-model="expanded" class="task-accordion my-6 rounded-lg">
          <v-expansion-panel class="rounded-lg" value="tasks">
            <v-expansion-panel-title hide-actions class="tw-cursor-default">
              <v-icon :icon="expanded !== 'tasks' ? 'mdi-chevron-down' : 'mdi-chevron-up'" @click="() => {}" />
              <span class="text-h5 text-gray-800"> {{ $t(`${i18Dir}.tasks`) }} </span>
              <alex-custom-chip size="small" status="secondary" :text="listTasks.length" />
            </v-expansion-panel-title>

            <v-expansion-panel-text>
              <alex-learningplan-task-table
                :key="tasks.reduce((acc, { id }) => `${acc}${id}`, '') + isAddingTask"
                :tasks="listTasks"
                :search="filter"
                :active-filter="false"
                :group="'Grupo'"
                :over="{ id: 0, index: 0, position: 'top' }"
                :drag-from="0"
                :dragging="false"
                individual-journey
                @delete-task="handleDeleteTask"
                @edit-task="openDrawer"
                @kanban="isKanban = true"
              />

              <div
                :class="`${!isAddingTask && 'pa-4 tw-border-dashed'} d-flex align-center justify-center ga-2 tw-border
                  tw-rounded-[8px] tw-cursor-pointer tw-transition
                hover:tw-bg-gray-50 mb-4`"
                @click="isAddingTask = true"
              >
                <template v-if="!isAddingTask">
                  <v-icon color="gray-800">mdi-plus</v-icon>
                  <p class="text-body-4 text-gray-800 tw-leading-none">
                    {{ $t('components.projects.individual_learning.tasks.addTask') }}
                  </p>
                </template>
                <template v-else>
                  <alex-inputs-text-field
                    ref="addTaskInput"
                    v-model="newTaskTitle"
                    name="task"
                    :placeholder="$t('components.projects.individual_learning.tasks.inputs.taskTitle')"
                    variant="outlined"
                    hide-details
                    class="tw-w-full px-4 py-2"
                    density="comfortable"
                    auto-focus
                    @keydown.enter.prevent="(e) => e.target.blur()"
                    @blur="
                      () => {
                        if (newTaskTitle) {
                          handleCreateTask(newTaskTitle, { group: 'to_do' });
                        }

                        isAddingTask = false;
                        newTaskTitle = '';
                      }
                    "
                  />
                </template>
              </div>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
      </Transition>
    </div>

    <alex-learningplan-task-drawer-teacher
      v-model="teacherDrawer"
      :task-id="taskDetails?.id"
      :title="taskDetails?.title"
      :status="taskDetails?.status"
      :blocks="taskDetails?.blocks"
      :trail="taskDetails?.trail"
      :learningplan-id="learningPlanStore.learningPlan?.id || 0"
      :tags="taskDetails?.tags"
      :type="taskDetails?.type"
      :events="taskDetails?.task_events"
      :goals="taskDetails?.learning_goals"
      :members="taskDetails?.task_members"
      :description="taskDetails?.description || undefined"
      :submission-description="taskDetails?.submission_description"
      :has-submission="taskDetails?.submission_required"
      :can-change-from-review="taskDetails?.can_change_from_review"
      :send-after-deadline="taskDetails?.can_submit_after_deadline"
      :start-date="taskDetails?.start_at"
      :end-date="taskDetails?.finish_at"
      :restrictions="taskDetails?.allowed_editor_plugins"
      individual-journey
      editable
      @change-goals="handleChangeGoals"
      @change-values="handleChangeValues"
      @change-description="handleChangeDescription"
      @change-submission-description="handleChangeSubmissionDescription"
      @change-tags="handleChangeTags"
      @change-title="handleChangeTitle"
      @change-date="handleChangeDate"
      @change-can-alter-from-review="handleChangeAlterFromReview"
      @change-kanban-status="(group) => handleUpdateDrawerStatus(group)"
    />

    <alex-learningplan-task-drawer-filter
      ref="filterDrawer"
      v-model="openFilterDrawer"
      kanban-filter
      :classes="taskMemberClasses"
      @filter="
        (filterVal) => {
          filters = [
            {
              title: 'Classe',
              value: filterVal.select,
              field: 'class',
            },
            {
              title: 'Start date',
              value: filterVal?.finalDate?.start,
              field: 'start',
            },
            {
              title: 'Final date',
              value: filterVal?.finalDate?.end,
              field: 'end',
            },
          ];
        }
      "
      @update:model-value="() => {}"
    />
  </div>
</template>

<script setup lang="ts">
import { type TaskStudent } from '@/components/alex/learningplan/task/kanban/index.vue';

// Const
const i18Dir = 'components.projects.individual_learning.tasks';

// Hooks
const headerStore = usePageHeaderStore();
const learningPlanStore = useLearningPlanStore();
const { setMessage } = useMessageStore();
const strapi = useStrapi();
const { find } = useStrapiUtils();
const route = useRoute();
const { t } = useI18n();

// Ref
const kanban = ref<{
  setCanDrag: (val: boolean) => void;
  handleFilter: () => void;
} | null>(null);

// <Task[] | TaskStudent[]>
const isKanban = ref<boolean>(true); // or list
const tasks = ref<VNode | any>([]);
const expanded = ref<string>('tasks');
const isMobile = ref<boolean>(false);
const columns = ref<any>([
  {
    title: t('components.learningPlan.drawer.task.status.toDo'),
    color: 'gray',
    group: 'to_do',
    accept: true,
    add: true,
  },
  {
    title: t('components.learningPlan.drawer.task.status.inProgress'),
    color: 'blue',
    group: 'in_progress',
    accept: true,
  },
  {
    title: t('components.learningPlan.drawer.task.status.underReview'),
    color: 'orange',
    group: 'in_review',
    accept: true,
  },
  {
    title: t('components.learningPlan.drawer.task.status.done'),
    color: 'green',
    group: 'done',
    accept: true,
  },
]);

watch(tasks, (tasks) => {
  console.log('tasks:', tasks);
});

// Edit drawer
const teacherDrawer = ref<boolean>(false);
const taskDetails = ref<TaskSimple | null>(null);

// Filters
// - Search
const filter = ref<string>('');
// - Drawer (list)
const openFilterDrawer = ref<boolean>(false);
const filterDrawer = ref<any>(null);
const filters = ref<any>(null);

// Add Task
const isAddingTask = ref<boolean>(false);
const newTaskTitle = ref<string>('');

// Function
const handleCreateTask = async (title: string, column) => {
  if (!title || !column) {
    return;
  }

  const memberId = learningPlanStore.learningPlan?.members.find(
    (member) => member?.user?.id && member?.user?.id.toString() === route.params?.memberId,
  );

  if (!memberId) {
    return;
  }

  const newTask = await strapi.create('tasks', {
    title,
    status: 'published',
    learningplan: learningPlanStore.learningPlan?.id ?? 0,
    position: 0,
    allowed_editor_plugins: '',
    submission_description: '',
    submission_required: false,
    can_submit_after_deadline: true,
    can_change_from_review: true,
    start_at: new Date(),
    type: 'individual',
  });

  const newTaskMember = await strapi.create('task-members', {
    task: newTask.data.id,
    status: column.group,
    start_at: new Date(),
    learning_plan_member: memberId,
  });

  const taskMember = {
    id: newTaskMember.data.id,
    ...newTaskMember.data.attributes,

    task: {
      id: newTask.data.id,
      ...newTask.data.attributes,
    },
  };

  tasks.value = [...tasks.value, formatTaskMember(taskMember)];
  setMessage(t(`${i18Dir}.messages.taskCreated`), 'success', true);
};

const handleDeleteTask = (id) => {
  const taskMember = tasks.value.find(({ task }) => task.id === id);

  if (!taskMember) {
    return;
  }

  strapi
    .delete('task-members', taskMember.id)
    .then(() => {
      tasks.value = tasks.value.filter(({ task }) => task.id !== id);
      setMessage(t(`${i18Dir}.messages.taskDeleted`), 'success', true);
    })
    .catch(() => {
      setMessage(t(`${i18Dir}.messages.failDeleteTask`), 'error', true);
    })
    .finally(() => strapi.delete('tasks', id));
};

const openDrawer = (taskMember) => {
  if (typeof taskMember === 'number') {
    taskMember = tasks.value.find(({ task }) => task.id === taskMember);
  }

  if (!taskMember?.task) {
    setMessage(t(`${i18Dir}.messages.noTaskSelected`), 'warning', true);
    return;
  }

  taskDetails.value = {
    ...taskMember.task,
    status: taskMember.status,
  };

  teacherDrawer.value = true;
};

const checkMobile = () => {
  isMobile.value = window.innerWidth <= 500;
};

// - Get data
const getStudentTasks = async () => {
  const memberId = route.params?.memberId || 0;

  const res = await find('task-members', {
    populate: [
      'task.tags',
      'task.trail',
      'task.blocks',
      'task.task_events.task_member.learning_plan_member.user.avatar',
      'task.task_events.learning_plan_member.user.avatar',
      'task.task_members.learning_plan_member.user.avatar',
      'task.task_members.learning_plan_group.group_members.student_member.user.avatar',
      'task.learning_goals',
      'learning_plan_member.learning_class',
      'learning_plan_member.user.avatar',
      'learning_plan_group.group_members.student_member.user.avatar',
      'learning_plan_group.learning_class',
    ],
    filters: {
      learning_plan_member: {
        user: memberId,
      },

      task: {
        task_members: {
          learning_plan_member: {
            user: memberId,
          },
        },
        status: {
          $not: 'draft',
        },
        type: 'individual',
      },
    },
  });

  if (!res.data) {
    return;
  }

  // Formatado para kanban
  tasks.value = (res.data as TaskMember[])?.map(formatTaskMember) || [];
};

// Util
const formatTaskMember = (taskMember) => ({
  id: taskMember.id,
  status: taskMember.status,
  doc_name: taskMember.doc_name,
  date: new Date(taskMember.finished_at?.replaceAll('-', '/')),
  title: taskMember.task?.title,
  learning_plan_member: taskMember.learning_plan_member,
  user: {
    name: taskMember?.learning_plan_member?.user.fullname || '',
    avatar: taskMember?.learning_plan_member?.user.avatar?.url || undefined,
  },
  ...(taskMember.learning_plan_group?.learning_class?.name && {
    group: {
      name: taskMember.learning_plan_group?.learning_class?.name || '',
      participants: taskMember.learning_plan_group?.group_members.map((member) => ({
        name: member.student_member.user.fullname,
        ...(member.student_member.user.avatar?.url && {
          image: {
            url: member.student_member.user.avatar?.url,
          },
          learning_class: member.student_member.learning_class?.name,
          role: member.role,
        }),
      })),
    },
  }),
  studentClass:
    taskMember?.learning_plan_member?.learning_class?.name ||
    taskMember.learning_plan_group?.learning_class?.name ||
    '',
  task: taskMember.task,
  submissions: taskMember.task_submissions,
});

const getTaskMembers = (taskMembers) => {
  const members: {
    name: string;
    image?: {
      url: string;
    };
  }[] = [];

  taskMembers.forEach((taskMember) => {
    if (taskMember?.learning_plan_member?.user) {
      members.push({
        name: taskMember?.learning_plan_member?.user?.fullname ?? '',
        image: taskMember?.learning_plan_member?.user?.avatar?.url && {
          url: taskMember.learning_plan_member.user.avatar.url,
        },
      });
    }
  });

  return members;
};

const listTasks = computed(() => {
  // Apply filters
  const classFilter = filters.value?.find(({ field }) => field === 'class');
  const startFilter = filters.value?.find(({ field }) => field === 'start');
  const endFilter = filters.value?.find(({ field }) => field === 'end');

  const filteredTasks =
    tasks.value?.filter((taskMember) => {
      if (isKanban.value) {
        return true;
      }

      if (startFilter?.value && taskMember.task.start_at !== startFilter.value) {
        return false;
      }

      if (endFilter?.value && taskMember.task.finish_at !== endFilter.value) {
        return false;
      }

      if (classFilter?.value && taskMember.studentClass !== classFilter.value) {
        return false;
      }

      return true;
    }) ?? [];

  // Format kanban tasks into list type
  return filteredTasks.map(({ status, task }) => ({
    id: task.id,
    title: task.title,
    status: task.status,
    finish_at: task.finish_at,
    start_at: task.start_at,
    position: 0,
    type: task.type,
    archived_at: task.archived_at,
    students: getTaskMembers(task.task_members),
    delivered: {
      toDo: status === 'to_do' ? 1 : 0,
      doing: status === 'in_progress' ? 1 : 0,
      underReview: status === 'in_review' ? 1 : 0,
      completed: status === 'done' ? 1 : 0,
    },
  }));
});

// - Update kanban
const handleUpdateStatus = async (_: number, item: TaskStudent, newStatus: string) => {
  if (!kanban.value) {
    return;
  }

  const taskMember = tasks.value.find((task) => item.id === task.id);

  if (!taskMember) {
    return;
  }

  try {
    kanban.value.setCanDrag(false);
    const submissionValidationStatus = ['in_review', 'in_progress'];
    const time = new Date();
    const lastSubmission = taskMember.submissions?.length ? taskMember?.submissions[0] : undefined;

    tasks.value.map((taskStudent) => {
      if (taskMember.id === taskStudent.id) {
        taskStudent.status = newStatus;
      }

      return taskStudent;
    });

    if (taskMember?.task?.submission_required) {
      if (newStatus === 'in_review' && !lastSubmission) {
        throw new Error('missingSubmission');
      }
      if (newStatus === 'in_review' && lastSubmission) {
        const lastSubRes = await strapi.findOne('task-submissions', {
          fields: ['submission'],
          filters: {
            id: lastSubmission.id,
          },
        });

        // Valor atualizado da ultima submissão, caso tenha sido alterado
        const lastSubVal = lastSubRes.data?.[0].attributes.submission;

        await strapi.update('task-submissions', lastSubmission.id, {
          submission: lastSubVal ? lastSubVal.submission : lastSubmission.submission,
          submitted_at: time.toISOString(),
        });
      }
      if (newStatus === 'in_progress' && item.status !== 'to_do') {
        await strapi.create('task-submissions', {
          task_member: taskMember.id,
          submission: lastSubmission?.submission,
        });
      }
    }
    await strapi.update<TaskMember>('task-members', taskMember.id, {
      status: newStatus as TaskMemberStatus,
      ...(submissionValidationStatus.includes(newStatus) && {
        last_submission_at: newStatus === 'in_progress' && taskMember.submissions ? null : time.toISOString(),
      }),
    });
  } catch (error) {
    // tasks.value.data = tasks.value.data.map((task) => {
    //   if (task.id === item.id) {
    //     return { ...task, status: item.status };
    //   }
    //   return task;
    // });

    tasks.value.map((taskStudent) => {
      if (taskMember.id === taskStudent.id) {
        taskStudent.status = taskMember.status; // Old status
      }

      return taskStudent;
    });

    if ((error as any)?.message === 'missingSubmission') {
      setMessage(t('components.learningPlan.drawer.task.errors.missingSubmission'), 'error', true);
      return;
    }
    setMessage(t('pages.tasks.errors.updateStatusTask'), 'error', true);
  } finally {
    kanban.value.setCanDrag(true);
  }
};

const taskMemberClasses = computed(() => {
  const classes: string[] = tasks.value.flatMap((taskMember) =>
    taskMember.learning_plan_member?.learning_class ? taskMember.learning_plan_member?.learning_class.name : [],
  );

  return Array.from(new Set(classes));
});

// - Drawer events
const handleUpdateDrawerStatus = async (status) => {
  if (!taskDetails.value || !status) {
    return;
  }

  const taskMember = tasks.value.find(({ task }) => task.id === taskDetails.value.id);

  if (!taskMember) {
    return;
  }

  await strapi.update('task-members', taskMember.id, {
    status,
  });

  tasks.value.map((task) => {
    if (task.id === taskMember.id) {
      task.status = status;
    }

    return task;
  });
};

const updateTaskFields = () => {
  tasks.value = tasks.value.map((taskMember) => {
    if (taskMember.task?.id === taskDetails.value?.id) {
      taskMember.task = taskDetails.value;
    }

    return taskMember;
  });
};

const handleChangeGoals = (learningGoals: LearningPlanGoalSimple[]) => {
  if (!taskDetails.value) {
    return;
  }

  taskDetails.value = {
    ...taskDetails.value,
    learning_goals: learningGoals,
  };

  updateTaskFields();
};

const handleChangeValues = (values: Partial<TaskSimple>) => {
  if (!taskDetails.value) return;

  taskDetails.value = {
    ...(taskDetails.value as TaskSimple),
    status: values.status!,
    type: values.type,
    start_at: values.start_at,
    finish_at: values.finish_at,
    submission_required: values.submission_required!,
    can_submit_after_deadline: values.can_submit_after_deadline!,
    allowed_editor_plugins: values.allowed_editor_plugins!,
  };

  // Ver atualizar task member
  updateTaskFields();
};

const handleChangeDate = async (id, _, endDate) => {
  if (!id) {
    return;
  }

  let oldDate;

  const taskMember = tasks.value.find(({ task }) => task.id === id);

  if (!taskMember.id) {
    return;
  }

  try {
    tasks.value = tasks.value.map((taskMember) => {
      if (taskMember.task.id === id) {
        oldDate = taskMember.date;
        taskMember.date = endDate;
      }

      return taskMember;
    });

    await strapi.update('task-members', taskMember.id, {
      finished_at: endDate,
    });
  } catch (_) {
    tasks.value = tasks.value.map((taskMember) => {
      if (taskMember.task.id === id) {
        taskMember.date = oldDate;
      }

      return taskMember;
    });

    setMessage('Falha ao atualizar data final', 'error', true);
  }
};

const handleChangeDescription = (description: string) => {
  if (!taskDetails.value) return;

  taskDetails.value = {
    ...taskDetails.value,
    description,
  };

  updateTaskFields();
};

const handleChangeSubmissionDescription = (description: string) => {
  if (!taskDetails.value) return;

  taskDetails.value = {
    ...taskDetails.value,
    submission_description: description,
  };

  updateTaskFields();
};

const handleChangeTags = (tags: TagSimple[]) => {
  if (!taskDetails.value) return;

  taskDetails.value = {
    ...taskDetails.value,
    tags,
  };

  updateTaskFields();
};

const handleChangeTitle = (title: string) => {
  if (!taskDetails.value) return;

  taskDetails.value = {
    ...taskDetails.value,
    title,
  };

  tasks.value = tasks.value.map((taskMember) => {
    if (taskMember.task?.id === taskDetails.value?.id) {
      taskMember.title = title;
      taskMember.task = taskDetails.value;
    }

    return taskMember;
  });
};

const handleChangeAlterFromReview = (val: boolean) => {
  if (!taskDetails.value) return;

  taskDetails.value = {
    ...taskDetails.value,
    can_change_from_review: val,
  };

  updateTaskFields();
};

//
onBeforeMount(() => {
  headerStore.showHeader = false;

  getStudentTasks();
});

onMounted(() => {
  checkMobile();

  window.addEventListener('resize', () => checkMobile());
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', () => checkMobile());
});

watch(teacherDrawer, (open) => {
  if (!open) {
    taskDetails.value = null;
  }
});

watch(isKanban, () => {
  expanded.value = 'tasks';
  filters.value = [];
});
</script>

<style scoped>
.wrapper {
  border-radius: 8px;
  box-shadow: 0px 0px 16px 0px rgba(0, 0, 0, 0.08);
}
</style>

<style>
.task-accordion {
  box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.1);
  border: solid 1px rgb(var(--v-theme-gray-200));

  .v-theme--mainTheme {
    --v-border-opacity: unset !important;
  }

  .v-expansion-panel-text__wrapper {
    padding: 0 16px !important;
  }

  .v-expansion-panel-title {
    transition: all 0.3s ease;
    height: 52px !important;
    justify-content: flex-start !important;
    gap: 8px;
    width: 100%;
    padding: 16px;
    background-color: transparent !important;
    border-radius: 16px;
  }

  .v-expansion-panel-title__overlay {
    display: none;
  }

  .v-expansion-panel-title--active {
    background-color: #fff !important;
    height: 60px !important;
    min-height: 60px !important;
  }

  .v-expansion-panel-title:hover:not(:has(.delete-btn:hover)) {
    background-color: #fff !important;
  }

  .v-expansion-panel__shadow {
    display: none !important;
  }

  .v-expansion-panel-title__icon {
    margin-inline-start: 0 !important;
  }

  .v-expansion-panel__shadow {
    display: none !important;
  }
}
</style>
