<template>
  <div v-for="i in 4" :key="i">
    <Transition name="slide">
      <v-expansion-panels
        v-if="shouldDisplay(i)"
        v-model="expand[i - 1]"
        class="task-accordion my-6 rounded-lg"
      >
        <v-expansion-panel class="rounded-lg">
          <v-expansion-panel-title class="cursor-default" disabled hide-actions>
            <v-icon
              :icon="
                expand[i - 1] === 0 ? 'mdi-chevron-down' : 'mdi-chevron-up'
              "
              @click="toggleExpand(i)"
            />
            <span class="text-h5 text-gray-800">{{ taskSections[i - 1] }}</span>
            <alex-custom-chip
              status="secondary"
              :text="filteredTasks[i - 1].toString()"
            ></alex-custom-chip>
          </v-expansion-panel-title>
          <v-expansion-panel-text>
            <Transition :name="slideTransition(i)" mode="out-in">
              <div v-if="!tasksArray[i - 1].length && i">
                <alex-learningplan-task-empty-state
                  key="empty-state"
                  :index="i"
                  :drop-area="over.list === groups[i - 1]"
                  @drag-over="handleEmptyStateOver"
                  @drag-leave="onDragLeave"
                />
              </div>
              <div v-else>
                <alex-learningplan-task-table
                  key="table"
                  :tasks="tasksArray[i - 1]"
                  :search="search"
                  :active-filter="isFilterActive"
                  :group="groups[i - 1]"
                  :over="setOver(i - 1)"
                  :drag-from="dragFrom"
                  :dragging="dragging"
                  :handle-pending-contract="handlePendingContract"
                  @start-drag="startDrag"
                  @drag-over="onDragOver"
                  @drag-end="onDrop"
                  @drag-leave="onDragLeave"
                  @delete-task="handleDeleteTask"
                  @move-task="handleMoveTask"
                  @toggle-archive="handleToggleArchive"
                  @edit-task="openDrawer"
                />
              </div>
            </Transition>
            <div v-if="i === 1" class="mb-4">
              <Transition mode="out-in" name="add-task">
                <alex-custom-button
                  v-if="!isCreatingTask"
                  size="large"
                  variant="text"
                  prepend-icon="mdi-plus"
                  class="w-100 create-task-btn"
                  :loading="loader"
                  @click="isCreatingTask = true"
                >
                  {{ $t('pages.task.add') }}
                </alex-custom-button>
                <div v-else class="d-flex ga-2">
                  <alex-inputs-text-field
                    v-model="taskTitle"
                    autofocus
                    :placeholder="t('pages.task.addPlaceholder')"
                    class="w-100"
                    density="comfortable"
                    name="taskTitle"
                    hide-details
                    :disabled="loader"
                  />

                  <alex-custom-button
                    size="large"
                    :loading="loader"
                    @click="handleCreateTask"
                  >
                    {{ $t('pages.task.addButton') }}
                  </alex-custom-button>
                </div>
              </Transition>
            </div>
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>
    </Transition>
  </div>
  <pre>{{ taskDetails }}</pre>

  <alex-learningplan-task-drawer-teacher
    v-model="teacherDrawer"
    :task-id="taskDetails?.id"
    :title="taskDetails?.title"
    :status="taskDetails?.status"
    :blocks="taskDetails?.blocks"
    :trail="taskDetails?.trail"
    :learningplan-id="learningPlanStore.learningPlan?.id || 0"
    :tags="taskDetails?.tags"
    :contract-address="taskDetails?.contract_address"
    :type="taskDetails?.type"
    :events="taskDetails?.task_events"
    :goals="taskDetails?.learning_goals"
    :description="taskDetails?.description || undefined"
    :submission-description="taskDetails?.submission_description"
    :has-submission="taskDetails?.submission_required"
    :send-after-deadline="taskDetails?.can_submit_after_deadline"
    :start-date="taskDetails?.start_at"
    :end-date="taskDetails?.finish_at"
    :restrictions="taskDetails?.allowed_editor_plugins"
    :members="taskDetails?.task_members"
    :editable="true"
    :kanban-button="true"
    @change-goals="handleChangeGoals"
    @change-values="handleChangeValues"
    @change-description="handleChangeDescription"
    @change-submission-description="handleChangeSubmissionDescription"
    @change-tags="handleChangeTags"
    @change-members="handleChangeMembers"
    @change-title="handleChangeTitle"
    @kanban-click="navigateTo(`tasks/${taskDetails?.id}`)"
  />
