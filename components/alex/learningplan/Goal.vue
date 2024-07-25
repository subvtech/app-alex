<template>
  <div class="goal d-flex pa-4 w-100 gap">
    <span>{{ index + 1 }}.</span>
    <div class="d-flex gap-1">
      <span class="w-100 word-break">
        <span class="title h-min">
          {{ keyWord }}
        </span>
        {{ title }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  title: {
    type: String,
    required: true,
  },
  index: {
    type: Number,
    required: true,
  },
  keyWord: {
    type: String,
    required: true,
  },
});
</script>

<style scoped lang="scss">
.goal {
  border-radius: 8px;
  background: var(--cinza-cinza-azulado, #f1f5f9);
  .word-break {
    word-break: break-all;
  }
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
