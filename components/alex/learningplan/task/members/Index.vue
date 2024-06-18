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
          class="w-50"
          :placeholder="$t('components.learningPlan.members.search')"
          prepend-inner-icon="mdi-magnify"
          density="compact"
          clearable
        />

        <alex-learningplan-task-members-invite
          :learningplan-id="learningplanId"
          @select-member-click="addMember"
          @select-class-click="addClass"
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
const emit = defineEmits(['change-members']);
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
    await strapiUtils.create<TaskMember>('task-members', {
      // @ts-ignore
      task: props.taskId,
      status: 'to_do',
      started_at: props.startAt!,
      finished_at: props.finishAt!,
      can_submit_after_deadline: props.sendAfterDeadline,
      students: [member.id],
      in_charge: member.id,
    });
    setTimeout(refresh, 100);
    setMessage(
      t('components.learningPlan.drawer.task.addMember', {
        member: member.user.fullname,
      }),
      'success',
      true,
    );
    emit('change-members');
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
const addClass = async (classSimple: ClassSimple) => {
  await client(`/tasks/${props.taskId}/add-class`, {
    method: 'PUT',
    body: {
      classId: classSimple.id,
    },
    onResponse: ({ response }) => {
      if (!response.ok) {
        setMessage(
          t('components.learningPlan.drawer.task.errors.addClass', {
            name: classSimple.name,
          }),
          'error',
          true,
        );
      }
      const data: TaskMemberStudent[] = response._data;
      if (!data.length) {
        setMessage(
          t('components.learningPlan.drawer.task.members.allClass', {
            name: classSimple.name,
          }),
          'warning',
          true,
        );
        return;
      }
      setTimeout(refresh, 100);
      emit('change-members');
    },
    onRequestError: () => {
      setMessage(
        t('components.learningPlan.drawer.task.errors.addClass', {
          name: classSimple.name,
        }),
        'error',
        true,
      );
    },
  });
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
