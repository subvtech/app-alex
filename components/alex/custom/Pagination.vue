<template>
  <v-pagination
    :length="length"
    :disabled="disabled"
    class="text-gray-600"
    :total-visible="totalVisible"
  ></v-pagination>
</template>

<script setup lang="ts">
defineProps({
  length: {
    type: Number,
    default: 0,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  totalVisible: {
    type: Number,
    default: length,
  },
});
</script>

<style>
.v-btn__overlay {
  display: none;
}

.v-ripple__container {
  border-radius: 8px;
}

.v-pagination__item {
  border-radius: 8px;
  transition: all 0.2s;
}
.v-pagination__item:hover {
  background: #ebedef;
}

.v-pagination__item:active {
  background: #d2d6da;
}

.v-pagination__item--is-active {
  background: #00b7cc;
  color: #fff;
}

.v-pagination__item--is-active:hover {
  background: #008a99;
}
.v-pagination__item--is-active:active {
  background: #005c66;
}
</style>
