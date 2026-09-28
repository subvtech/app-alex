<template>
  <alex-custom-card :title="$t('components.projects.settings.title')" :align-content="'align-center'">
    <template #content>
      <div class="d-flex flex-column w-100 gap-6 justify-center settings-content">
        <alex-project-settings-general
          :id="project.id"
          :title="project.title"
          :description="project.description"
          :start-date="project.start_date"
          :end-date="project.end_date"
          :slug="project.slug"
          @update="updateGeneral"
        />
        <alex-project-settings-delete @update="removeProject" />
      </div>
    </template>
  </alex-custom-card>
</template>

<script setup lang="ts">
const props = defineProps<{
  project: LearningPlanSimple;
}>();

const emit = defineEmits(['update']);
const { update } = useStrapi();
const { setMessage } = useMessageStore();
const { t } = useI18n();
const router = useRouter();

const updateGeneral = async (data: Record<string, string>) => {
  await update('learningplans', props.project.id, data);
  setMessage(t('components.projects.settings.general.update'), 'green', true);
  emit('update');
};

const removeProject = async () => {
  await update('learningplans', props.project.id, {
    archived_at: new Date(),
  });
  setMessage(t('components.projects.settings.delete.update'), 'green', true);
  await router.push('/projects/me');
};
</script>

<style scoped lang="scss">
.settings-content {
  max-width: 804px;
}
</style>
