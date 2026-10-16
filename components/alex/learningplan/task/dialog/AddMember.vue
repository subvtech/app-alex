<template>
  <div class="inline-member-picker">
    <div class="select-all-control">
      <v-checkbox
        class="select-all-checkbox"
        :model-value="selectAllStatus === 1"
        :indeterminate="selectAllStatus === -1"
        :disabled="!hasStudentsToAdd"
        density="compact"
        hide-details
        @click.stop="toggleSelectAll"
      />
      <span class="text-body-2 select-all-label" @click="hasStudentsToAdd && toggleSelectAll()">
        Selecionar todos
      </span>
    </div>
    <p v-if="!hasStudentsToAdd" class="text-body-1 text-gray-400 text-center">
      Parece que todos os alunos foram adicionados a esta tarefa.
    </p>
    <v-expansion-panels class="task-student-card" multiple>
      <template v-for="classValue in filteredClasses" :key="classValue.id">
        <v-expansion-panel>
          <v-expansion-panel-title
            ><alex-inputs-checkbox
              :model-value="!!getSelectedUsersStatus(classValue.id, filteredClasses, selectedUsers)"
              :indeterminate="getSelectedUsersStatus(classValue.id, filteredClasses, selectedUsers) === -1"
              class="checkbox"
              @click.stop="selectAllUsers(classValue.id, classes.data)"
            />
            <p class="text-body-2 tw-w-full text-gray-900">
              {{ classValue.name }}
            </p></v-expansion-panel-title
          >
          <v-expansion-panel-text>
            <v-slide-y-transition group hide-on-leave>
              <alex-custom-list-item-user
                v-for="member in classValue.learning_plan_members"
                :key="member.id"
                :user="{
                  name: member.user.fullname,
                  email: member.email,
                  image: member.user?.avatar?.formats?.small?.url || member.user?.avatar?.url,
                }"
                no-chip
                :selected="isExistingMember(member)"
                :is-selected-value="isExistingMember(member) || isTempSelected(member)"
                @click.stop="selectUser(member)"
              />
            </v-slide-y-transition>
          </v-expansion-panel-text>
        </v-expansion-panel>
      </template>
    </v-expansion-panels>
    <alex-custom-button
      class="tw-mt-4"
      variant="secondary"
      prepend-icon="mdi-plus"
      :disabled="!selectedUsers.length || loadingAdd"
      :loading="loadingAdd"
      @click="handleSubmit"
    >
      {{ $t('components.learningPlan.drawer.task.dialog.add') }}
    </alex-custom-button>
  </div>
</template>

<script setup lang="ts">
interface AddStudent {
  learningplanId: number;
  taskId: number;
  members: TaskMember[];
  search?: string;
}
const props = withDefaults(defineProps<AddStudent>(), {
  search: '',
});
type Emits = {
  'add-click': [members: LearningPlanMemberSimple[]];
};
const emit = defineEmits<Emits>();
const loadingAdd = ref(false);
const strapiUtils = useStrapiUtils();
const existingTaskMemberIds = ref<number[]>([]);
const syncedTaskId = ref<number | null>(null);
let syncRequestId = 0;
const getMemberIdsFromTaskMembers = (taskMembers: TaskMember[] = []) =>
  taskMembers.flatMap((taskMember) => {
    if (taskMember.learning_plan_member?.id) {
      return [taskMember.learning_plan_member.id];
    }
    if (taskMember.learning_plan_group?.group_members?.length) {
      return taskMember.learning_plan_group.group_members.map((groupMember) => groupMember.student_member.id);
    }
    return [];
  });
const existingMembersSet = computed(() => {
  if (syncedTaskId.value === props.taskId) {
    return new Set(existingTaskMemberIds.value);
  }
  return new Set(getMemberIdsFromTaskMembers(props.members));
});
const normalizeMemberId = (member?: { id?: number }) => (typeof member?.id === 'number' ? member.id : null);
const isExistingMember = (member: { id?: number }) => {
  const id = normalizeMemberId(member);
  return id !== null && existingMembersSet.value.has(id);
};
const isTempSelected = (member: { id?: number }) => !!selectedUsers.value.find((u) => u.id === member.id);

const fetchAllPages = async <T,>(contentType: string, params: any, pageSize = 100) => {
  let page = 1;
  let total = 0;
  const data: T[] = [];

  do {
    const response = await strapiUtils.find<T>(contentType, {
      ...params,
      pagination: { page, pageSize },
    });
    data.push(...response.data);
    total = response.meta?.pagination?.total ?? data.length;
    page += 1;
  } while (data.length < total);

  return data;
};

const fetchClassMembers = (classId: number) =>
  fetchAllPages<LearningPlanMemberSimple>(
    'learning-plan-members',
    {
      filters: { learning_class: classId },
      populate: {
        user: {
          populate: ['avatar'],
        },
        learning_class: {
          fields: ['id'],
        },
      },
    },
    100,
  );

