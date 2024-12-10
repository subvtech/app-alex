<template>
  <v-data-iterator
    :search="search"
    :page="page"
    :items="membersRef"
    :items-per-page="itemsPerPage"
    class="members"
    :filter-keys="[
      'student_member.user.fullname',
      'student_member.user.name',
      'student_member.user.email',
      'student_member.learning_class.name',
      'user.fullname',
      'user.email',
    ]"
    :loading="isLoading"
  >
    <!-- Header -->
    <template v-if="!listGroupMembers" #header>
      <div class="header d-flex tw-align-center py-4 px-2">
        <alex-inputs-text-field
          v-model="search"
          name="member"
          class="w-100 tw-mr-4"
          :placeholder="$t('components.learningPlan.members.search')"
          prepend-inner-icon="mdi-magnify"
          :density="isProject ? 'comfortable' : 'compact'"
          clearable
        />

        <alex-learningplan-task-dialog-add-member
          v-if="!isGroup && isTypeDefined && isTask"
          v-model="addMemberDialog"
          :learningplan-id="props.learningplanIds[0]"
          :members="membersRef"
          @add-click="addMember"
        />
        <alex-learningplan-task-dialog-add-group
          v-else-if="isGroup && isTask"
          v-model="addGroupDialog"
          :learningplan-id="props.learningplanIds[0]"
          :task-id="props.taskId"
          :start-at="startAt"
          :finish-at="finishAt"
          :can-submit-after="props.sendAfterDeadline"
          :task-members="membersRef"
          @add-group="handleAddGroup"
        />
        <alex-learningplan-task-dialog-add-project-members
          v-if="isProject"
          v-model="addProjectMembersDialog"
          :learningplan-ids="props.learningplanIds"
          :selected-students="membersRef"
          @invite="(members) => (membersRef = members)"
        />

        <alex-custom-dropdown :items="typeOptions" :disabled="isTypeDefined || isProject">
          <template #activator="{ props: propsDropdown }">
            <alex-custom-button
              v-bind="propsDropdown"
              class="tw-ml-auto"
              variant="secondary"
              prepend-icon="mdi-plus"
              :size="isProject ? 'large' : 'default'"
              @click="handleAddMemberOrClass"
              >{{ $t('components.learningPlan.members.add.label') }}</alex-custom-button
            >
          </template>
        </alex-custom-dropdown>
      </div>
      <alex-learningplan-task-dialog-create-group
        v-if="isTask"
        v-model="groupDialog"
        :learning-plan-id="props.learningplanIds[0]"
        :task-id="props.taskId"
        :start-at="props.startAt"
        :finish-at="props.finishAt"
        :can-submit-after="props.sendAfterDeadline"
        :classes="classes.data"
        :task-members="membersRef"
        :group="groupInfo"
        @add-group="handleAddGroup"
        @update-group="handleAddGroup"
      />
    </template>
    <!-- Cards -->
    <template #default="{ items }">
      <template v-if="listGroupMembers">
        <template v-for="member in items" :key="`student-member${member.raw.id}`">
          <alex-learningplan-task-members-card
            v-for="groupMember in member.raw.learning_plan_group?.group_members"
            :key="`group-member${groupMember.id}`"
            :member="{
              name: groupMember.student_member.user.fullname,
              class: member.raw.learning_plan_group?.learning_class?.name,
              avatarUrl: groupMember.student_member.user?.avatar?.url,
              responsable: groupMember.role === learningPlanGroupMemberRolesSimple.IN_CHARGE,
            }"
            @to-profile="navigateTo(`/users/${groupMember.student_member.user.username}`)"
        /></template>
      </template>
      <template v-else>
        <alex-learningplan-task-members-card
          v-for="member in items"
          :key="`student-member${member.raw.id}`"
          :member="{
            name:
              member.raw.learning_plan_member?.user?.fullname ||
              member.raw.learning_plan_group?.title ||
              member.raw.user?.fullname,
            class:
              member.raw.learning_plan_member?.learning_class?.name ||
              member.raw.learning_plan_group?.learning_class?.name,
            avatarUrl: member.raw.learning_plan_member?.user?.avatar?.url || member.raw.user?.avatar?.url,
            group: !!member.raw.learning_plan_group,
            participants: member.raw.learning_plan_group
              ? getMembersOfGroup(member.raw.learning_plan_group)
              : undefined,
          }"
          :edit="edit"
          :clickable="!isProject"
          :no-class="isProject"
          @remove-click="
            member.raw.learning_plan_member
              ? removeMember(
                  member.raw.learning_plan_member.user.email,
                  member.raw.id,
                  member.raw.learning_plan_member.user.fullname,
                )
              : removeMember(undefined, member.raw.id, member.raw.learning_plan_group?.title)
          "
          @edit-click="() => handleEditClick(member.raw.learning_plan_group, items)"
          @to-profile="
            member.raw.learning_plan_member
              ? navigateTo(`/users/${member.raw.learning_plan_member.user.username}`)
              : undefined
          "
        />
      </template>
      <template v-else>
        <template v-for="member in items" :key="`student-member${member.raw.id}`">
          <alex-learningplan-task-members-card
            v-for="groupMember in member.raw.learning_plan_group.group_members"
            :key="`group-member${groupMember.id}`"
            :member="{
              name: groupMember.student_member.user.fullname,
              class: member.raw.learning_plan_group?.learning_class.name,
              avatarUrl: groupMember.student_member.user?.avatar?.url,
              responsable: groupMember.role === 'in_charge',
            }"
            :edit="false"
            @to-profile="navigateTo(`/users/${groupMember.student_member.user.username}`)"
        /></template>
      </template>
    </template>
    <template #no-data>
      <div class="d-flex align-center justify-center flex-column ga-4 text-center">
        <img
          class="no-members-svg"
          src="public/svg/no-members.svg"
          :alt="$t('components.learningPlan.members.missing.member')"
          role="no-members"
        />
        <p class="text-body-3 text-gray-400">
          {{ $t('components.learningPlan.members.missing.member') }}
        </p>
      </div>
    </template>
    <template #loader>
      <div class="tw-flex tw-items-center tw-justify-center">
        <v-progress-circular color="secondary-0" indeterminate></v-progress-circular>
      </div>
    </template>
    <template #footer="{ pageCount, groupedItems }">
      <div v-if="groupedItems.length && membersRef.length > itemsPerPage" class="d-flex align-center ga-2 pa-6">
        <span class="flex-1-1">
          {{ showingData(membersRef, groupedItems as any[], search, pageCount) }}
        </span>
        <alex-custom-pagination v-model="page" :length="pageCount" :total-visible="3" class="extra-mb" />
      </div>
    </template>
  </v-data-iterator>
