<template>
  <v-list-item :value="goal.id" class="pa-0 border rounded-lg">
    <v-list-item-title class="d-flex ga-1 pa-2"
      ><p class="text-body-3 text-gray-600">{{ goal.id }}.</p>

      <p class="flex-1-1 text-body-3 text-gray-600 text-wrap">
        <span v-if="goal.verb" class="font-weight-bold text-secondary-0">{{
          `${goal.verb} `
        }}</span
        ><span>{{ goal.description }}</span>
      </p></v-list-item-title
    >
  </v-list-item>
</template>

<script setup lang="ts">
interface GoalProps {
  id: number;
  description: string;
  verb?: string;
}

const goal = defineProps<GoalProps>();
</script>
