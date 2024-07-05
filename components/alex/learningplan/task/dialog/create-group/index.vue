<template>
  <alex-custom-dialog
    v-model="model"
    class="alex-create-group-dialog"
    :title="
      props.group
        ? $t('components.learningPlan.drawer.task.dialog.title.edit')
        : $t('components.learningPlan.drawer.task.dialog.title.create')
    "
    :main-button-text="
      props.group
        ? $t('components.learningPlan.drawer.task.dialog.save')
        : $t('components.learningPlan.drawer.task.dialog.create')
    "
    @on-main-action="saveGroup"
    @on-secondary-action="model = false"
  >
    <p class="text-gray-800 text-body-1 mb-2">
      <span class="text-error mr-1">*</span
      >{{ $t('components.learningPlan.drawer.task.dialog.label.class') }}
    </p>
    <alex-inputs-select
      v-model="learningClass"
      name="class"
      :placeholder="
        $t('components.learningPlan.drawer.task.dialog.select.class')
      "
      density="comfortable"
      :items="filteredClasses"
      :disabled="props.group !== undefined"
    />

    <p class="text-gray-800 text-body-1 mb-2 mt-4">
      <span class="text-error mr-1">*</span
      >{{ $t('components.learningPlan.drawer.task.dialog.label.name') }}
    </p>
    <alex-inputs-text-field
      v-model="name"
      name="name"
      :placeholder="
        $t('components.learningPlan.drawer.task.dialog.select.name')
      "
      density="comfortable"
    />

    <div class="mb-2 mt-4">
      <alex-inputs-autocomplete
        v-model="responsible"
        name="responsible"
        :label="
          $t('components.learningPlan.drawer.task.dialog.label.responsible')
        "
        :placeholder="
          $t('components.learningPlan.drawer.task.dialog.select.responsible')
        "
        :items="members"
        item-title="user.fullname"
        density="comfortable"
        return-object
        required
      >
        <template #item="{ props: propsItem, item, index }">
          <alex-custom-list-item-user
            v-bind="propsItem"
            :key="index"
            :user="{
              email: item.raw.user.email,
              name: item.raw.user.fullname,
              image: item.raw.user.avatar?.url,
            }"
            no-checkbox
          />
        </template>
      </alex-inputs-autocomplete>
    </div>

    <div class="mb-2 mt-4">
      <alex-inputs-autocomplete
        v-model="member"
        name="members"
        :label="$t('components.learningPlan.drawer.task.dialog.label.members')"
        :placeholder="
          $t('components.learningPlan.drawer.task.dialog.select.members')
        "
        :items="filteredMembers"
        item-title="user.fullname"
        density="comfortable"
        return-object
        required
      >
        <template #item="{ props: propsItem, item, index }">
          <alex-custom-list-item-user
            v-bind="propsItem"
            :key="index"
            :user="{
              email: item.raw.user.email,
              name: item.raw.user.fullname,
              image: item.raw.user.avatar?.url,
            }"
            no-checkbox
          />
        </template>
      </alex-inputs-autocomplete>
    </div>

    <p class="text-body-3 text-gray-600 mt-1">
      {{ $t('components.learningPlan.drawer.task.dialog.message.onlyMembers') }}
    </p>

    <div v-if="selectedMembers.length" class="mt-4 px-4">
      <alex-learningplan-task-dialog-create-group-card
        v-for="groupMember in selectedMembers"
        :key="groupMember.id"
        :name="groupMember.user.fullname"
        :email="groupMember.user.email"
        :image-url="groupMember.user.avatar?.url"
        :in-charge="groupMember.id == responsible?.id"
        icon-color="red"
        @click:remove="removeMember(groupMember)"
      />
    </div>
  </alex-custom-dialog>
</template>

<script setup lang="ts">
const model = defineModel<boolean>({ required: true });

interface CompProps {
  learningPlanId: number;
  classes: ClassSimple[];
  // Se essa props estiver definida, está no modo editar
  group?: LearningPlanGroupSimple;
}

const props = defineProps<CompProps>();

const learningClass = ref<string | undefined>(undefined);
const name = ref<string>('');
const responsible = ref<LearningPlanMemberSimple | undefined>(undefined);
const member = ref();

