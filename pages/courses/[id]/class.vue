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
      :show-action="learningPlanStore.userIsFacilitator"
      dialog-action-text="Enviar convites"
      :dialog-action-loading="sendingInvites"
      :dialog-action-disabled="!usersToInvite.length"
      @action="onClickSendInvites"
    >
      <template #item="{ item }">
        <alex-learningplan-class-member-card
          :name="item?.user?.fullname"
          :email="item.email"
          :avatar-image="item?.user?.avatar?.url"
          :cover-image="item?.user?.cover"
          :role="item?.role"
          @delete="() => onDeleteParticipant(item.id)"
        />
      </template>
      <template #dialog-content>
        <alex-inputs-users-autocomplete
          v-model="usersToInvite"
          name="usersToInvite"
          class="w-100"
          :ignore-user-ids="ignoreUserIds"
          :ignore-emails="ignoreUserEmails"
          :label="$t('components.learningPlan.dialogs.whoParticipate')"
          :placeholder="$t('components.learningPlan.dialogs.searchMember')"
        />
        <p>Convites pendentes</p>
        <alex-custom-list-item-user
          v-for="(member, i) in learningPlanStore.pendingMembers"
          :key="`pending-member-${i}`"
          :user="{
            name: member.user?.fullname,
            email: member.email,
            image: member.user?.avatar?.url,
          }"
          no-select
          status="pending"
          :loading-delete="removingMember && removingMemberId === member.id"
          :loading-refresh="
            resendingInviteMember && resendingInviteMemberId === member.id
          "
          @delete="onDeleteParticipant(member.id)"
          @refresh="onResendInvite(member)"
        />
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
      dialog-action-text="Criar Grupo"
      @action="onCreateGroup"
    >
      <template #dialog-content>
        <alex-inputs-text-field
          label="Qual o nome do Grupo?*"
          name="group_name"
          density="comfortable"
        />
        <alex-inputs-autocomplete
          v-model="selectedInChargeGroupMember"
          label="Quem será responsável pelo grupo?"
          name="in_charge"
          variant="outlined"
          density="comfortable"
          item-title="user.fullname"
          :custom-filter="searchGroupMembers"
          :items="learningPlanStore.activeMembers"
          return-object
        >
          <template #item="{ props: propsItem, item, index }">
            <alex-custom-list-item-user
              v-bind="propsItem"
              :key="index"
              :user="{
                email: item.raw.user.email,
                name: item.raw.user.fullname,
              }"
              no-delete
            />
          </template>
        </alex-inputs-autocomplete>
        <alex-inputs-autocomplete
          v-model="selectedGroupMembers"
          label="Quem será responsável pelo grupo?"
          name="in_charge"
          variant="outlined"
          density="comfortable"
          :items="membersToCreateGroup"
          :custom-filter="searchGroupMembers"
          return-object
          multiple
        >
          <template #selection>
            <span></span>
          </template>
          <template #item="{ props: propsItem, item, index }">
            <alex-custom-list-item-user
              v-bind="propsItem"
              :key="index"
              :user="{
                email: item.raw.user.email,
                name: item.raw.user.fullname,
                image: item.raw.user?.avatar?.url,
              }"
              no-delete
            />
          </template>
        </alex-inputs-autocomplete>
        <alex-custom-list-item-user
          v-for="(member, i) in groupMembers"
          :key="`group-member-${i}`"
          :user="{
            email: member?.user?.email || '',
            name: member?.user?.fullname || '',
            image: member?.user?.avatar?.url,
          }"
          no-delete
        />
      </template>
    </alex-learningplan-class-section-card>
  </div>
</template>
<script setup lang="ts">
const strapi = useStrapi();
const { setMessage } = useMessageStore();
const searchMembers = ref('');
const searchGroups = ref('');
const usersToInvite = ref([]);
const learningPlanStore = useLearningPlanStore();
const route = useRoute();
const learningPlanId = computed(() => parseInt(route.params?.id.toString()));
const sendingInvites = ref(false);
const removingMember = ref(false);
const removingMemberId = ref(0);

const resendingInviteMember = ref(false);
const resendingInviteMemberId = ref(0);

const selectedInChargeGroupMember = ref<LearningPlanMemberSimple>();
const selectedGroupMembers = ref<LearningPlanMemberSimple[]>([]);

watch(selectedInChargeGroupMember, () => {
  selectedGroupMembers.value = selectedGroupMembers.value.filter(
    (m) => m.id !== selectedInChargeGroupMember.value?.id,
  );
});

async function onClickSendInvites() {
  if (!usersToInvite.value.length) {
    return;
  }

  try {
    sendingInvites.value = true;

    await strapi.update<LearningPlanSimple>(
      'learningplans',
      learningPlanId.value,
      {
        members: usersToInvite.value,
      },
    );

    usersToInvite.value = [];

    await learningPlanStore.loadLearningPlan(learningPlanId.value);
  } catch (error) {
    console.log(error);
    setMessage('Erro ao enviar convites!', 'red', true);
  } finally {
    sendingInvites.value = false;
  }
}

function onCreateGroup() {
  console.log('onCreateGroup');
}

const ignoreUserIds = computed(() => {
  return learningPlanStore.learningPlan?.members?.map((m) => m.user?.id) || [];
});

const ignoreUserEmails = computed(() => {
  return learningPlanStore.learningPlan?.members?.map((m) => m.email) || [];
});

const membersToCreateGroup = computed<LearningPlanMemberSimple[]>(() => {
  return (
    learningPlanStore.activeMembers?.filter(
      (member) => member.id !== selectedInChargeGroupMember.value?.id,
    ) || []
  );
});

const groupMembers = computed<LearningPlanMemberSimple[]>(() => {
  return selectedInChargeGroupMember.value
    ? [selectedInChargeGroupMember.value, ...selectedGroupMembers.value]
    : selectedGroupMembers.value;
});

async function onResendInvite(member: LearningPlanMemberSimple) {
  try {
    resendingInviteMemberId.value = member.id;
    resendingInviteMember.value = true;

    const data = {
      learningplan: learningPlanId.value,
      duration: 259200,
      emails_to_send: member.email,
      role: member.role,
    };

    await strapi.create('invitation-links', data);
    setMessage('Convite reenviado com sucesso!', 'green', true);
  } catch (error) {
    setMessage('Não foi possivel reenviar o convite!', 'red', true);
  } finally {
    resendingInviteMember.value = false;
  }
}

async function onDeleteParticipant(id: number) {
  try {
    removingMember.value = true;
    removingMemberId.value = id;

    const response = await strapi.delete('learning-plan-members', id);
    if (response.data.id) {
      await learningPlanStore.loadLearningPlan(learningPlanId.value);
      setMessage('Participante removido com sucesso!', 'green', true);
    }
  } catch (error) {
    setMessage('Erro ao remover participante!', 'red', true);
  } finally {
    removingMember.value = false;
  }
}

function searchGroupMembers(_itemTitle, queryText, item) {
  return (
    item.raw.user.fullname.toLowerCase().includes(queryText) ||
    item.raw.user.email.toLowerCase().includes(queryText)
  );
}
</script>
<style scoped lang="scss"></style>
