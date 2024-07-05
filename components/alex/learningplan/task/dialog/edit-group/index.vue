<template>
  <alex-custom-dialog
    v-model="model"
    :main-button-text="
      $t('components.learningPlan.drawer.task.dialog.title.add')
    "
    :main-button-disabled="responsible ? onAnotherGroup(responsible) : true"
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
        <alex-custom-button
          icon="mdi-dots-vertical"
          variant="text"
          @click="console.log('abrir opções')"
        />
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
  group?: LearningPlanGroupSimple; // Tirar opcional
  allGroups: LearningPlanGroupSimple[];
}

const props = defineProps<CompProps>();

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

  const ids: number[] = [];

  filteredGroups.forEach((group) => {
    group.group_members.forEach((member) =>
      ids.push(member.student_member.user.id),
    );
  });

  return ids;
});

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
  return otherGroupIds.value.includes(member.student_member.user.id);
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

  const membersData = [...members.value, responsible.value].map(
    ({ id, role }) => ({
      member_id: id,
      role,
    }),
  );

  await strapi
    .update('learnin-plan-groups', props.group?.id || 0, membersData)
    .then(() => {
      setMessage(
        t('components.learningPlan.drawer.task.dialog.message.updated'),
        'success',
        true,
      );
      model.value = false;
    })
    .catch(() =>
      setMessage(
        t('components.learningPlan.drawer.task.dialog.message.updateError'),
        'error',
        true,
      ),
    );
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
