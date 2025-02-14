<template>
  <div class="d-flex flex-column">
    <p class="text-body-4 text-gray-800">
      {{ text }}
    </p>
    <p class="text-body-3 text-gray-800">$ {{ balance.toFixed(2) }}</p>
  </div>
</template>
<script setup lang="ts">
interface ContractBalanceProps {
  text: string;
  balance: number;
}

withDefaults(defineProps<ContractBalanceProps>(), { text: undefined });
</script>
