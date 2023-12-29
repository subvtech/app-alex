<template>
  <alex-custom-card
    :title="$t(`components.${namespace}.settings.delete.courseTitle`)"
    full-width
    show-footer-divider
    :show-icon="false"
  >
    <template #content>
      <p class="text">
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

<style scoped lang="scss">
.text {
  color: var(--Cinza-Cinza-700, #5A636D);
text-align: justify;

/* Body/P3 */
font-family: Sen;
font-size: 14px;
font-style: normal;
font-weight: 400;
line-height: 135%; /* 18.9px */
letter-spacing: 0.28px;
}</style>
