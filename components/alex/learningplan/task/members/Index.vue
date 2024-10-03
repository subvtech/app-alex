<template>
  <v-data-iterator
    :search="search"
    :page="page"
    :items="kind === 'project' ? projectStudents : members.data"
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
    :loading="true"
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
          :density="kind === 'project' ? 'comfortable' : 'compact'"
          clearable
        />

        <alex-learningplan-task-dialog-add-member
          v-if="type === 'individual' && kind === 'task'"
          v-model="addMemberDialog"
          :learningplan-id="props.learningplanId"
          :members="members.data"
          @add-click="addMember"
        />
        <alex-learningplan-task-dialog-add-group
          v-else-if="type === 'group' && kind === 'task'"
          v-model="addGroupDialog"
          :learningplan-id="props.learningplanId"
          :task-id="props.taskId"
          :start-at="startAt"
          :finish-at="finishAt"
          :can-submit-after="props.sendAfterDeadline"
          :task-members="members.data"
          @add-group="handleAddGroup"
        />
        <alex-learningplan-task-dialog-add-project-members
          v-if="kind === 'project'"
          v-model="addProjectMembersDialog"
          :learningplan-ids="props.learningplanIds"
          :selected-students="projectStudents"
          @invite="(members) => (projectStudents = members)"
        />

        <alex-custom-dropdown :items="typeOptions" :disabled="!!type || kind === 'project'">
          <template #activator="{ props: propsDropdown }">
            <alex-custom-button
              v-bind="propsDropdown"
              class="tw-ml-auto"
              variant="secondary"
              prepend-icon="mdi-plus"
              :size="kind === 'project' ? 'large' : 'default'"
              @click="handleAddMemberOrClass"
              >{{ $t('components.learningPlan.members.add.label') }}</alex-custom-button
            >
          </template>
        </alex-custom-dropdown>
      </div>
      <alex-learningplan-task-dialog-create-group
        v-if="kind === 'task'"
        v-model="groupDialog"
        :learning-plan-id="props.learningplanId"
        :task-id="props.taskId"
        :start-at="props.startAt"
        :finish-at="props.finishAt"
        :can-submit-after="props.sendAfterDeadline"
        :classes="classes.data"
        :task-members="members.data"
        :group="groupInfo"
        @add-group="handleAddGroup"
        @update-group="handleAddGroup"
      />
    </template>
    <!-- Cards -->
    <template #default="{ items }">
      <template v-if="!listGroupMembers">
        <alex-learningplan-task-members-card
          v-for="member in items"
          :key="`student-member${member.raw.id}`"
          :member="{
            name:
              member.raw.learning_plan_member?.user.fullname ||
              member.raw.learning_plan_group?.title ||
              member.raw.user.fullname,
            class:
              member.raw.learning_plan_member?.learning_class?.name ||
              member.raw.learning_plan_group?.learning_class.name,
            avatarUrl: member.raw.learning_plan_member?.user?.avatar?.url || member.raw.user?.avatar?.url,
            group: !!member.raw.learning_plan_group,
            participants: member.raw.learning_plan_group
              ? getMembersOfGroup(member.raw.learning_plan_group)
              : undefined,
          }"
          :edit="edit"
          :clickable="kind !== 'project'"
          :no-class="kind === 'project'"
          @remove-click="removeMember(member.raw)"
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

    <template #footer="{ pageCount, groupedItems }">
      <div v-if="groupedItems.length && members.data.length > itemsPerPage" class="d-flex align-center ga-2 pa-6">
        <span class="flex-1-1">
          {{ showingData(members.data, groupedItems as any[], search, pageCount) }}
        </span>
        <alex-custom-pagination v-model="page" :length="pageCount" :total-visible="3" class="extra-mb" />
      </div>
    </template>
  </v-data-iterator>
</template>

<script setup lang="ts">
import { AlexDropdownItem } from '~/components/alex/custom/Dropdown.vue';

interface MembersProps {
  listGroupMembers?: boolean;
  type?: TaskType | null;
  startAt?: string | null;
  finishAt?: string | null;
  sendAfterDeadline?: boolean;
  blockDelete?: boolean;
  edit?: boolean;
}

interface TaskMemberProps {
  learningplanId: number;
  taskId: number;
  kind: 'task';
}
interface ProjectMemberProps {
  learningplanIds: number[];
  students: LearningPlanMemberSimple[];
  kind: 'project';
}

