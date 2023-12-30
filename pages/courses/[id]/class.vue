<template>
  <div>
    <alex-learningplan-class-section-card
      v-model:search="searchMembers"
      v-model:dialog-model="dialogAddMember"
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
          :no-options="!learningPlanStore.userIsFacilitator"
          @delete="() => deleteParticipant(item.id)"
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
          remove-selection
          :loading-delete="removingMember && removingMemberId === member.id"
          :loading-second-button="
            resendingInviteMember && resendingInviteMemberId === member.id
          "
          @delete="onDeleteParticipant(member.id)"
          @second-button-action="onResendInvite(member)"
          ><template #secondButton="{ loading, click }">
            <alex-custom-button
              icon="mdi-cached"
              variant="text"
              :loading="loading"
              @click="click"
            /> </template
        ></alex-custom-list-item-user>
      </template>
    </alex-learningplan-class-section-card>
    <alex-learningplan-class-section-card
      v-model:search="searchGroups"
      v-model:dialog-model="dialogGroup"
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
      :dialog-action-text="dialogGroupActionText"
      :dialog-title="dialogGroupTitle"
      :filter-keys="['title']"
      :show-action="learningPlanStore.userIsFacilitator"
      :dialog-action-loading="creatingGroup"
      :dialog-action-disabled="!formAddGroup.meta.value.valid"
      empty-state-object-name="pages.classes.participant"
      @action="!editing ? onCreateGroup() : onUpdateGroup(editingGroupId)"
    >
      <!-- onUpdateGroup(item.id)  -->
      <template #item="{ item }">
        <alex-learningplan-class-group-card
          :title="item?.title"
          :members="getGroupMembersInfo(item.group_members)"
          :no-options="!learningPlanStore.userIsFacilitator"
          @delete="() => deleteGroupCard(item.id)"
          @edit="
            () => setUpdatedValues(item.id, item.title, item.group_members)
          "
          @open="() => openGroupCard(item)"
        />
      </template>
      <template #dialog-content>
        <v-form>
          <alex-inputs-text-field
            v-model="groupTitle"
            :schema="createGroupRules.groupTitle"
            label="Qual o nome do Grupo?"
            name="groupTitle"
            density="comfortable"
            placeholder="Digite o nome do grupo"
          />
          <alex-inputs-autocomplete
            v-model="selectedInChargeGroupMember"
            :schema="createGroupRules.leader"
            label="Quem será responsável pelo grupo?"
            placeholder="Selecione o responsável pelo grupo"
            name="leader"
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
            label="Quem serão os participantes do grupo?"
            :schema="createGroupRules.members"
            placeholder="Selecione os participantes para o grupo"
            name="members"
            variant="outlined"
            density="comfortable"
            item-title="user.fullname"
            :items="learningPlanStore.activeMembers || []"
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
              />
            </template>
          </alex-inputs-autocomplete>
          <alex-custom-list-item-user
            v-for="(member, i) in selectedGroupMembers"
            :key="`group-member-${i}`"
            :user="{
              email: member?.user?.email || '',
              name: member?.user?.fullname || '',
              image: member?.user?.avatar?.url || '',
            }"
            remove-selection
            @delete="() => removeSelectedGroupMember(member.id)"
          >
            <template
              v-if="member.id === selectedInChargeGroupMember?.id"
              #chip
            >
              <alex-custom-chip status="dark" size="small" text="Responsável" />
            </template>
          </alex-custom-list-item-user>
        </v-form>
      </template>
    </alex-learningplan-class-section-card>
    <alex-learningplan-class-participants-details-dialog
      v-model="dialogShowGroup"
      :show-values-group="showValuesGroup"
    />
    <alex-learningplan-dialogs-alert
      v-model="dialogConfirmDeleteGroup"
      variant="error"
      :image="{ src: '/svg/exclusionImage.svg', width: 120, height: 100 }"
      title="Realmente deseja excluir esse grupo?"
      subtitle="Ao desfazer esse grupo todos os conteúdos e alunos vinculados à perderão esse vínculo."
      submit-button-text="Excluir"
      @cancel="dialogConfirmDeleteGroup = false"
      @submit="() => onDeleteGroup(removingGroupId)"
    />
    <alex-learningplan-dialogs-alert
      v-model="confirmDeleteMember"
      variant="error"
      :image="{ src: '/svg/exclusionImage.svg', width: 120, height: 100 }"
      title="Realmente deseja remover esse participante da turma?"
      subtitle="Ao remover o participante ele ficará impossibilitado de acessar os conteúdos desse curso."
      submit-button-text="Excluir"
      @submit="() => onDeleteParticipant(removingMemberId)"
      @cancel="confirmDeleteMember = false"
    />
  </div>
