<template>
  <div class="d-flex" style="gap: 24px">
    <alex-custom-card title="Sobre o curso" :save="onSave">
      <template #content>
        <span :contenteditable="canEdit">{{ text }}</span>
      </template>
    </alex-custom-card>
    <div>
      <alex-custom-card title="Details">
        <template #content>
          <app-general-boxes
            :boxes="[
              {
                icon: 'mdi-bookmark-box-multiple-outline',
                number: 0,
                label: $t('components.profile.general.courses'),
              },
              {
                icon: 'mdi-newspaper-variant-multiple-outline',
                number: 1,
                label: $t('components.profile.general.projects'),
              },
              {
                icon: 'mdi-check-decagram',
                number: 62,
                label: $t('components.profile.general.assignments'),
              },
            ]"
          />
        </template>
        <template #footer>
          <span> </span>
        </template>
      </alex-custom-card>
      <profile-competences label="dasda" />
    </div>
  </div>
</template>

<script setup lang="ts">
const { update } = useStrapi();
const props = defineProps({
  text: {
    type: String,
    required: true,
  },
  id: {
    type: Number,
    required: true,
  },
  canEdit: {
    type: Boolean,
    default: false,
  },
});

const { text } = toRefs(props);

const onSave = async () => {
  await update('learningplans', props.id, { description: text });
};
</script>