</template>

<script setup lang="ts">
import { filterType } from '@/pages/courses/[id]/tasks/index.vue';
import { useMultipleDragDrop } from '~/composables/useMultipleDragDrop';
import { TaskSimple, TaskStatus } from '~/models/simple/taskSimple.model';

export interface TaskItem {
  id: number;
  title: string;
  status: TaskStatus;
  finish_at?: string | null;
  start_at?: string | null;
  position: number;
  type?: 'group' | 'individual';
  archived?: boolean;
  contract_address?: string;
  students?: { name: string; image?: { url: string } }[];
  delivered: {
    toDo: number;
    doing: number;
    underReview: number;
    completed: number;
  };
}

interface ApplicationError {
  data: null | any;
  error: {
    status: number;
    name: string;
    message: string;
    details?: {
      policy: string;
      errCode: string;
    };
  };
}

const props = defineProps<{
  search: string;
  filter: filterType | undefined;
}>();

const { create, delete: _delete, update, findOne } = useStrapi();
const { find } = useStrapiUtils();
const client = useStrapiClient();
const { cancelContract, getContractBalance } = useContracts();
const { t } = useI18n();
const expand = ref([0, 0, 0, 0]);
const isCreatingTask = ref(false);
const taskTitle = ref('');
const loader = ref(false);
const { setMessage } = useMessageStore();
const learningPlanStore = useLearningPlanStore();
const teacherDrawer = ref(false);
const slideTransition = (i: number) =>
  tasksArray.value[i - 1].length ? 'slide-down' : 'slide-up';

const groupsArray = ['draft', 'published', 'finished', 'archived'];
const groups = {};

groupsArray.forEach((group, index) => {
  groups[group] = index;
  groups[index] = group;
});

const handlePendingContract = async () => {
  let isThereAPendingContract = !!taskDetails?.value?.contract_address;
  if (isThereAPendingContract) {
    const contractAddress = taskDetails!.value!.contract_address!;
    const balance = await getContractBalance(contractAddress);
    if (balance && Number(balance) > 0) {
      const result = await cancelContract({
        contractAddress,
      });
      if (result) isThereAPendingContract = false;
    }
  }

  return isThereAPendingContract;
};

const searchField = computed(() => props.search.toLowerCase());
const tasksFilter = computed(() => props.filter);
const isFilterActive = computed(() => {
  if (tasksFilter.value) return Object.keys(tasksFilter.value).length !== 0;
  return false;
});

const shouldDisplay = (i: number) => {
  const { archivedTasks } = tasksFilter.value || {};
  return (!archivedTasks && i !== 4) || (i === 4 && archivedTasks);
};
const displayError = (message: string, e?: ApplicationError) => {
  let displayMessage = t('pages.task.crud.errorMessage', {
    action: t(`pages.task.crud.${message}`),
  });
  const error = e?.error;
  if (error?.name === 'ApplicationError' && error?.details) {
    displayMessage = t(`pages.task.crud.${error.details.errCode}`);
  }
  setMessage(displayMessage, 'error', true);
  if (learningPlanStore.learningPlan)
    learningPlanStore.loadLearningPlan(learningPlanStore.learningPlan.id, true);
};

const displaySuccess = (message: string) => {
  setMessage(
    t('pages.task.crud.successMessage', {
      action: t(`pages.task.crud.${message}`),
    }),
    'success',
    true,
  );
};

const isDateInRange = (date?: string | null, range) => {
  if (!range) return true;
  if (!date) return false;
  const { start, end } = range;
  if (start && new Date(date) < new Date(start)) return false;
  if (end && new Date(date) > new Date(end)) return false;
  return true;
};

const getHigherIndex = (taskStatus: string) => {
  const tasks = tasksArray.value[groups[taskStatus]];
  return tasks[tasks.length - 1]?.position + 1 || 0;
};

