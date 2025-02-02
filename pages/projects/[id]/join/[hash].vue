<template>
  <alex-custom-confirm-dialog
    v-if="!learningPlanStore.loading && invitationHash && !invitationHash.is_expired"
    v-model="openConfirmation"
    variant="primary"
    persistent
    :title="$t('components.learningPlan.join.active.titleProject')"
    image-class="mb-6"
    :image="{
      src: '/svg/Invite.svg',
      alt: $t('components.learningPlan.invite'),
      width: 300,
      height: 200,
    }"
    :loading="loading"
    :submit-button-text="$t('components.learningPlan.join.active.action')"
    :cancel-button-text="$t('components.courses.settings.meetings.delete.cancel')"
    @submit="onConfirm"
    @cancel="onCancel"
  >
    <template #subtitle>
      {{ $t('components.learningPlan.join.active.descriptionProject') }}
      <strong>{{ learningPlanStore.learningPlan?.title }}</strong>
    </template>
  </alex-custom-confirm-dialog>
  <alex-custom-confirm-dialog
    v-else-if="!learningPlanStore.loading && invitationHash && invitationHash.is_expired"
    v-model="openConfirmation"
    variant="primary"
    persistent
    hide-cancel-button
    :title="$t('components.learningPlan.join.expired.title')"
    :image="{
      src: '/svg/InviteExpired.svg',
      alt: $t('components.courses.invites.expired'),
      width: 300,
      height: 200,
    }"
    :subtitle="$t('components.learningPlan.join.expired.description')"
    :submit-button-text="$t('components.learningPlan.join.expired.action')"
    :cancel-button-text="$t('components.courses.settings.meetings.delete.cancel')"
    :loading="loading"
    @submit="onCancel"
  />
  <v-row v-else justify="center">
    <v-progress-circular indeterminate color="accent" size="100" width="6" />
  </v-row>
</template>
<script lang="ts" setup>
const learningPlanStore = useLearningPlanStore();
const { setMessage } = useMessageStore();
const user = useStrapiUser();
const route = useRoute();
const strapi = useStrapi();

const hash = route.params.hash?.toString();

const openConfirmation = ref<boolean>(false);
const loading = ref<boolean>(false);
const invitationHash = ref<InvitationLinkSimple>();

onMounted(() => {
  if (!user.value) {
    return navigateTo('/login?redirect=' + route.fullPath, { replace: true });
  }

  if (!learningPlanStore.learningPlan) {
    learningPlanStore.loadLearningPlan(+route.params.id);
  }
});

watch(learningPlanStore, () => {
  if (!learningPlanStore.learningPlan) {
    return;
  }

  invitationHash.value = learningPlanStore.activeInviteLinks.find((link) => {
    return link.hash === hash && (!link.emails_to_send || link.emails_to_send.includes(user.value?.email || ''));
  });

  const isLinkEnabled = learningPlanStore.learningPlan?.invite_enabled;
  if (learningPlanStore.userIsActiveMember || learningPlanStore.userIsFacilitator) {
    setMessage('Voce já faz parte do projeto!', 'blue', true);
    navigateTo(`/projects/${learningPlanStore.learningPlan?.id}`);
  }
  if (!invitationHash.value || !isLinkEnabled) {
    setMessage('Convite não encontrado!', 'red', true);
    navigateTo('/projects/me');
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
      const member = learningPlanStore.pendingMembers.find(
        (member) => member.user?.id === user.value?.id || member.email === user.value?.email,
      );

      const id = member?.id;

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
    navigateTo(`/projects/${learningPlanStore.learningPlan?.id}`);
    loading.value = false;
    openConfirmation.value = false;
  } catch (_) {
    setMessage('Não foi possivel finalizar a operação. Tente Novamente!', 'red', true);
  } finally {
    loading.value = false;
  }
}
</script>