</template>

<script setup lang="ts">
import type { AlexDropdownItem } from '~/components/alex/custom/Dropdown.vue';

interface MembersProps {
  listGroupMembers?: boolean;
  type?: TaskType | null;
  startAt?: string | null;
  finishAt?: string | null;
  sendAfterDeadline?: boolean;
  blockDelete?: boolean;
  edit?: boolean;
  members: TaskMember[];
  isProject?: boolean;
  taskId?: number;
  learningplanIds?: number[];
}

const props = withDefaults(defineProps<MembersProps>(), {
  sendAfterDeadline: false,
  startAt: null,
  finishAt: null,
  type: null,
  blockDelete: false,
  isProject: false,
  edit: true,
  listGroupMembers: false,
  taskId: 0,
  learningplanIds: () => [0],
  members: () => [],
});
const { members: membersRef } = toRefs(props);

type Emits = {
  'change-members': [];
  'set-members': [value: TaskMember[]];
  'set-type': [value: TaskType];
};

const strapiUtils = useStrapiUtils();
const strapi = useStrapi();
const { setMessage } = useMessageStore();
const { t } = useI18n();

const emit = defineEmits<Emits>();

const isLoading = ref(false);
const addMemberDialog = ref(false);
const addGroupDialog = ref(false);
const addProjectMembersDialog = ref(false);
const groupDialog = ref<boolean>(false);
const groupInfo = ref<LearningPlanGroupSimple | undefined>(undefined);
const allGroups = ref<LearningPlanGroupSimple[]>([]);
const setTypeDropdown = ref<boolean>(false);
const page = ref<number>(1);
const itemsPerPage = 12;
const search = ref('');
const client = useStrapiClient();
const typeOptions: AlexDropdownItem[] = [
  {
    text: t('components.learningPlan.drawer.task.type.individual'),
    onClick: () => {
      emit('set-type', 'individual');
      if (checkHasFilledDates.value) {
        addMemberDialog.value = true;
      }
    },
  },
  {
    text: t('components.learningPlan.drawer.task.type.collective'),
    onClick: () => {
      emit('set-type', 'group');
      if (checkHasFilledDates.value) {
        addGroupDialog.value = true;
      }
    },
  },
];

