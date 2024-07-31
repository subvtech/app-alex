<template>
  <div class="d-flex ga-5 flex-column container">
    <div class="pa-4">
      <p class="text-primary text-h2">TipTap padrão</p>
      <TipTap v-model="editorData" :task-id="3" />
      <p class="output">{{ editorData }}</p>
    </div>

    <alex-learningplan-task-description
      v-model="teste"
      :edit="true"
      :task-id="5"
      :submission="true"
      title="Teste do lucas"
    />
  </div>
</template>

<script setup>
const editorData = ref('');

const teste = ref('Teste do lucas');

watch(teste, async (val) => {
  if (typeof val !== 'string') {
    val = JSON.stringify(val);
  }

  try {
    val = await JSON.parse(val);
  } catch (e) {}
});
</script>

<style scoped>
.output {
  font-size: 0.8rem;
  line-height: 1.5;
  margin-top: 10px;
}

.container {
  max-width: 90%;
  margin: auto;
}
</style>
