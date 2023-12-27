<template>
  <div>
    <alex-learningplan-class-section-card
      v-model:search="searchMembers"
      title="Participantes da turma"
      :loading="learningPlanStore.loading"
      :show-empty-state="!learningPlanStore.learningPlan?.members?.length"
      :items="learningPlanStore.learningPlan?.members"
      empty-state-image="/svg/no-team-members.svg"
      image-height="250px"
      image-width="335px"
      empty-state-message="Parece que ainda não há participantes nessa turma!"
      search-placeholder="Encontrar participante"
      action-text="Convites"
      action-icon="mdi-email-outline"
    >
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
    >
      assd
      {{ searchGroups }}
    </alex-learningplan-class-section-card>
  </div>
</template>
<script setup lang="ts">
import { useI18n } from 'vue-i18n';

// const { find, findOne, update } = useStrapi();
const route = useRoute();

const searchMembers = ref('');
const searchGroups = ref('');

const learningPlanStore = useLearningPlanStore();
</script>
<style scoped lang="scss">
// .participantes-card {
//   height: 588px;
//   max-height: 588px;
// }
</style>
