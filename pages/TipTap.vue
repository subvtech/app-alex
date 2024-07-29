<template>
  <div class="d-flex ga-5 flex-column container">
    <div class="pa-4">
      <p class="text-primary text-h2">TipTap padrão</p>
      <TipTap v-model="editorData" />
      <p class="output">{{ editorData }}</p>
    </div>

    <alex-learningplan-task-description
      v-model="teste"
      :edit="true"
      :task-id="3"
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
  console.log('Valor mudou: ', val);

  try {
    val = await JSON.parse(val);
  } catch (e) {}
  console.log('Valor json dnv');
  console.log(val);
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