const fetchTaskMembers = (taskId: number) =>
  fetchAllPages<TaskMember>(
    'task-members',
    {
      filters: { task: taskId },
      populate: {
        learning_plan_member: {
          fields: ['id'],
        },
        learning_plan_group: {
          populate: {
            group_members: {
              populate: {
                student_member: {
                  fields: ['id'],
                },
              },
            },
          },
        },
      },
    },
    100,
  );

const syncExistingTaskMembers = async () => {
  if (!props.taskId) {
    existingTaskMemberIds.value = [];
    syncedTaskId.value = null;
    return;
  }
  const currentRequestId = ++syncRequestId;
  const taskMembers = await fetchTaskMembers(props.taskId);
  if (currentRequestId !== syncRequestId) {
    return;
  }
  existingTaskMemberIds.value = getMemberIdsFromTaskMembers(taskMembers);
  syncedTaskId.value = props.taskId;
};

const getMembers = async (learningplanId: number) => {
  const classes = await fetchAllPages<ClassSimple>(
    'classes',
    {
      filters: { learningplan: learningplanId },
    },
    100,
  );

  const classesWithMembers = await Promise.all(
    classes.map(async (classValue) => ({
      ...classValue,
      learning_plan_members: await fetchClassMembers(classValue.id),
    })),
  );

  return {
    meta: { total: classesWithMembers.length },
    data: classesWithMembers,
  };
};
const {
  data: classes,
  execute,
  refresh,
} = await useAsyncData('classes-member-invite-modal-add-member-dialog', () => getMembers(props.learningplanId), {
  default: () => ({ meta: 0, data: [] as ClassSimple[] }),
  lazy: true,
});
const selectedUsers = ref<LearningPlanMemberSimple[]>([]);
const filteredClasses = computed(() => {
  if (!props.search) return classes.value.data;
  const lowerCaseSearch = props.search.toLowerCase();
  return classes.value.data.map((classValue) => ({
    ...classValue,
    learning_plan_members: classValue.learning_plan_members?.filter(
      (member) =>
        member.user.fullname.toLowerCase().includes(lowerCaseSearch) ||
        member.user.email.toLowerCase().includes(lowerCaseSearch) ||
        member.user.username.toLowerCase().includes(lowerCaseSearch),
    ),
  }));
});
const filteredAvailableUsers = computed(() =>
  filteredClasses.value.flatMap((classValue) =>
    (classValue.learning_plan_members || []).filter((member) => !isExistingMember(member)),
  ),
);
const hasStudentsToAdd = computed(() => filteredAvailableUsers.value.length > 0);
const selectAllStatus = computed(() => {
  const selectedIds = new Set(selectedUsers.value.map((user) => user.id));
  const selectedCount = filteredAvailableUsers.value.filter((user) => selectedIds.has(user.id)).length;
  if (!selectedCount) return 0;
  return selectedCount === filteredAvailableUsers.value.length ? 1 : -1;
});
const toggleSelectAll = () => {
  const visibleUsers = filteredAvailableUsers.value;
  const visibleIds = new Set(visibleUsers.map((user) => user.id));
  const selectedIds = new Set(selectedUsers.value.map((user) => user.id));
  const allVisibleSelected = visibleUsers.length > 0 && visibleUsers.every((user) => selectedIds.has(user.id));

  if (allVisibleSelected) {
    selectedUsers.value = selectedUsers.value.filter((user) => !visibleIds.has(user.id));
    return;
  }
  const newUsers = visibleUsers.filter((user) => !selectedIds.has(user.id));
  selectedUsers.value = [...selectedUsers.value, ...newUsers.map((user) => toRaw(user))];
};
const selectUser = (user: LearningPlanMemberSimple) => {
  if (existingMembersSet.value.has(user.id)) return;

  const alreadyUser = selectedUsers.value.find((already) => user.id === already.id);
  if (alreadyUser) {
    selectedUsers.value = selectedUsers.value.filter((user) => user.id !== alreadyUser.id);
    return;
  }
  selectedUsers.value = [...selectedUsers.value, toRaw(user)];
};
const getAllStudentsByClass = (classID: number, classesArray: ClassSimple[]) =>
  classesArray.flatMap((classValue) => (classValue.id === classID ? toRaw(classValue.learning_plan_members!) : []));
