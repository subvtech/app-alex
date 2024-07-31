<template>
  <div class="d-flex ga-5 flex-column container">
    <div class="pa-4">
      <p class="text-primary text-h2 mb-2">TipTap Padrão</p>
      <TipTap v-model="editorData" :doc-name="`task-1`" />
      <p class="output">{{ editorData }}</p>
    </div>
    <div class="pa-4">
      <p class="text-primary text-h2 mb-2">TipTap Texto</p>
      <TipTap :doc-name="`task-2`" :allowed-blocks="['text']" />
    </div>
    <div class="pa-4">
      <p class="text-primary text-h2 mb-2">TipTap Imagem</p>
      <TipTap :doc-name="`task-3`" :allowed-blocks="['image']" />
    </div>
    <div class="pa-4">
      <p class="text-primary text-h2 mb-2">TipTap Video</p>
      <TipTap :doc-name="`task-4`" :allowed-blocks="['video']" />
    </div>
    <div class="pa-4">
      <p class="text-primary text-h2 mb-2">TipTap Attaches</p>
      <TipTap :doc-name="`task-5`" :allowed-blocks="['files']" />
    </div>
    <div class="pa-4">
      <p class="text-primary text-h2 mb-2">TipTap Media</p>
      <TipTap :doc-name="`task-6`" :allowed-blocks="['media']" />
    </div>

    <alex-learningplan-task-description
      v-model="teste"
      :edit="true"
      :doc-name="`task-5`"
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