type TaskPropsType = MembersProps & TaskMemberProps;
type ProjectPropsType = MembersProps & ProjectMemberProps;

type PropsType = TaskPropsType | ProjectPropsType;

const props = withDefaults(defineProps<PropsType>(), {
  sendAfterDeadline: false,
  startAt: null,
  finishAt: null,
  type: null,
  blockDelete: false,
  edit: true,
  listGroupMembers: false,
  taskId: 0,
  learningplanId: 0,
  kind: 'task',
  learningplanIds: () => [],
  students: () => [],
});

const projectStudents = ref<LearningPlanMemberSimple[]>([...props.students]);

type Emits = {
  'change-members': [];
  'set-members': [value: LearningPlanMemberSimple[]];
  'set-type': [value: TaskType];
};

watch(
  () => projectStudents.value,
  () => {
    emit('set-members', projectStudents.value);
  },
);

const strapiUtils = useStrapiUtils();
const strapi = useStrapi();
const { setMessage } = useMessageStore();
const { t } = useI18n();
const emit = defineEmits<Emits>();
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
      if (props.startAt && props.finishAt) {
        addMemberDialog.value = true;
      }
    },
  },
  {
    text: t('components.learningPlan.drawer.task.type.collective'),
    onClick: () => {
      emit('set-type', 'group');
      if (props.startAt && props.finishAt) {
        addGroupDialog.value = true;
      }
    },
  },
];

const handleAddGroup = () => {
  emit('change-members');
  refresh();
};

const checkHasFilledDates = () => {
  if (!props.startAt || !props.finishAt) {
    setMessage(t('components.learningPlan.drawer.task.pleaseFillDates'), 'warning', true);
    return false;
  }
  return true;
};
const getMembers = (taskId: number) =>
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
      task: taskId,
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
    entity: t('components.learningPlan.drawer.students'),
  });

  return message;
};

const { data: members, refresh } = await useAsyncData('task-members', () => getMembers(props.taskId), {
  default: () => ({
    meta: { total: 0 },
    data: [] as TaskMember[],
  }),
});
const addMember = async (members: LearningPlanMemberSimple[]) => {
  if (!props.type) {
    setMessage(t('components.learningPlan.drawer.task.pleaseFillType'), 'warning', true);
    return;
  }
  if (!checkHasFilledDates()) return;
  try {
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
        setTimeout(refresh, 100);
        emit('change-members');
      },
    });
  } catch (error) {
    setMessage(t('components.learningPlan.drawer.task.errors.addMember'), 'error', true);
  }
};
const removeMember = async (member) => {
  if (props.kind === 'project') {
    const indexOf = projectStudents.value.findIndex(
      (student) => student.user.id === member.user.id || student.user.email === member.user.email,
    );
    projectStudents.value.splice(indexOf, 1);
  } else {
    try {
      if (props.blockDelete) {
        setMessage(t('Você não pode remover alunos após alguém ter feito uma entrega'), 'warning', true);
        return;
      }
      const memberName = member.learning_plan_member
        ? member.learning_plan_member?.user?.fullname
        : member.learning_plan_group?.title;
      await strapi.delete('task-members', member.id);
      setTimeout(refresh, 100);
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
    }
  }
};

const getMembersOfGroup = (group: LearningPlanGroupSimple) =>
  group.group_members.map((member) => ({
    name: member.student_member.user.fullname,
    image: { url: member.student_member.user?.avatar?.url || '' },
    className: 'text-body-3',
  }));
const handleEditClick = (selectedGroup: LearningPlanGroupSimple, taskMembers: { raw: TaskMember }[] | any) => {
  // Checa se o grupo tem submissões
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
  if (props.kind === 'project') {
    addProjectMembersDialog.value = true;
  }
  if (!props.type || !checkHasFilledDates()) {
    setTypeDropdown.value = true;
  } else if (props.type === 'group') {
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
const { data: classes } = await useAsyncData('classes-member-invite', () => getGroups(props.learningplanId), {
  default: () => ({ meta: 0, data: [] as ClassSimple[] }),
});

watch(
  () => props.taskId,
  () => {
    refresh();
  },
);

watch(addGroupDialog, (value) => {
  if (!value) {
    refresh();
  }
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
