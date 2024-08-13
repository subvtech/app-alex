<template>
  <alex-custom-dialog
    v-model="model"
    title="Adicionar Participantes"
    main-button-text="Convidar"
    secondary-button-text="Cancelar"
    @on-main-action="onInvite"
    @on-secondary-action="onCancel"
  >
    <alex-custom-tabs
      v-if="learningplanIds.length"
      v-model="activePage"
      :tabs="tabs"
    />
    <alex-inputs-text-field
      v-if="activePage === '1'"
      v-model="searchStudents"
      name="search"
      placeholder="Buscar Participantes"
      class="tw-w-full my-6"
      density="comfortable"
      prepend-inner-icon="mdi-magnify"
      hide-details
      clearable
    />
    <alex-inputs-text-field
      v-if="activePage === '2'"
      v-model="searchGroups"
      name="search"
      placeholder="Buscar Grupos"
      class="tw-w-full my-6"
      density="comfortable"
      prepend-inner-icon="mdi-magnify"
      hide-details
      clearable
    />
    <v-window v-model="activePage">
      <v-window-item value="1">
        <v-expansion-panels multiple>
          <v-expansion-panels class="task-student-card" multiple>
            <p
              v-if="!hasStudentsToAdd"
              class="text-body-1 text-gray-400 text-center"
            >
              Não foram encontrados alunos para adicionar.
            </p>
            <template
              v-for="classValue in filteredClasses"
              :key="classValue.id"
            >
              <v-expansion-panel v-if="classValue.members?.length">
                <v-expansion-panel-title
                  class="justify-start align-center ga-3"
                >
                  <alex-inputs-checkbox
                    :model-value="
                      !!getSelectedUsersStatus(
                        classValue.id,
                        filteredClasses,
                        selectedUsers,
                      )
                    "
                    :indeterminate="
                      getSelectedUsersStatus(
                        classValue.id,
                        filteredClasses,
                        selectedUsers,
                      ) === -1
                    "
                    class="checkbox"
                    @click.stop="
                      selectClass(
                        classValue.members,
                        getSelectedUsersStatus(
                          classValue.id,
                          filteredClasses,
                          selectedUsers,
                        ),
                      )
                    "
                  />
                  <span class="text-body-2 text-gray-900">
                    {{ classValue.name }}
                  </span>
                  <span class="text-body-3 text-gray-500 mr-auto">
                    {{ classValue.learningplan }}
                  </span>
                </v-expansion-panel-title>
                <v-expansion-panel-text>
                  <v-slide-y-transition group hide-on-leave>
                    <alex-custom-list-item-user
                      v-for="member in classValue.members"
                      :key="member.id"
                      :user="{
                        name: member.user.fullname,
                        email: member.user.email,
                        image: member.user.avatar?.formats.small.url,
                      }"
                      no-chip
                      :is-selected-value="
                        !!selectedUsers.find(
                          (projectUser) =>
                            projectUser.user.id === member.user.id,
                        )
                      "
                      @click.stop="selectUser(member)"
                    />
                  </v-slide-y-transition>
                </v-expansion-panel-text>
              </v-expansion-panel>
            </template>
          </v-expansion-panels>
        </v-expansion-panels>
      </v-window-item>
      <v-window-item value="2">
        <v-expansion-panels multiple>
          <v-expansion-panels class="task-student-card" multiple>
            <p
              v-if="!hasGroupsToAdd"
              class="text-body-1 text-gray-400 text-center"
            >
              Não foram encontrados grupos para adicionar.
            </p>
            <template v-for="classValue in filteredGroups" :key="classValue.id">
              <v-expansion-panel v-if="classValue.groups?.length">
                <v-expansion-panel-title
                  class="justify-start align-center ga-3"
                >
                  <span class="text-body-2 text-gray-900">
                    {{ classValue.name }}
                  </span>
                  <span class="text-body-3 text-gray-500 mr-auto">
                    {{ classValue.learningplan }}
                  </span>
                </v-expansion-panel-title>
                <v-expansion-panel-text>
                  <div class="bg-gray-blue pa-2 d-flex tw-flex-col tw-gap-2">
                    <alex-learningplan-task-dialog-add-group-card
                      v-for="group in classValue.groups"
                      :key="group.id"
                      :group="group"
                      :is-added="isGroupAdded(group)"
                      @add-members="addStudentsFromGroups"
                    />
                    <p v-if="!classValue.groups?.length" class="text-gray-500">
                      Não foram encontrados grupos para adicionar.
                    </p>
                  </div>
                </v-expansion-panel-text>
              </v-expansion-panel>
            </template>
          </v-expansion-panels>
        </v-expansion-panels>
      </v-window-item>
      <v-window-item value="3">
        <alex-inputs-users-autocomplete
          v-model="autoCompleteUsers"
          :ignore-user-ids="selectedUsers.map((user) => user.user.id)"
          :ignore-emails="selectedUsers.map((user) => user.user.email)"
          :no-data-text="$t('components.usersAutocomplete.searchUserToCourse')"
          name="selectUsers"
        />
      </v-window-item>
    </v-window>
  </alex-custom-dialog>
</template>

<script setup lang="ts">
import { User } from '@/components/alex/inputs/UsersAutocomplete.vue';