const handleAddGroup = async () => {
  emit('change-members');
  await fetchTaskMembers();
};

const checkHasFilledDates = computed(() => {
  const result = !!props.startAt && !!props.finishAt;
  if (!result) setMessage(t('components.learningPlan.drawer.task.pleaseFillDates'), 'warning', true);
  return result;
});

const isTask = computed(() => !props.isProject);
const isGroup = computed(() => props.type === 'group');
const isTypeDefined = computed(() => props.type !== null);

const getMembers = () =>
  strapiUtils.find<TaskMember>('task-members', {
    populate: {
      task_submissions: {
        populate: ['justification'],
      },
      learning_plan_member: {
        populate: ['user.avatar', 'learning_class'],
      },
      learning_plan_group: {
        populate: {
          group_members: {
            populate: ['student_member.user.avatar'],
          },
          learning_class: true,
        },
      },
    },
    filters: {
      task: props.taskId,
    },
  });

const showingData = (items: any[], pageItems: any[], search: string, pageCount: number) => {
  const itemsPerPageCalc = search ? itemsPerPage : pageItems.length;
  const range = pageItems.length < itemsPerPage ? 2 : 1;
  const from = itemsPerPageCalc === 1 ? items.length : (page.value - 1) * itemsPerPageCalc + range;
  const to = page.value === pageCount ? items.length : page.value * itemsPerPageCalc;
  const total = items.length;
  const message = t('pages.courses.showingData', {
    from,
    to,
    total,
    entity: t('components.learningPlan.drawer.members'),
  });

  return message;
};

const fetchTaskMembers = async () => {
  const temp = await getMembers();
  membersRef.value = temp.data;
};
const addMember = async (members: LearningPlanMemberSimple[]) => {
  if (!props.type) {
    setMessage(t('components.learningPlan.drawer.task.pleaseFillType'), 'warning', true);
    return;
  }
  if (!checkHasFilledDates.value) return;
  try {
    isLoading.value = true;
    await client(`/tasks/${props.taskId}/add-students`, {
      method: 'PUT',
      body: {
        students: members,
      },
      onResponse(context) {
        const data: TaskMemberStudent[] = context.response._data;
        if (!data.length) {
          setMessage(t('components.learningPlan.drawer.task.members.allSelectedMembers'), 'warning', true);
          return;
        }
        setMessage(t('components.learningPlan.drawer.task.members.addMembers'), 'success', true);
        setTimeout(fetchTaskMembers, 100);
        emit('change-members');
      },
    });
  } catch (error) {
    setMessage(t('components.learningPlan.drawer.task.errors.addMember'), 'error', true);
  } finally {
    isLoading.value = false;
  }
};

