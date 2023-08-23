<template >
    <template v-if="step == activeStep">
    <slot></slot>
    </template>
</template>

<script setup lang="ts">
 defineProps({
    activeStep: Number,
    step: Number
})

</script>

<style scoped>

</style>