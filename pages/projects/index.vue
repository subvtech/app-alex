<template>
    <div class="d-flex align-center">
        <h6 class="text-h6 font-weight-bold">Projects</h6>
        <v-breadcrumbs :items="breadcrumbs" >
            <template #divider>
             <v-icon icon="mdi-chevron-right" color="gray-400"></v-icon>
            </template>
        </v-breadcrumbs>
    </div>
</template>

<script setup lang="ts">
const breadcrumbs = [
        {
          title: 'Home',
          disabled: false,
          href: '/',
        },
        {
          title: 'Projects',
          disabled: false,
          href: '/projects',
        },
        
      ]
</script>

<style scoped>
</style>