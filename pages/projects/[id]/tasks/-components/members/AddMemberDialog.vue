<template>
  <alex-custom-dialog
    v-model="model"
    :title="$t('components.learningPlan.drawer.task.dialog.newMembers')"
    :main-button-text="$t('components.learningPlan.drawer.task.dialog.add')"
    :loading="loadingAdd"
    @on-main-action="handleSubmit"
    @on-secondary-action="model = false"
  >
    <template #activator="{ isActive, props: activatorProps }">
      <slot name="activator" :is-active="isActive" :props="activatorProps" />
    </template>
    <alex-inputs-text-field
      v-model="search"
      name="search"
      class="tw-mb-6"
      :placeholder="$t('components.learningPlan.drawer.task.dialog.searchMembers')"
      prepend-inner-icon="mdi-magnify"
      density="comfortable"
      hide-details
    />
    <p v-if="false" class="text-body-1 text-gray-400 text-center">
      Parece que todos os alunos foram adicionados a esta tarefa.
    </p>
    <template v-if="filteredMembers.length">
      <Card
        v-for="member in filteredMembers"
        :key="member.raw.id"
        v-model="selectedMembers"
        :member="{
          name: member.raw.user.fullname,
          image: member.raw.user?.avatar?.formats?.small?.url || member.raw.user?.avatar?.url,
          responsable: member.role === learningPlanGroupMemberRolesSimple.IN_CHARGE,
          email: member.raw.email,
        }"
        :raw="member"
        no-delete
        @toggle-responsible-click="handleUpdateResponsible"
      />
    </template>
    <template v-else>
      <div class="d-flex align-center justify-center flex-column ga-4 text-center">
        <img
          class="no-members-svg"
          src="/svg/no-members.svg"
          :alt="$t('pages.projects.tasks.all_members_added')"
          role="no-members"
        />
        <p class="text-body-3 text-gray-400">
          {{ $t('pages.projects.tasks.all_members_added') }}
        </p>
      </div>
    </template>
    <template #footer>
      <alex-custom-dialog-footer
        no-secondary-button
        :main-button-text="'Adicionar'"
        :main-button-disabled="!hasSelectedMembers || !hasResponsable"
        @on-main-action="handleSubmit"
        @on-secondary-action="model = false"
      />
    </template>
  </alex-custom-dialog>
</template>

<script setup lang="ts">
import { useQueryClient } from '@tanstack/vue-query';
import { MemberItem, useGetProjectMembers } from '../../-composables/useMember';
import Card from './Card.vue';

interface AddMemberDialog {
  learningplanId?: number;
  groupId?: number;
  defaultMembers?: LearningPlanGroupMemberSimple[];
}
const model = defineModel<boolean>({ required: true });
const props = withDefaults(defineProps<AddMemberDialog>(), {
  learningplanId: undefined,
  groupId: undefined,
  defaultMembers: () => [],
});
type Emits = {
  'add-click': [groupId: number, members: MemberItem[]];
};
const emit = defineEmits<Emits>();
// refs
// const { setMessage } = useMessageStore();
const search = ref('');
const loadingAdd = ref(false);
const learningplanValue = toRef(props, 'learningplanId');
const selectedMembers = ref<(MemberItem & { responsable: boolean })[]>([]);

// computed
const enabledGetMembers = computed(() => !!learningplanValue.value);
const hasSelectedMembers = computed(() => !!selectedMembers.value.length);
const hasResponsable = computed(
  () =>
    !!selectedMembers.value.find((member) => member.role === 'in_charge') ||
    !!props.defaultMembers.find((member) => member.role === 'in_charge'),
);
const filteredAlreadyMembers = computed(() =>
  members.value.filter((member) => {
    const alreadyMember = props.defaultMembers?.find((alreadyMember) => alreadyMember.student_member.id === member.id);
    return !alreadyMember;
  }),
);
const filteredMembers = computed(() =>
  filteredAlreadyMembers.value.filter((member) => contains(member.raw.user.fullname, search.value)),
);
//
const { data: members } = useGetProjectMembers(learningplanValue, enabledGetMembers);
const queryClient = useQueryClient();

// Methods
const handleSubmit = () => {
  if (!props.groupId) {
    return;
  }
  emit('add-click', props.groupId, selectedMembers.value);
  selectedMembers.value = [];
};
const handleUpdateResponsible = (member: MemberItem | null) => {
  selectedMembers.value = selectedMembers.value.map((oldMember) => {
    if (member?.id === oldMember.id) {
      return { ...oldMember, role: 'in_charge' };
    }
    return { ...oldMember, role: 'standard' };
  });
  queryClient.setQueryData<MemberItem[]>(['project-members', learningplanValue], (oldData) => {
    if (!oldData) {
      return oldData;
    }
    return oldData.map((oldMember) => {
      if (member?.id === oldMember.id) {
        return { ...oldMember, role: 'in_charge' };
      }
      return { ...oldMember, role: 'standard' };
    });
  });
};
</script>

<style lang="scss"></style>
