<template>
  <v-row justify="center" align="center">
    <v-col cols="12">
      <alex-custom-button @click="() => (createCourseDialog = true)">
        Novo Curso
      </alex-custom-button>
      <alex-learningplan-dialogs-create-learningplan
        v-model="createCourseDialog"
      />
    </v-col>
  </v-row>
</template>
<script setup lang="ts">
const createCourseDialog = ref(false);

definePageMeta({
  middleware: 'auth',
});
</script>

<style scoped lang="scss">
.max-w-200 {
  max-width: 200px;
}
</style>
