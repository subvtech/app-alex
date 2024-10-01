<template>
  <v-card
    class="d-flex w-100 py-3 px-4 align-start justify-space-between"
    variant="outlined"
    color="gray-blue"
    rounded="lg"
    elevation="0"
  >
  <div class="tw-flex tw-w-full tw-items-center justify-space-between">
    <div>
      <p class="text-body-1 text-gray-800">Quarta-feira, 18 de outubro</p>
      <p class="text-body-1 text-gray-500" >Quinzenal: cada Quarta-feira</p>
    </div>
    <div class="tw-flex tw-items-center gap-3" >
      <p class="text-body-1 text-gray-800" >
        14:00 às 18:00
      </p>
      <v-icon color="gray-800">mdi-pencil-outline</v-icon>
    </div>

  </div>
  </v-card>
</template>

<script setup>

  const props = defineProps({

  })
</script>

<style lang="scss" scoped>

</style>