const handleCreateTask = async () => {
  if (taskTitle.value) {
    loader.value = true;
    const learningPlanId = learningPlanStore.learningPlan?.id;
    if (!learningPlanId) return;
    const higherIndex = getHigherIndex('draft');
    try {
      const res = await create('tasks', {
        title: taskTitle.value,
        status: 'draft' as TaskStatus,
        learningplan: learningPlanId,
        position: higherIndex,
        allowed_editor_plugins: '',
        submission_description: '',
        submission_required: false,
        can_submit_after_deadline: false,
      });
      learningPlanStore.learningPlan?.tasks.push({
        id: res.data.id,
        learning_plan_id: learningPlanId,
        learning_goals: [],
        trail: undefined,
        task_events: undefined,
        task_members: undefined,
        tags: undefined,
        ...res.data.attributes,
      });
      displaySuccess('addSuccess');
    } catch (e) {
      displayError('addError');
    }
  }
  loader.value = false;
  taskTitle.value = '';
  isCreatingTask.value = false;
};
const toggleExpand = (index: number) => {
  isCreatingTask.value = false;
  taskTitle.value = '';
  expand.value[index - 1] = !expand.value[index - 1] ? -1 : 0;
};
const taskSections = [
  t('pages.task.draft'),
  t('pages.task.published'),
  t('pages.task.done'),
  t('pages.task.archived'),
];

const tasksArray = computed(() => {
  const draft: TaskItem[] = [];
  const published: TaskItem[] = [];
  const closed: TaskItem[] = [];
  const archived: TaskItem[] = [];
  learningPlanStore.learningPlan?.tasks
    .sort((a, b) => (a.position > b.position ? 1 : -1))
    .forEach((task) => {
      const delivered = {
        toDo: 0,
        doing: 0,
        underReview: 0,
        completed: 0,
      };
      if (tasksFilter.value?.select && task.type !== tasksFilter.value?.select)
        return;
      if (!isDateInRange(task.start_at, tasksFilter.value?.startDate)) return;
      if (!isDateInRange(task.finish_at, tasksFilter.value?.finalDate)) return;
      const students: TaskItem['students'] = [];
      task.task_members?.forEach((taskMember) => {
        if (taskMember.status === 'to_do') delivered.toDo += 1;
        if (taskMember.status === 'in_progress') delivered.doing += 1;
        if (taskMember.status === 'in_review') delivered.underReview += 1;
        if (taskMember.status === 'done') delivered.completed += 1;
        taskMember.learning_plan_group?.group_members?.forEach((student) => {
          const studentUser = student.student_member?.user;
          students.push({
            name: studentUser?.fullname,
            image: studentUser?.avatar?.url
              ? { url: studentUser.avatar.url }
              : undefined,
          });
        });

        if (taskMember.learning_plan_member) {
          students.push({
            name: taskMember.learning_plan_member.user?.fullname,
            image: taskMember.learning_plan_member.user?.avatar?.url
              ? { url: taskMember.learning_plan_member.user?.avatar.url }
              : undefined,
          });
        }
      });
      const taskItem = {
        id: task.id,
        title: task.title,
        status: task.status,
        finish_at: task.finish_at,
        start_at: task.start_at,
        type: task.type,
        archived_at: task.archived_at,
        position: task.position,
        students,
        delivered,
      };
      if (task.archived_at) archived.push(taskItem);
      else if (task.status === 'draft') draft.push(taskItem);
      else if (task.status === 'published') published.push(taskItem);
      else if (task.status === 'finished') closed.push(taskItem);
    });
  return [draft, published, closed, archived];
});

const editTaskId = ref<number>(-1);

const taskDetails = computed(() => {
  if (editTaskId.value) {
    return learningPlanStore.learningPlan?.tasks.find(
      (t) => t.id === editTaskId.value,
    );
  }
  return null;
});