</template>
<script setup lang="ts">
import { useForm } from 'vee-validate';
const { setMessage } = useMessageStore();
const { createGroupRules } = useFormRules();
const strapi = useStrapi();
const formAddGroup = useForm();
const editing = ref(false);
const editingGroupId = ref(0);
// Dialog
const dialogAddMember = ref(false);
const dialogGroup = ref(false);
const dialogShowGroup = ref(false);
const dialogConfirmDeleteGroup = ref(false);
const dialogGroupTitle = ref('Criar Curso');
const dialogGroupActionText = ref('Criar Curso');
//
const showValuesGroup = ref<{
  title: string;
  members: LearningPlanGroupMemberSimple[];
}>();

// Filters
const searchMembers = ref('');
const searchGroups = ref('');
//
const usersToInvite = ref([]);
const learningPlanStore = useLearningPlanStore();
const route = useRoute();
const learningPlanId = computed(() => parseInt(route.params?.id.toString()));
const sendingInvites = ref(false);
const creatingGroup = ref(false);
// Remove
const confirmDeleteMember = ref(false);
const removingMember = ref(false);
const removingMemberId = ref(0);
// const removingGroup = ref(false);
const removingGroupId = ref(0);
//
const groupTitle = ref('');
const headerStore = usePageHeaderStore();
const resendingInviteMember = ref(false);
const resendingInviteMemberId = ref(0);
const selectedInChargeGroupMember = ref<LearningPlanMemberSimple | null>(null);
const selectedGroupMembers = ref<LearningPlanMemberSimple[]>([]);
const ignoreUserIds = computed(() => {
  return learningPlanStore.learningPlan?.members?.map((m) => m.user?.id) || [];
});
const ignoreUserEmails = computed(() => {
  return learningPlanStore.learningPlan?.members?.map((m) => m.email) || [];
});

