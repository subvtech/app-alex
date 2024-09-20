<script setup lang="ts">
import AddMemberDialog from './AddMemberDialog.vue';
interface MembersProps {
  startAt?: string | null;
  finishAt?: string | null;
  blockDelete?: boolean;
  edit?: boolean;
}

const props = withDefaults(defineProps<MembersProps>(), {
  startAt: null,
  finishAt: null,
  blockDelete: false,
  edit: true,
  taskId: undefined,
  learningplanId: undefined,
  students: () => [],
});

const projectStudents = ref<LearningPlanMemberSimple[]>([]);

type Emits = {
  'change-members': [];
  'set-members': [value: LearningPlanMemberSimple[]];
};

watch(
  () => projectStudents.value,
  () => {
    emit('set-members', projectStudents.value);
  },
);

// const strapiUtils = useStrapiUtils();
const { setMessage } = useMessageStore();
const { t } = useI18n();
const emit = defineEmits<Emits>();
const addMemberDialog = ref(false);
const page = ref<number>(1);
const itemsPerPage = 12;
const search = ref('');
const client = useStrapiClient();
const members = [];
const checkHasFilledDates = () => {
  if (!props.startAt || !props.finishAt) {
    setMessage(t('components.learningPlan.drawer.task.pleaseFillDates'), 'warning', true);
    return false;
  }
  return true;
};
// const getMembers = (taskId: number) =>
//   strapiUtils.find<TaskMember>('task-members', {
//     populate: {
//       task_submissions: {
//         populate: ['justification'],
//       },
//       learning_plan_member: {
//         populate: ['user.avatar', 'learning_class'],
//       },
//       learning_plan_group: {
//         populate: {
//           group_members: {
//             populate: ['student_member.user.avatar'],
//           },
//           learning_class: true,
//         },
//       },
//     },
//     filters: {
//       task: taskId,
//     },
//   });
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

const addMember = async (members: LearningPlanMemberSimple[]) => {
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
        emit('change-members');
      },
    });
  } catch (error) {
    setMessage(t('components.learningPlan.drawer.task.errors.addMember'), 'error', true);
  }
};

const handleAddMember = () => {
  addMemberDialog.value = true;
};
</script>

<template>
  <v-data-iterator :search="search" :page="page" :items="members" :items-per-page="itemsPerPage" class="members">
    <!-- Header -->
    <template #header>
      <div class="header d-flex tw-align-center py-4 px-2">
        <alex-inputs-text-field
          v-model="search"
          name="member"
          class="w-100 tw-mr-4"
          :placeholder="$t('components.learningPlan.members.search')"
          prepend-inner-icon="mdi-magnify"
          density="compact"
          clearable
        />

        <AddMemberDialog
          v-model="addMemberDialog"
          :learningplan-id="props.learningplanId"
          :members="members"
          @add-click="addMember"
        />

        <alex-custom-button class="tw-ml-auto" variant="secondary" prepend-icon="mdi-plus" @click="handleAddMember">{{
          $t('components.learningPlan.members.add.label')
        }}</alex-custom-button>
      </div>
    </template>
    <!-- Cards -->
    <!-- <template #default="{ items }">
      <alex-learningplan-task-members-card v-for="member in items" :member="{}" :edit="edit" />
    </template> -->
    <template #no-data>
      <div class="d-flex align-center justify-center flex-column ga-4 text-center">
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
      <div v-if="groupedItems.length && members.length > itemsPerPage" class="d-flex align-center ga-2 pa-6">
        <span class="flex-1-1">
          {{ showingData(members, groupedItems as any[], search, pageCount) }}
        </span>
        <alex-custom-pagination v-model="page" :length="pageCount" :total-visible="3" class="extra-mb" />
      </div>
    </template>
  </v-data-iterator>
</template>

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