const filteredTasks = computed(() => {
  const draft = tasksArray.value[0].filter((task) =>
    task.title.toLowerCase().includes(searchField.value.toLowerCase()),
  ).length;
  const published = tasksArray.value[1].filter((task) =>
    task.title.toLowerCase().includes(searchField.value.toLowerCase()),
  ).length;
  const closed = tasksArray.value[2].filter((task) =>
    task.title.toLowerCase().includes(searchField.value.toLowerCase()),
  ).length;
  const archived = tasksArray.value[3].filter((task) =>
    task.title.toLowerCase().includes(searchField.value.toLowerCase()),
  ).length;

  return [draft, published, closed, archived];
});

const handleDeleteTask = async (id: number) => {
  try {
    const deleteIndex = learningPlanStore.learningPlan?.tasks.findIndex(
      (task) => task.id === id,
    );
    if (typeof deleteIndex === 'number' && deleteIndex > -1) {
      learningPlanStore.learningPlan?.tasks.splice(deleteIndex, 1);
    }
    const taskTobeDeleted = await findOne('tasks', id);
    console.log(taskTobeDeleted);
    // await _delete('tasks', id);
    displaySuccess('deleteSuccess');
  } catch (e) {
    displayError('deleteError');
  }
};

const handleMoveTask = async ({
  id,
  status,
}: {
  id: number;
  status: TaskStatus;
}) => {
  try {
    const taskPosition = getHigherIndex(status);
    const task = learningPlanStore.learningPlan?.tasks.find((t) => t.id === id);
    if (task) {
      task.status = status;
      task.position = taskPosition;
      await update('tasks', id, { status, position: taskPosition });
      displaySuccess('moveSuccess');
    }
  } catch (e: unknown) {
    displayError('moveError', e);
  }
};

const handleToggleArchive = async (id: number) => {
  const task = learningPlanStore.learningPlan?.tasks.find((t) => t.id === id);
  if (!task) return;
  try {
    if (task) {
      const newPosition = getHigherIndex(
        !task.archived_at ? 'archived' : task.status,
      );
      task.position = newPosition;
      task.archived_at = task.archived_at ? null : new Date().toISOString();
      await update('tasks', id, {
        archived_at: task.archived_at,
        position: newPosition,
      });
      displaySuccess(task.archived_at ? 'archiveSuccess' : 'unarchiveSuccess');
    }
  } catch (e) {
    displayError(task.archived_at ? 'archiveError' : 'unarchiveError');
  }
};

const {
  over,
  dragFrom,
  dragging,
  startDrag,
  dragEnd,
  onDragOver,
  onDragLeave,
} = useMultipleDragDrop();

const setOver = (groupIndex: number) => {
  if (over.value.list === groups[groupIndex]) return over.value;
  return { ...over.value, id: -1 };
};

const handleEmptyStateOver = (index: number, dragEvent: DragEvent) => {
  onDragOver(groups[index - 1], -index, -1, dragEvent);
};

const updateTaskPositions = async (tasksStatus: TaskStatus, item: TaskItem) => {
  const groupIndex = groups[tasksStatus];

  const cloneArray = JSON.parse(JSON.stringify(tasksArray.value[groupIndex]));

  const task = learningPlanStore.learningPlan?.tasks.find(
    (t) => t.id === item.id,
  );

  if (!task) return;

  if (task?.status === tasksStatus) {
    const removeIndex = cloneArray.findIndex((t: TaskItem) => t.id === task.id);
    cloneArray.splice(removeIndex, 1);
  }

  let targeIndex = cloneArray.findIndex((t) => t.id === over.value.id);
  targeIndex = over.value.position === 'top' ? targeIndex : targeIndex + 1;
  cloneArray.splice(targeIndex, 0, item);

  task.status = tasksStatus;
  item.status = tasksStatus;
  await update('tasks', task.id, { status: tasksStatus });
  await client('tasks/update-multiple', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: cloneArray,
  });
  tasksArray.value[groupIndex] = cloneArray;
};

