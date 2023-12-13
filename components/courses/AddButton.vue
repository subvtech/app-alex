<template>
  <v-btn class="custom-btn text-transform-none" prepend-icon="mdi-plus" @click="action">
    {{ $t('components.courses.goals.add') }}
  </v-btn>
</template>

<script setup lang="ts">
defineProps({
    action: {
        type: Function,
        default: () => {}
    }
})</script>
<style scoped lang="scss">
.custom-btn {
  border: 1px dashed;
  display: flex;
  height: 44px;
  padding: 0px 16px;
  justify-content: center;
  align-items: center;
  align-self: stretch;

  border-radius: 8px;
  border: 1px dashed var(--cinza-cinza-600, #6e7a87);
  box-shadow: none;

  &:hover {
    background: var(--cinza-cinza-100, #ebedef);
  }

  &:active {
    background: var(--cinza-cinza-200, #d2d6da);
  }
}
.text-transform-none {
  text-transform: none;
}
</style>
