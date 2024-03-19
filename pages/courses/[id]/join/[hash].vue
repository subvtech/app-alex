<template>
  <alex-learningplan-dialogs-alert
    v-if="
      !learningPlanStore.loading && invitationHash && !invitationHash.is_expired
    "
    v-model="openConfirmation"
    variant="primary"
    persistent
    :title="$t('components.learningPlan.join.active.title')"
    image-class="mb-6"
    :image="{
      src: '/svg/Invite.svg',
      alt: 'Convite',
      width: 300,
      height: 200,
    }"
    :loading="loading"
    :submit-button-text="$t('components.learningPlan.join.active.action')"
    @submit="onConfirm"
    @cancel="onCancel"
  >
    <template #subtitle>
      {{ t('components.learningPlan.join.active.description') }}
      <strong>{{ learningPlanStore.learningPlan?.title }}</strong>
      {{ t('components.learningPlan.join.active.at') }}
      <strong>{{ learningPlanStore.learningPlan?.class_name }}</strong>
    </template>
  </alex-learningplan-dialogs-alert>
  <alex-learningplan-dialogs-alert
    v-else-if="
      !learningPlanStore.loading && invitationHash && invitationHash.is_expired
    "
    v-model="openConfirmation"
    variant="primary"
    persistent
    hide-cancel-button
    :title="$t('components.learningPlan.join.expired.title')"
    :image="{
      src: '/svg/InviteExpired.svg',
      alt: 'Convite Expirado',
      width: 300,
      height: 200,
    }"
    :subtitle="$t('components.learningPlan.join.expired.description')"
    :submit-button-text="$t('components.learningPlan.join.expired.action')"
    :loading="loading"
    @submit="onCancel"
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
const invitationHash = ref<InvitationLinkSimple>();
const { t } = useI18n();

watch(learningPlanStore, () => {
  invitationHash.value = learningPlanStore.activeInviteLinks.find((link) => {
    return (
      link.hash === hash &&
      (!link.emails_to_send ||
        link.emails_to_send.includes(user.value?.email || ''))
    );
  });
  const isLinkEnabled = learningPlanStore.learningPlan?.invite_enabled;
  if (
    learningPlanStore.userIsActiveMember ||
    learningPlanStore.userIsFacilitator
  ) {
    setMessage('Voce já faz parte do curso!', 'blue', true);
    navigateTo(`/courses/${learningPlanStore.learningPlan?.id}`);
  }
  if (!invitationHash.value || !isLinkEnabled) {
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
        learning_class: invitationHash.value?.learning_class?.id,
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

.modal-body {
  width: 100%;
  max-width: 350px !important;
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
