<template>
  <alex-custom-card title="Sobre o curso">
    <template #content>
      <span contenteditable>{{ text }}</span>
    </template>
  </alex-custom-card>
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
});

const save = async () => {
  await update('courses', props.id);
};
</script>
