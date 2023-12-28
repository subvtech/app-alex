<template>
  <div>
    <alex-learningplan-class-section-card
      v-model:search="searchMembers"
      title="Participantes da turma"
      :loading="learningPlanStore.loading"
      :show-empty-state="!learningPlanStore?.activeMembers?.length"
      :items="learningPlanStore.activeMembers || []"
      empty-state-image="/svg/no-team-members.svg"
      image-height="250px"
      image-width="335px"
      empty-state-message="Parece que ainda não há participantes nessa turma!"
      search-placeholder="Encontrar participante"
      action-text="Convites"
      action-icon="mdi-email-outline"
      dialog-title="Convites do Curso"
      :filter-keys="['user.fullname', 'email']"
      @action="onClickSendInvites"
    >
      <template #item="{ item }">
        <alex-learningplan-class-member-card
          :name="item?.user?.fullname"
          :email="item.email"
          :avatar-image="item?.user?.avatar?.url"
          :cover-image="item?.user?.cover"
          @delete="() => onDeleteParticipant(item.id)"
        />
      </template>
      <template #dialog-content>
        <alex-inputs-users-autocomplete
          v-model="readySendUsers"
          name="readySendUsers"
          class="w-100"
          :label="$t('components.learningPlan.dialogs.whoParticipate')"
          :placeholder="$t('components.learningPlan.dialogs.searchMember')"
        />
        <!-- <alex-custom-list-item-user
          v-for="(member, i) in learningPlanStore.pendingMembers"
          :key="`pending-member-${i}`"
          :user="{
            name: member.user?.fullname,
            email: member.email,
            image: member.user?.avatar,
          }"
          no-select
          status="pending"
        /> -->
      </template>
    </alex-learningplan-class-section-card>
    <alex-learningplan-class-section-card
      v-model="searchGroups"
      title="Grupos de participantes"
      :loading="learningPlanStore.loading"
      :items="learningPlanStore.learningPlan?.groups"
      :show-empty-state="!learningPlanStore.learningPlan?.groups?.length"
      empty-state-image="/svg/no-group-members.svg"
      image-height="200px"
      image-width="250px"
      empty-state-message="Parece que ainda não há grupos criados!"
      search-placeholder="Encontrar grupo"
      action-text="Criar grupos"
      action-icon="mdi-account-multiple-plus-outline"
      colored-background
      @action="onCreateGroup"
    >
      <template #dialog-content> content </template>
    </alex-learningplan-class-section-card>
  </div>
</template>
<script setup lang="ts">
const strapi = useStrapi();
const { setMessage } = useMessageStore();
const searchMembers = ref('');
const searchGroups = ref('');
const readySendUsers = ref([]);
const learningPlanStore = useLearningPlanStore();

function onClickSendInvites() {
  console.log('onClickSendInvites');
}

function onCreateGroup() {
  console.log('onCreateGroup');
}
// Está listando, apagando e atualizando após apagar, falta criar e arrumar o bug do input. Além do i18
async function onDeleteParticipant(id: number) {
  const response = await strapi.delete('learning-plan-members', id);
  if (learningPlanStore.learningPlan?.members && response.data.id) {
    learningPlanStore.learningPlan.members =
      learningPlanStore.learningPlan.members.filter(
        (member) => member.id !== id,
      );
    // falta i18
    setMessage('Usuário removido com sucesso!', 'green', true);
    return;
  }
  // falta i18
  setMessage('Erro ao remover usuário!', 'red', true);
}
</script>
<style scoped lang="scss"></style>
