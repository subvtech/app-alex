<template>
  <v-data-iterator
    :search="search"
    :page="page"
    :items="members.data"
    :items-per-page="itemsPerPage"
    class="members"
    :filter-keys="[
      'student_member.user.fullname',
      'student_member.user.name',
      'student_member.user.email',
      'student_member.learning_class.name',
    ]"
    :loading="true"
  >
    <!-- Header -->
    <template #header>
      <div class="header d-flex align-center py-4 px-2">
        <alex-inputs-text-field
          v-model="search"
          name="member"
          class="w-100 mr-4"
          :placeholder="$t('components.learningPlan.members.search')"
          prepend-inner-icon="mdi-magnify"
          density="compact"
          clearable
        />

        <alex-learningplan-task-dialog-add-member
          v-if="type === 'individual'"
          v-model="addMemberDialog"
          :learningplan-id="props.learningplanId"
          :members="members.data"
          @add-click="addMember"
        />
        <alex-learningplan-task-dialog-add-group
          v-else
          v-model="addGroupDialog"
          :learningplan-id="props.learningplanId"
        />
        <alex-custom-button
          class="ml-auto"
          variant="secondary"
          prepend-icon="mdi-plus"
          @click="handleAddMemberOrClass"
          >{{
            $t('components.learningPlan.members.add.label')
          }}</alex-custom-button
        >
      </div>
    </template>
    <!-- Cards -->
    <template #default="{ items }">
      <alex-learningplan-task-members-card
        v-for="member in items"
        :key="`student-member${member.raw.id}`"
        :member="{
          name: member.raw.student_member?.user.fullname,
          class: member.raw.student_member?.learning_class?.name,
          avatarUrl: member.raw.student_member?.user.avatar?.url,
        }"
        @remove-click="removeMember(member.raw.task_member.id, member.raw)"
        @to-profile="
          navigateTo(`/users/${member.raw.student_member.user.username}`)
        "
      />
    </template>
    <template #no-data>
      <div
        class="d-flex align-center justify-center flex-column ga-4 text-center"
      >
        <img
          class="no-members-svg"
          src="/svg/no-members.svg"
          :alt="$t('components.learningPlan.members.missing.member')"
          role="no-members"
        />
        <p class="text-body-3 text-gray-400">
          {{ $t('components.learningPlan.members.missing.member') }}
        </p>
      </div>
    </template>

    <template #footer="{ pageCount, groupedItems }">
      <div
        v-if="groupedItems.length && members.data.length > itemsPerPage"
        class="d-flex align-center ga-2 pa-6"
      >
        <span class="flex-1-1">
          {{
            showingData(members.data, groupedItems as any[], search, pageCount)
          }}
        </span>
        <alex-custom-pagination
          v-model="page"
          :length="pageCount"
          :total-visible="3"
          class="extra-mb"
        />
      </div>
    </template>
  </v-data-iterator>
</template>

<script setup lang="ts">
interface MembersProps {
  learningplanId: number;
  taskId: number;
  type?: TaskType | null;
  startAt?: string | null;
  finishAt?: string | null;
  sendAfterDeadline?: boolean;
  blockDelete?: boolean;
}
const props = withDefaults(defineProps<MembersProps>(), {
  sendAfterDeadline: false,
  startAt: null,
  finishAt: null,
  type: null,
  blockDelete: false,
});
const strapiUtils = useStrapiUtils();
const strapi = useStrapi();
const { setMessage } = useMessageStore();
const { t } = useI18n();
const emit = defineEmits(['change-members']);
const addMemberDialog = ref(false);
const addGroupDialog = ref(false);
const page = ref<number>(1);
const itemsPerPage = 12;
const search = ref('');
const client = useStrapiClient();
const getMembers = (taskId: number) =>
  strapiUtils.find<TaskMemberStudent>('task-member-students', {
    populate: {
      student_member: {
        populate: ['user.avatar', 'learning_class'],
      },
      task_member: true,
    },
    filters: {
      task_member: {
        task: taskId,
      },
    },
  });
const showingData = (
  items: any[],
  pageItems: any[],
  search: string,
  pageCount: number,
) => {
  const itemsPerPageCalc = search ? itemsPerPage : pageItems.length;
  const range = pageItems.length < itemsPerPage ? 2 : 1;
  const from =
    itemsPerPageCalc === 1
      ? items.length
      : (page.value - 1) * itemsPerPageCalc + range;
  const to =
    page.value === pageCount ? items.length : page.value * itemsPerPageCalc;
  const total = items.length;
  const message = t('pages.courses.showingData', {
    from,
    to,
    total,
    entity: t('components.learningPlan.drawer.students'),
  });

  return message;
};
const { data: members, refresh } = await useAsyncData(
  'task-members-students',
  () => getMembers(props.taskId),
  {
    default: () => ({
      meta: { total: 0 },
      data: [] as TaskMemberStudent[],
    }),
  },
);
const addMember = async (members: LearningPlanMemberSimple[]) => {
  if (!props.type) {
    setMessage(
      t('components.learningPlan.drawer.task.pleaseFillType'),
      'warning',
      true,
    );
    return;
  }
  if (!props.finishAt || !props.startAt) {
    setMessage(
      t('components.learningPlan.drawer.task.pleaseFillDates'),
      'warning',
      true,
    );
    return;
  }
  try {
    await client(`/tasks/${props.taskId}/add-students`, {
      method: 'PUT',
      body: {
        students: members,
      },
      onResponse(context) {
        const data: TaskMemberStudent[] = context.response._data;
        if (!data.length) {
          setMessage(
            t('components.learningPlan.drawer.task.members.allSelectedMembers'),
            'warning',
            true,
          );
          return;
        }
        setMessage(
          t('components.learningPlan.drawer.task.members.addMembers'),
          'success',
          true,
        );
        setTimeout(refresh, 100);
        emit('change-members');
      },
    });
  } catch (error) {
    setMessage(
      t('components.learningPlan.drawer.task.errors.addMember'),
      'error',
      true,
    );
  }
};
const removeMember = async (
  taskMemberID: number,
  member: TaskMemberStudent,
) => {
  try {
    if (props.blockDelete) {
      setMessage(
        t('Você não pode remover alunos após alguém ter feito uma entrega'),
        'warning',
        true,
      );
      return;
    }
    await strapi.delete('task-members', taskMemberID);
    await strapi.delete('task-member-students', member.id);
    setTimeout(refresh, 100);
    setMessage(
      t('components.learningPlan.drawer.task.removeMember', {
        member: member.student_member?.user?.fullname,
      }),
      'success',
      true,
    );
    emit('change-members');
  } catch (error) {
    setMessage(
      t('components.learningPlan.drawer.task.errors.removeMember'),
      'error',
      true,
    );
  }
};
const handleAddMemberOrClass = () => {
  if (props.type === 'individual') {
    addMemberDialog.value = true;
    return;
  }
  addGroupDialog.value = true;
};
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
