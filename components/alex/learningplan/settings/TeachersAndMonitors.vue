<template>
  <alex-custom-card title="Professores e Monitores do Curso" outline full-width>
    <template #content>
      <div class="w-100">
        <div class="mb-4">
          <p class="text-subtitle-2 mb-2"></p>
          <VAutocomplete v-model="selectedTeachers" v-model:search="teacherSearch" :items="teachers"
            :item-props="itemProps" item-value="id" return-object label="Selecionar professor" multiple chips clearable
            class="w-100" style="max-width: 50%" :chip-props="{ class: 'ma-1' }" />
        </div>

        <div class="mb-4">
          <p class="text-subtitle-2 mb-2"></p>
          <VAutocomplete v-model="selectedMonitors" v-model:search="monitorSearch" :items="monitors"
            :item-props="itemProps" item-value="id" return-object label="Selecionar monitor" multiple chips clearable
            class="w-100" style="max-width: 50%" :chip-props="{ class: 'ma-1' }" />
        </div>

        <div v-if="filteredsavedMembersTeachers.length > 0" class="mt-4">
          <p class="text-subtitle-2 mb-2">Professores:</p>
          <div class="d-flex flex-wrap gap-2">
            <VChip v-for="member in filteredsavedMembersTeachers" :key="member.id">
              {{ member.user?.fullname }}
              <VBtn v-if="!isPrimaryFacilitatorMember(member)" icon variant="text" size="x-small" class="ml-2"
                @click.stop.prevent="openTeacherDeleteDialog(member)">
                <VIcon size="x-small">mdi-close</VIcon>
              </VBtn>
            </VChip>
          </div>
        </div>

        <div v-if="filteredsavedMembersMonitors.length > 0" class="mt-4">
          <p class="text-subtitle-2 mb-2">Monitores:</p>
          <div class="d-flex flex-wrap gap-2">
            <VChip v-for="member in filteredsavedMembersMonitors" :key="member.id">
              {{ member.user?.fullname }}
              <VBtn v-if="!isPrimaryFacilitatorMember(member)" icon variant="text" size="x-small" class="ml-2"
                @click.stop.prevent="openMonitorDeleteDialog(member)">
                <VIcon size="x-small">mdi-close</VIcon>
              </VBtn>
            </VChip>
          </div>
        </div>

      </div>
      <alex-custom-confirm-dialog v-model="deleteDialog"
        :image="{ src: '/svg/exclusionImage.svg', width: 120, height: 100 }" title="Deseja realmente remover?"
        subtitle="Essa ação não poderá ser desfeita." variant="error" submit-button-text="Excluir" no-input-confirmation
        cancel-button-text="Cancelar" @submit="confirmDelete" @cancel="closeDeleteDialog" />
    </template>
    <template #footer>
      <div class="d-flex justify-end">
        <alex-custom-button @click="save">
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
const teacherSearch = ref('');
const monitorSearch = ref('');

type TeacherOption = {
  id: number;
  fullname?: string;
  email?: string;
};

type MonitorOption = {
  id: number;
  fullname?: string;
  email?: string;
};

const { find, create, destroy } = useStrapiUtils();

const selectedTeachers = ref<TeacherOption[]>([]);
const selectedMonitors = ref<MonitorOption[]>([]);
const teachers = ref<TeacherOption[]>([]);
const monitors = ref<MonitorOption[]>([]);
const savedMembersTeachers = ref<any[]>([]);
const savedMembersMonitors = ref<any[]>([]);

const filteredsavedMembersTeachers = computed(() =>
  savedMembersTeachers.value.filter((member) => member?.user?.isProfessor === true),
);

const filteredsavedMembersMonitors = computed(() =>
  savedMembersMonitors.value.filter((member) => member?.role === 'collaborator'),
);

const deleteDialog = ref(false);
const memberToDelete = ref<any | null>(null);
const memberTypeToDelete = ref<'teacher' | 'monitor' | null>(null);

const itemProps = (item: any) => ({
  title: item.fullname,
  subtitle: item.email,
});

const loadTeachers = async () => {
  const filters: any = {
    isProfessor: true,
  };

  if (teacherSearch.value) {
    filters.$or = [
      { email: { $containsi: teacherSearch.value } },
      { fullname: { $containsi: teacherSearch.value } },
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

const loadMonitors = async () => {
  const filters: any = {
    isProfessor: false,
  };

  if (monitorSearch.value) {
    filters.$or = [
      { email: { $containsi: monitorSearch.value } },
      { fullname: { $containsi: monitorSearch.value } },
    ];
  }

  try {
    const response = await find<MonitorOption>('users', {
      fields: ['id', 'fullname', 'email'],
      populate: ['avatar'],
      filters,
    });
    monitors.value = response?.data ?? [];
  } catch {
    monitors.value = [];
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

const saveMonitors = async () => {
  try {
    await Promise.all(
      selectedMonitors.value.map((monitor) =>
        create('learning-plan-members', {
          learningplan: learningPlanId,
          user: monitor.id,
          role: 'collaborator',
          email: monitor.email,
          status: 'joined',
          joined_at: new Date(),
        }),
      ),
    );
    // Recarrega a lista de membros salvos
    await loadSelectedMonitors();
    selectedMonitors.value = [];
  } catch (error) {
    console.error('Erro ao salvar monitores:', error);
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
    savedMembersTeachers.value = response?.data?.filter((member: any) => member?.user?.isProfessor === true) ?? [];
  } catch (error) {
    console.error('Erro ao carregar professores salvos:', error);
    savedMembersTeachers.value = [];
  }
};

const loadSelectedMonitors = async () => {
  try {
    const response = await find('learning-plan-members', {
      filters: {
        learningplan: { id: learningPlanId },
        user: { isProfessor: false },
      },
      populate: { user: { fields: ['id', 'fullname', 'email', 'isProfessor'] } },
    });
    savedMembersMonitors.value = response?.data?.filter((member: any) => member?.user?.isProfessor === false) ?? [];
  } catch (error) {
    console.error('Erro ao carregar monitores salvos:', error);
    savedMembersMonitors.value = [];
  }
};

const isPrimaryFacilitatorMember = (member: any) => {
  return Boolean(
    member?.isPrimaryFacilitator || member?.isPimaryFacilitator || member?.is_primary_facilitator,
  );
};

const openTeacherDeleteDialog = (member: any) => {
  memberToDelete.value = member;
  memberTypeToDelete.value = 'teacher';
  deleteDialog.value = true;
};

const openMonitorDeleteDialog = (member: any) => {
  memberToDelete.value = member;
  memberTypeToDelete.value = 'monitor';
  deleteDialog.value = true;
};

const closeDeleteDialog = () => {
  deleteDialog.value = false;
  memberToDelete.value = null;
};

const save = async () => {
  await saveTeachers();
  await saveMonitors();
};

const confirmDelete = async () => {
  if (!memberToDelete.value) {
    closeDeleteDialog();
    return;
  }

  try {
    await destroy('learning-plan-members', memberToDelete.value.id);

    if (memberTypeToDelete.value === 'teacher') {
      await loadSelectedTeachers();
    } else {
      await loadSelectedMonitors();
    }

    closeDeleteDialog();

  }
  catch (error) {
    console.error('Erro ao deletar membro:', error);
    closeDeleteDialog();
  }
};

onMounted(() => {
  loadTeachers();
  loadMonitors();
  loadSelectedTeachers();
  loadSelectedMonitors();
});

watch(teacherSearch, loadTeachers);
watch(monitorSearch, loadMonitors);

</script>