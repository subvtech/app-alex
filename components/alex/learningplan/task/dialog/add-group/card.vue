<template>
  <div class="flex gap-2 bg-white mt-2 p-4 rounded-md">
    <div class="w-full">
      <h4 class="text-body-4 text-gray-900">{{ group.title }}</h4>
      <div class="flex gap-2 text-body-5 text-gray-500">
        <p>Responsável</p>
        <h4 class="text-body-6 text-gray-900">
          {{
            getInChargeMember(group.group_members)?.student_member.user.fullname
          }}
        </h4>
      </div>
      <alex-custom-avatar-group
        class="ml-2"
        :avatar-items="getGroupMemberAvatars(group.group_members)"
      />
    </div>
    <alex-custom-button size="small" variant="outlined"
      >Adicionar</alex-custom-button
    >
  </div>
</template>

<script setup lang="ts">
interface GroupCard {
  group: LearningPlanGroupSimple;
}
defineProps<GroupCard>();
const getInChargeMember = (members: LearningPlanGroupMemberSimple[]) =>
  members.find((member) => member.role === 'in_charge');

const getGroupMemberAvatars = (members: LearningPlanGroupMemberSimple[]) =>
  members.map((member) => ({
    name: member.student_member.user.fullname,
    image: member.student_member.user.avatar?.formats.small,
  }));
</script>

<style scoped></style>
