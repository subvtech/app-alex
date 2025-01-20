<script setup lang="ts">
import { useQueryClient } from '@tanstack/vue-query';

const user = useStrapiUser<User>();
const createProjectDialog = ref(false);
const queryClient = useQueryClient();

const { t } = useI18n();
const { find, update } = useStrapiUtils();
const { delete: strapiDel } = useStrapi();
const { setMessage } = useMessageStore();

const projectListing = ref<null | any>(null);

const confirmProjectDialog = ref<boolean>(false);
const pendingInvitations = ref<LearningPlanMemberSimple[]>([]);

const isProfessor = computed(() => {
  return user.value?.role?.type === UserRoles.PROFESSOR;
});

const updateProjects = () => {
  queryClient.invalidateQueries({ queryKey: ['my-projects'] });
};

const handleInvitation = async (accept: boolean) => {
  confirmProjectDialog.value = false;

  const member = pendingInvitations.value.shift();

  if (!member) {
    return;
  }

  if (!accept)
    await strapiDel('learning-plan-members', member.id).catch(() => {
      setMessage(t('pages.projects.confirm.rejectFail'), 'error', true);
    });
  else
    await update('learning-plan-members', member.id, {
      status: 'joined',
    })
      .then(() => {
        setMessage(t('pages.projects.confirm.joinSuccess'), 'success', true);
        projectListing.value?.refetch();
      })
      .catch(() => {
        setMessage(t('pages.projects.confirm.joinFail'), 'error', true);
      });
};

onMounted(() => {
  find('learning-plan-members', {
    filters: {
      user: user.value?.id,
      status: 'pending_invitation',
      learningplan: {
        type: 'project',
      },
    },
    populate: ['learningplan'],
  }).then(({ data }) => {
    pendingInvitations.value = data as LearningPlanMemberSimple[];
    confirmProjectDialog.value = !!data.length;
  });
});

watch(confirmProjectDialog, (open) => {
  if (!open && pendingInvitations.value.length) {
    confirmProjectDialog.value = true;
  }
});
</script>

<template>
  <div class="flex-grow-1 d-flex flex-column">
    <alex-custom-header
      class="mb-6"
      :title="$t('pages.projects.common.my_projects')"
      :has-main-button="isProfessor"
      :main-button-text="$t('pages.projects.common.new_project')"
      button-size="large"
      main-button-icon="mdi-plus"
      no-back-arrow
      @main-action="() => (createProjectDialog = true)"
    />
    <alex-learningplan-listing ref="projectListing" type="project" />
    <alex-project-dialogs-create v-model="createProjectDialog" @submit="updateProjects" />

    <!-- v-model -->
    <alex-custom-confirm-dialog
      v-if="pendingInvitations.length"
      v-model="confirmProjectDialog"
      variant="primary"
      persistent
      :title="$t('components.learningPlan.join.active.title')"
      image-class="mb-6"
      :image="{
        src: '/svg/Invite.svg',
        alt: $t('components.learningPlan.invite'),
        width: 300,
        height: 200,
      }"
      :loading="false"
      :submit-button-text="$t('components.learningPlan.join.active.action')"
      :cancel-button-text="$t('pages.projects.confirm.reject')"
      @submit="() => handleInvitation(true)"
      @cancel="() => handleInvitation(false)"
    >
      <template #subtitle>
        {{ $t('components.learningPlan.join.active.description') }}
        <strong>{{ pendingInvitations[0]?.learningplan?.title ?? '' }}</strong>
      </template>
    </alex-custom-confirm-dialog>
  </div>
</template>
