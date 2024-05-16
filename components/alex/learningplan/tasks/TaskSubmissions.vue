<template>
  <HoverCard>
    <HoverCardTrigger>
      <v-icon icon="mdi-paperclip" />
      {{ completed + underReview }}
      entregas
    </HoverCardTrigger>
    <HoverCardContent>
      <div class="d-flex justify-space-between pb-4 divider-row">
        <span class="text-gray-800 text-h5">Progresso</span>
        <span class="text-secondary-0 text-h5">{{ completedPercentage }}%</span>
      </div>
      <div class="d-flex ga-4 flex-column mt-4 text-gray-600 text-body-1">
        <span v-for="i in 4" :key="i" class="d-flex justify-space-between">
          <alex-custom-chip
            :status="taskStatus[i - 1].color"
            :text="taskStatus[i - 1].text"
          />
          {{ taskStatus[i - 1].value }}
          Alunos
        </span>
      </div>
    </HoverCardContent>
  </HoverCard>
</template>

<script setup lang="ts">
interface Submissions {
  toDo: number;
  doing: number;
  underReview: number;
  completed: number;
}

type TaskStatus = {
  text: string;
  color: 'secondary' | 'blue' | 'orange' | 'green' | 'primary' | 'red';
  value: number;
};

const props = withDefaults(defineProps<Submissions>(), {
  toDo: 0,
  doing: 0,
  underReview: 0,
  completed: 0,
});

const taskStatus: TaskStatus[] = [
  { text: 'A fazer', color: 'secondary', value: props.toDo },
  { text: 'Fazendo', color: 'blue', value: props.doing },
  { text: 'Em avaliação', color: 'orange', value: props.underReview },
  { text: 'Concluída', color: 'green', value: props.completed },
];

const completedPercentage = computed(() => {
  const total = props.toDo + props.doing + props.underReview + props.completed;
  return total === 0 ? 0 : Math.round((props.completed / total) * 100);
});
</script>

<style scoped>
.divider-row {
  border-bottom: 1px solid rgb(var(--v-theme-gray-100));
}
</style>