function removeSelectedGroupMember(id: number) {
  if (selectedInChargeGroupMember?.value?.id === id) {
    formAddGroup.setFieldError(
      'members',
      'Você não pode retirar o responsável dos integrantes',
    );
    setTimeout(() => {
      formAddGroup.setFieldError('members', undefined);
    }, 2000);
  }
  selectedGroupMembers.value = selectedGroupMembers.value.filter(
    (member) => member.id !== id,
  );
}
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

    setMessage('Convites enviados com sucesso!', 'green', true);
    await learningPlanStore.loadLearningPlan(learningPlanId.value);
  } catch (error) {
    setMessage('Erro ao enviar convites!', 'red', true);
  } finally {
    sendingInvites.value = false;
  }
}
async function onCreateGroup() {
  const { valid } = await formAddGroup.validate();
  if (!valid) {
    return;
  }
  try {
    creatingGroup.value = true;

    const members = selectedGroupMembers.value?.map(
      (member: LearningPlanMemberSimple) => {
        const role =
          member.id === selectedInChargeGroupMember.value?.id
            ? 'in_charge'
            : 'standard';
        return { role, member_id: member.id };
      },
    );

    const data = {
      title: groupTitle.value,
      learningplan: learningPlanId.value,
      group_members: members,
    };

    await strapi.create('learnin-plan-groups', data);
    setMessage('Grupo criado com sucesso!', 'green', true);
    learningPlanStore.loadLearningPlan(learningPlanId.value);
    selectedGroupMembers.value = [];
    selectedInChargeGroupMember.value = null;
    formAddGroup.resetForm();
    dialogGroup.value = false;
  } catch (_) {
    setMessage('Erro ao criar grupo!', 'red', true);
  } finally {
    creatingGroup.value = false;
  }
}
async function onDeleteGroup(id: number) {
  const { valid } = await formAddGroup.validate();
  if (!valid) {
    return;
  }
  try {
    await strapi.delete('learnin-plan-groups', id);
    setMessage('Grupo excluido com sucesso!', 'green', true);
    learningPlanStore.loadLearningPlan(learningPlanId.value);
  } catch (_) {
    setMessage('Erro ao excluir grupo!', 'red', true);
  } finally {
    dialogConfirmDeleteGroup.value = false;
  }
}
async function onUpdateGroup(id: number) {
  const { valid } = await formAddGroup.validate();
  if (!valid) {
    return;
  }
  try {
    const members = selectedGroupMembers.value?.map(
      (member: LearningPlanMemberSimple) => {
        return member.user.id;
      },
    );
    const data = {
      title: groupTitle.value,
      learningplan: learningPlanId.value,
      group_members: members,
    };

    await strapi.update('learnin-plan-groups', id, data);
    setMessage('Grupo atualizado com sucesso!', 'green', true);
    learningPlanStore.loadLearningPlan(learningPlanId.value);
  } catch (_) {
    setMessage('Erro ao atualizar o grupo!', 'red', true);
  }
}
function setUpdatedValues(
  id: number,
  title: string,
  groupMembers: LearningPlanGroupMemberSimple[],
) {
  dialogGroupTitle.value = 'Editar Grupo ';
  dialogGroupActionText.value = 'Atualizar Grupo';
  dialogGroup.value = true;
  editingGroupId.value = id;
  editing.value = true;
  groupTitle.value = title;
  const selectedMembersList =
    (learningPlanStore?.activeMembers?.filter((activeMember) =>
      groupMembers
        .map((member) => member.student_member.id)
        .includes(activeMember.id),
    ) as LearningPlanMemberSimple[]) || [];
  formAddGroup.setFieldValue('members', selectedMembersList);
  selectedGroupMembers.value = selectedMembersList;
  const leader = filterMembersByRole('IN_CHARGE', groupMembers);
  const leaderId = leader ? leader[0]?.student_member?.id : undefined;
  const selectedLeader =
    selectedMembersList.filter((member) => member.id === leaderId)[0] ||
    undefined;
  selectedInChargeGroupMember.value = selectedLeader;
  formAddGroup.setFieldValue('leader', selectedLeader);
}
function getGroupMembersInfo(groupMembers: LearningPlanGroupMemberSimple[]) {
  return groupMembers?.map((groupMember) => {
    return {
      name: groupMember.student_member?.user?.fullname || '',
      image: groupMember.student_member?.user?.avatar || '',
      role: groupMember.role,
    };
  });
}
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
    confirmDeleteMember.value = false;
  }
}
function deleteParticipant(id: number) {
  removingMemberId.value = id;
  confirmDeleteMember.value = true;
}
function searchGroupMembers(_itemTitle: string, queryText: string, item: any) {
  return (
    item.raw.user.fullname.toLowerCase().includes(queryText) ||
    item.raw.user.email.toLowerCase().includes(queryText)
  );
}
function filterMembersByRole(
  role: keyof typeof learningPlanGroupMemberRolesSimple,
  members?: LearningPlanGroupMemberSimple[],
) {
  return members?.filter(
    (member) => member.role === learningPlanGroupMemberRolesSimple[role],
  );
}
function openGroupCard(item: any) {
  dialogShowGroup.value = true;
  showValuesGroup.value = {
    title: item.title,
    members: item.group_members,
  };
}
function deleteGroupCard(id: number) {
  removingGroupId.value = id;
  dialogConfirmDeleteGroup.value = true;
}

onBeforeMount(() => {
  headerStore.showHeader = true;
  headerStore.title = 'Meus Cursos';
  headerStore.items = [
    {
      title: 'Home',
      to: '/',
    },
    {
      title: 'Meus Curos',
      to: '/courses/me',
    },
    {
      title: learningPlanStore.learningPlan
        ? learningPlanStore.learningPlan.title
        : 'Curso',
      to: `/courses/${learningPlanId.value}`,
    },
    {
      title: 'Turma',
    },
  ];
});

watch(
  () => [selectedGroupMembers.value, selectedInChargeGroupMember.value],
  () => {
    const alreadyHasLeader = selectedGroupMembers.value.filter(
      (member) => member.id === selectedInChargeGroupMember?.value?.id,
    );
    if (selectedInChargeGroupMember.value && !alreadyHasLeader.length) {
      selectedGroupMembers.value = [
        selectedInChargeGroupMember.value,
        ...selectedGroupMembers.value,
      ];
    }
  },
);

watch(dialogGroup, (value) => {
  if (!value) {
    groupTitle.value = '';
    selectedGroupMembers.value = [];
    selectedInChargeGroupMember.value = null;
    formAddGroup.resetForm();
    editing.value = false;
    dialogGroupTitle.value = 'Criar Grupo ';
    dialogGroupActionText.value = 'Criar Grupo';
    editing.value = false;
  }
});
</script>