const getSelectedUsersStatus = (
  classID: number,
  classesArray: ClassSimple[],
  selectedUsers: LearningPlanMemberSimple[],
) => {
  const users = getAllStudentsByClass(classID, classesArray);
  const isSelected = (user: LearningPlanMemberSimple) =>
    existingMembersSet.value.has(user.id) || selectedUsers.find((selectedUser) => user.id === selectedUser.id);
  const unSelectedUsers = users.filter((user) => !isSelected(user));
  if (users.length === unSelectedUsers.length) {
    return 0; // No one selected
  }
  if (!unSelectedUsers.length) {
    return 1; // All selected
  }
  return -1; // has one that is unselected
};
const selectAllUsers = (classID: number, classesArray: ClassSimple[]) => {
  const users = getAllStudentsByClass(classID, classesArray);
  const eligibleUsers = users.filter((user) => !existingMembersSet.value.has(user.id));
  const unSelectedUsers = eligibleUsers.filter(
    (user) => !selectedUsers.value.find((selectedUser) => user.id === selectedUser.id),
  );
  if (!unSelectedUsers.length) {
    selectedUsers.value = selectedUsers.value.filter((user) => user.learning_class?.id !== classID);
    return;
  }
  selectedUsers.value = [...selectedUsers.value, ...unSelectedUsers];
};

const handleSubmit = async () => {
  try {
    loadingAdd.value = true;
    emit('add-click', selectedUsers.value);
    await setTimeout(async () => {
      await refresh();
      loadingAdd.value = false;
    }, 1000);
  } catch (error) {}
};
onMounted(() => {
  execute();
  syncExistingTaskMembers();
});

watch(
  () => props.taskId,
  () => {
    existingTaskMemberIds.value = [];
    syncedTaskId.value = null;
    selectedUsers.value = [];
    syncExistingTaskMembers();
  },
);
</script>

<style lang="scss">
.checkbox input,
.checkbox .v-selection-control__input,
.checkbox .v-selection-control__wrapper {
  height: 30px !important;
  width: 30px !important;
}

.checkbox,
.checkbox .v-input,
.checkbox .v-input__control,
.checkbox .v-selection-control {
  height: 30px !important;
  width: 30px !important;
  min-height: 30px;
  justify-content: center;
  margin-bottom: 0 !important;
}
.select-all-control {
  display: flex;
  align-items: center;
  gap: 0;
  margin-bottom: 10px;
}
.select-all-checkbox {
  flex: 0 0 32px;
  width: 32px;
  max-width: 32px;
  margin: 0;
}
.select-all-checkbox .v-input__control,
.select-all-checkbox .v-selection-control {
  flex: 0 0 32px !important;
  width: 32px !important;
  min-width: 32px !important;
  max-width: 32px !important;
}
.select-all-checkbox .v-selection-control__input,
.select-all-checkbox .v-selection-control__wrapper {
  width: 32px !important;
  min-width: 32px !important;
  max-width: 32px !important;
}
.select-all-label {
  cursor: pointer;
  line-height: 1.25;
  margin-left: 4px;
  margin-left: 0;
}
.task-student-card {
  box-shadow: none !important;
  border-radius: 8px;
  .v-theme--mainTheme {
    --v-border-opacity: unset !important;
  }

  .v-expansion-panel,
  .v-expansion-panel .v-expansion-panel--active {
    padding: 0 !important;
    margin-top: 8px;
    border: solid 1px rgb(var(--v-theme-gray-100)) !important;
    border-top-left-radius: 8px !important;
    border-top-right-radius: 8px !important;
    border-bottom-left-radius: 8px !important;
    border-bottom-right-radius: 8px !important;
  }
  .v-expansion-panel:not(.v-expansion-panel--active):hover {
    border: solid 1px rgb(var(--v-theme-gray-500)) !important;
  }
  .v-expansion-panel:not(:first-child)::after {
    display: none !important;
  }

  &.group .v-expansion-panel-text__wrapper {
    background-color: rgb(var(--v-theme-gray-blue));
    padding: 8px !important;
  }
  .v-expansion-panel-text__wrapper {
    padding: 0px !important;
  }

  .v-expansion-panel-title {
    display: flex;
    transition: all 0.3s ease;
    height: 56px !important;
    align-items: center;
    gap: 8px;
    width: 100%;
    padding: 16px;
    background-color: transparent !important;
    border-radius: 8px !important;
  }

  .v-expansion-panel-title__overlay {
    display: none;
  }

  // .v-expansion-panel-title {
  //   // display: flex !important;
  //   // justify-content: space-between !important;
  // }

  .v-expansion-panel-title--active {
    background-color: #fff !important;
    height: 60px !important;
    min-height: 60px !important;
  }

  .v-expansion-panel-title:hover:not(:has(.delete-btn:hover)) {
    background-color: #fff !important;
    border-radius: 8px;
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
  &.v-expansion-panels:not(.v-expansion-panels--variant-accordion)
    > :last-child:not(:first-child):not(.v-expansion-panel--active),
  &.v-expansion-panels:not(.v-expansion-panels--variant-accordion)
    > :first-child:not(:last-child):not(.v-expansion-panel--active),
  &.v-expansion-panels:not(.v-expansion-panels--variant-accordion)
    > :not(:first-child):not(:last-child):not(.v-expansion-panel--active) {
    border-top-left-radius: 8px !important;
    border-top-right-radius: 8px !important;
    border-bottom-left-radius: 8px !important;
    border-bottom-right-radius: 8px !important;
  }
}
</style>
