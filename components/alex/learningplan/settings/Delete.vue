<template>
  <alex-custom-card
    :title="$t(`components.${namespace}.settings.delete.courseTitle`)"
    full-width
    show-footer-divider
    :show-icon="false"
  >
    <template #content>
      <p>
        {{ $t(`components.${namespace}.settings.delete.courseDescription`) }}
      </p>
    </template>
    <template #footer>
      <div class="d-flex justify-end w-100 pt-6">
        <alex-learningplan-dialogs-delete-learningplan
          @update="emit('update')"
        />
      </div>
    </template>
  </alex-custom-card>
</template>
<script setup lang="ts">
const emit = defineEmits(['update']);
defineProps({
  namespace: {
    type: String as PropType<'courses' | 'trails'>,
    default: 'courses',
  },
});
</script>
