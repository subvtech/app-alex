<template>
  <div class="d-flex ga-5 flex-column container">
    <div class="pa-4">
      <p class="text-primary text-h2">TipTap padrão</p>
      <TipTap v-model="editorData" />
      <p class="output">{{ editorData }}</p>
    </div>
  </div>
</template>

<script setup>
const editorData = ref('');
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
