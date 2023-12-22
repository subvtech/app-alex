<template>
  <span>
    Acesse o menu lateral para consultar a documentacao dos componentes criados
  </span>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'components',
  middleware: 'auth',
});
</script>
