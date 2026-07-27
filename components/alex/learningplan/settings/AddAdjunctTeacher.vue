<template>
  <alex-custom-card
    title="Professores Colaboradores"
    outline
    full-width
  >
    <template #content>
      <div class="w-100">
        <div class="mb-4">
          <p class="text-subtitle-2 mb-2">Adicionar novo professor:</p>
          <VAutocomplete
            v-model="selectedTeachers"
            v-model:search="search"
            :items="teachers"
            :item-props="itemProps"
            item-value="id"
            return-object
            label="Professores"
            multiple
            chips
            clearable
            class="w-100"
            style="max-width: 50%"
            :chip-props="{ class: 'ma-1' }"
          />
        </div>

        <div v-if="filteredSavedMembers.length > 0" class="mt-4">
          <p class="text-subtitle-2 mb-2">Professores adicionados:</p>
          <div class="d-flex flex-wrap gap-2">
            <VChip
              v-for="member in filteredSavedMembers"
              :key="member.id"
            >
              {{ member.user?.fullname }}
              <VBtn
                v-if="!isPrimaryFacilitatorMember(member)"
                icon
                variant="text"
                size="x-small"
                class="ml-2"
                @click.stop.prevent="openTeacherDeleteDialog(member)"
              >
                <VIcon size="x-small">mdi-close</VIcon>
              </VBtn>
            </VChip>
          </div>
        </div>
      </div>
      <alex-custom-confirm-dialog
        v-model="deleteDialog"
        :image="{ src: '/svg/exclusionImage.svg', width: 120, height: 100 }"
        title="Deseja realmente remover este professor?"
        subtitle="Essa ação não poderá ser desfeita."
        variant="error"
        submit-button-text="Excluir"
        no-input-confirmation
        cancel-button-text="Cancelar"
        @submit="confirmDeleteTeacher"
        @cancel="closeDeleteDialog"
      />
    </template>
    <template #footer>
      <div class="d-flex justify-end">
        <alex-custom-button @click="saveTeachers">
          Salvar
        </alex-custom-button>
      </div>
    </template>
  </alex-custom-card>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, watch } from 'vue';
import { useStrapiUtils } from '../../../../composables/useStrapiUtils';

const props = defineProps<{
  learningPlanId: number;
}>();

const learningPlanId = props.learningPlanId;
const search = ref('');

type TeacherOption = {
  id: number;
  fullname?: string;
  email?: string;
};

const { find, create, destroy } = useStrapiUtils();

const selectedTeachers = ref<TeacherOption[]>([]);
const teachers = ref<TeacherOption[]>([]);
const savedMembers = ref<any[]>([]);
const filteredSavedMembers = computed(() =>
  savedMembers.value.filter((member) => member?.user?.isProfessor === true),
);
const deleteDialog = ref(false);
const memberToDelete = ref<any | null>(null);

const itemProps = (item: any) => ({
  title: item.fullname,
  subtitle: item.email,
});

const loadTeachers = async () => {
  const filters: any = {
    isProfessor: true,
  };

  if (search.value) {
    filters.$or = [
      { email: { $containsi: search.value } },
      { fullname: { $containsi: search.value } },
    ];
  }

  try {
    const response = await find<TeacherOption>('users', {
      fields: ['id', 'fullname', 'email'],
      populate: ['avatar'],
      filters,
    });
    teachers.value = response?.data ?? [];
  } catch {
    teachers.value = [];
  }
};

const saveTeachers = async () => {
  try {
    await Promise.all(
      selectedTeachers.value.map((teacher) =>
        create('learning-plan-members', {
          learningplan: learningPlanId,
          user: teacher.id,
          role: 'facilitator',
          email: teacher.email,
          status: 'joined',
          joined_at: new Date(),
        }),
      ),
    );
    // Recarrega a lista de membros salvos
    await loadSelectedTeachers();
    selectedTeachers.value = [];
  } catch (error) {
    console.error('Erro ao salvar professores:', error);
  }
};

const loadSelectedTeachers = async () => {
  try {
    const response = await find('learning-plan-members', {
      filters: {
        learningplan: { id: learningPlanId },
        user: { isProfessor: true },
      },
      populate: { user: { fields: ['id', 'fullname', 'email', 'isProfessor'] } },
    });
    savedMembers.value = response?.data?.filter((member: any) => member?.user?.isProfessor === true) ?? [];
  } catch (error) {
    console.error('Erro ao carregar professores salvos:', error);
    savedMembers.value = [];
  }
};

const isPrimaryFacilitatorMember = (member: any) => {
  return Boolean(
    member?.isPrimaryFacilitator || member?.isPimaryFacilitator || member?.is_primary_facilitator,
  );
};

const openTeacherDeleteDialog = (member: any) => {
  memberToDelete.value = member;
  deleteDialog.value = true;
};

const closeDeleteDialog = () => {
  deleteDialog.value = false;
  memberToDelete.value = null;
};

const confirmDeleteTeacher = async () => {
  if (!memberToDelete.value) {
    closeDeleteDialog();
    return;
  }

  await deleteTeacher(memberToDelete.value.id);
  closeDeleteDialog();
};

const deleteTeacher = async (memberId: number) => {
  try {
    await destroy('learning-plan-members', memberId);
    await loadSelectedTeachers();
  } catch (error) {
    console.error('Erro ao deletar professor:', error);
  }
};

onMounted(() => {
  loadTeachers();
  loadSelectedTeachers();
});

watch(search, loadTeachers);

</script>