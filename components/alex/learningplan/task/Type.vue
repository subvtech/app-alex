<template>
  <v-menu>
    <!-- Exibição -->
    <template #activator="{ props }">
      <p
        v-bind="props"
        class="output pa-1 text-p3 text-gray-800 rounded-md cursor-pointer"
      >
        {{ config[curr].title }}
      </p>
    </template>

    <!-- Opções -->
    <v-list>
      <v-list-item
        v-for="(data, status) in config"
        :key="status"
        :value="status"
      >
        <v-list-item-title @click="curr = status">{{
          data.title
        }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script setup lang="ts">
const { t } = useI18n();

type TaskTypes = 'individual' | 'collective';

interface TypeProps {
  title: string;
}

const config: Record<TaskTypes, TypeProps> = {
  individual: {
    title: t('components.learningPlan.drawer.task.type.individual'),
  },
  collective: {
    title: t('components.learningPlan.drawer.task.type.collective'),
  },
};

const curr = ref<TaskTypes>('individual');
</script>

<style scoped>
/** Estilização da página */
.text-p3 {
  /* Body/P3 */
  font-family: Sen;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 135%; /* 18.9px */
  letter-spacing: 0.28px;
}

.text-p4 {
  /* Body/P4 */
  font-family: Sen;
  font-size: 14px;
  font-style: normal;
  font-weight: 700;
  line-height: 135%; /* 18.9px */
  letter-spacing: 0.28px;
}

.output:hover {
  --v-theme-overlay-multiplier: var(--v-theme-gray-blue-overlay-multiplier);
  background-color: rgb(var(--v-theme-gray-blue)) !important;
  transition: 0.3s;
}
</style>
