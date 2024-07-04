<template>
  <alex-custom-dialog
    v-model="model"
    :title="props.group ? 'Editar grupo' : 'Criar grupo'"
    class="alex-create-group-dialog"
    @on-main-action="saveGroup"
  >
    <p class="text-gray-800 text-body-1 mb-2">
      <span class="text-error mr-1">*</span>A qual turma o grupo pertence?
    </p>
    <alex-inputs-select
      v-model="learningClass"
      name="class"
      placeholder="Selecione a turma do grupo"
      density="comfortable"
      :items="filteredClasses"
      :disabled="props.group !== undefined"
    />

    <p class="text-gray-800 text-body-1 mb-2 mt-4">
      <span class="text-error mr-1">*</span>Qual o nome do grupo?
    </p>
    <alex-inputs-text-field
      v-model="name"
      name="name"
      placeholder="Digite o nome do grupo"
      density="comfortable"
    />

    <div class="mb-2 mt-4">
      <alex-inputs-autocomplete
        v-model="responsible"
        name="responsible"
        label="Quem será o responsável pelo grupo?"
        placeholder="Selecione o responsável pelo grupo"
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
        label="Quem serão os participantes do grupo?"
        placeholder="Selecione os participantes do grupo"
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

    <p class="text-body-3 text-gray-600 mt-1">
      Só serão listados os usuários participantes do curso e que não façam parte
      do grupo
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

const learningClass = ref<string>('');
const name = ref<string>('');
const responsible = ref<LearningPlanMemberSimple | undefined>(undefined);
const member = ref();

// Membros selecionáveis
const members = ref<LearningPlanMemberSimple[]>([]);
const selectedMembers = ref<LearningPlanMemberSimple[]>([]);

const strapi = useStrapi();
const { setMessage } = useMessageStore();

const filteredClasses = computed(() =>
  props.classes.map((group) => group.name),
);

function removeMember(member: LearningPlanMemberSimple) {
  selectedMembers.value = selectedMembers.value.filter(
    (selectedMember) => selectedMember.id !== member.id,
  );

  if (member.id === responsible.value?.id) {
    responsible.value = undefined;
  }

  // Membros que podem ser adicionados
  members.value = [...members.value, member];
}

async function saveGroup() {
  if (!learningClass.value) {
    setMessage('Selecione uma turma pra o grupo', 'warning', true);
    return;
  }

  if (!name.value) {
    setMessage('Informe o nome do grupo', 'warning', true);
    return;
  }

  if (!responsible.value) {
    setMessage('Selecione um responsável para o grupo', 'warning', true);
    return;
  }

  const membersData = selectedMembers.value.map((member) => {
    return {
      member_id: member.id,
      role: member.id !== responsible.value?.id ? 'standard' : 'in_charge',
    };
  });

  const selectedClass = props.classes.filter(
    (group) => group.name === learningClass.value,
  )[0];

  const data = {
    title: name.value,
    learningplan: props.learningPlanId,
    learning_class: selectedClass.id || 0,
    group_members: membersData,
  };

  if (props.group) {
    strapi.update('learnin-plan-groups', props.group.id, data);
    setMessage('Grupo atualizado com sucesso', 'success', true);
  } else {
    await strapi.create('learnin-plan-groups', data);
    setMessage('Grupo criado com sucesso', 'success', true);
  }

  model.value = false;
}

// Fazer função
onMounted(() => {
  if (!props.group) {
    learningClass.value = '';
    name.value = '';
    responsible.value = undefined;
    member.value = undefined;

    selectedMembers.value = [];
    members.value = [];
    return;
  }

  learningClass.value = props.group.learning_class?.name || '';
  name.value = props.group.title;

  const allMembers = props.group.group_members;

  selectedMembers.value = allMembers.map((member) => member.student_member);

  if (allMembers.some((member) => member.role === 'in_charge')) {
    responsible.value = allMembers.filter(
      (member) => member.role === 'in_charge',
    )[0].student_member;
  }
});

watch(model, () => {
  if (!props.group) {
    learningClass.value = '';
    name.value = '';
    responsible.value = undefined;
    member.value = undefined;

    selectedMembers.value = [];
    members.value = [];
    return;
  }

  learningClass.value = props.group.learning_class?.name || '';
  name.value = props.group.title;

  const allMembers = props.group.group_members;

  selectedMembers.value = allMembers.map((member) => member.student_member);

  if (allMembers.some((member) => member.role === 'in_charge')) {
    responsible.value = allMembers.filter(
      (member) => member.role === 'in_charge',
    )[0].student_member;
  }
});

watch(learningClass, () => {
  // Exibe os membros disponiveis
  const selectedClass = props.classes.filter(
    (group) => group.name === learningClass.value,
  )[0];

  if (selectedClass) {
    members.value = selectedClass.learning_plan_members || [];
  }
});

watch(responsible, () => {
  if (!responsible.value) {
    return;
  }

  selectedMembers.value = [responsible.value, ...selectedMembers.value];

  members.value = members.value.filter(
    (groupMember) => groupMember !== responsible.value,
  );
});

watch(member, () => {
  if (!member.value) {
    return;
  }

  selectedMembers.value = [...selectedMembers.value, member.value];

  members.value = members.value.filter(
    (groupMember) => groupMember !== member.value,
  );
  member.value = undefined;
});
</script>

<style>
.alex-create-group-dialog .v-input__details {
  display: none !important;
}
</style>
