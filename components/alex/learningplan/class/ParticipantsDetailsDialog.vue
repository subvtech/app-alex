<template>
  <alex-custom-dialog
    v-model="value"
    title="Grupo de participantes"
    no-footer
    body-classes="d-flex flex-column gap-6 bg-white pa-6 rounded-b-lg"
  >
    <div class="d-flex flex-column align-center justify-center">
      <p class="text-gray-600 text-subtitle-2">
        {{ learningPlanStore?.learningPlan?.title }}
      </p>
      <h2 class="text-h2 text-gray-800">{{ showValuesGroup?.title }}</h2>
    </div>
    <template
      v-for="(section, indexSection) in sectionsShowGroup"
      :key="`group-section-${indexSection}`"
    >
      <h5 class="text-h5 text-gray-800">{{ section.title }}</h5>
      <alex-custom-list-item-user
        v-for="(member, i) in filterMembersByRole(
          section.filter,
          showValuesGroup?.members,
        )"
        :key="`group-member-${i}`"
        :user="{
          email: member?.student_member?.email || 'a',
          name: member?.student_member?.user?.fullname || '',
          image: member?.student_member?.user.avatar?.url || '',
        }"
        remove-selection
        no-delete
        ><template #secondButton="{ loading, click }">
          <alex-custom-button
            icon="mdi-message-text-outline"
            variant="secondary"
            :loading="loading"
            @click="click"
          /> </template
      ></alex-custom-list-item-user>
      <v-divider
        v-if="indexSection == 0"
        color="secondary"
        :thickness="1"
        class="border-opacity-100"
      />
    </template>
  </alex-custom-dialog>
</template>

<script setup lang="ts">
interface ParticipantsDetailsDialogProps {
  modelValue: boolean;
  showValuesGroup?: {
    title: string;
    members: LearningPlanGroupMemberSimple[];
  };
}
const learningPlanStore = useLearningPlanStore();
const props = withDefaults(defineProps<ParticipantsDetailsDialogProps>(), {
  showValuesGroup: undefined,
});
const emit = defineEmits(['update:modelValue']);
const value = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emit('update:modelValue', value);
  },
});
const sectionsShowGroup: {
  title: string;
  filter: keyof typeof learningPlanGroupMemberRolesSimple;
}[] = [
  { title: 'Responsável', filter: 'IN_CHARGE' },
  { title: 'Participantes', filter: 'STANDARD' },
];

function filterMembersByRole(
  role: keyof typeof learningPlanGroupMemberRolesSimple,
  members?: LearningPlanGroupMemberSimple[],
) {
  return members?.filter(
    (member) => member.role === learningPlanGroupMemberRolesSimple[role],
  );
}
</script>

<style scoped></style>