const removeMember = async (memberEmail: string | undefined, memberId: number, memberName?: string) => {
  try {
    if (props.blockDelete && isTask.value) {
      setMessage(t('components.learningPlan.drawer.task.status.remove.forbidden'), 'warning', true);
      return;
    }
    isLoading.value = true;

    await strapi.delete('task-members', memberId);
    membersRef.value = [
      ...membersRef.value.filter((student) => {
        return (
          student.learning_plan_member &&
          (student.learning_plan_member?.user.id !== memberId ||
            student.learning_plan_member?.user.email !== memberEmail)
        );
      }),
    ];
    // setTimeout(fetchTaskMembers, 100);
    setMessage(
      t('components.learningPlan.drawer.task.removeMember', {
        member: memberName,
      }),
      'success',
      true,
    );
    emit('change-members');
  } catch (error) {
    setMessage(t('components.learningPlan.drawer.task.errors.removeMember'), 'error', true);
  } finally {
    isLoading.value = false;
  }
};

const getMembersOfGroup = (group: LearningPlanGroupSimple) =>
  group.group_members.map((member) => ({
    name: member.student_member.user.fullname,
    image: { url: member.student_member.user?.avatar?.url || '' },
    className: 'text-body-3',
  }));

const handleEditClick = (
  selectedGroup: LearningPlanGroupSimple | undefined,
  taskMembers: { raw: TaskMember }[] | any,
) => {
  if (!selectedGroup) {
    setMessage(t('components.learningPlan.drawer.task.dialog.message.hasSubmission'), 'warning', true);
    return;
  }
  // Checks if there is a submission
  const selectedTaskMember = taskMembers.find((member) => member.raw.learning_plan_group?.id === selectedGroup.id);

  if (selectedTaskMember?.raw.task_submissions?.length) {
    setMessage(t('components.learningPlan.drawer.task.dialog.message.hasSubmission'), 'warning', true);
    return;
  }

  // Atualiza os dados para abrir o modal
  groupInfo.value = selectedGroup;
  allGroups.value = taskMembers.map((member) => member.raw.learning_plan_group!);

  groupDialog.value = true;
};
const handleAddMemberOrClass = () => {
  if (props.isProject) {
    addProjectMembersDialog.value = props.isProject;
  }
  if (!props.type || !checkHasFilledDates.value) {
    setTypeDropdown.value = true;
  } else if (isGroup.value) {
    addGroupDialog.value = true;
  } else {
    addMemberDialog.value = true;
  }
};
const getGroups = (learningplanId: number) =>
  strapiUtils.find<ClassSimple>('classes', {
    populate: [
      'learning_plan_groups.group_members.student_member.user.avatar',
      'learning_plan_groups.learning_class',
      'learning_plan_members',
      'learning_plan_members.user.fullname',
      'learning_plan_members.user.avatar',
    ],
    filters: {
      learningplan: learningplanId,
    },
  });
const { data: classes } = await useAsyncData('classes-member-invite', () => getGroups(props.learningplanIds[0]), {
  default: () => ({ meta: 0, data: [] as ClassSimple[] }),
});

watch(
  membersRef,
  () => {
    isLoading.value = true;
    emit('set-members', membersRef.value);
    isLoading.value = false;
  },
  { deep: true },
);

watch(
  () => props.taskId,
  async () => {
    await fetchTaskMembers();
  },
);

watch(addGroupDialog, async (value) => {
  if (value) return;
  await fetchTaskMembers();
});
</script>

<style>
.no-members-svg {
  opacity: 0.6;
  mix-blend-mode: luminosity;
  width: 150px;
  height: 111.829px;
}
.members .v-input__details {
  display: none !important;
}
.add-member-enter-active {
  transition: all 0.5s ease-in-out;
}
.add-member-enter-from,
.add-member-leave-to {
  opacity: 0;
}
</style>
