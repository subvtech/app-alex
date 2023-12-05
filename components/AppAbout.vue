<template>
  <div class="d-flex gap" :class="fullWidth ? 'w-100' : ''">
    <alex-custom-card title="Sobre o curso" :save="onSave" full-width>
      <template #content>
        <span :contenteditable="canEdit">{{ text }}</span>
      </template>
    </alex-custom-card>
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
  fullWidth: {
    type: Boolean,
    default: false,
  },
});

const { text } = toRefs(props);

const onSave = async () => {
  await update('learningplans', props.id, { description: text });
};
</script>
<style scoped lang="scss">
.gap {
  gap: 24px;
}
</style>