const onDrop = async (item: TaskItem, tableSort: string) => {
  if (over.value.list) {
    const task = learningPlanStore.learningPlan?.tasks.find(
      (t) => t.id === item.id,
    );
    if (
      task?.status === over.value.list &&
      (over.value.index === -1 || isFilterActive.value)
    ) {
      const message = isFilterActive.value
        ? t('pages.task.crud.dndFilterError')
        : t('pages.task.crud.dndSortError', {
            type: t(`pages.task.table.header.${tableSort}`).toLowerCase(),
          });
      setMessage(message, 'warning', true, false, true);
    } else if (task) {
      try {
        if (over.value.index === -1) {
          task.position = getHigherIndex(over.value.list);
          task.status = over.value.list as TaskStatus;
          await update('tasks', item.id, {
            status: over.value.list,
            position: getHigherIndex(over.value.list),
          });
        } else {
          await updateTaskPositions(over.value.list as TaskStatus, item);
        }
        displaySuccess('moveSuccess');
      } catch (e: ApplicationError) {
        displayError('moveError', e);
      }
    }
  }
  dragEnd();
};

const openDrawer = (id: number) => {
  editTaskId.value = id;
  teacherDrawer.value = true;
};

const handleChangeValues = (values: Partial<TaskSimple>) => {
  const task = learningPlanStore.learningPlan?.tasks.find(
    (t) => t.id === editTaskId.value,
  );
  if (task) {
    task.status = values.status!;
    task.type = values.type;
    task.start_at = values.start_at;
    task.finish_at = values.finish_at;
    task.contract_address = values.contract_address!;
    task.submission_required = values.submission_required!;
    task.can_submit_after_deadline = values.can_submit_after_deadline!;
    task.allowed_editor_plugins = values.allowed_editor_plugins!;
  }

  console.log({
    values,
  });
};

const handleChangeDescription = (description: string) => {
  const task = learningPlanStore.learningPlan?.tasks.find(
    (t) => t.id === editTaskId.value,
  );
  if (task) {
    task.description = description;
  }
};

const handleChangeTitle = (title: string) => {
  const task = learningPlanStore.learningPlan?.tasks.find(
    (t) => t.id === editTaskId.value,
  );
  if (task) {
    task.title = title;
  }
};

const handleChangeGoals = (learningGoals: LearningPlanGoalSimple[]) => {
  const task = learningPlanStore.learningPlan?.tasks.find(
    (t) => t.id === editTaskId.value,
  );

  if (task) {
    task.learning_goals = learningGoals;
  }
};

const handleChangeSubmissionDescription = (description: string) => {
  const task = learningPlanStore.learningPlan?.tasks.find(
    (t) => t.id === editTaskId.value,
  );
  if (task) {
    task.submission_description = description;
  }
};

const handleChangeTags = (tags: TagSimple[]) => {
  const task = learningPlanStore.learningPlan?.tasks.find(
    (t) => t.id === editTaskId.value,
  );
  if (task) {
    task.tags = tags;
  }
};

const handleChangeMembers = async () => {
  const task = learningPlanStore.learningPlan?.tasks.find(
    (t) => t.id === editTaskId.value,
  );
  try {
    const response = await find<TaskMember>('task-members', {
      populate: [
        'task_submission',
        'learning_plan_group.group_members.student_member.user.avatar',
        'learning_plan_group.group_members.student_member.user.wallet',
        'learning_plan_member.user.avatar',
        'learning_plan_member.user.wallet',
        'learning_plan_member.learning_class',
      ],
      filters: {
        task: editTaskId.value,
      },
    });

    const { data } = response;
    if (task) {
      task.task_members = data;
    }
    return response;
  } catch (e: any) {
    setMessage(t('pages.tasks.cantUpdateMembers'), 'red', true);
    if (learningPlanStore.learningPlan)
      learningPlanStore.loadLearningPlan(
        learningPlanStore.learningPlan.id,
        true,
      );
  }
};
</script>

<style>
.cursor-default {
  cursor: default;
}

.create-task-btn {
  border: 1px dashed rgb(var(--v-theme-gray-200));
}

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

.add-task-enter-active {
  transition: all 0.5s ease-in-out;
}

.add-task-enter-from,
.add-task-leave-to {
  opacity: 0;
}

.slide-up-enter-active,
.slide-up-leave-active,
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
}

.slide-up-enter-from,
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

.slide-up-leave-to,
.slide-down-enter-from {
  opacity: 0;
  transform: translateY(-30px);
}

.slide-enter-active {
  transition: all 0.5s ease-out;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(20px);
  opacity: 0;
}
</style>
