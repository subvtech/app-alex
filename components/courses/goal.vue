<template>
  <div id="goal" class="d-flex pa-4 gap">
    <span>{{ index }}.</span>
    <div class="d-flex flex-column">
      <span class="title">
        {{ title }}
      </span>
      <span>
        {{ description }}
      </span>
    </div>
  </div>
</template>
<script setup lang="ts">
const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  index: {
    type: Number,
    required: true,
  },
});
</script>

<style scoped lang="scss">
#goal {
  border-radius: 8px;
  background: var(--cinza-cinza-azulado, #f1f5f9);
  .title {
    color: var(--principais-secundria-secundria-0, #00b7cc);

    font-size: 16px;
    font-weight: 700;
    letter-spacing: 0.32px;
  }

  span {
    color: var(--cinza-cinza-600, #6e7a87);

    /* Body/P1 */
    font-family: Sen;
    font-size: 16px;

    font-weight: 400;
    letter-spacing: 0.32px;
  }

  &.gap {
    gap: 8px;
  }
}
</style>
