<template>
  <v-container
    class="bg-white h-72 rounded-t-lg px-6 border-bottom-gray-100"
    data-testid="alex-modal-header"
  >
    <v-row dense>
      <v-col class="w-100 d-flex align-center justify-start gap-2">
        <h4 class="text-h4 text-gray-800">{{ title }}</h4>
        <h4 v-if="highlight" class="text-h4 text-secondary-0">
          {{ highlight }}
        </h4>
      </v-col>
      <v-col cols="auto"
        ><alex-custom-button
          icon="mdi-close"
          variant="text"
          size="large"
          @click="() => emits('onClose')"
      /></v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
interface HeaderProps {
  title?: string;
  highlight?: string;
}
withDefaults(defineProps<HeaderProps>(), {
  title: 'Title',
  highlight: undefined,
});
const emits = defineEmits(['onClose']);
</script>

<style scoped>
.border-bottom-gray-100 {
  border-bottom: 1px solid rgb(var(--v-theme-gray-100)) !important;
}
.h-72 {
  height: 72px;
}
.h-76 {
  height: 76px;
}
</style>
