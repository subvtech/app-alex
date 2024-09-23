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
    <Card
      v-for="member in filteredMembers"
      :key="member.id"
      v-model="selectedMembers"
      :member="{
        name: member.user.fullname,
        image: member.user?.avatar?.formats?.small?.url || member.user?.avatar?.url,
        responsable: member.responsable,
        email: member.email,
      }"
      :raw="member"
      no-delete
      @toggle-responsable-click="handleUpdateResponsible"
    />
    <template #footer>
      <alex-custom-dialog-footer
        no-secondary-button
        :main-button-text="'Adicionar'"
        :main-button-disabled="!hasSelectedMembers || !hasResponsable"
        @on-main-action="handleSubmit"
      />
    </template>
  </alex-custom-dialog>
</template>

<script setup lang="ts">
import { useQueryClient } from '@tanstack/vue-query';
import { Member, useGetProjectMembers } from '../../-composables/useMember';
import Card from './Card.vue';

interface AddStudent {
  learningplanId: number;
}
const model = defineModel<boolean>({ required: true });
const props = defineProps<AddStudent>();
type Emits = {
  'add-click': [members: LearningPlanMemberSimple[]];
};
defineEmits<Emits>();
// refs
// const { setMessage } = useMessageStore();
const search = ref('');
const loadingAdd = ref(false);
const learningplanValue = toRef(props, 'learningplanId');
const selectedMembers = ref<Member[]>([]);

// computed
const enabledGetMembers = computed(() => !!learningplanValue.value);
const hasSelectedMembers = computed(() => !!selectedMembers.value.length);
const hasResponsable = computed(() => !!selectedMembers.value.find((member) => member.responsable));
const filteredMembers = computed(() => members.value.filter((member) => contains(member.user.fullname, search.value)));
//
const { data: members } = useGetProjectMembers(learningplanValue, enabledGetMembers);
const queryClient = useQueryClient();

// Methods
const handleSubmit = () => {
  console.log(selectedMembers.value);
};
const handleUpdateResponsible = (member: Member | null) => {
  selectedMembers.value = selectedMembers.value.map((oldMember) => {
    if (member?.id === oldMember.id) {
      return { ...oldMember, responsable: true };
    }
    return { ...oldMember, responsable: false };
  });
  queryClient.setQueryData<Member[]>(['project-members', learningplanValue], (oldData) => {
    if (!oldData) {
      return oldData;
    }
    return oldData.map((oldMember) => {
      if (member?.id === oldMember.id) {
        return { ...oldMember, responsable: true };
      }
      return { ...oldMember, responsable: false };
    });
  });
};
</script>

<style lang="scss"></style>
