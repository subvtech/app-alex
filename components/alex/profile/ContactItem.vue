<template>
  <div class="d-flex align-center gap-4">
    <v-icon color="#6E7A87">{{ icon }}</v-icon>
    <div class="d-flex flex-column justify-center align-start field">
      <p>{{ label }}</p>
      <span>{{ value }}</span>
    </div>
  </div>
</template>
<script setup lang="ts">
export interface ContactItemType {
  icon: string;
  label: string;
  value: string;
}
withDefaults(defineProps<ContactItemType>(), {});
</script>
<style scoped lang="scss">
.field {
  p {
    color: #a0a8b1;
    font-size: 14px;
    font-weight: 400;
    line-height: 135%; /* 18.9px */
    letter-spacing: 0.56px;
  }

  span {
    color: #6e7a87;
    font-size: 16px;
    font-weight: 400;
    line-height: 135%; /* 21.6px */
    letter-spacing: 0.64px;
    text-decoration: none;
  }
}
</style>