// Items do autocomplete
const members = ref<LearningPlanMemberSimple[]>([]); // Membros da turma
const filteredMembers = ref<LearningPlanMemberSimple[]>([]); // Membros não selecionados
//
const selectedMembers = ref<LearningPlanMemberSimple[]>([]);

const strapi = useStrapi();
const { setMessage } = useMessageStore();
const { t } = useI18n();

const filteredClasses = computed(() =>
  props.classes.map((group) => group.name),
);

function setForms() {
  if (!model.value) {
    return;
  }

  if (!props.group) {
    responsible.value = undefined;
    member.value = undefined;
    learningClass.value = undefined;
    name.value = '';

    selectedMembers.value = [];
    return;
  }

  const allMembers = props.group.group_members;
  const inCharge = allMembers.find(({ role }) => role === 'in_charge');

  selectedMembers.value = allMembers.map((member) => member.student_member);
  responsible.value = inCharge?.student_member;
  learningClass.value = props.group.learning_class?.name;
  name.value = props.group.title;

  updateItems(); // Ver computed
}

function updateItems() {
  const selectedClass = props.classes.find(
    ({ name }) => name === learningClass.value,
  );

  if (!selectedClass) {
    return;
  }

  const classStudents = selectedClass.learning_plan_members || [];
  const selectedIds = selectedMembers.value.map(({ id }) => id);

  const newMembers = classStudents.filter(
    ({ id }) => id !== responsible.value?.id,
  );

  const newFilteredMembers = classStudents.filter(
    ({ id }) => !selectedIds.includes(id),
  );

  if (newMembers !== members.value) {
    members.value = newMembers;
  }

  if (newFilteredMembers !== filteredMembers.value) {
    filteredMembers.value = newFilteredMembers;
  }
}

function removeMember(member: LearningPlanMemberSimple) {
  selectedMembers.value = selectedMembers.value.filter(
    (selectedMember) => selectedMember.id !== member.id,
  );

  if (member.id === responsible.value?.id) {
    responsible.value = undefined;
  }

  updateItems();
}

async function saveGroup() {
  if (!learningClass.value) {
    setMessage(
      t('components.learningPlan.drawer.task.dialog.message.missClass'),
      'warning',
      true,
    );
    return;
  }

  if (!name.value) {
    setMessage(
      t('components.learningPlan.drawer.task.dialog.message.missName'),
      'warning',
      true,
    );
    return;
  }

  if (!responsible.value) {
    setMessage(
      t('components.learningPlan.drawer.task.dialog.message.missResponsible'),
      'warning',
      true,
    );
    return;
  }

  const membersData = selectedMembers.value.map((member) => {
    return {
      member_id: member.id,
      role: member.id !== responsible.value?.id ? 'standard' : 'in_charge',
    };
  });

  const selectedClass = props.classes.find(
    (group) => group.name === learningClass.value,
  );

  const data = {
    title: name.value,
    learningplan: props.learningPlanId,
    learning_class: selectedClass?.id || 0,
    group_members: membersData,
  };

  if (props.group) {
    strapi.update('learnin-plan-groups', props.group.id, data);
    setMessage(
      t('components.learningPlan.drawer.task.dialog.message.updated'),
      'success',
      true,
    );
  } else {
    await strapi.create('learnin-plan-groups', data);
    setMessage(
      t('components.learningPlan.drawer.task.dialog.message.created'),
      'success',
      true,
    );
  }

  model.value = false;
}

// Fazer função
onMounted(() => setForms());

watch(model, () => setForms());
watch(learningClass, () => updateItems());

watch(responsible, () => {
  if (!responsible.value) {
    return;
  }

  const filteredMembers = selectedMembers.value.filter(
    ({ id }) => id !== responsible.value?.id,
  );

  selectedMembers.value = [responsible.value, ...filteredMembers];

  updateItems();
});

watch(member, () => {
  if (!member.value) {
    return;
  }

  selectedMembers.value = [...selectedMembers.value, member.value];
  member.value = undefined;

  updateItems();
});
</script>

<style>
.alex-create-group-dialog .v-input__details {
  display: none !important;
}
</style>
