<template>
  <alex-custom-card
    :title="$t('components.courses.settings.delete.courseTitle')"
    full-width
    show-footer-divider
    :show-icon="false"
  >
    <template #content>
      <p>
        {{ $t('components.courses.settings.delete.courseDescription') }}
      </p>
    </template>
    <template #footer>
      <div class="d-flex justify-end w-100 pt-6">
        <alex-learningplan-dialogs-delete-learningplan />
      </div>
    </template>
  </alex-custom-card>
</template>
<script setup lang="ts"></script>
