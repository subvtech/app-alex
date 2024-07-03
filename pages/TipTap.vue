<template>
  <div class="d-flex ga-5 flex-column">
    <div class="pa-4">
      <p class="text-primary text-h2">TipTap padrão</p>
      <TipTap v-model="editorData" />
      <code>{{ editorData }}</code>
    </div>
    <div class="pa-4">
      <p class="text-primary text-h2">TipTap StarterKit</p>
      <TipTap-Starter-kit v-model="editorData2" />
      <code>{{ editorData2 }}</code>
    </div>
  </div>
</template>

<script setup>
const editorData = ref('');
const editorData2 = ref('');
</script>
