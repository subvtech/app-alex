<template>
  <alex-custom-dialog v-model="model" no-footer>
    <template #header>
      <header class="d-flex align-start ga-4 px-6 pt-6 bg-white rounded-t-lg">
        <alex-custom-button
          icon="mdi-chevron-left"
          variant="text"
          @click="console.log('voltar (ver com o zig pra onde vai)')"
        />
        <div class="flex-fill text-center">
          <p class="text-subtitle-2 text-gray-600">Grupo de integrantes</p>
          <p class="text-h2 text-gray-800 my-1">Servidores Windows</p>
          <p class="text-subtitle-2 text-gray-600">Turma A</p>
        </div>
        <alex-custom-button
          icon="mdi-dots-vertical"
          variant="text"
          @click="console.log('abrir opções')"
        />
      </header>
    </template>

    <alex-inputs-text-field
      class="tw-w-full mb-6"
      name="group"
      prepend-inner-icon="mdi-magnify"
      placeholder="Buscar participantes"
      density="comfortable"
    />

    <div v-if="responsible" class="mb-6">
      <p class="text-h5 text-gray-800 mb-2">Responsável</p>
      <div>
        <alex-learningplan-task-groups-card
          :name="responsible.student_member.user.fullname"
          :email="responsible.student_member.user.email"
          :image-url="responsible.student_member.user.avatar?.url"
          hide-details
        />
      </div>
    </div>

    <div v-if="members.length">
      <p class="text-h5 text-gray-800 mb-2">Membros</p>
      <div>
        <alex-learningplan-task-dialog-create-group-card
          v-for="(member, index) in membersFiltered"
          :key="index"
          :name="member.student_member.user.fullname"
          :email="member.student_member.user.email"
          :image-url="member.student_member.user.avatar?.url"
        />
      </div>
    </div>
  </alex-custom-dialog>
</template>

<script setup lang="ts">
const model = defineModel<boolean>({ required: true });

interface CompProps {
  members: LearningPlanGroupMemberSimple[];
}

const props = defineProps<CompProps>();

const responsible = computed<LearningPlanGroupMemberSimple | undefined>(() => {
  const filtered = props.members.filter(
    (member) => member.role === 'in_charge',
  );
  return filtered ? filtered[0] : undefined;
});

const membersFiltered = computed<LearningPlanGroupMemberSimple[]>(() =>
  props.members.filter((member) => member.role === 'standard'),
);
</script>