interface classItem {
  id: number;
  name: string;
  learningplan: string;
  members: LearningPlanMemberSimple[];
  groups: LearningPlanGroupSimple[];
}

interface AddProjectMembers {
  learningplanIds: number[];
  selectedStudents: LearningPlanMemberSimple[];
}

const props = defineProps<AddProjectMembers>();

const { find } = useStrapiUtils();

const activePage = ref('1');
const tabs = [
  { label: 'Participantes', value: '1' },
  { label: 'Grupos', value: '2' },
];
const model = defineModel<boolean>({ required: true });
const searchStudents = ref('');
const searchGroups = ref('');
const emit = defineEmits(['invite']);

const autoCompleteUsers = ref<User[]>([]);

const selectedUsers = ref<LearningPlanMemberSimple[]>([
  ...props.selectedStudents,
]);

const { data: classesData } = await useAsyncData(
  'classes',
  () =>
    find<LearningPlanSimple>('learningplans', {
      filters: {
        id: {
          $in: props.learningplanIds,
        },
      },
      populate: [
        'classes.learning_plan_groups.group_members.student_member.user.avatar',
        'classes.learning_plan_members.user.avatar',
      ],
    }),
  {
    default: () => [] as classItem[],
    transform: (value) => {
      return value.data.flatMap((learningplan) => {
        return learningplan.classes.map((classItem) => {
          return {
            id: classItem.id,
            name: classItem.name,
            learningplan: learningplan.title,
            members: classItem.learning_plan_members,
            groups: classItem.learning_plan_groups,
          };
        });
      });
    },
  },
);

const filteredClasses = computed(() => {
  if (!searchStudents.value) return classesData.value;
  const lowerCaseSearch = searchStudents.value.toLowerCase();
  return classesData.value.map((classValue) => ({
    ...classValue,
    members: classValue.members?.filter(
      (member) =>
        member.user.fullname.toLowerCase().includes(lowerCaseSearch) ||
        member.user.email.toLowerCase().includes(lowerCaseSearch),
    ),
  }));
});

const hasStudentsToAdd = computed(
  () =>
    filteredClasses.value.filter(
      (studentClass) => !!studentClass.members?.length,
    ).length > 0,
);

const selectUser = (user: LearningPlanMemberSimple) => {
  selectedUsers.value.find(
    (selectedUser) => selectedUser.user.id === user.user.id,
  )
    ? (selectedUsers.value = selectedUsers.value.filter(
        (selectedUser) => selectedUser.id !== user.id,
      ))
    : (selectedUsers.value = [...selectedUsers.value, user]);
};

const selectClass = (members: LearningPlanMemberSimple[], status: number) => {
  if (status === 0) {
    members.forEach((member) => {
      selectedUsers.value = [...selectedUsers.value, member];
    });
  } else {
    selectedUsers.value = selectedUsers.value.filter(
      (user) => !members.find((member) => member.id === user.id),
    );
  }
};

const getSelectedUsersStatus = (
  classId: number,
  filteredClasses: classItem[],
  selectedUsers: LearningPlanMemberSimple[],
) => {
  const classValue = filteredClasses.find(
    (classValue) => classValue.id === classId,
  );
  if (!classValue) return 0;
  const selectedUsersInClass = selectedUsers.filter((user) =>
    classValue.members.find((member) => member.user.id === user.user.id),
  );
  if (selectedUsersInClass.length === 0) return 0;
  if (selectedUsersInClass.length === classValue.members.length) return 1;
  return -1;
};

const filteredGroups = computed(() => {
  if (!searchGroups.value) return classesData.value;
  const lowerCaseSearch = searchGroups.value.toLowerCase();
  return classesData.value.map((classValue) => ({
    ...classValue,
    groups: classValue.groups?.filter((group: learningPlanGroup) =>
      group.title.toLowerCase().includes(lowerCaseSearch),
    ),
  }));
});

const hasGroupsToAdd = computed(
  () =>
    filteredGroups.value.filter((studentClass) => !!studentClass.groups?.length)
      .length > 0,
);

const addStudentsFromGroups = (group: LearningPlanGroupSimple) => {
  const users: LearningPlanMemberSimple[] = [];
  group.group_members.forEach((member: LearningPlanGroupMemberSimple) => {
    users.push(member.student_member);
  });
  selectedUsers.value = [...selectedUsers.value, ...users];
};

const isGroupAdded = (group: LearningPlanGroupSimple) => {
  return group.group_members.every((member) =>
    selectedUsers.value.find(
      (selectedUser) => selectedUser.user.id === member.student_member.user.id,
    ),
  );
};

const onCancel = () => {
  selectedUsers.value = [];
  searchGroups.value = '';
  searchStudents.value = '';
  model.value = false;
};

const onInvite = () => {
  if (autoCompleteUsers.value.length) {
    const users = autoCompleteUsers.value.map((user) => ({
      user: {
        id: user.id,
        email: user.email,
        fullname: user.fullname || user.email,
        avatar: user.avatar,
      },
    }));

    emit('invite', users);
  } else {
    emit('invite', selectedUsers.value);
  }
  onCancel();
};

onBeforeMount(() => {
  if (!props.learningplanIds.length) {
    activePage.value = '3';
  }
});

watch(
  () => props.selectedStudents,
  () => {
    selectedUsers.value = [...props.selectedStudents];
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
