<template>
  <alex-custom-dialog
    v-model="model"
    title="Adicionar integrantes"
    main-button-text="Adicionar"
    @on-main-action="handleSubmit"
  >
    <template #activator="{ isActive, props: activatorProps }">
      <slot name="activator" :is-active="isActive" :props="activatorProps" />
    </template>
    <alex-inputs-text-field
      v-model="search"
      name="search"
      class="mb-6"
      placeholder="Buscar participantes do curso"
      prepend-inner-icon="mdi-magnify"
      density="comfortable"
      hide-details
    />
    <v-expansion-panels class="task-student-card" multiple>
      <template v-for="classValue in filteredClasses" :key="classValue.id">
        <v-expansion-panel v-if="classValue.learning_plan_members?.length">
          <v-expansion-panel-title
            ><alex-inputs-checkbox
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
              @click.stop="selectAllUsers(classValue.id, classes.data)"
            />
            <p class="text-body-2 w-full text-gray-900">
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
                  image: member.user?.avatar?.formats.small.url,
                }"
                no-chip
                :is-selected-value="
                  !!selectedUsers.find((user) => user.id === member.id)
                "
                @click.stop="selectUser(member)"
              />
            </v-slide-y-transition>
          </v-expansion-panel-text>
        </v-expansion-panel>
      </template>
    </v-expansion-panels>
  </alex-custom-dialog>
</template>

<script setup lang="ts">
interface AddStudent {
  learningplanId: number;
  members: TaskMemberStudent[];
}
const model = defineModel<boolean>();
const props = defineProps<AddStudent>();
type Emits = {
  'add-click': [members: LearningPlanMemberSimple[]];
};
const emit = defineEmits<Emits>();
const strapi = useStrapiUtils();
const search = ref('');
const membersID = computed(() =>
  props.members.map((member) => member.student_member.id),
);
const getMembers = (learningplanId: number) =>
  strapi.find<ClassSimple>('classes', {
    populate: {
      learning_plan_members: {
        populate: {
          user: {
            populate: ['avatar'],
          },
          learning_class: {
            fields: ['id'],
          },
        },
        filters: {
          id: {
            $notIn: membersID.value,
          },
        },
      },
    },
    filters: { learningplan: learningplanId },
  });
const selectedUsers = ref<LearningPlanMemberSimple[]>([]);

const {
  data: classes,
  execute,
  refresh,
} = await useAsyncData(
  'classes-member-invite',
  () => getMembers(props.learningplanId),
  {
    default: () => ({ meta: 0, data: [] as ClassSimple[] }),
    lazy: true,
  },
);
const filteredClasses = computed(() => {
  if (!search.value) return classes.value.data;
  const lowerCaseSearch = search.value.toLowerCase();
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
const selectUser = (user: LearningPlanMemberSimple) => {
  const alreadyUser = selectedUsers.value.find(
    (already) => user.id === already.id,
  );
  if (alreadyUser) {
    selectedUsers.value = selectedUsers.value.filter(
      (user) => user.id !== alreadyUser.id,
    );
    return;
  }
  selectedUsers.value = [...selectedUsers.value, toRaw(user)];
};
const getAllStudentsByClass = (classID: number, classesArray: ClassSimple[]) =>
  classesArray.flatMap((classValue) =>
    classValue.id === classID ? toRaw(classValue.learning_plan_members!) : [],
  );
const getSelectedUsersStatus = (
  classID: number,
  classesArray: ClassSimple[],
  selectedUsers: LearningPlanMemberSimple[],
) => {
  const users = getAllStudentsByClass(classID, classesArray);
  const unSelectedUsers = users.filter(
    (user) =>
      !selectedUsers.find((selectedUser) => user.id === selectedUser.id),
  );
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
  const unSelectedUsers = users.filter(
    (user) =>
      !selectedUsers.value.find((selectedUser) => user.id === selectedUser.id),
  );
  if (!unSelectedUsers.length) {
    selectedUsers.value = selectedUsers.value.filter(
      (user) => user.learning_class?.id !== classID,
    );
    return;
  }
  selectedUsers.value = [...selectedUsers.value, ...users];
};

const handleSubmit = () => {
  emit('add-click', selectedUsers.value);
  setTimeout(() => {
    refresh();
  }, 1000);
};
watch(model, (value) => {
  if (value) {
    selectedUsers.value = [];
    execute();
  }
});
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
