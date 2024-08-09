<template>
  <alex-custom-dialog
    v-model="model"
    :main-button-text="
      $t('components.learningPlan.drawer.task.dialog.title.add')
    "
    :main-button-disabled="hasMembersInOtherGroups"
    @on-main-action="updateGroup"
    @on-secondary-action="model = false"
  >
    <template #header>
      <header class="d-flex align-start ga-4 px-6 pt-6 bg-white rounded-t-lg">
        <alex-custom-button
          icon="mdi-chevron-left"
          variant="text"
          @click="model = false"
        />
        <div class="flex-fill text-center">
          <p class="text-subtitle-2 text-gray-600">
            {{ $t('components.learningPlan.drawer.task.dialog.title.members') }}
          </p>
          <p class="text-h2 text-gray-800 my-1">{{ props.group?.title }}</p>
          <p class="text-subtitle-2 text-gray-600">
            {{ props.group?.learning_class?.name || '(Sem turma)' }}
          </p>
        </div>
        <alex-custom-button icon="mdi-dots-vertical" variant="text" />
      </header>
    </template>

    <alex-inputs-text-field
      v-model="search"
      class="tw-w-full mb-6"
      name="group"
      prepend-inner-icon="mdi-magnify"
      :placeholder="
        $t('components.learningPlan.drawer.task.dialog.searchMembers')
      "
      density="comfortable"
    />

    <div class="mb-6">
      <p class="text-h5 text-gray-800 mb-2">
        {{ $t('components.learningPlan.drawer.task.dialog.responsible') }}
      </p>
      <div v-if="responsible">
        <alex-learningplan-task-dialog-create-group-card
          :name="responsible.student_member.user.fullname"
          :email="responsible.student_member.user.email"
          :image-url="responsible.student_member.user.avatar?.url"
          :another-group="onAnotherGroup(responsible)"
          hide-details
        />
      </div>
    </div>

    <div>
      <p class="text-h5 text-gray-800 mb-2">
        {{ $t('components.learningPlan.drawer.task.dialog.members') }}
      </p>
      <div v-if="members.length">
        <alex-learningplan-task-dialog-create-group-card
          v-for="member in filteredMembers"
          :key="member.id"
          :name="member.student_member.user.fullname"
          :email="member.student_member.user.email"
          :image-url="member.student_member.user.avatar?.url"
          :another-group="onAnotherGroup(member)"
          @click:remove="removeMember(member)"
        />
      </div>
      <div v-else class="text-center">
        <p class="text-gray-800 text-body-1">
          {{ $t('components.learningPlan.drawer.task.dialog.noMembers') }}
        </p>
      </div>
    </div>
  </alex-custom-dialog>
</template>

<script setup lang="ts">
interface CompProps {
  learningPlanId: number;
  taskId: number;
  startAt?: string | null;
  finishAt?: string | null;
  canSubmitAfter?: boolean;
  group?: LearningPlanGroupSimple; // Tirar opcional
  allGroups: LearningPlanGroupSimple[];
}

const props = defineProps<CompProps>();

const emit = defineEmits(['add-group']);

const model = defineModel<boolean>({ required: true });

const search = ref<string>('');
const members = ref<LearningPlanGroupMemberSimple[]>([]);

const strapi = useStrapi();
const { setMessage } = useMessageStore();
const { t } = useI18n();

const otherGroupIds = computed<number[]>(() => {
  const filteredGroups = props.allGroups.filter(
    ({ id }) => id !== props.group?.id,
  );
  return filteredGroups.flatMap((group) =>
    group.group_members.map((groupMember) => groupMember.student_member.id),
  );
});
const hasMembersInOtherGroups = computed(
  () =>
    !!members.value.filter((member) =>
      otherGroupIds.value.includes(member.student_member.id),
    ).length,
);
const filteredMembers = computed<LearningPlanGroupMemberSimple[]>(() =>
  members.value.filter((member) =>
    member.student_member.user.fullname
      .toLocaleLowerCase()
      .includes(search.value.toLowerCase()),
  ),
);

const responsible = computed<LearningPlanGroupMemberSimple | undefined>(() => {
  const responsible = props.group?.group_members.find(
    ({ role }) => role === 'in_charge',
  );

  const name = responsible?.student_member?.user.fullname;

  return name?.toLowerCase().includes(search.value.toLowerCase())
    ? responsible
    : undefined;
});

function onAnotherGroup(member: LearningPlanGroupMemberSimple): boolean {
  return otherGroupIds.value.includes(member.student_member.id);
}

function removeMember(member: LearningPlanGroupMemberSimple) {
  members.value = members.value.filter(({ id }) => id !== member.id);
}

async function updateGroup() {
  if (responsible.value === undefined) {
    setMessage(
      t('components.learningPlan.drawer.task.dialog.message.missResponsible'),
      'warning',
      true,
    );
    return;
  }

  if (!members.value.length) {
    setMessage(
      t('components.learningPlan.drawer.task.dialog.message.oneMember'),
      'warning',
      true,
    );
    return;
  }

  const membersData = [...members.value, responsible.value].map((member) => ({
    member_id: member.student_member.id,
    role: member.role,
  }));

  const groupInfo = {
    title: props.group?.title || '',
    learningplan: props.learningPlanId,
    learning_class: props.group?.learning_class?.id || 0,
    group_members: membersData,
  };

  try {
    const { data } = await strapi.create('learnin-plan-groups', groupInfo);

    await strapi.create('task-members', {
      status: 'to_do',
      can_submit_after_deadline:
        props.canSubmitAfter !== undefined ? props.canSubmitAfter : true,
      started_at: props.startAt || null,
      finished_at: props.finishAt || null,
      task: props.taskId,
      learning_plan_group: data.id,
    });

    emit('add-group');
    setMessage(
      t('components.learningPlan.drawer.task.dialog.message.created'),
      'success',
      true,
    );
  } catch (e) {
    setMessage(
      t('components.learningPlan.drawer.task.dialog.message.createError'),
      'error',
      true,
    );
  } finally {
    model.value = false;
  }
}

watch(model, () => {
  if (!model.value) {
    return;
  }

  members.value =
    props.group?.group_members.filter((member) => member.role === 'standard') ||
    [];
});
</script>
