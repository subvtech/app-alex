<template>
  <alex-learningplan-dialogs-alert
    v-if="!learningPlanStore.loading && learningPlanStore.invitationLink"
    v-model="openConfirmation"
    variant="primary"
    persistent
    title="Deseja participar desse curso?"
    :subtitle="`Voce foi convidado para participar do curso de ${learningPlanStore.learningPlan?.title} da turma ${learningPlanStore.learningPlan?.class_name}`"
    submit-button-text="Participar"
    :loading="loading"
    @submit="onConfirm"
    @cancel="onCancel"
  />
  <v-row v-else justify="center">
    <v-progress-circular indeterminate color="accent" size="100" width="6" />
  </v-row>
</template>

<script setup lang="ts">
const route = useRoute();
const learningPlanStore = useLearningPlanStore();
const { setMessage } = useMessageStore();
const openConfirmation = ref(false);
const strapi = useStrapi();
const loading = ref(false);
const user = useStrapiUser();
const hash = route.params.hash?.toString();

watch(learningPlanStore, () => {
  const isCorrectInvitationHash =
    learningPlanStore.invitationLink?.hash === hash;
  const isLinkEnabled = learningPlanStore.learningPlan?.invite_enabled;
  if (
    learningPlanStore.userIsActiveMember ||
    learningPlanStore.userIsFacilitator
  ) {
    setMessage('Voce já faz parte do curso!', 'blue', true);
    navigateTo(`/courses/${learningPlanStore.learningPlan?.id}`);
  }

  if (!isCorrectInvitationHash || !isLinkEnabled) {
    setMessage('Convite não encontrado!', 'red', true);
    navigateTo('/courses/me');
  }
  openConfirmation.value = true;
});

function onCancel() {
  openConfirmation.value = false;
  navigateTo('/');
}

async function onConfirm() {
  try {
    loading.value = true;

    if (learningPlanStore.userIsPendingMember) {
      const id = learningPlanStore.pendingMembers.find(
        (member) =>
          member.user?.id === user.value?.id ||
          member.email === user.value?.email,
      )?.id;

      if (id && user.value) {
        await strapi.update('learning-plan-members', id, {
          user: user.value.id,
          status: 'joined',
          joined_at: new Date(),
        });
      }
    } else {
      const data = {
        user: user.value?.id,
        status: 'joined',
        joined_at: new Date(),
        learningplan: learningPlanStore.learningPlan?.id,
        role: 'student',
      };

      await strapi.create('learning-plan-members', data);
    }

    setMessage('Participação registrada com sucesso!', 'green', true);
    navigateTo(`/courses/${learningPlanStore.learningPlan?.id}`);
    loading.value = false;
    openConfirmation.value = false;
  } catch (_) {
    setMessage(
      'Não foi possivel finalizar a operação. Tente Novamente!',
      'red',
      true,
    );
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped lang="scss">
#join {
  .bg-img {
    background-image: url('/images/login-bg.svg');
    background-position: center center;
    background-repeat: no-repeat;
    background-attachment: fixed;
    background-size: cover;
  }
  .content-box {
    border-radius: 8px;
    border: 2px solid #67b055;

    display: flex;
    padding: 16px;

    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
    align-self: stretch;
    border-radius: 8px;
    max-width: 400px;

    .title {
      color: var(--Principais-Branco, #fff);

      /* H6 */
      font-family: Sen;
      font-size: 24px;
      font-style: normal;
      font-weight: 700;
      line-height: 34px; /* 141.667% */
    }

    .description {
      color: var(--Cinza-Cinza-200, #d2d6da);

      /* P1 */
      font-family: Sen;
      font-size: 16px;
      font-style: normal;
      font-weight: 400;
      line-height: 24px; /* 150% */
    }
  }
  .link {
    color: #00e4ff;

    /* P1 */
    font-family: Sen;
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: 24px; /* 150% */
  }
}
</style>
