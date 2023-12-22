<template>
  <v-row justify="center" align="center">
    <v-col cols="12">
      <!-- <alex-custom-button
        text="test"
        @click="
          () => {
            create('learningplans', {
              title: 'test1243',
              start_date: '2023-12-22',
              type: 'course',
              slug: 'test1243',
              invitation_enabled: true,
              invitation_duration: 3600,
            });
          }
        "
      /> -->
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
// const { create } = useStrapi4();
definePageMeta({
  middleware: 'auth',
  layout: 'components',
});
</script>

<style scoped lang="scss">
.max-w-200 {
  max-width: 200px;
}
</style>
