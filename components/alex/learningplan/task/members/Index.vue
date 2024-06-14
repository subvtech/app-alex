<template>
  <div class="members">
    <!-- Header -->
    <div class="header d-flex align-center py-4 px-2">
      <alex-inputs-text-field
        name="member"
        class="w-50"
        :placeholder="$t('components.learningPlan.members.search')"
        prepend-inner-icon="mdi-magnify"
        density="compact"
        clearable
      />

      <alex-learningplan-task-members-invite
        :learningplan-id="learningplanId"
        @select-member-click="addMember"
      >
        <template #activator="{ menuProps }">
          <alex-custom-button
            v-bind="menuProps"
            class="ml-auto"
            variant="secondary"
            prepend-icon="mdi-plus"
            >{{
              $t('components.learningPlan.members.invite.label')
            }}</alex-custom-button
          >
        </template>
      </alex-learningplan-task-members-invite>
    </div>

    <!-- Cards -->
    <template v-if="members?.data.length">
      <alex-learningplan-task-members-card
        v-for="member in members.data"
        :key="`student-member${member.id}`"
        :member="{
          name: member.student_member?.user.fullname,
          class: member.student_member?.learning_class?.name,
          avatarUrl: member.student_member?.user.avatar?.url,
        }"
        @remove-click="() => removeMember(member.task_member.id, member.id)"
      />
    </template>
    <div
      v-else
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

    <!-- Menu -->
    <div
      v-if="members?.meta.pagination.pageCount > 1"
      class="d-flex align-center ga-2 pa-6"
    >
      <span class="flex-1-1">
        Mostrando do
        {{ members?.meta.pagination.pageCount }} ao {{ totalVisible }} de um
        total de {{ members?.meta.pagination.total }} Alunos</span
      >
      <alex-custom-pagination
        v-model="page"
        :length="members?.meta.pagination.pageCount"
        :total-visible="totalVisible"
        class="extra-mb"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
const page = ref<number>(1);
const totalVisible = 10;
interface MembersProps {
  learningplanId: number;
  taskId: number;
  startAt?: string | null;
  finishAt?: string | null;
  sendAfterDeadline?: boolean;
}
const props = withDefaults(defineProps<MembersProps>(), {
  sendAfterDeadline: false,
  startAt: null,
  finishAt: null,
});
const strapiUtils = useStrapiUtils();
const strapi = useStrapi();
const { setMessage } = useMessageStore();
const { t } = useI18n();
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
const { data: members, refresh } = await useAsyncData(
  'task-members-students',
  () => getMembers(props.taskId),
);
const checkAlreadyHasMember = (member: LearningPlanMemberSimple) => {
  if (members.value?.data) {
    const alreadyInTask = members.value.data.find(
      (alreadyMember) => alreadyMember.student_member.id === member.id,
    );
    if (alreadyInTask) {
      setMessage(
        t('components.learningPlan.drawer.task.memberAlreadyInTask', {
          member: alreadyInTask.student_member.user.fullname,
        }),
        'warning',
        true,
      );
      return true;
    }
  }
  return false;
};
const addMember = async (member: LearningPlanMemberSimple) => {
  if (checkAlreadyHasMember(member)) {
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
    const { data: taskMember } = await strapiUtils.create<TaskMember>(
      'task-members',
      {
        // @ts-ignore
        task: props.taskId,
        status: 'to_do',
        started_at: props.startAt!,
        finished_at: props.finishAt!,
        can_submit_after_deadline: props.sendAfterDeadline,
      },
    );
    strapiUtils.create('task-member-students', {
      role: 'in_charge',
      student_member: member.id,
      task_member: taskMember.id,
    });
    setMessage(
      t('components.learningPlan.drawer.task.addMember', {
        member: member.user.fullname,
      }),
      'success',
      true,
    );
    setTimeout(refresh, 100);
  } catch (error) {
    setMessage(
      t('components.learningPlan.drawer.task.errors.addMember'),
      'error',
      true,
    );
  }
};
const removeMember = async (taskMemberID: number, memberID: number) => {
  await strapi.delete('task-members', taskMemberID);
  await strapi.delete('task-member-students', memberID);
  setTimeout(refresh, 100);
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
