<template>
  <v-row justify="center" align="center">
    <v-col cols="12">
      <alex-learningplan-task-chat-input
        class="bg-white p-2"
        :submissions="[
          {
            id: 1,
            status: 'reviewed',
            mark: 1,
            maxMark: 10,
            time: new Date(),
          },
        ]"
        @submit="(values) => console.log(values)"
      />
    </v-col>
  </v-row>
</template>
<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
  layout: 'default',
});
</script>

<style scoped lang="scss">
.max-w-200 {
  max-width: 200px;
}
</style>
