<template>
  <div class="tw-flex tw-gap-2 bg-white tw-mt-2 tw-p-4 tw-rounded-md">
    <div class="tw-w-full">
      <h4 class="text-body-4 text-gray-900">{{ group.title }}</h4>
      <div class="tw-flex tw-gap-2 text-body-5 text-gray-500">
        <p>
          {{ $t('components.learningPlan.drawer.task.dialog.responsible') }}
        </p>
        <h4 class="text-body-6 text-gray-900">
          {{
            getInChargeMember(group.group_members)?.student_member.user.fullname
          }}
        </h4>
      </div>
      <alex-custom-avatar-group
        class="tw-ml-2"
        :avatar-items="getGroupMemberAvatars(group.group_members)"
      />
    </div>
    <alex-custom-button
      size="small"
      variant="outlined"
      @click="emit('add-members', group)"
      >{{
        $t('components.learningPlan.drawer.task.dialog.add')
      }}</alex-custom-button
    >
  </div>
</template>

<script setup lang="ts">
interface GroupCard {
  group: LearningPlanGroupSimple;
}
defineProps<GroupCard>();

type Emit = {
  'add-members': [group: LearningPlanGroupSimple];
};

const emit = defineEmits<Emit>();

const getInChargeMember = (members: LearningPlanGroupMemberSimple[]) =>
  members.find((member) => member.role === 'in_charge');

const getGroupMemberAvatars = (members: LearningPlanGroupMemberSimple[]) =>
  members.map((member) => ({
    name: member.student_member?.user.fullname || '',
    image: member.student_member?.user.avatar?.formats.small,
  }));
</script>

<style scoped></style>
